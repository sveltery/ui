import { flushSync, type Component } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import ShapeHarness from './fixtures/ShapeHarness.svelte';
import Sector from '../../src/shape/Sector.svelte';
import Polygon from '../../src/shape/Polygon.svelte';
import Cross from '../../src/shape/Cross.svelte';
import Trapezoid from '../../src/shape/Trapezoid.svelte';
import { render } from '../shell/mount.js';

type AnyShape = Component<Record<string, unknown>>;

function draw(...shapes: Array<[AnyShape, Record<string, unknown>]>): HTMLElement {
  return render(ShapeHarness, { shapes: shapes.map(([component, props]) => ({ component, props })) }).target;
}

const attributes = (element: Element | null) => Object.fromEntries([...(element?.attributes ?? [])].map((attribute) => [attribute.name, attribute.value]));

// Ported from test/shape/Sector.spec.tsx and its snapshots.
describe('Sector', () => {
  it('renders one sector path', () => {
    const target = draw([Sector as AnyShape, { fill: '#ff7902', cx: 200, cy: 300, innerRadius: 150, outerRadius: 200, endAngle: 90 }]);
    expect(attributes(target.querySelector('path.recharts-sector'))).toEqual({
      class: 'recharts-sector',
      cx: '200',
      cy: '300',
      d: 'M 400,300\n    A 200,200,0,\n    0,0,\n    200,100\n  L 200,150\n            A 150,150,0,\n            0,1,\n            350,300 Z',
      fill: '#ff7902',
    });
  });

  it('rounds the corners when cornerRadius > 0', () => {
    const target = draw([Sector as AnyShape, { fill: '#ff7902', cx: 200, cy: 300, innerRadius: 150, outerRadius: 200, cornerRadius: 10, endAngle: 90 }]);
    const sectors = target.querySelectorAll('.recharts-sector');
    expect(sectors).toHaveLength(1);
    expect(sectors[0].getAttribute('d')).toBe(
      'M 389.7367,300\n    A10,10,0,0,0,399.7228,289.4737\n    A200,200,0,0,0,210.5263,100.2772\n    A10,10,0,0,0,200,110.2633\n  L200,140.3128\n      A10,10,0,0,0,209.375,150.2933\n      A150,150,0,0,1,349.7067,290.625\n      A10,10,0,0,0,359.6872,300Z',
    );
  });

  it('renders nothing when the props are invalid', () => {
    const target = draw(
      [Sector as AnyShape, { fill: '#ff7902', cx: 200, cy: 300, innerRadius: 200, outerRadius: 150, endAngle: 90 }],
      [Sector as AnyShape, { fill: '#ff7902', cx: 200, cy: 300, innerRadius: 150, outerRadius: 200, startAngle: 90, endAngle: 90 }],
    );
    expect(target.querySelectorAll('.recharts-sector')).toHaveLength(0);
  });
});

// Ported from test/shape/Cross.spec.tsx and its snapshots.
describe('Cross', () => {
  it('renders one path', () => {
    const target = draw([Cross as AnyShape, { top: 50, left: 50, x: 150, y: 180, width: 200, height: 200, stroke: '#000', fill: 'none' }]);
    expect(attributes(target.querySelector('path.recharts-cross'))).toEqual({
      class: 'recharts-cross',
      d: 'M150,50v200M50,180h200',
      fill: 'none',
      height: '200',
      stroke: '#000',
      width: '200',
      x: '150',
      y: '180',
    });
  });

  it('renders nothing when the props are invalid', () => {
    const target = draw([Cross as AnyShape, { top: 50, left: 50, x: 'x', y: 180, width: 200, height: 200, stroke: '#000', fill: 'none' }]);
    expect(target.querySelectorAll('.recharts-cross')).toHaveLength(0);
  });

  it('renders the default path without props', () => {
    const target = draw([Cross as AnyShape, {}]);
    expect(attributes(target.querySelector('path.recharts-cross'))).toEqual({ class: 'recharts-cross', d: 'M0,0v0M0,0h0', height: '0', width: '0', x: '0', y: '0' });
  });
});

// Ported from test/shape/Trapezoid.spec.tsx and its snapshots.
describe('Trapezoid', () => {
  it('renders one trapezoid in a group', () => {
    const target = draw([Trapezoid as AnyShape, { fill: '#f00', x: 300, y: 100, upperWidth: 100, lowerWidth: 0, height: 50 }]);
    const path = target.querySelector('svg > g > path.recharts-trapezoid');
    expect(attributes(path)).toEqual({ class: 'recharts-trapezoid', d: 'M 300,100L 400,100L 350,150L 350,150L 300,100 Z', fill: '#f00', height: '50', x: '300', y: '100' });
  });

  it('renders the animated path without a group', () => {
    const target = draw([Trapezoid as AnyShape, { fill: '#f00', x: 300, y: 100, upperWidth: 100, lowerWidth: 0, height: 50, isUpdateAnimationActive: true }]);
    const path = target.querySelector('svg > path.recharts-trapezoid');
    expect(path?.getAttribute('d')).toBe('M 300,100L 400,100L 350,150L 350,150L 300,100 Z');
    expect(path?.getAttribute('style')).toBe('stroke-dasharray: 0px 1px;');
  });

  it('renders nothing when the props are invalid', () => {
    const target = draw(
      [Trapezoid as AnyShape, { fill: '#f00', x: 300, y: 100, upperWidth: 0, lowerWidth: 0, height: 50 }],
      [Trapezoid as AnyShape, { fill: '#f00', x: 300, y: 100, upperWidth: 100, lowerWidth: 0, height: 0 }],
    );
    expect(target.querySelectorAll('.recharts-trapezoid')).toHaveLength(0);
  });
});

