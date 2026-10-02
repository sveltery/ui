// A dependency-free Standard Schema fixture; not an application validator API.
export type Input = { nativeText: string; text: string; emptyText?: string; action?: string; baseAction?: string; uiAction?: string };
type Issue = { message: string; path: string[] };
type Result = { value: Input } | { issues: Issue[] };
type FixtureSchema = { '~standard': { version: 1; vendor: string; types?: { input: Input; output: Input }; validate(value: unknown): Result } };
export const schema: FixtureSchema = {
  '~standard': {
    version: 1,
    vendor: 'sveltery-remote-fields-fixture',
    validate(value: unknown): Result {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return { issues: [{ message: 'Expected form values', path: [] }] };
      const data = value as Record<string, unknown>;
      const output: Input = { nativeText: '', text: '' };
      const issues: Issue[] = [];
      for (const key of ['nativeText', 'text'] as const) {
        const field = data[key];
        if (typeof field === 'string' && field.length >= 2) output[key] = field;
        else issues.push({ message: 'Use at least two characters', path: [key] });
      }
      for (const key of ['emptyText', 'action', 'baseAction', 'uiAction'] as const) {
        const field = data[key];
        if (typeof field === 'string') output[key] = field;
        else if (field !== undefined) issues.push({ message: 'Expected a string', path: [key] });
      }
      return issues.length ? { issues } : { value: output };
    }
  }
};
