export type Mode = 'light' | 'dark';

/** The color mode. `app.html` applies the stored or system mode before first paint; this keeps it in sync. */
class ColorMode {
  current = $state<Mode>('light');

  constructor() {
    if (typeof document !== 'undefined') this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', this.current === 'dark');
    try {
      localStorage.setItem('theme', this.current);
    } catch {
      // Storage can be unavailable, for example in a private window. The toggle still applies to this page.
    }
  }
}

export const mode = new ColorMode();