// Ported from test/shape/Polygon.spec.tsx and its snapshots.
describe('Polygon', () => {
  const triangle = [
    { x: 100, y: 300 },
    { x: 300, y: 300 },
    { x: 200, y: 50 },
  ];
  const withNull = [...triangle, null, { x: 400, y: 300 }, { x: 600, y: 300 }, { x: 500, y: 50 }];
  const base = [
    { x: 100, y: 400 },
    { x: 300, y: 400 },
    { x: 200, y: 200 },
  ];
  const polygon = (props: Record<string, unknown>) => draw([Polygon as AnyShape, props]).querySelector('.recharts-polygon');

  it('renders one path', () => {
    expect(attributes(polygon({ points: triangle, fill: '#ff7300' }))).toEqual({ class: 'recharts-polygon', d: 'M100,300L300,300L200,50L100,300Z', fill: '#ff7300' });
  });

  it('renders nothing without points', () => {
    const target = draw([Polygon as AnyShape, { points: [], fill: '#ff7300' }], [Polygon as AnyShape, { fill: '#ff7300' }]);
    expect(target.querySelectorAll('.recharts-polygon')).toHaveLength(0);
  });

  it('renders an empty path when no point is valid', () => {
    expect(polygon({ points: [{ x: NaN, y: 100 }, { x: 100, y: NaN }, { x: '100', y: 100 }, null, undefined], fill: '#ff7300' })?.getAttribute('d')).toBe('');
    expect(polygon({ points: [{ x: NaN, y: NaN }] })?.getAttribute('d')).toBe('');
  });

  it('filters out points with only one valid coordinate', () => {
    expect(polygon({ points: [{ x: 100, y: 100 }, { x: NaN, y: 400 }, { x: 500, y: NaN }, { x: 200, y: 200 }] })?.getAttribute('d')).toBe('M100,100M200,200L100,100');
  });

  it('splits at nulls unless connectNulls', () => {
    expect(polygon({ points: withNull, fill: '#ff7300', connectNulls: false })?.getAttribute('d')).toBe('M100,300L300,300L200,50M400,300L600,300L500,50L100,300');
    expect(attributes(polygon({ points: withNull, fill: '#ff7300', connectNulls: true }))).toEqual({
      class: 'recharts-polygon',
      d: 'M100,300L300,300L200,50L400,300L600,300L500,50L100,300Z',
      fill: '#ff7300',
    });
  });

  it('renders a range polygon with baseLinePoints', () => {
    const group = polygon({ points: triangle, baseLinePoints: base, stroke: 'black', fill: 'blue', className: 'custom-polygon' });
    expect(group?.tagName).toBe('g');
    expect(group?.getAttribute('class')).toBe('recharts-polygon custom-polygon');
    const paths = [...(group?.querySelectorAll('path') ?? [])];
    expect(paths.map((path) => [path.getAttribute('fill'), path.getAttribute('stroke'), path.getAttribute('d')])).toEqual([
      ['blue', 'none', 'M100,300L300,300L200,50L100,300L200,200L300,400L100,400L200,200Z'],
      ['none', 'black', 'M100,300L300,300L200,50L100,300Z'],
      ['none', 'black', 'M100,400L300,400L200,200L100,400Z'],
    ]);
  });

  it('keeps the outer path whole when it does not close', () => {
    const group = polygon({ points: [triangle[0], triangle[1], null, { x: 400, y: 300 }, { x: 600, y: 300 }], baseLinePoints: [{ x: 100, y: 400 }, { x: 600, y: 400 }], connectNulls: false, fill: 'blue' });
    const path = group?.querySelector('path');
    expect(path?.getAttribute('fill')).toBe('blue');
    expect(path?.getAttribute('d')).toMatch(/L100,300L600,400/);
  });

  it('drops the fill when the baseline does not close', () => {
    const group = polygon({ points: [{ x: 100, y: 300 }, { x: 600, y: 300 }], baseLinePoints: [{ x: 100, y: 400 }, null, { x: 600, y: 400 }], connectNulls: false, fill: 'blue' });
    const path = group?.querySelector('path');
    expect(path?.getAttribute('fill')).toBe('none');
    expect(path?.getAttribute('d')).not.toMatch(/Z$/);
  });

  it('draws only the fill without a stroke', () => {
    const paths = polygon({ points: triangle, baseLinePoints: base, stroke: 'none', fill: 'blue' })?.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    expect(paths?.[0].getAttribute('fill')).toBe('blue');
  });

  it('calls the event handlers', () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const path = polygon({ points: triangle, onClick, onMouseEnter, onMouseLeave });
    for (const type of ['click', 'mouseenter', 'mouseleave']) path?.dispatchEvent(new MouseEvent(type, { bubbles: true }));
    flushSync();
    expect([onClick.mock.calls.length, onMouseEnter.mock.calls.length, onMouseLeave.mock.calls.length]).toEqual([1, 1, 1]);
  });

  it('closes a single point on itself', () => {
    expect(polygon({ points: [{ x: 100, y: 100 }] })?.getAttribute('d')).toBe('M100,100L100,100Z');
  });
});
