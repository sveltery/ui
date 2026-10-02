import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { LabelProbe } from '../../../../../tests/reference/LabelProbe';
// Trusted local reference markup: no user input enters the supplemental React harness.
export function load() { return { html: renderToString(createElement(LabelProbe)) }; }
