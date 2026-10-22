<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Form as Primitive, type FormErrorProps } from '@sveltery/base/form';
  import { cn } from 'cn';
  let { children: content, class: classProp, ...props }: FormErrorProps = $props();
</script>
<Primitive.Error role="alert" data-slot="form-error" {...props} class={cn('cn-field-error font-normal', classProp)}>
  {#snippet children(messages: string[])}
    {#if content}
      {@render (content as Snippet<[string[]]>)(messages)}
    {:else if messages.length > 1}
      <ul class="ml-4 flex list-disc flex-col gap-1">
        {#each messages as message, index (index)}
          <li>{message}</li>
        {/each}
      </ul>
    {:else}
      {messages[0]}
    {/if}
  {/snippet}
</Primitive.Error>
