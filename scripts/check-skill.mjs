#!/usr/bin/env node
// Checks an agent skill against the repository: its frontmatter, its links, every CLI command and flag it names, and every docs URL.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docsContent = join(root, 'apps/docs/content/docs');
const site = 'https://ui.sveltery.dev';
const siteRoutes = new Set(['/llms.txt', '/create', '/schema.json', '/r']);
const runner = /(?:npx|pnpm dlx|bunx) @sveltery\/ui@latest((?: +[^\s`|]+)*)/gu;

/** Each command of the CLI and the flags it takes, read from the commander setup in packages/cli/src/index.ts. */
export function readCommands(source = readFileSync(join(root, 'packages/cli/src/index.ts'), 'utf8')) {
  const commands = new Map();
  for (const [, receiver, name, body] of source.matchAll(/\b(program|preset)\s*\.command\('([\w-]+)'\)([\s\S]*?)(?=\n(?:program|preset|const|try)\b)/gu)) {
    const flags = new Set(['-h', '--help']);
    for (const [, spec] of body.matchAll(/\.option\('([^']+)'/gu)) {
      for (const flag of spec.split(/[ ,]+/u).filter((word) => word.startsWith('-'))) flags.add(flag);
    }
    const names = [name, ...[...body.matchAll(/\.alias\('([\w-]+)'\)/gu)].map((match) => match[1])];
    for (const alias of names) commands.set(receiver === 'preset' ? `preset ${alias}` : alias, flags);
  }
  return commands;
}

/** GitHub's heading anchor: lowercase, punctuation dropped, spaces to hyphens. */
const slug = (heading) => heading.trim().toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /gu, '-');
const anchors = (text) => new Set([...text.replace(/```[\s\S]*?```/gu, '').matchAll(/^#{1,6} (.+)$/gmu)].map((match) => slug(match[1])));

function docsPage(path) {
  const page = path.replace(/^\/docs\/?/u, '').replace(/\.md$/u, '').replace(/\/$/u, '');
  return [join(docsContent, `${page}.md`), join(docsContent, page, 'index.md')].find((file) => page !== '' && existsSync(file)) ?? (page === '' ? join(docsContent, 'index.md') : undefined);
}

function checkSiteLink(path, problems, where) {
  const [pathname, hash] = path.split('#');
  if (siteRoutes.has(pathname)) return;
  if (!pathname.startsWith('/docs')) return problems.push(`${where}: ${path} is not a docs page or a known route`);
  const file = docsPage(pathname);
  if (!file) return problems.push(`${where}: ${path} has no page in apps/docs/content/docs`);
  if (hash && !anchors(readFileSync(file, 'utf8')).has(hash)) problems.push(`${where}: ${path} has no heading #${hash}`);
}

function checkCommands(text, commands, problems, where) {
  for (const [, args] of text.matchAll(runner)) {
    const words = args.trim().split(/ +/u).filter(Boolean);
    if (!/^[a-z][\w-]*$/u.test(words[0] ?? '')) continue;
    const name = words[0] === 'preset' && words[1] && !words[1].startsWith('-') ? `preset ${words[1]}` : words[0];
    const flags = commands.get(name);
    if (!flags) {
      problems.push(`${where}: \`${name}\` is not a CLI command`);
      continue;
    }
    for (const word of words.filter((candidate) => /^--?[a-z]/u.test(candidate))) {
      const flag = word.split('=')[0];
      if (!flags.has(flag)) problems.push(`${where}: \`${name}\` has no ${flag} flag`);
    }
  }
}

/** The flags that cli.md's tables list under each command heading, which the commands must have too. */
function checkFlagTables(text, commands, problems, where) {
  let command;
  for (const line of text.split('\n')) {
    const heading = /^### `([\w ]+)`/u.exec(line);
    if (heading) command = heading[1];
    if (!command || !line.startsWith('| `-')) continue;
    const flags = commands.get(command);
    if (!flags) {
      problems.push(`${where}: \`${command}\` is not a CLI command`);
      continue;
    }
    const cells = line.split('|').slice(1, 3).join(' ');
    for (const [flag] of cells.matchAll(/--?[a-z][\w-]*/gu)) {
      if (!flags.has(flag)) problems.push(`${where}: \`${command}\` has no ${flag} flag`);
    }
  }
}

function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/u.exec(text);
  if (!match) return undefined;
  return Object.fromEntries(match[1].split('\n').filter((line) => /^[\w-]+:/u.test(line)).map((line) => {
    const index = line.indexOf(':');
    return [line.slice(0, index), line.slice(index + 1).trim()];
  }));
}

/** Every problem in the skill at `dir`, plus those in `extraDocs`, docs pages that describe it. Empty when it passes. */
export function checkSkill(dir, { commands = readCommands(), extraDocs = [] } = {}) {
  const problems = [];
  const files = readdirSync(dir, { recursive: true }).map(String).filter((file) => /\.(md|json|ya?ml)$/u.test(file));
  const skill = join(dir, 'SKILL.md');
  if (!existsSync(skill)) return [`${dir}: SKILL.md is missing`];

  const meta = frontmatter(readFileSync(skill, 'utf8'));
  if (!meta) problems.push('SKILL.md: frontmatter is missing');
  else {
    if (meta.name !== basename(dir)) problems.push(`SKILL.md: name "${meta.name}" does not match the folder "${basename(dir)}"`);
    if (!meta.description) problems.push('SKILL.md: description is missing');
    else if (meta.description.length > 1024) problems.push(`SKILL.md: description is ${meta.description.length} characters, over 1024`);
    else if (/[<>]/u.test(meta.description)) problems.push('SKILL.md: description has angle brackets');
  }

  const docs = [...files.map((file) => join(dir, file)), ...extraDocs];
  for (const file of docs.filter((path) => path.endsWith('.md'))) {
    const where = relative(root, file);
    const text = readFileSync(file, 'utf8');
    const prose = text.replace(/```[\s\S]*?```/gu, '');
    for (const [, target] of prose.matchAll(/\]\(([^)\s]+)\)/gu)) {
      if (target.startsWith(site)) checkSiteLink(target.slice(site.length) || '/', problems, where);
      else if (target.startsWith('/')) checkSiteLink(target, problems, where);
      else if (!/^[a-z]+:/u.test(target)) {
        const [path, hash] = target.split('#');
        const linked = path ? resolve(dirname(file), path) : file;
        if (!existsSync(linked)) problems.push(`${where}: link ${target} points at a missing file`);
        else if (hash && !anchors(readFileSync(linked, 'utf8')).has(hash)) problems.push(`${where}: link ${target} has no heading #${hash}`);
      }
    }
    for (const [url] of text.matchAll(/https:\/\/ui\.sveltery\.dev\/[^\s)`'"<>]*/gu)) checkSiteLink(url.slice(site.length).replace(/[.,]$/u, ''), problems, where);
    checkCommands(text, commands, problems, where);
    if (basename(file) === 'cli.md') checkFlagTables(text, commands, problems, where);
  }

  const evalsFile = join(dir, 'evals/evals.json');
  if (existsSync(evalsFile)) {
    const evals = JSON.parse(readFileSync(evalsFile, 'utf8'));
    if (meta && evals.skill_name !== meta.name) problems.push(`evals.json: skill_name "${evals.skill_name}" is not "${meta.name}"`);
    const ids = evals.evals.map((entry) => entry.id);
    if (new Set(ids).size !== ids.length) problems.push('evals.json: ids repeat');
    for (const entry of evals.evals) {
      if (!entry.prompt || !entry.expected_output || !entry.expectations?.length) problems.push(`evals.json: eval ${entry.id} needs a prompt, an expected_output and expectations`);
    }
  }
  return [...new Set(problems)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = resolve(process.argv[2] ?? join(root, 'skills/sveltery'));
  const problems = checkSkill(dir, { extraDocs: [join(docsContent, 'skills.md')] });
  if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`Skill ${relative(root, dir)}: PASS`);
}
