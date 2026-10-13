<script lang="ts">
  import * as Primitive from '@sveltery/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireProps } from './types.js';
  let { item = $bindable(), class: classProp, ...props }: QuestionnaireProps = $props();
</script>
<Primitive.Root data-slot="questionnaire" bind:item class={cn('cn-questionnaire flex w-full min-w-0 flex-col', classProp)} {...props} />
