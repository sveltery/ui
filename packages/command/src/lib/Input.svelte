<script lang="ts">
  import { getCommand } from './root-state.svelte.js';
  import type { CommandInputProps } from './types.js';

  let { value = $bindable(''), ...rest }: CommandInputProps = $props();

  const root = getCommand();
  const unlink = root.linkSearch({
    get value() {
      return value;
    }
  });
  $effect(() => unlink);
</script>

<input
  {...rest}
  cmdk-input=""
  autocomplete="off"
  autocorrect="off"
  spellcheck={false}
  aria-autocomplete="list"
  role="combobox"
  aria-expanded="true"
  aria-controls={root.ids.list}
  aria-labelledby={root.ids.label}
  aria-activedescendant={root.selectedItem?.id}
  id={root.ids.input}
  type="text"
  bind:value
/>
