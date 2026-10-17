import * as v from 'valibot';

export const profileSchema = v.object({
  birthday: v.pipe(v.string(), v.isoDate('Pick a date.')),
  accent: v.pipe(v.string(), v.hexColor('Pick a color.')),
  avatar: v.optional(v.file()),
  code: v.pipe(v.string(), v.regex(/^\d{6}$/, 'Enter the 6-digit code.')),
});

/** The code the demos accept, so any other one shows an issue from the server. */
export const demoCode = '123456';
