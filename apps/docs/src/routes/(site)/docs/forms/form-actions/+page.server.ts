import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import { signupSchema, takenEmail } from '$lib/forms/signup';
import type { Actions } from './$types';

// The page's demo posts to this action, and a page with actions renders on each request.
export const prerender = false;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const values = { name: String(data.get('name') ?? ''), email: String(data.get('email') ?? '') };
    const result = v.safeParse(signupSchema, values);
    if (!result.success) return fail(400, { values, errors: v.flatten<typeof signupSchema>(result.issues).nested });
    if (result.output.email === takenEmail) return fail(400, { values, errors: { email: ['That email is already registered.'] } });
    return { welcome: result.output.name };
  },
} satisfies Actions;
