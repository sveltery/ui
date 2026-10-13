<script lang="ts">
  import { Field, type FieldRootActions, type FieldRootState } from '@sveltery/base/field';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ItemModel, setItem } from './item.svelte.js';
  import { getRoot } from './root.svelte.js';
  import type { QuestionnaireItemProps } from './types.js';
  import { dataAttributes } from './utils.js';

  let {
    name,
    required = false,
    multiple = false,
    disabled = false,
    invalid = false,
    onStatusChange,
    'aria-describedby': describedBy,
    'aria-keyshortcuts': keyShortcuts,
    children,
    ...rest
  }: QuestionnaireItemProps = $props();

  let field = $state<FieldRootActions>();
  const root = getRoot();
  const item = new ItemModel(root, {
    get name() { return name; },
    get required() { return required; },
    get multiple() { return multiple; },
    get disabled() { return disabled; },
    get invalid() { return invalid; },
    get onStatusChange() { return onStatusChange; },
    validateField: () => field?.validate()
  });
  setItem(item);
  root.register(item);
  $effect(() => () => root.unregister(item));
  $effect.pre(() => item.syncMultiple());
  $effect(() => item.reportStatus());
  $effect(() => item.syncField());

  const active = $derived(item.active);
  const itemState = $derived({ active, disabled, invalid: item.invalid, multiple, required, status: item.status });
  const join = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ') || undefined;
</script>

<!-- The Field's control for Form: it carries the item's validity and submits nothing. -->
{#snippet control(props: HTMLAttributes<HTMLElement>)}
  <input {...props} type="hidden" name={null} />
{/snippet}

{#snippet fieldset(_: HTMLAttributes<HTMLElement>, fieldState: FieldRootState)}
  <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
  <fieldset
    aria-describedby={join(...item.descriptions, ...(item.invalid ? item.errors : []), describedBy)}
    aria-invalid={item.invalid || undefined}
    aria-keyshortcuts={join(
      keyShortcuts,
      active && 'Meta+Enter Control+Enter',
      active && item.answers.length > 0 && 'ArrowUp ArrowDown',
      active && !root.state.first && 'ArrowLeft',
      active && !root.state.last && item.status !== 'unanswered' && 'ArrowRight'
    )}
    {disabled}
    hidden={!active}
    inert={!active}
    tabindex="-1"
    {...dataAttributes(itemState)}
    {...rest}
    {@attach item.attach}
    {@attach () => {
      item.fieldInvalid = fieldState.valid === false;
    }}
  >
    <Field.Control render={control} />
    {@render children?.()}
  </fieldset>
{/snippet}

<Field.Root bind:this={field} {name} {disabled} validate={item.check} render={fieldset} />
