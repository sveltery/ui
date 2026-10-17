import type { ComponentProps } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { Button as BaseButton } from '@sveltery/base/button';
import { Button } from '$registry/bases/base/ui/button';
import { NativeCheckbox } from '$registry/bases/base/ui/native-checkbox';
import { NativeRadio } from '$registry/bases/base/ui/native-radio-group';
import { NativeSlider } from '$registry/bases/base/ui/native-slider';
import { NativeSwitch } from '$registry/bases/base/ui/native-switch';
import { Textarea } from '$registry/bases/base/ui/textarea';
import { controlsForm } from './native-controls/controls.remote';
import { planForm } from './native-radio/plan.remote';
import { probe } from './form.remote';
import type { Input } from './schema';
const current = probe.for('type-contract');
const textAttrs = current.fields.text.as('text', 'Draft');
const submitAttrs = current.fields.action.as('submit', 'native');
const nativeText: HTMLTextareaAttributes = textAttrs;
const uiText: ComponentProps<typeof Textarea> = textAttrs;
const baseSubmit: ComponentProps<typeof BaseButton> = submitAttrs;
const uiSubmit: ComponentProps<typeof Button> = submitAttrs;
// A native control types `type` as its one literal, so only its own `.as()` spread fits.
const radio: ComponentProps<typeof NativeRadio> = planForm.fields.plan.as('radio', 'pro');
// @ts-expect-error a checkbox spread cannot go on a NativeRadio
const checkbox: ComponentProps<typeof NativeRadio> = planForm.fields.agree.as('checkbox');
// @ts-expect-error a NativeRadio cannot become another input type
const text: ComponentProps<typeof NativeRadio> = { type: 'text' };
const box: ComponentProps<typeof NativeCheckbox> = controlsForm.fields.agree.as('checkbox');
const boxOption: ComponentProps<typeof NativeCheckbox> = controlsForm.fields.topics.as('checkbox', 'news');
const toggle: ComponentProps<typeof NativeSwitch> = controlsForm.fields.notify.as('checkbox');
const range: ComponentProps<typeof NativeSlider> = controlsForm.fields.volume.as('range');
// @ts-expect-error a radio spread cannot go on a NativeCheckbox
const boxRadio: ComponentProps<typeof NativeCheckbox> = planForm.fields.plan.as('radio', 'pro');
// @ts-expect-error a NativeSwitch cannot become another input type
const toggleText: ComponentProps<typeof NativeSwitch> = { type: 'text' };
// @ts-expect-error a number spread cannot go on a NativeSlider
const rangeNumber: ComponentProps<typeof NativeSlider> = controlsForm.fields.volume.as('number');
const result: Input | undefined = current.result?.parsed;
// @ts-expect-error submit fields require an explicit value in Kit 3.0.1
current.fields.action.as('submit');
// @ts-expect-error a text field cannot use a numeric field type
current.fields.text.as('number');
// @ts-expect-error schema inference must reject unknown fields
current.fields.unknownField.as('text');
// @ts-expect-error schema inference must reject non-string values
current.fields.text.set(42);
void [nativeText, uiText, baseSubmit, uiSubmit, radio, checkbox, text, box, boxOption, toggle, range, boxRadio, toggleText, rangeNumber, result];
