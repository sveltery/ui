export const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/** The package manager every command block shows, shared across the page and remembered between visits. */
class PackageManagerChoice {
  current = $state<PackageManager>('pnpm');

  /** Reads the stored choice. Call it after hydration so the server-rendered default never mismatches. */
  restore() {
    try {
      const stored = localStorage.getItem('package-manager');
      if (PACKAGE_MANAGERS.includes(stored as PackageManager)) this.current = stored as PackageManager;
    } catch {
      // Storage can be unavailable; keep the default.
    }
  }

  set(value: PackageManager) {
    this.current = value;
    try {
      localStorage.setItem('package-manager', value);
    } catch {
      // Storage can be unavailable; the choice still applies to this page.
    }
  }
}

export const packageManager = new PackageManagerChoice();
