<script lang="ts">
  // Actual dependency primitives + unchanged source utility inputs. This is a
  // CSS environment diagnostic, not a published styled Separator wrapper.
  import { Separator } from '@sveltery/base/separator';
  import { onMount } from 'svelte';
  import { stateClasses, stateWitnesses } from '../../../../tests/reference/css-state-witnesses';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  const separatorClasses = 'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch';
</script>
<main data-css-environment data-hydrated={hydrated}>
  <h1>Genuine shadcn support CSS environment</h1>
  <div style="display: flex; flex-direction: column; width: 240px; height: 60px">
    <Separator class={separatorClasses} data-testid="css-horizontal" />
  </div>
  <div style="display: flex; flex-direction: row; width: 240px; height: 60px">
    <Separator orientation="vertical" class={separatorClasses} data-testid="css-vertical" />
  </div>
  {#each stateWitnesses as witness (witness.id)}
    <span class={stateClasses} data-testid={witness.id} {...witness.attrs}></span>
  {/each}
</main>
