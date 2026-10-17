import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { choicesSchema } from './choices';

export const saveChoices = form(choicesSchema, async (data, issue) => {
  if (data.fruits.includes('pineapple')) invalid(issue.fruits('Pineapple is out of season.'));
  return data;
});
