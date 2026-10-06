<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  let saved = $state(false);
</script>
<form class="mb-6 flex gap-3" onsubmit={event => { event.preventDefault(); saved = true; }}>
  <Button type="submit">Save preferences</Button>
  <Button variant="outline" disabled>Unavailable</Button>
</form>
<p aria-live="polite">{saved ? 'Preferences saved locally' : 'Ready'}</p>
