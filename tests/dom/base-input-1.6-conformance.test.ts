// Actual Base React1.6 helper assertions, executed unchanged in both frameworks.
// This is separate from shadcn Input wrapper tests and contextual Field tests.
import { afterEach, describe, expect } from 'vitest';
import { createElement, isValidElement, Fragment, act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Input } from '@base-ui/react/input';
import { mount, tick, unmount } from 'svelte';
import Fixture from './BaseInputConformanceFixture.svelte';
import { testPropForwarding } from '../reference/base-input-1.6/ported/propForwarding';
import { testRenderProp } from '../reference/base-input-1.6/ported/renderProp';
import { testRefForwarding } from '../reference/base-input-1.6/ported/refForwarding';
import { testClassName } from '../reference/base-input-1.6/ported/className';
import type { ConformantComponentProps } from '../reference/base-input-1.6/describeConformance';
const roots: Root[] = [];
const components: ReturnType<typeof mount>[] = [];
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
expect.extend({
  toHaveAttribute(received: Element | null, name: string, expected?: unknown) {
    const pass = !!received?.hasAttribute(name) && (expected === undefined || received.getAttribute(name) === String(expected));
    return { pass, message: () => `Expected ${received?.outerHTML} to have ${name}${expected === undefined ? '' : `="${expected}"`}` };
  },
});
afterEach(async () => {
  await act(async () => { for (const root of roots.splice(0)) root.unmount(); });
  for (const component of components.splice(0)) await unmount(component);
  document.body.replaceChildren();
});
function unwrap(element: ReactElement): ReactElement {
  if (element.type === Fragment) return unwrap(element.props.children as ReactElement);
  if (typeof element.type === 'function' && element.type !== Input) return unwrap((element.type as (props: unknown) => ReactElement)(element.props));
  if (!isValidElement(element) || element.type !== Input) throw new Error('Only upstream helper Input infrastructure can be translated');
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
  const options = () => ({ render, refInstanceof: window.HTMLInputElement });
  const element = createElement(Input) as ReactElement<ConformantComponentProps>;
  testPropForwarding(element, options);
  testRefForwarding(element, options);
  testRenderProp(element, options);
  testClassName(element, options);
});
