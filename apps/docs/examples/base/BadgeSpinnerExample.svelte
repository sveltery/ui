<script lang="ts">
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Spinner } from '$registry/bases/base/ui/spinner';
</script>

<div class="flex flex-wrap gap-2">
  <Badge variant="destructive">
    <Spinner data-icon="inline-start" />
    Deleting
  </Badge>
  <Badge variant="secondary">
    Generating
    <Spinner data-icon="inline-end" />
  </Badge>
</div>
