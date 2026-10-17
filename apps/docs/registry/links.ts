/**
 * Base UI's docs page for each item that is styled on a Base UI component, by Base UI's path under `react/`. An item has
 * an `api` link only when it is listed here. links.test.ts checks that the item's docs page links the same page.
 */
export const BASE_UI_PAGES: Record<string, string> = {
  accordion: 'components/accordion',
  'alert-dialog': 'components/alert-dialog',
  'aspect-ratio': 'components/aspect-ratio',
  avatar: 'components/avatar',
  button: 'components/button',
  checkbox: 'components/checkbox',
  collapsible: 'components/collapsible',
  combobox: 'components/combobox',
  'context-menu': 'components/context-menu',
  dialog: 'components/dialog',
  direction: 'utils/direction-provider',
  drawer: 'components/drawer',
  'dropdown-menu': 'components/menu',
  'hover-card': 'components/preview-card',
  input: 'components/input',
  menubar: 'components/menubar',
  'navigation-menu': 'components/navigation-menu',
  popover: 'components/popover',
  progress: 'components/progress',
  'radio-group': 'components/radio-group',
  'scroll-area': 'components/scroll-area',
  select: 'components/select',
  separator: 'components/separator',
  sheet: 'components/dialog',
  slider: 'components/slider',
  switch: 'components/switch',
  tabs: 'components/tabs',
  toast: 'components/toast',
  toggle: 'components/toggle',
  'toggle-group': 'components/toggle-group',
  tooltip: 'components/tooltip',
};

/**
 * What `docs` prints for a `registry:ui` item, as upstream's `meta.links` do: its docs page, the same page as Markdown with
 * every example's source inlined, and Base UI's API reference as Markdown when the item has one.
 */
export function itemLinks(name: string, origin: string): Record<string, string> {
  const api = BASE_UI_PAGES[name];
  return {
    docs: `${origin}/docs/components/${name}`,
    examples: `${origin}/docs/components/${name}.md`,
    ...(api && { api: `https://base-ui.com/react/${api}.md` }),
  };
}
