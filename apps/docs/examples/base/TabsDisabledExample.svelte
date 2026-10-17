<script lang="ts">
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
</script>

<Tabs value="home">
  <TabsList>
    <TabsTrigger value="home">Home</TabsTrigger>
    <TabsTrigger value="settings" disabled>Disabled</TabsTrigger>
  </TabsList>
</Tabs>
