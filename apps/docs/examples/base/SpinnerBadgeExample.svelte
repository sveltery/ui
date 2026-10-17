<script lang="ts">
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Spinner } from '$registry/bases/base/ui/spinner';
</script>

<div class="flex items-center gap-4 [--radius:1.2rem]">
  <Badge>
    <Spinner data-icon="inline-start" />
    Syncing
  </Badge>
  <Badge variant="secondary">
    <Spinner data-icon="inline-start" />
    Updating
  </Badge>
  <Badge variant="outline">
    <Spinner data-icon="inline-start" />
    Processing
  </Badge>
</div>
