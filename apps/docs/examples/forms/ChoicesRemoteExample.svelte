<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
  import { toggleVariants } from '$registry/bases/base/ui/toggle';
  import { cn } from 'cn';
  import { choicesSchema, fruits, textStyles, views } from '$lib/forms/choices';
  import { saveChoices } from '$lib/forms/choices.remote';

  const f = saveChoices.preflight(choicesSchema);
  // A label styled as a Toggle, around a visually hidden checkbox or radio: `has-checked:` reads its state.
  const toggle = cn(toggleVariants({ variant: 'outline' }), 'cursor-pointer capitalize select-none has-checked:bg-muted has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50');
</script>

<form {...f} class="w-full max-w-sm">
  <FieldGroup>
    <Field data-invalid={!!f.fields.fruits.issues()}>
      <FieldLabel for="remote-fruits">Fruits</FieldLabel>
      <NativeSelect id="remote-fruits" {...f.fields.fruits.as('select multiple')} class="w-full">
        {#each fruits as fruit (fruit)}
          <NativeSelectOption value={fruit} class="capitalize">{fruit}</NativeSelectOption>
        {/each}
      </NativeSelect>
      <FieldDescription>Hold Ctrl or Cmd to pick more than one. Pineapple shows an issue from the server.</FieldDescription>
      <FieldError errors={f.fields.fruits.issues()} />
    </Field>
    <FieldSet>
      <FieldLegend variant="label">Text style</FieldLegend>
      <div class="flex gap-1">
        {#each textStyles as style (style)}
          <label class={toggle}><input class="sr-only" {...f.fields.styles.as('checkbox', style)} />{style}</label>
        {/each}
      </div>
    </FieldSet>
    <FieldSet data-invalid={!!f.fields.view.issues()}>
      <FieldLegend variant="label">Calls</FieldLegend>
      <div role="radiogroup" aria-label="Calls" class="flex gap-2">
        {#each views as view (view)}
          <label class={toggle}><input class="sr-only" {...f.fields.view.as('radio', view)} />{view}</label>
        {/each}
      </div>
      <FieldError errors={f.fields.view.issues()} />
    </FieldSet>
    <Button type="submit" class="w-fit" disabled={f.pending > 0}>Save</Button>
    {#if f.result}
      <p class="text-sm">Saved {f.result.fruits.join(', ')}.</p>
    {/if}
  </FieldGroup>
</form>
