// Source-derived icon assertions. No icon runtime tests exist at the immutable shadcn pin.
import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HugeiconsIcon } from '@hugeicons/react';
import IconSvg from '../../apps/docs/examples/icons/IconSvg.svelte';
import Fixture from '../../apps/docs/examples/icons/IconsProbe.svelte';
import { loadIcon, loadIconLibrary, type IconData } from '../../apps/docs/examples/icons/data.js';
import { iconLibraries } from '../../apps/docs/examples/icons/config.js';
import { loadLibrary } from '../reference/icons/load-library';
const names = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
const attrs = (element: Element) => Object.fromEntries([...element.attributes].map(attr => [attr.name, attr.name === 'style' ? (element as SVGElement).style.cssText : attr.value]).sort(([a], [b]) => a.localeCompare(b)));
function tree(element: Element): unknown { return { tag: element.localName, namespace: element.namespaceURI, attrs: attrs(element), text: element.children.length ? undefined : element.textContent, nodes: [...element.children].map(tree) }; }
function target() { const target = document.createElement('div'); document.body.append(target); return target; }
for (const library of iconLibraries) {
  it(`${library} all pinned generated exports match genuine React geometry and attributes`, async () => {
    const [data, reference] = await Promise.all([loadIconLibrary(library), loadLibrary(library)]);
    expect(Object.keys(data).sort()).toEqual(Object.keys(reference).sort());
    for (const [name, iconData] of Object.entries(data)) {
      const attributes = {};
      const host = target(); const local = mount(IconSvg, { target: host, props: { data: iconData, library, attributes } }); await tick();
      const icon = reference[name as keyof typeof reference];
      const props = library === 'hugeicons' ? { icon, strokeWidth: 2 } : {};
      const expected = target(); expected.innerHTML = renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : icon, props as never));
      expect(tree(host.querySelector('svg')!), `${library}/${name}`).toEqual(tree(expected.querySelector('svg')!));
      await unmount(local); host.remove(); expected.remove();
    }
  });
  for (const attributes of [{ ...names, class: 'size-5 red', width: 31, height: 27, color: 'rebeccapurple', strokeWidth: 7, title: 'Icon & <title>', 'aria-label': 'Navigate', role: 'img', style: 'color: red;' }, { ...names, class: null, color: null, width: null, title: null }, { ...names, class: ['one', { two: true }], 'data-slot': 'icon' }, { ...names, stroke: undefined, color: undefined, width: undefined, viewBox: undefined }, { ...names, stroke: null, 'aria-hidden': true, class: '' }, { ...names, stroke: '5' }]) {
    it(`${library} preserves loader stroke consumption, native props, title and caller precedence ${JSON.stringify(attributes)}`, async () => {
      const [data, reference] = await Promise.all([loadIconLibrary(library), loadLibrary(library)]);
      const name = names[library]; const host = target(); mounted.push(mount(IconSvg, { target: host, props: { data: data[name] as IconData, library, attributes } })); await tick();
      const { class: className, style, ...rest } = attributes as typeof attributes & { strokeWidth?: number; style?: string };
      delete rest.strokeWidth;
      const icon = reference[name as keyof typeof reference];
      const props = { ...rest, className: className == null ? className : typeof className === 'string' ? className : 'one two', style: style ? { color: 'red' } : undefined, ...(library === 'hugeicons' ? { icon, strokeWidth: 2 } : {}) };
      const expected = target(); expected.innerHTML = renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : icon, props as never));
      expect(tree(host.querySelector('svg')!)).toEqual(tree(expected.querySelector('svg')!));
    });
  }
}
it('reactive library changes, selected-name changes, absent/unknown names and stale loading retain real SVG/null behavior', async () => {
  const host = target(); const component = mount(Fixture, { target: host }); mounted.push(component); await tick();
  for (const library of iconLibraries) { component.select(library); await loadIcon(library, names[library]); await tick(); expect(host.querySelector('svg')).not.toBeNull(); expect(host.querySelector('svg path')).not.toBeNull(); expect(host.querySelector('svg')!.getAttribute(library)).toBe(names[library]); }
  component.unknown(); await loadIcon('remixicon', 'UnknownExport'); await tick(); expect(host.querySelector('svg')).toBeNull();
  component.absent(); await tick(); expect(host.querySelector('svg')).toBeNull();
  component.restore(); component.select('lucide'); await loadIcon('lucide', names.lucide); await tick(); const before = tree(host.querySelector('svg')!);
  component.changeName(); await loadIcon('lucide', 'ArrowRightIcon'); await tick(); expect(tree(host.querySelector('svg')!)).not.toEqual(before);
  component.select('tabler'); component.select('phosphor'); flushSync(); await tick(); expect(host.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 256 256');
});

it('default Hugeicons preserves genuine React explicit empty class', async () => {
  const [data, reference] = await Promise.all([loadIconLibrary('hugeicons'), loadLibrary('hugeicons')]);
  const host = target(); mounted.push(mount(IconSvg, { target: host, props: { data: data.ArrowLeft01Icon, library: 'hugeicons', attributes: {} } })); await tick();
  const expected = target(); expected.innerHTML = renderToStaticMarkup(createElement(HugeiconsIcon, { icon: reference.ArrowLeft01Icon, strokeWidth: 2 }));
  expect(expected.querySelector('svg')!.getAttribute('class')).toBe('');
  expect(tree(host.querySelector('svg')!)).toEqual(tree(expected.querySelector('svg')!));
});

it('selected native SVG maintains refs, native events, caller children, symbol attachments and cleanup', async () => {
  const { default: Lifecycle } = await import('./IconsLifecycleFixture.svelte');
  await loadIcon('lucide', 'ArrowLeftIcon'); const host = target(); const component = mount(Lifecycle, { target: host }); mounted.push(component); await tick();
  const svg = host.querySelector('svg')!; expect(component.snapshot()).toEqual({ ref: svg, attached: 1, detached: 0, clicks: 0 });
  expect(svg.querySelector('text')!.textContent).toBe('Native & escaped'); expect(svg.getAttribute('data-attached')).toBe('first');
  svg.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick(); expect(component.snapshot().clicks).toBe(1);
  component.setClass(''); await tick(); expect(host.querySelector('svg')).toBe(svg); expect(svg.getAttribute('class')).toBe('lucide lucide-arrow-left');
  component.setClass('size-7'); await tick(); expect(svg.getAttribute('class')).toBe('lucide lucide-arrow-left size-7');
  component.swap(); await tick(); expect(component.snapshot()).toEqual({ ref: svg, attached: 2, detached: 1, clicks: 1 }); expect(svg.getAttribute('data-attached')).toBe('second');
  component.remove(); await tick(); expect(component.snapshot()).toEqual({ ref: null, attached: 2, detached: 2, clicks: 1 });
});
