// Explicit import resolution replaces the upstream extensionless interpolated path for Vite and Node fixtures.
export function loadLibrary(library: string) {
  switch (library) {
    case 'lucide': return import('./__lucide__');
    case 'tabler': return import('./__tabler__');
    case 'hugeicons': return import('./__hugeicons__');
    case 'phosphor': return import('./__phosphor__');
    case 'remixicon': return import('./__remixicon__');
    default: return Promise.reject(new Error(`Unknown icon library: ${library}`));
  }
}
