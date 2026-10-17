<script lang="ts">
  import IconGitBranch from '@tabler/icons-svelte-runes/icons/git-branch';
  import IconGitFork from '@tabler/icons-svelte-runes/icons/git-fork';
  import { Button } from '$registry/bases/base/ui/button';
</script>

<div class="flex gap-2">
  <Button variant="outline">
    <IconGitBranch data-icon="inline-start" /> New Branch
  </Button>
  <Button variant="outline">
    Fork
    <IconGitFork data-icon="inline-end" />
  </Button>
</div>
