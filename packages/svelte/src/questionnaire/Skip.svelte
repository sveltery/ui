<script lang="ts">
  import Action from './Action.svelte';
  import type { QuestionnaireSkipProps } from './types.js';

  let props: QuestionnaireSkipProps = $props();
</script>

<Action action="skip" {...props} />
