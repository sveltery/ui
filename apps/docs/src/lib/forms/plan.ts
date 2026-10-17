import * as v from 'valibot';

export const plans = ['starter', 'pro', 'enterprise'] as const;

export const planSchema = v.object({ plan: v.picklist(plans, 'Choose a plan.') });

/** The plan the demos treat as sold out, to show an issue from the server. */
export const soldOutPlan = 'enterprise';
