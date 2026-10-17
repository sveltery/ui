import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { planSchema, soldOutPlan } from './plan';

export const choosePlan = form(planSchema, async (data, issue) => {
  if (data.plan === soldOutPlan) invalid(issue.plan('Enterprise is sold out this month.'));
  return { plan: data.plan };
});
