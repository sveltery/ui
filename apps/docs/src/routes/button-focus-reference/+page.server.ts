import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ButtonFocusProbe } from '../../../../../tests/reference/ButtonFocusProbe';
export function load({ url }: { url: URL }) {
  const custom = url.searchParams.get('case') === 'custom-focusable';
  return { html: renderToString(createElement(ButtonFocusProbe, { custom })), custom };
}
