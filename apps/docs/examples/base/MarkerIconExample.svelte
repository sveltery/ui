<script lang="ts">
  import BookOpenCheck from '@lucide/svelte/icons/book-open-check';
  import GitBranchIcon from '@lucide/svelte/icons/git-branch';
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Marker, MarkerContent, MarkerIcon } from '$registry/bases/base/ui/marker';
</script>

<div class="flex w-full max-w-sm flex-col gap-12 py-12">
  <Marker>
    <MarkerIcon>
      <GitBranchIcon />
    </MarkerIcon>
    <MarkerContent>Switched to a new branch</MarkerContent>
  </Marker>
  <Marker variant="separator">
    <MarkerIcon>
      <SearchIcon />
    </MarkerIcon>
    <MarkerContent>Explored 4 files</MarkerContent>
  </Marker>
  <Marker class="flex-col">
    <MarkerIcon>
      <BookOpenCheck />
    </MarkerIcon>
    <MarkerContent>Syncing completed</MarkerContent>
  </Marker>
</div>
