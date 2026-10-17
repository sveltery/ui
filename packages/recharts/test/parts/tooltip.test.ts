import { describe, expect, it } from 'vitest';
import TooltipFixture from './fixtures/TooltipFixture.svelte';
import { render, settle } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400 },
  { name: 'b', uv: 300 },
  { name: 'c', uv: 200 },
];

function hover(target: HTMLElement, clientX: number, clientY: number) {
  const wrapper = target.querySelector('.recharts-wrapper');
  wrapper?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX, clientY }));
  settle();
}

function tooltip(target: HTMLElement): HTMLElement {
  const wrappers = target.querySelectorAll<HTMLElement>('.recharts-tooltip-wrapper');
  expect(wrappers).toHaveLength(1);
  return wrappers[0]!;
}

describe('Tooltip', () => {
  it('puts a hidden wrapper in the chart wrapper, before the svg', () => {
    const { target } = render(TooltipFixture, { data });
    const wrapper = target.querySelector('.recharts-wrapper');
    expect([...(wrapper?.children ?? [])].map((child) => child.getAttribute('class'))).toEqual(['recharts-tooltip-wrapper', 'recharts-surface']);
    const element = tooltip(target);
    expect(element.getAttribute('style')).toBe('visibility: hidden; pointer-events: none; position: absolute; top: 0px; left: 0px;');
    expect(element.getAttribute('tabindex')).toBe('-1');
    expect(element.children).toHaveLength(1);
    expect(element.querySelector('.recharts-default-tooltip')).not.toBeNull();
  });

  it('shows the hovered item with the default content and a cursor rectangle in a BarChart', () => {
    const { target } = render(TooltipFixture, { data });
    hover(target, 200, 150);
    const element = tooltip(target);
    expect(element.style.visibility).toBe('visible');
    expect(element.querySelector('.recharts-tooltip-label')?.textContent).toBe('b');
    expect(element.querySelector('.recharts-tooltip-item-name')?.textContent).toBe('uv');
    expect(element.querySelector('.recharts-tooltip-item-separator')?.textContent).toBe(' : ');
    expect(element.querySelector('.recharts-tooltip-item-value')?.textContent).toBe('300');
    const cursor = target.querySelector('.recharts-zIndex-layer_200 path.recharts-rectangle.recharts-tooltip-cursor');
    expect(cursor?.getAttribute('fill')).toBe('#ccc');
    expect(cursor?.getAttribute('stroke')).toBe('none');
  });

  it('draws a line cursor and the active dot in a LineChart', () => {
    const { target } = render(TooltipFixture, { data, kind: 'line' });
    hover(target, 200, 150);
    expect(target.querySelector('path.recharts-curve.recharts-tooltip-cursor')).not.toBeNull();
    expect(target.querySelectorAll('.recharts-active-dot circle.recharts-dot')).toHaveLength(1);
  });

  it('renders no cursor with cursor={false}', () => {
    const { target } = render(TooltipFixture, { data, tooltipProps: { cursor: false } });
    hover(target, 200, 150);
    expect(target.querySelector('.recharts-tooltip-cursor')).toBeNull();
    expect(tooltip(target).style.visibility).toBe('visible');
  });

  it('walks the data with the arrow keys on the accessibility layer', () => {
    const { target } = render(TooltipFixture, { data });
    const svg = target.querySelector('svg.recharts-surface') as SVGSVGElement;
    svg.dispatchEvent(new FocusEvent('focus'));
    target.querySelector('.recharts-wrapper')?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    settle();
    expect(tooltip(target).querySelector('.recharts-tooltip-label')?.textContent).toBe('a');
    target.querySelector('.recharts-wrapper')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    settle();
    expect(tooltip(target).querySelector('.recharts-tooltip-label')?.textContent).toBe('b');
  });
});
