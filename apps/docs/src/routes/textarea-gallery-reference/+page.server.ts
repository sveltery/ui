import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { SelectedTextareaGallery } from '../../../../../tests/reference/SelectedTextareaGallery';
export function load() { return { html: renderToString(createElement(SelectedTextareaGallery)) }; }
