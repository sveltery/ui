<script lang="ts">
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
</script>

<Tabs value="account" orientation="vertical">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
</Tabs>
