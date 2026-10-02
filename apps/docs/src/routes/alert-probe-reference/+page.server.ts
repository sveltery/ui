import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AlertProbe } from '../../../../../tests/reference/AlertProbe';
// Trusted local reference markup; no user content enters this source-derived harness.
export function load() { return { html: renderToString(createElement(AlertProbe)) }; }
