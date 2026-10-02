import { form } from '$app/server';
import { schema } from './schema';
export const probe = form(schema, async data => ({ parsed: data }));
