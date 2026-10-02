import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AlertGallery } from '../../../../../tests/reference/AlertGallery';
// Trusted local reference markup; no user content enters this source-derived harness.
export function load() { return { html: renderToString(createElement(AlertGallery)) }; }
