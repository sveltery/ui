<script lang="ts">
  import { Textarea } from '@sveltery/ui/textarea';
</script>
<!-- Five pinned example states; native layout/labels substitute for out-of-scope Example/Field wrappers. -->
<section data-gallery class="grid gap-6">
  <section><h2>Basic</h2><Textarea data-testid="basic" placeholder="Type your message here." /></section>
  <section><h2>Invalid</h2><Textarea data-testid="invalid" placeholder="Type your message here." aria-invalid="true" /></section>
  <section><h2>With Label</h2><label for="textarea-demo-message">Message</label><Textarea data-testid="labelled" id="textarea-demo-message" placeholder="Type your message here." rows={6} /></section>
  <section><h2>With Description</h2><label for="textarea-demo-message-2">Message</label><Textarea data-testid="described" id="textarea-demo-message-2" placeholder="Type your message here." rows={6} /><p>Type your message and press enter to send.</p></section>
  <section><h2>Disabled</h2><label for="textarea-demo-disabled">Message</label><Textarea data-testid="disabled" id="textarea-demo-disabled" placeholder="Type your message here." disabled /></section>
  <Textarea data-testid="override" aria-label="Override" class="min-h-32 w-64 rounded-none px-6" style="resize: none;" />
</section>
