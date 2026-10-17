import { assert } from '../../utils/assert.js';
import { getGroupContext, hasGroupContext } from './GroupContext.js';

export function useGroupContext() {
  assert(hasGroupContext(), 'Group Context not found; did you render a Panel or Separator outside of a Group?');

  return getGroupContext();
}
