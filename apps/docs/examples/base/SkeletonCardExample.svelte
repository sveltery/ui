<script lang="ts">
  import { Card, CardContent, CardHeader } from '$registry/bases/base/ui/card';
  import { Skeleton } from '$registry/bases/base/ui/skeleton';
</script>

<Card class="w-full max-w-xs">
  <CardHeader>
    <Skeleton class="h-4 w-2/3" />
    <Skeleton class="h-4 w-1/2" />
  </CardHeader>
  <CardContent>
    <Skeleton class="aspect-video w-full" />
  </CardContent>
</Card>
