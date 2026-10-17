import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { demoCode, profileSchema } from './profile';

export const saveProfile = form(profileSchema, async ({ avatar, ...data }, issue) => {
  if (data.code !== demoCode) invalid(issue.code(`That code is wrong. Try ${demoCode}.`));
  return { ...data, avatar: avatar?.size ? avatar.name : undefined };
});
