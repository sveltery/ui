import { ATTRIBUTE_ALIASES, BOOLEAN_ATTRIBUTES, BOOLEANISH_ATTRIBUTES, EVENT_ALIASES, IGNORED_PROPS, UNITLESS_STYLES } from './reactDomTables.js';

/** A prop bag named the way recharts builds it for JSX: className, strokeWidth, onMouseEnter, a style object. */
export type ReactDomProps = { readonly [key: string]: unknown };

/** Attributes and listeners to spread onto a Svelte element. Keys are DOM attribute names or Svelte event attributes. */
export type DomAttributes = Record<string, unknown>;

const REACT_ONLY_PROPS = new Set(['key', 'dangerouslySetInnerHTML']);

function isEventProp(key: string): boolean {
  return key.length > 2 && (key[0] === 'o' || key[0] === 'O') && (key[1] === 'n' || key[1] === 'N');
}

function eventAttribute(key: string): string {
  const capture = key.endsWith('Capture');
  const name = capture ? key.slice(0, -'Capture'.length) : key;
  const event = EVENT_ALIASES.get(name) ?? name.slice(2).toLowerCase();
  return `on${event}${capture ? 'capture' : ''}`;
}

function hyphenate(styleName: string): string {
  return styleName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^ms-/, '-ms-');
}

/** Serializes a React style object the way react-dom assigns it, property by property. */
export function styleToCss(style: unknown): string | undefined {
  if (style == null) return undefined;
  if (typeof style === 'string') return style;
  const declarations: string[] = [];
  for (const [name, value] of Object.entries(style)) {
    if (value == null || typeof value === 'boolean' || value === '') continue;
    if (name.startsWith('--')) {
      declarations.push(`${name}: ${value}`);
    } else if (typeof value === 'number' && value !== 0 && !UNITLESS_STYLES.has(name)) {
      declarations.push(`${hyphenate(name)}: ${value}px`);
    } else {
      declarations.push(`${hyphenate(name)}: ${String(value).trim()}`);
    }
  }
  return declarations.length ? `${declarations.join('; ')};` : undefined;
}

function attributeValue(key: string, name: string, value: unknown): unknown {
  if (value == null || typeof value === 'function' || typeof value === 'symbol') return undefined;
  if (typeof value !== 'boolean') return BOOLEAN_ATTRIBUTES.has(key) ? (value ? '' : undefined) : value;
  if (BOOLEAN_ATTRIBUTES.has(key)) return value ? '' : undefined;
  if (BOOLEANISH_ATTRIBUTES.has(key)) return String(value);
  const prefix = name.toLowerCase().slice(0, 5);
  return prefix === 'data-' || prefix === 'aria-' ? String(value) : undefined;
}

/**
 * Turns a recharts prop bag into the attributes react-dom would write, ready to spread onto a Svelte element.
 * Key order is kept, so a bag transcribed from upstream JSX yields the same attribute order.
 */
export function attrs(props: ReactDomProps): DomAttributes {
  const result: DomAttributes = {};
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (IGNORED_PROPS.has(key) || REACT_ONLY_PROPS.has(key)) continue;
    if (key === 'style') {
      const css = styleToCss(value);
      if (css !== undefined) result.style = css;
    } else if (isEventProp(key)) {
      if (typeof value === 'function') result[eventAttribute(key)] = value;
    } else {
      const name = ATTRIBUTE_ALIASES.get(key) ?? key;
      const attribute = attributeValue(key, name, value);
      if (attribute !== undefined) result[name] = attribute;
    }
  }
  return result;
}
