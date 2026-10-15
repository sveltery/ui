/** A user-facing failure: the CLI prints its message without a stack trace and exits non-zero. */
export class CliError extends Error {}

/** Turns untrusted JSON into a typed value, or throws a ParseError naming the offending path. */
export type Parser<T> = (value: unknown, path: string) => T;
type Optional<T> = Parser<T> & { optional: true };
type Shape = Record<string, Parser<unknown>>;
type Infer<P> = P extends Parser<infer T> ? T : never;
type Simplify<T> = { [K in keyof T]: T[K] } & {};
export type InferShape<S extends Shape> = Simplify<
  { [K in keyof S as S[K] extends Optional<unknown> ? never : K]: Infer<S[K]> } & {
    [K in keyof S as S[K] extends Optional<unknown> ? K : never]?: Infer<S[K]>;
  }
>;

export class ParseError extends Error {}

const fail = (path: string, expected: string, value: unknown): never => {
  const got = value === null ? 'null' : Array.isArray(value) ? 'an array' : typeof value === 'string' ? JSON.stringify(value) : typeof value;
  throw new ParseError(`${path || 'value'}: expected ${expected}, got ${got}`);
};

export const string: Parser<string> = (value, path) => (typeof value === 'string' ? value : fail(path, 'a string', value));

export const number: Parser<number> = (value, path) => (typeof value === 'number' ? value : fail(path, 'a number', value));

export const literal =
  <const T extends string | number | boolean>(...options: readonly T[]): Parser<T> =>
  (value, path) =>
    options.includes(value as T) ? (value as T) : fail(path, options.map((o) => JSON.stringify(o)).join(' or '), value);

export const array =
  <T>(item: Parser<T>): Parser<T[]> =>
  (value, path) =>
    Array.isArray(value) ? value.map((v, i) => item(v, `${path}[${i}]`)) : fail(path, 'an array', value);

export const record =
  <T>(item: Parser<T>): Parser<Record<string, T>> =>
  (value, path) =>
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).map(([key, v]) => [key, item(v, `${path}.${key}`)]))
      : fail(path, 'an object', value);

export const optional = <T>(parser: Parser<T>): Optional<T> =>
  Object.assign((value: unknown, path: string) => (value === undefined ? (undefined as T) : parser(value, path)), { optional: true as const });

/** Unknown keys are dropped, so a registry can add fields without breaking older CLIs. */
export const object =
  <S extends Shape>(shape: S): Parser<InferShape<S>> =>
  (value, path) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return fail(path, 'an object', value);
    const out: Record<string, unknown> = {};
    for (const [key, parser] of Object.entries(shape)) {
      const parsed = parser((value as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
      if (parsed !== undefined) out[key] = parsed;
    }
    return out as InferShape<S>;
  };

export const refine =
  <T>(parser: Parser<T>, check: (value: T) => boolean, expected: string): Parser<T> =>
  (value, path) => {
    const parsed = parser(value, path);
    return check(parsed) ? parsed : fail(path, expected, value);
  };
