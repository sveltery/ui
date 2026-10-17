import { describe, expect, it } from 'vitest';
import AreaFixture from './fixtures/AreaFixture.svelte';
import { render } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400 },
  { name: 'b', uv: 300 },
  { name: 'c', uv: 200 },
];

describe('Area', () => {
  it('renders the filled area and its stroke in the area layer', () => {
    const { target } = render(AreaFixture, { data });
    const area = target.querySelector('.recharts-zIndex-layer_100 > .recharts-area');
    expect(area?.getAttribute('class')).toBe('recharts-layer recharts-area');
    const fill = area?.querySelector('path.recharts-curve.recharts-area-area');
    expect(fill?.getAttribute('stroke')).toBe('none');
    expect(fill?.getAttribute('fill')).toBe('#3182bd');
    expect(fill?.getAttribute('fill-opacity')).toBe('0.6');
    const stroke = area?.querySelector('path.recharts-curve.recharts-area-curve');
    expect(stroke?.getAttribute('fill')).toBe('none');
    expect(stroke?.getAttribute('stroke')).toBe('#3182bd');
  });

  it('wraps the area in the animation clip layer when not animated, as upstream does', () => {
    const { target } = render(AreaFixture, { data });
    expect(target.querySelector('.recharts-area > .recharts-layer > .recharts-layer[clip-path^="url(#animationClipPath-"]')).not.toBeNull();
    expect(target.querySelector('[id^="animationClipPath-"]')).toBeNull();
  });

  it('renders dots when asked', () => {
    const { target } = render(AreaFixture, { data, areaProps: { dot: true } });
    expect(target.querySelectorAll('.recharts-area-dots circle.recharts-area-dot')).toHaveLength(3);
  });
});
