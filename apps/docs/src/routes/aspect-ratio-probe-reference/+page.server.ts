import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AspectRatioProbe } from '../../../../../tests/reference/AspectRatioProbe';
// Trusted local supplemental reference; no user input.
export function load() { return { html: renderToString(createElement(AspectRatioProbe)) }; }
