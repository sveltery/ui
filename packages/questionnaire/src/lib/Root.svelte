<script lang="ts">
  import { Form } from '@sveltery/base/form';
  import { QuestionnaireModel, setRoot } from './root.svelte.js';
  import type { QuestionnaireRootProps } from './types.js';
  import { dataAttributes } from './utils.js';

  let {
    item = $bindable(),
    defaultItem,
    items,
    onItemChange,
    shortcuts,
    errors = $bindable(),
    novalidate = true,
    onkeydown,
    onreset,
    children,
    ...rest
  }: QuestionnaireRootProps = $props();

  const root = new QuestionnaireModel({
    get item() { return item; },
    get defaultItem() { return defaultItem; },
    get items() { return items; },
    get shortcuts() { return shortcuts; },
    get novalidate() { return novalidate; },
    select(next, report) {
      item = next;
      if (report) onItemChange?.(next);
    }
  });
  item ??= root.initialItem ?? undefined;
  setRoot(root);

  $effect(() => root.reconcile());
  $effect(() => root.followFocus());
  $effect(() => root.warn());
</script>

<Form
  bind:errors
  {novalidate}
  onFocusInvalid={root.focusInvalid}
  data-shortcuts={shortcuts}
  {...dataAttributes(root.state)}
  {...rest}
  onkeydown={(event) => {
    onkeydown?.(event);
    root.keydown(event);
  }}
  onreset={(event) => {
    onreset?.(event);
    if (!event.defaultPrevented) root.reset();
  }}
  {@attach root.attach}
>
  {@render children?.()}
</Form>
