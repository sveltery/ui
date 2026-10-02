// Node-only fixture compiler: preserve pinned React source logic, resolve package ESM entrypoints and relative imports.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
const require = createRequire(import.meta.url);
export async function prepareIconReference() {
  const manifest = JSON.parse(readFileSync('tests/reference/icon-sources.json', 'utf8'));
  const resolution = Object.fromEntries(manifest.packages.map(pin => {
    let root = dirname(require.resolve(pin.name)); while (!existsSync(`${root}/package.json`)) root = dirname(root);
    const pkg = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'));
    return [pin.name, pathToFileURL(`${root}/${pkg.module ?? pkg.main}`).href];
  }));
  resolution.react = import.meta.resolve('react');
  const output = resolve('.checks/icons-reference'); mkdirSync(`${output}/icons`, { recursive: true });
  for (const file of ['icon.tsx', ...readdirSync('tests/reference/icons').filter(name => /\.(ts|tsx)$/.test(name)).map(name => `icons/${name}`)]) {
    let source = readFileSync(`tests/reference/${file}`, 'utf8');
    for (const [name, url] of Object.entries(resolution)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
    source = source.replace(/(["'])(\.\.?\/[^"']+)\1/g, (_match, quote, specifier) => `${quote}${specifier}.mjs${quote}`);
    const code = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText;
    writeFileSync(`${output}/${file.replace(/\.(ts|tsx)$/, '.mjs')}`, code);
  }
  return import(pathToFileURL(`${output}/icon.mjs`));
}
