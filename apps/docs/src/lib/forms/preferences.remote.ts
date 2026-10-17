import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { preferencesSchema } from './preferences';

export const savePreferences = form(preferencesSchema, async (data, issue) => {
  if (data.topics.length === 0 && !data.digest) invalid(issue.topics('Pick a topic or turn on the digest.'));
  return data;
});
