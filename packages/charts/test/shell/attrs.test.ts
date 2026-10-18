import { describe, expect, it } from 'vitest';
import { attrs, styleToCss } from '../../src/util/attrs.js';

describe('attrs', () => {
  it('renames React prop names to the attributes react-dom writes', () => {
    expect(attrs({ className: 'recharts-layer', strokeWidth: 2, tabIndex: -1, fillOpacity: 0.5, xlinkHref: '#a', viewBox: '0 0 10 10' })).toEqual({
      class: 'recharts-layer',
      'stroke-width': 2,
      tabindex: -1,
      'fill-opacity': 0.5,
      'xlink:href': '#a',
      viewBox: '0 0 10 10',
    });
  });

  it('keeps the key order of the bag', () => {
    expect(Object.keys(attrs({ width: 500, height: 300, className: 'recharts-wrapper', style: { position: 'relative' } }))).toEqual(['width', 'height', 'class', 'style']);
  });

  it('maps event props to Svelte event attributes the way react-dom listens', () => {
    const handler = () => {};
    expect(attrs({ onClick: handler, onMouseEnter: handler, onDoubleClick: handler, onFocus: handler, onBlur: handler, onKeyDown: handler, onClickCapture: handler })).toEqual({
      onclick: handler,
      onmouseenter: handler,
      ondblclick: handler,
      onfocusin: handler,
      onfocusout: handler,
      onkeydown: handler,
      onclickcapture: handler,
    });
  });

  it('drops values react-dom does not write', () => {
    expect(attrs({ children: 'x', key: 'k', ref: {}, onClick: 'not a function', fill: undefined, stroke: null, d: () => 'M0', connectNulls: true, opacity: false })).toEqual({});
  });

  it('writes booleans only where react-dom does', () => {
    expect(attrs({ 'data-active': true, 'aria-hidden': false, focusable: false, hidden: true, disabled: false })).toEqual({
      'data-active': 'true',
      'aria-hidden': 'false',
      focusable: 'false',
      hidden: '',
    });
  });
});

describe('styleToCss', () => {
  it('adds px to numbers except zero and unitless properties', () => {
    expect(styleToCss({ position: 'relative', cursor: 'default', width: 500, height: 300, opacity: 0.5, strokeWidth: 2, margin: 0 })).toBe(
      'position: relative; cursor: default; width: 500px; height: 300px; opacity: 0.5; stroke-width: 2; margin: 0;',
    );
  });

  it('hyphenates names, keeps custom properties and skips empty values', () => {
    expect(styleToCss({ minWidth: '0', WebkitTransition: 'none', msTransform: 'none', '--color-desktop': 'red', display: undefined, visibility: '', zIndex: true })).toBe(
      'min-width: 0; -webkit-transition: none; -ms-transform: none; --color-desktop: red;',
    );
  });

  it('returns undefined when nothing is left to write', () => {
    expect(styleToCss({})).toBeUndefined();
    expect(styleToCss(undefined)).toBeUndefined();
  });
});
