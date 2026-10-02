// Actual Base React1.6 ordinary and helper assertions, executed in both frameworks.
// Ordinary JSX/render/screen infrastructure is translated; original expectations stay unchanged.
// This is separate from shadcn Separator wrapper tests and contextual Field tests.
import { afterEach, describe, expect, it } from 'vitest';
import { createElement, isValidElement, Fragment, act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Separator } from '@base-ui/react/separator';
import { mount, tick, unmount } from 'svelte';
import Fixture from './BaseSeparatorConformanceFixture.svelte';
import { testPropForwarding } from '../reference/base-separator-1.6/ported/propForwarding';
import { testRenderProp } from '../reference/base-separator-1.6/ported/renderProp';
import { testRefForwarding } from '../reference/base-separator-1.6/ported/refForwarding';
import { testClassName } from '../reference/base-separator-1.6/ported/className';
import type { ConformantComponentProps } from '../reference/base-separator-1.6/describeConformance';
const roots: Root[] = [];
const components: ReturnType<typeof mount>[] = [];
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
expect.extend({
  toHaveAttribute(received: Element | null, name: string, expected?: unknown) {
    const pass = !!received?.hasAttribute(name) && (expected === undefined || received.getAttribute(name) === String(expected));
    return { pass, message: () => `Expected ${received?.outerHTML} to have ${name}${expected === undefined ? '' : `="${expected}"`}` };
  },
  toBeVisible(received: Element | null) { const css = received ? getComputedStyle(received) : null; const pass = !!received?.isConnected && css?.display !== 'none' && css?.visibility !== 'hidden' && css?.opacity !== '0'; return { pass, message: () => `Expected ${received?.outerHTML} to be visible` }; },
});
afterEach(async () => {
  await act(async () => { for (const root of roots.splice(0)) root.unmount(); });
  for (const component of components.splice(0)) await unmount(component);
  document.body.replaceChildren();
});
function unwrap(element: ReactElement): ReactElement {
  if (element.type === Fragment) return unwrap(element.props.children as ReactElement);
  if (typeof element.type === 'function' && element.type !== Separator) return unwrap((element.type as (props: unknown) => ReactElement)(element.props));
  if (!isValidElement(element) || element.type !== Separator) throw new Error('Only upstream helper Separator infrastructure can be translated');
  return element;
}
for (const framework of ['actual React1.6', 'Base Svelte d889'] as const) describe(framework, () => {
  const render = async (element: ReactElement<ConformantComponentProps>) => {
    const container = document.createElement('section'); document.body.append(container);
    if (framework === 'actual React1.6') {
      const root = createRoot(container); roots.push(root); await act(async () => root.render(element));
    } else {
      const raw = unwrap(element);
      components.push(mount(Fixture, { target: container, props: { referenceProps: raw.props as Record<string, unknown> } })); await tick();
    }
    return { container };
  };
  const options = () => ({ render, refInstanceof: window.HTMLSeparatorElement });
  const element = createElement(Separator) as ReactElement<ConformantComponentProps>;
  testPropForwarding(element, options);
  testRefForwarding(element, options);
  testRenderProp(element, options);
  testClassName(element, options);
  it('renders a div with the `separator` role', async () => {
    await render(createElement(Separator));
    expect(document.querySelector('[role=separator]')).toBeVisible();
  });
  describe('prop: orientation', () => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      it(orientation, async () => {
        await render(createElement(Separator, { orientation: orientation as 'horizontal' | 'vertical' }));
        expect(document.querySelector('[role=separator]')).toHaveAttribute('aria-orientation', orientation);
      });
    });
  });
});
