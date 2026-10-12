<script lang="ts">
  import { Label } from '@sveltery/ui/label';
  import { Textarea } from '@sveltery/ui/textarea';
</script>

<!-- Native section/heading/div substitute for unimplemented Example/ExampleWrapper/Field. -->
<section data-label-gallery class="grid gap-6">
  <section>
    <h2>With Textarea</h2>
    <div>
      <Label for="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </div>
  </section>
</section>
