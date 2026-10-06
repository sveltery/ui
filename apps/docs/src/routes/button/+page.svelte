<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, variants, sizes } from '@sveltery/ui/button';
  import ButtonExample from '../../../examples/base/ButtonProbe.svelte';
  import Fixture from '../../../../../tests/dom/ButtonFixture.svelte';
  let { data }: { data: { scenario: string } } = $props();
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<svelte:head><title>Sveltery Button example</title></svelte:head>
{#if data.scenario}
  <Fixture scenario={data.scenario} />
{:else}
  <main class="p-8" data-hydrated={hydrated}>
    <h1 class="mb-4 text-2xl font-medium">Button</h1>
    <p class="mb-4">Experimental Nova Button built on Sveltery Base.</p>
    <ButtonExample />
    <section data-gallery class="mt-6 flex flex-wrap gap-3" aria-label="Variants and sizes">
      {#each variants as variant (variant)}
        {#each sizes as size (size)}
          <Button data-testid={`${variant}-${size}`} {variant} {size} aria-label={`${variant} ${size}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M12 4v16" /></svg>{#if !size.startsWith('icon')}Action{/if}
          </Button>
        {/each}
      {/each}
      <Button data-testid="disabled-style" disabled>Disabled</Button>
      <Button data-testid="invalid-style" aria-invalid>Invalid</Button>
      <Button data-testid="expanded-style" variant="outline" aria-expanded>Expanded</Button>
      <Button data-testid="override-style" class="h-12 rounded-none px-6">Override</Button>
      <Button data-testid="icon-start-style"><svg data-icon="inline-start" aria-hidden="true" viewBox="0 0 24 24" />Start</Button>
    </section>
  </main>
{/if}
