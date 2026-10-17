<script lang="ts">
  import GitBranchIcon from '@lucide/svelte/icons/git-branch';
  import GitForkIcon from '@lucide/svelte/icons/git-fork';
  import { Button } from '$registry/bases/base/ui/button';
</script>

<div class="flex gap-2">
  <Button variant="outline">
    <GitBranchIcon data-icon="inline-start" /> New Branch
  </Button>
  <Button variant="outline">
    Fork
    <GitForkIcon data-icon="inline-end" />
  </Button>
</div>
