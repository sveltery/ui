<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '../../apps/docs/registry/bases/base/ui/button/index.js';
  import { Button as BaseButton } from '@sveltery/base/button';
</script>
{#snippet replacement(props: Record<string | symbol, unknown>, _state: { disabled: boolean }, children?: Snippet)}
  <span {...props}>{#if children}{@render children()}{:else}Fallback label{/if}</span>
{/snippet}
<BaseButton data-testid="base-empty" nativeButton={false} render={replacement} />
<Button data-testid="styled-empty" nativeButton={false} render={replacement} />
<Button data-testid="styled-present" nativeButton={false} render={replacement}>Explicit label</Button>
