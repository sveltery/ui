<script lang="ts">
  import { DEV } from 'esm-env';
  import { QuestionnaireModel, setRoot } from './root.svelte.js';
  import type { QuestionnaireRootProps } from './types.js';
  import { dataAttributes } from './utils.js';

  let {
    item = $bindable(),
    defaultItem,
    items,
    onItemChange,
    shortcuts,
    novalidate = true,
    onkeydown,
    onreset,
    onsubmit,
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
  if (DEV) $effect(() => root.warn());
</script>

<form
  {novalidate}
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
  onsubmit={(event) => {
    if (root.submit()) onsubmit?.(event);
    else event.preventDefault();
  }}
  {@attach root.attach}
>
  {@render children?.()}
</form>
