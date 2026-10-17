export type Mode = 'light' | 'dark';

/** Browser chrome colors per mode, as upstream's META_THEME_COLORS. `app.html` sets the same values before first paint. */
const themeColors: Record<Mode, string> = { light: '#ffffff', dark: '#09090b' };

/** The color mode. `app.html` applies the stored or system mode before first paint; this keeps it in sync. */
class ColorMode {
  current = $state<Mode>('light');

  constructor() {
    if (typeof document !== 'undefined') this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    // Switch without transitions, so colors don't animate between modes.
    const style = document.createElement('style');
    style.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.append(style);
    document.documentElement.classList.toggle('dark', this.current === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[this.current]);
    getComputedStyle(document.body);
    setTimeout(() => style.remove(), 1);
    try {
      localStorage.setItem('theme', this.current);
    } catch {
      // Storage can be unavailable, for example in a private window. The toggle still applies to this page.
    }
  }
}

export const mode = new ColorMode();
