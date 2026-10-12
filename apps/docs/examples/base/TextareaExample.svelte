<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Textarea } from '@sveltery/ui/textarea';
</script>

{#snippet TextareaBasic()}
  <Example title="Basic"><Textarea placeholder="Type your message here." /></Example>
{/snippet}
{#snippet TextareaInvalid()}
  <Example title="Invalid"><Textarea placeholder="Type your message here." aria-invalid="true" /></Example>
{/snippet}
<ExampleWrapper>{@render TextareaBasic()}{@render TextareaInvalid()}</ExampleWrapper>
