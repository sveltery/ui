<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
</script>

{#snippet SonnerBasic()}
  <Example title="Basic" class="items-center justify-center">
    <Button onclick={() => toast('Event has been created')} variant="outline" class="w-fit">Show Toast</Button>
  </Example>
{/snippet}

{#snippet SonnerWithDescription()}
  <Example title="With Description" class="items-center justify-center">
    <Button onclick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })} variant="outline" class="w-fit">
      Show Toast
    </Button>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SonnerBasic()}
  {@render SonnerWithDescription()}
</ExampleWrapper>
