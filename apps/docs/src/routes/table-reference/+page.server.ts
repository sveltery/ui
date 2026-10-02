import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { TableGallery } from '../../../../../tests/reference/TableGallery';
// Trusted local reference markup: no user input enters the supplemental React harness.
export function load() { return { html: renderToString(createElement(TableGallery)) }; }
