import { afterEach, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import QuestionnaireCollectionFixture from './QuestionnaireCollectionFixture.svelte';

// The questionnaire package owns the esm-env dependency, so the mock names its copy.
vi.mock('../../packages/svelte/node_modules/esm-env/index.js', () => ({ BROWSER: true, DEV: false, NODE: false }));

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => {
  if (instance) await unmount(instance);
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it('prints no collection warnings in production', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  instance = mount(QuestionnaireCollectionFixture, { target: document.body, props: { scenario: 'mismatch' } });
  flushSync();
  expect(document.querySelector('input')?.getAttribute('name')).toBe('answer');
  expect(warn.mock.calls).toEqual([]);
});
