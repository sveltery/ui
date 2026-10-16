<script lang="ts">
  import Action from './Action.svelte';
  import type { QuestionnaireSubmitProps } from './types.js';

  let props: QuestionnaireSubmitProps = $props();
</script>

<Action action="submit" {...props} />
