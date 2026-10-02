import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ExampleProbe } from '../../../../../tests/reference/ExampleProbe';
export function load() { return { html: renderToString(createElement(ExampleProbe)) }; }
