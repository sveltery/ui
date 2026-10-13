import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { signupSchema, takenEmail } from './signup';

export const signup = form(signupSchema, async (data, issue) => {
  if (data.email === takenEmail) invalid(issue.email('That email is already registered.'));
  return { welcome: data.name };
});
