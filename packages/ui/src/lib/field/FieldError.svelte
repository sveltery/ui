<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  let { children, class: classProp, errors, match, ...props }: ComponentProps<typeof Primitive.Error> & { errors?: Array<{ message?: string } | undefined> } = $props();
  const messages = $derived([...new Set(errors?.map((error) => error?.message).filter((message) => !!message))]);
  // shadcn's children and `errors` show what they are given. A bare FieldError shows the field's own error.
  const explicit = $derived(match === undefined && (children !== undefined || errors !== undefined));
  const className = $derived(cn('cn-field-error font-normal [&>ul]:ml-4 [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-1', classProp));
</script>
{#snippet list()}
  {#if messages.length === 1}
    {messages[0]}
  {:else}
    <ul class="ml-4 flex list-disc flex-col gap-1">
      {#each messages as message (message)}<li>{message}</li>{/each}
    </ul>
  {/if}
{/snippet}
{#if !explicit}
  <Primitive.Error role="alert" data-slot="field-error" {match} {children} {...props} class={className} />
{:else if children || messages.length}
  <Primitive.Error role="alert" data-slot="field-error" match children={children ?? list} {...props} class={className} />
{/if}
