import type { IconLibraryName } from './config.js';
export type IconNode = { tag: string; attributes: Record<string, string | number | undefined>; nodes: IconNode[] };
export type IconData = { attributes: Record<string, string | number | undefined>; nodes: IconNode[] };
type Library = Record<string, IconData>;
const promises = new Map<IconLibraryName, Promise<Library>>();
const iconPromises = new Map<string, Promise<IconData | null>>();
const icons = new Map<string, IconData | null>();
const importers = {
  lucide: () => import('../../src/lib/icons/lucide.js'),
  tabler: () => import('../../src/lib/icons/tabler.js'),
  hugeicons: () => import('../../src/lib/icons/hugeicons.js'),
  phosphor: () => import('../../src/lib/icons/phosphor.js'),
  remixicon: () => import('../../src/lib/icons/remixicon.js'),
};
export function loadedIcon(library: IconLibraryName, name: string): IconData | null | undefined {
  return icons.get(`${library}/${name}`);
}
export function loadIconLibrary(library: IconLibraryName): Promise<Library> {
  let promise = promises.get(library);
  if (!promise) { promise = importers[library]().then(module => { const data = module.default as Library; return data; }); promises.set(library, promise); }
  return promise;
}
export function loadIcon(library: IconLibraryName, name: string): Promise<IconData | null> {
  const key = `${library}/${name}`;
  let promise = iconPromises.get(key);
  if (!promise) { promise = loadIconLibrary(library).then(data => { const icon = Object.hasOwn(data, name) ? data[name] : null; icons.set(key, icon); return icon; }); iconPromises.set(key, promise); }
  return promise;
}
