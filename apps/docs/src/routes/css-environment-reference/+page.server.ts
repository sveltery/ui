import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { CssEnvironmentReference } from '../../../../../tests/reference/CssEnvironmentReference';
// Trusted local reference sources; no user content.
export function load() { return { html: renderToString(createElement(CssEnvironmentReference)) }; }
