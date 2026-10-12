<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Textarea } from '@sveltery/ui/textarea';
</script>

<ExampleWrapper>
  <Example title="Basic">
    <Textarea placeholder="Type your message here." />
  </Example>
  <Example title="Invalid">
    <Textarea placeholder="Type your message here." aria-invalid="true" />
  </Example>
</ExampleWrapper>
