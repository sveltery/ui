import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import IconFixture from './IconFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function render(props: Record<string, unknown> = {}) {
  instance = mount(IconFixture, { target: document.body, props });
  flushSync();
  return document.querySelector('svg')!;
}

it('draws the Lucide icon when no library is provided', () => {
  const svg = render();
  expect(svg.getAttribute('class')).toBe('lucide lucide-x');
  expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  expect(svg.getAttribute('stroke-width')).toBe('2');
  expect([...svg.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(['M18 6 6 18', 'm6 6 12 12']);
});

it('draws the icon of the library the provider selects', () => {
  const geometry = (library: string) => {
    const svg = render({ library });
    const result = [svg.getAttribute('viewBox'), svg.getAttribute('class'), svg.querySelector('path')!.getAttribute('d')!.slice(0, 12)];
    unmount(instance!);
    instance = undefined;
    return result;
  };
  expect(geometry('tabler')).toEqual(['0 0 24 24', 'tabler-icon tabler-icon-x', 'M18 6l-12 12']);
  expect(geometry('hugeicons')).toEqual(['0 0 24 24', null, 'M18 6L6.0008']);
  expect(geometry('phosphor')).toEqual(['0 0 256 256', null, 'M205.66,194.']);
  expect(geometry('remixicon')).toEqual(['0 0 24 24', 'remixicon', 'M11.9997 10.']);
});

it('caller attributes override the icon defaults and classes merge', () => {
  const svg = render({ class: ['size-4', { hidden: false }], 'stroke-width': 1.5, 'aria-hidden': 'true' });
  expect(svg.getAttribute('class')).toBe('lucide lucide-x size-4');
  expect(svg.getAttribute('stroke-width')).toBe('1.5');
  expect(svg.getAttribute('aria-hidden')).toBe('true');
});

it('renders the geometry as SVG elements', () => {
  const svg = render();
  expect([...svg.children].map(node => [node.localName, node.namespaceURI])).toEqual([['path', 'http://www.w3.org/2000/svg'], ['path', 'http://www.w3.org/2000/svg']]);
});
