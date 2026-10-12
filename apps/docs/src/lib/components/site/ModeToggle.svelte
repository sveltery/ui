<script lang="ts">
  import { mode } from '$lib/theme.svelte';
</script>

<button
  type="button"
  class="extend-touch-target inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
  aria-label="Toggle theme"
  onclick={() => mode.toggle()}
>
  <svg viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 3l0 18" />
    <path d="M12 9l4.65 -4.65" />
    <path d="M12 14.3l7.37 -7.37" />
    <path d="M12 19.6l8.85 -8.85" />
  </svg>
</button>
