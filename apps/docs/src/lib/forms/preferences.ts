import * as v from 'valibot';

export const topics = ['product', 'security', 'events'] as const;

export const preferencesSchema = v.object({
  topics: v.optional(v.array(v.picklist(topics)), []),
  digest: v.optional(v.boolean(), false),
  volume: v.pipe(v.number(), v.minValue(0), v.maxValue(10)),
  terms: v.pipe(v.optional(v.boolean(), false), v.check((terms) => terms, 'Accept the terms to continue.')),
});
