<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, errors, ...props }: HTMLAttributes<HTMLDivElement> & { errors?: Array<{ message?: string } | undefined> } = $props();
  const uniqueErrors = $derived([...new Map(errors?.map((error) => [error?.message, error])).values()]);
</script>
{#if children || uniqueErrors.length > 1 || uniqueErrors[0]?.message}
  <div role="alert" data-slot="field-error" {...props} class={cn('cn-field-error font-normal', classProp)}>
    {#if children}
      {@render children()}
    {:else if uniqueErrors.length === 1}
      {uniqueErrors[0]?.message}
    {:else}
      <ul class="ml-4 flex list-disc flex-col gap-1">
        {#each uniqueErrors as error, index (index)}
          {#if error?.message}<li>{error.message}</li>{/if}
        {/each}
      </ul>
    {/if}
  </div>
{/if}
