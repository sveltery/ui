import { redirect } from '@sveltejs/kit';

// Upstream replaced Typography with Typeset and redirects the old page there.
export const prerender = false;

export function GET() {
  redirect(308, '/docs/typeset');
}
