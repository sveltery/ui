import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';

const plans = ['free', 'pro', 'team'];
type Plan = { plan: string; agree?: boolean };
// A dependency-free Standard Schema: `plan` must be one of the plans. `agree` exists for the type contract.
const schema = {
  '~standard': {
    version: 1 as const,
    vendor: 'fixture',
    types: undefined as unknown as { input: Plan; output: Plan },
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
