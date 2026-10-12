<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Label } from '@sveltery/ui/label';
  import { Textarea } from '@sveltery/ui/textarea';
</script>

<ExampleWrapper>
  <Example title="With Textarea">
    <div>
      <Label for="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </div>
  </Example>
</ExampleWrapper>
