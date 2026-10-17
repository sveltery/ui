<script lang="ts">
  import Action from './Action.svelte';
  import type { QuestionnaireNextProps } from './types.js';

  let props: QuestionnaireNextProps = $props();
</script>

<Action action="next" {...props} />
