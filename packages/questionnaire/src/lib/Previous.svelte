<script lang="ts">
  import Action from './Action.svelte';
  import type { QuestionnairePreviousProps } from './types.js';

  let props: QuestionnairePreviousProps = $props();
</script>

<Action action="previous" {...props} />
