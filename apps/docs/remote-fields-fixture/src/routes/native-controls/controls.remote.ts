import { form } from '$app/server';

// Every control the native components cover; `agree` must be checked so a rejection can be seen.
export type Controls = {
  agree?: boolean; topics?: string[]; notify?: boolean; volume?: number; day?: string; fruits?: string[]; format?: string[];
  code?: string; code2?: string; avatar?: File; color?: string; note?: string; bio?: string; action?: string;
};
type Issue = { message: string; path: string[] };
const schema = {
  '~standard': {
    version: 1 as const,
    vendor: 'fixture',
    types: undefined as unknown as { input: Controls; output: Controls },
    validate(value: unknown): { value: Controls } | { issues: Issue[] } {
      const data = value as Controls;
      return data.agree === true ? { value: data } : { issues: [{ message: 'Accept the terms', path: ['agree'] }] };
    },
  },
};

export const controlsForm = form(schema, ({ avatar, ...data }) => ({ received: { ...data, avatar: avatar && avatar.size ? `${avatar.name}:${avatar.size}` : undefined } }));
