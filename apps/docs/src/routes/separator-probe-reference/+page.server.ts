import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { SeparatorProbe } from '../../../../../tests/reference/SeparatorProbe';
export function load() { return { html: renderToString(createElement(SeparatorProbe)) }; }
