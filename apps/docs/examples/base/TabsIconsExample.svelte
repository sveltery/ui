<script lang="ts">
  import AppWindowIcon from '@lucide/svelte/icons/app-window';
  import CodeIcon from '@lucide/svelte/icons/code';
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
</script>

<Tabs value="preview">
  <TabsList>
    <TabsTrigger value="preview">
      <AppWindowIcon />
      Preview
    </TabsTrigger>
    <TabsTrigger value="code">
      <CodeIcon />
      Code
    </TabsTrigger>
  </TabsList>
</Tabs>
