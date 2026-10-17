import css from '$lib/typeset/typeset.css?raw';

export const prerender = true;

/** Serves the stylesheet the builder's Get Code panel copies, read from the source so it never drifts. */
export function GET() {
  return new Response(css, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
