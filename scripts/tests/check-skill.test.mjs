import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkSkill } from '../check-skill.mjs';

function fixture(files) {
  const dir = join(mkdtempSync(join(tmpdir(), 'skill-')), 'demo');
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  return dir;
}

const frontmatter = '---\nname: demo\ndescription: A demo skill.\n---\n';

test('the sveltery skill and its docs page pass', () => {
  assert.deepEqual(checkSkill('skills/sveltery', { extraDocs: ['apps/docs/content/docs/skills.md'] }), []);
});

test('a skill that names a missing command, flag, file, heading or docs page fails', () => {
  const dir = fixture({
    'SKILL.md': `${frontmatter}
Run \`npx @sveltery/ui@latest add button --force\` and \`pnpm dlx @sveltery/ui@latest create app\`.
See [rules](./rules/missing.md), [the CLI](./cli.md#nope) and [themes](https://ui.sveltery.dev/docs/themes.md).
`,
    'cli.md': '# CLI\n\n### `apply`: apply\n\n| Flag | Short |\n| --- | --- |\n| `--force` | `-f` |\n',
  });
  const problems = checkSkill(dir).map((problem) => problem.replace(/^.*?(SKILL|cli)\.md: /u, '$1.md: ')).sort();
  assert.deepEqual(problems, [
    'SKILL.md: /docs/themes.md has no page in apps/docs/content/docs',
    'SKILL.md: `add` has no --force flag',
    'SKILL.md: `create` is not a CLI command',
    'SKILL.md: link ./cli.md#nope has no heading #nope',
    'SKILL.md: link ./rules/missing.md points at a missing file',
    'cli.md: `apply` has no --force flag',
    'cli.md: `apply` has no -f flag',
  ]);
});

test('a skill whose name does not match its folder fails', () => {
  const dir = fixture({ 'SKILL.md': '---\nname: other\ndescription: A demo skill.\n---\n' });
  assert.deepEqual(checkSkill(dir), ['SKILL.md: name "other" does not match the folder "demo"']);
});
