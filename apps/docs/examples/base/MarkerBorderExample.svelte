<script lang="ts">
  import FileTextIcon from '@lucide/svelte/icons/file-text';
  import GitBranchIcon from '@lucide/svelte/icons/git-branch';
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Marker, MarkerContent, MarkerIcon } from '$registry/bases/base/ui/marker';
</script>

<div class="flex w-full max-w-sm flex-col gap-3 py-12">
  <Marker variant="border">
    <MarkerIcon>
      <GitBranchIcon />
    </MarkerIcon>
    <MarkerContent>Switched to release-candidate</MarkerContent>
  </Marker>
  <Marker variant="border">
    <MarkerIcon>
      <SearchIcon />
    </MarkerIcon>
    <MarkerContent>Reviewed 8 related files</MarkerContent>
  </Marker>
  <Marker variant="border">
    <MarkerIcon>
      <FileTextIcon />
    </MarkerIcon>
    <MarkerContent>Opened implementation notes</MarkerContent>
  </Marker>
</div>
