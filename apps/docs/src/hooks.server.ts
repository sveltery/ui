import type { Handle } from '@sveltejs/kit/hooks';
import { docStyle } from '$lib/docs/load';

/** Puts a docs page's `style` on `<body>`, where portaled popups mount, so the first paint is already in that style. */
export const handle: Handle = async ({ event, resolve }) => {
  const style = event.route.id === '/(site)/docs/[...slug]' ? await docStyle(event.params.slug ?? '') : undefined;
  if (!style) return resolve(event);
  return resolve(event, { transformPageChunk: ({ html }) => html.replace('<body class="style-nova"', `<body class="style-${style}"`) });
};
