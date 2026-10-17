// Picks the packages a v* tag publishes, and fails before anything is published when the tag is wrong.
// Usage: node scripts/release-plan.mjs v0.2.0 prints the directories in packages/ to publish, one per line.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

/** Publish order. A new directory in packages/ fails the plan until it is added here. */
export const PUBLISH_ORDER = ['cli', 'command', 'day-picker', 'input-otp', 'recharts', 'resizable', 'svelte'];

/**
 * A package is taken when it is public, on npm, and its version is not on npm yet. Every taken package must be at the
 * tag's version, and at least one must be taken; otherwise `error` says why and nothing is published.
 * @param {string} version the tag without its leading v
 * @param {{ dir: string; name: string; version: string; private: boolean; published: string[] | undefined }[]} packages
 *   `published` is undefined for a package npm does not have at all
 */
export function planRelease(version, packages) {
  const publish = [];
  const notices = [];
  const warnings = [];
  const mismatched = [];
  for (const pkg of packages) {
    if (pkg.private) notices.push(`${pkg.name} is private, not published.`);
    else if (!pkg.published) {
      warnings.push(
        `${pkg.name} is not on npm, so this workflow cannot publish it. Publish its first version by hand with \`npm publish --access public --provenance=false\`, then add this workflow as its trusted publisher on npm.`,
      );
    } else if (pkg.published.includes(pkg.version)) notices.push(`${pkg.name}@${pkg.version} is already on npm.`);
    else if (pkg.version !== version) mismatched.push(`${pkg.name} is at ${pkg.version}`);
    else publish.push(pkg.dir);
  }
  const error = mismatched.length
    ? `Tag v${version} does not match the unpublished version of every package: ${mismatched.join(', ')}.`
    : publish.length === 0
      ? `No package has an unpublished version ${version}. Bump the packages to release before tagging.`
      : undefined;
  return { publish: error ? [] : publish, notices, warnings, error };
}

/** The versions npm has of `name`, or undefined when npm has no such package. */
export function publishedVersions(name) {
  try {
    return [JSON.parse(execFileSync('npm', ['view', name, 'versions', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }))].flat();
  } catch (error) {
    if (/\bE404\b/.test(String(error.stdout))) return undefined;
    throw error;
  }
}

if (import.meta.main) {
  const version = process.argv[2]?.replace(/^v/, '');
  if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    console.error('Usage: node scripts/release-plan.mjs <vx.y.z>');
    process.exit(1);
  }
  const root = new URL('../packages/', import.meta.url);
  const dirs = readdirSync(root).sort();
  if (dirs.join(' ') !== [...PUBLISH_ORDER].sort().join(' ')) {
    console.error('::error::packages/ changed. Add the new package to PUBLISH_ORDER in scripts/release-plan.mjs.');
    process.exit(1);
  }
  const packages = PUBLISH_ORDER.map((dir) => {
    const pkg = JSON.parse(readFileSync(new URL(`${dir}/package.json`, root), 'utf8'));
    return { dir, name: pkg.name, version: pkg.version, private: pkg.private === true, published: pkg.private === true ? [] : publishedVersions(pkg.name) };
  });
  const plan = planRelease(version, packages);
  for (const notice of plan.notices) console.error(`::notice::${notice}`);
  for (const warning of plan.warnings) console.error(`::warning::${warning}`);
  if (plan.error) {
    console.error(`::error::${plan.error}`);
    process.exit(1);
  }
  console.log(plan.publish.join('\n'));
}
