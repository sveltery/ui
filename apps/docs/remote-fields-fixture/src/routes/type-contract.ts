import type { ComponentProps } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { Button as BaseButton } from '@sveltery/base/button';
import { Button } from '@sveltery/ui/button';
import { Textarea } from '@sveltery/ui/textarea';
import { probe } from './form.remote';
import type { Input } from './schema';
const current = probe.for('type-contract');
const textAttrs = current.fields.text.as('text', 'Draft');
const submitAttrs = current.fields.action.as('submit', 'native');
const nativeText: HTMLTextareaAttributes = textAttrs;
const uiText: ComponentProps<typeof Textarea> = textAttrs;
const baseSubmit: ComponentProps<typeof BaseButton> = submitAttrs;
const uiSubmit: ComponentProps<typeof Button> = submitAttrs;
const result: Input | undefined = current.result?.parsed;
// @ts-expect-error submit fields require an explicit value in Kit 2.70.3
current.fields.action.as('submit');
// @ts-expect-error a text field cannot use a numeric field type
current.fields.text.as('number');
// @ts-expect-error schema inference must reject unknown fields
current.fields.unknownField.as('text');
// @ts-expect-error schema inference must reject non-string values
current.fields.text.set(42);
void [nativeText, uiText, baseSubmit, uiSubmit, result];
