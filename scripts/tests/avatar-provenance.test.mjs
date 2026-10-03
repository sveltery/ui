// Authored source-derived regressions, not copied ordinary shadcn runtime tests.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { components, styles, selectStyleSections } from '../theme-assets.mjs';

test('complete immutable Avatar source and gallery retain authenticated bytes', () => {
  const pin = JSON.parse(readFileSync('tests/reference/avatar-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
});

test('all six Avatar exports retain original hosts and complete literal cn arguments', () => {
  const original = readFileSync('tests/reference/avatar.tsx', 'utf8');
  const names = ['Avatar', 'AvatarImage', 'AvatarFallback', 'AvatarBadge', 'AvatarGroup', 'AvatarGroupCount'];
  const hosts = ['Root', 'Image', 'Fallback', 'span', 'div', 'div'];
  for (const [index, name] of names.entries()) {
    const source = original.slice(original.indexOf(`function ${name}(`), original.indexOf('\nfunction ', original.indexOf(`function ${name}(`) + 1) === -1 ? original.indexOf('\nexport {') : original.indexOf('\nfunction ', original.indexOf(`function ${name}(`) + 1));
    const literals = [...source.matchAll(/^\s*"([^"]*)",?$/gmu)].map(match => match[1]);
    const native = readFileSync(`apps/docs/registry/bases/base/ui/avatar/${name}.svelte`, 'utf8');
    assert.match(native, /import \{ cn(?:, type ClassValue)? \} from 'cn'/u);
    for (const literal of literals) assert(native.includes(JSON.stringify(literal)), `${name}: original cn argument ${literal}`);
    assert.match(native, new RegExp(index < 3 ? `Avatar as AvatarPrimitive` : `<${hosts[index]}\\b`, 'u'));
    assert.doesNotMatch(native, /\$state|\$effect|setTimeout|MutationObserver|shared\/classes/u);
    assert.match(native, /class=\{className\} \{\.\.\.props\}/u, `${name}: rightmost caller prop spread`);
  }
});

test('Avatar delivers all five exact original CSS blocks in Nova and all eight styles', () => {
  assert(components.includes('Avatar'));
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/avatar-nova.css', 'utf8').trimEnd()));
  for (const style of styles) {
    const section = selectStyleSections(style).filter(item => item.component === 'Avatar');
    assert.equal(section.length, 1);
    assert(readFileSync(`apps/docs/registry/styles/scoped/${style}.css`, 'utf8').includes(section[0].css));
  }
});
