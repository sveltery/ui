import * as v from 'valibot';

export const fruits = ['apple', 'banana', 'blueberry', 'grapes', 'pineapple'] as const;
export const textStyles = ['bold', 'italic', 'underline'] as const;
export const views = ['all', 'missed'] as const;

export const choicesSchema = v.object({
  fruits: v.pipe(v.optional(v.array(v.picklist(fruits)), []), v.minLength(1, 'Pick at least one fruit.')),
  styles: v.optional(v.array(v.picklist(textStyles)), []),
  view: v.picklist(views, 'Choose a view.'),
});
