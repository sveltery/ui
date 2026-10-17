<script lang="ts">
  import BadgeCheck from '@lucide/svelte/icons/badge-check';
  import BookmarkIcon from '@lucide/svelte/icons/bookmark';
  import { Badge } from '$registry/bases/base/ui/badge';
</script>

<div class="flex flex-wrap gap-2">
  <Badge variant="secondary">
    <BadgeCheck data-icon="inline-start" />
    Verified
  </Badge>
  <Badge variant="outline">
    Bookmark
    <BookmarkIcon data-icon="inline-end" />
  </Badge>
</div>
