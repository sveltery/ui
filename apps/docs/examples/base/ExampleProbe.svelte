<script lang="ts">
  import { onMount } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  let hydrated = $state(false);
  let visible = $state(true);
  let title = $state('Example & <draft>');
  let contentClass = $state('gap-2 p-4');
  let containerClass = $state('max-w-md');
  let wrapperRef = $state<HTMLDivElement | null | undefined>();
  let exampleRef = $state<HTMLDivElement | null>(null);
  let attached = 0;
  let cleaned = 0;
  let clicks = 0;
  let snapshotText = $state('');
  let replaceAttachment = $state(false);
  const originalAttachment = { [createAttachmentKey()]: () => { attached++; return () => { cleaned++; }; } };
  const replacementAttachment = { [createAttachmentKey()]: () => { attached++; return () => { cleaned++; }; } };
  const attachment = $derived(replaceAttachment ? replacementAttachment : originalAttachment);
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  {#if visible}
    <ExampleWrapper id="probe-wrapper" data-probe="wrapper" data-slot="custom-wrapper" bind:ref={wrapperRef} {...attachment}>
      <Example id="probe-example" data-slot="custom-example" title={title} class={contentClass} containerClassName={containerClass} style="color: rgb(1, 2, 3)" bind:ref={exampleRef} {...attachment} onclick={() => { clicks++; }}>
        <div data-testid="unclassed-child">Plain child</div><div class="w-24" data-testid="sized-child">Sized child</div><span>Inline child</span>
      </Example>
      <Example id="empty-title" title=""><div>Empty title</div></Example>
      <Example id="absent-title"><div>Absent title</div></Example>
    </ExampleWrapper>
  {/if}
  <button onclick={() => { title = ''; contentClass = 'gap-4 p-8'; containerClass = 'max-w-none'; }}>Update example</button>
  <button onclick={() => { replaceAttachment = !replaceAttachment; }}>Replace attachments</button>
  <button onclick={() => { visible = !visible; }}>Toggle example</button>
  <button onclick={() => { snapshotText = JSON.stringify({ wrapper: wrapperRef?.id ?? null, example: exampleRef?.id ?? null, attached, cleaned, clicks }); }}>Inspect example</button>
  <output data-testid="example-state">{snapshotText}</output>
</main>
