import * as v from 'valibot';

export const signupSchema = v.object({
  name: v.pipe(v.string(), v.minLength(2, 'Use at least 2 characters.')),
  email: v.pipe(v.string(), v.email('Enter a valid email address.')),
});

/** The address the demos treat as already registered, to show an issue from the server. */
export const takenEmail = 'taken@example.com';
