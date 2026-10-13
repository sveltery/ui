import { parseForm } from '@sveltery/base/form/kit';
import { signupSchema, takenEmail } from '$lib/forms/signup';
import type { Actions } from './$types';

// The page's demo posts to this action, and a page with actions renders on each request.
export const prerender = false;

export const actions = {
  default: async ({ request }) => {
    const submission = await parseForm(request, signupSchema);
    if (!submission.ok) return submission.fail();
    if (submission.data.email === takenEmail) return submission.fail(submission.issue.email('That email is already registered.'));
    return { welcome: submission.data.name };
  },
} satisfies Actions;
