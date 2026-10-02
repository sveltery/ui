import assert from 'node:assert/strict';
import test from 'node:test';
import { schema } from '../../apps/docs/remote-fields-fixture/src/routes/schema.ts';
const validate = schema['~standard'].validate;
test('remote-field fixture schema accepts typed text and optional submitters', () => {
  const data = { nativeText: 'Native', text: 'UI', emptyText: '', action: 'native', baseAction: 'base', uiAction: 'ui' };
  assert.deepEqual(validate(data), { value: data });
  assert.deepEqual(validate({ nativeText: 'Native', text: 'UI' }), { value: { nativeText: 'Native', text: 'UI' } });
});
test('remote-field fixture rejects structural inputs before reading fields', () => {
  for (const input of [null, undefined, false, 1, 'text', []]) assert.deepEqual(validate(input), { issues: [{ message: 'Expected form values', path: [] }] });
});
test('remote-field fixture reports each invalid field and never returns partial output', () => {
  assert.deepEqual(validate({ nativeText: 42, text: 'x', emptyText: null, action: false, baseAction: [], uiAction: {} }), {
    issues: [
      { message: 'Use at least two characters', path: ['nativeText'] },
      { message: 'Use at least two characters', path: ['text'] },
      ...['emptyText', 'action', 'baseAction', 'uiAction'].map(key => ({ message: 'Expected a string', path: [key] }))
    ]
  });
  assert.deepEqual(validate({}), { issues: ['nativeText', 'text'].map(key => ({ message: 'Use at least two characters', path: [key] })) });
});
