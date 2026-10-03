import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { SeparatorGallery } from '../../../../../tests/reference/SeparatorGallery';
export function load() { return { html: renderToString(createElement(SeparatorGallery)) }; }
