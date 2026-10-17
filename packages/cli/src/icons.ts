import type { IconLibraryName } from './registry.js';

type IconLibrary = {
  /** npm packages that a component using this library needs. */
  packages: string[];
  /** Imports shared by every icon of the library. */
  sharedImports: string[];
  importIcon: (name: string) => string;
  /** Whether a module is one `importIcon` imports from. */
  isIconModule: (module: string) => boolean;
  /** The component tag and attributes that replace `IconPlaceholder`. */
  tag: (name: string) => string;
};

/** shadcn-svelte's conversion, kept as is so icon paths match its registry. */
export function kebab(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .toLowerCase();
}

export const iconLibraries: Record<IconLibraryName, IconLibrary> = {
  lucide: {
    packages: ['@lucide/svelte@^1.48.0'],
    sharedImports: [],
    importIcon: (name) => `import ${name} from '@lucide/svelte/icons/${kebab(name).replace(/-icon$/, '')}';`,
    isIconModule: (module) => module === '@lucide/svelte' || module.startsWith('@lucide/svelte/icons/'),
    tag: (name) => name,
  },
  tabler: {
    packages: ['@tabler/icons-svelte@^3.48.0'],
    sharedImports: [],
    importIcon: (name) => `import { ${name} } from '@tabler/icons-svelte';`,
    isIconModule: (module) => module === '@tabler/icons-svelte',
    tag: (name) => name,
  },
  hugeicons: {
    packages: ['@hugeicons/svelte@^1.1.5', '@hugeicons/core-free-icons@^4.3.5'],
    sharedImports: [`import { HugeiconsIcon } from '@hugeicons/svelte';`],
    importIcon: (name) => `import { ${name} } from '@hugeicons/core-free-icons';`,
    isIconModule: (module) => module === '@hugeicons/core-free-icons',
    tag: (name) => `HugeiconsIcon icon={${name}} strokeWidth={2}`,
  },
  phosphor: {
    packages: ['phosphor-svelte@^3.1.0'],
    sharedImports: [],
    importIcon: (name) => `import ${name} from 'phosphor-svelte/lib/${name.replace(/Icon$/, '')}';`,
    isIconModule: (module) => module.startsWith('phosphor-svelte/lib/'),
    tag: (name) => name,
  },
  remixicon: {
    packages: ['remixicon-svelte@^0.0.5'],
    sharedImports: [],
    importIcon: (name) => `import ${name} from 'remixicon-svelte/icons/${kebab(name.replace(/^Ri/, ''))}';`,
    isIconModule: (module) => module.startsWith('remixicon-svelte/icons/'),
    tag: (name) => name,
  },
};
