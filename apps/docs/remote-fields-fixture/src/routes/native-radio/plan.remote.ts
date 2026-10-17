import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';

const plans = ['free', 'pro', 'team'];
// A dependency-free Standard Schema: `plan` must be one of the plans.
const schema = {
  '~standard': {
    version: 1 as const,
    vendor: 'fixture',
    validate(value: unknown) {
      const plan = (value as { plan?: unknown } | null)?.plan;
      return typeof plan === 'string' && plans.includes(plan) ? { value: { plan } } : { issues: [{ message: 'Choose a plan', path: ['plan'] }] };
    },
  },
};

export const planForm = form(schema, (data, issue) => {
  if (data.plan === 'free') invalid(issue.plan('The free plan is full'));
  return { received: data };
});
