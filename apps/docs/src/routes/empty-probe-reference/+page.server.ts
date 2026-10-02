import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { EmptyProbe } from '../../../../../tests/reference/EmptyProbe';
// Trusted local reference markup: no user input enters the supplemental React harness.
export function load() { return { html: renderToString(createElement(EmptyProbe)) }; }
