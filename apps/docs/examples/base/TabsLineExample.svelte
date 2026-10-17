<script lang="ts">
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
</script>

<Tabs value="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
</Tabs>
