import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { TableProbe } from '../../../../../tests/reference/TableProbe';
// Trusted local reference markup: no user input enters the supplemental React harness.
export function load() { return { html: renderToString(createElement(TableProbe)) }; }
