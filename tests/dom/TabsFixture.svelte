<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$ui/tabs/index.js';
  let { variant = 'default', orientation = 'horizontal', activateOnFocus = false }: { variant?: 'default' | 'line'; orientation?: 'horizontal' | 'vertical'; activateOnFocus?: boolean } = $props();
  let value = $state('account');
  export function read() { return value; }
  export function write(next: string) { value = next; }
</script>
<Tabs bind:value {orientation} class="extra">
  <TabsList {variant} {activateOnFocus}>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="locked" disabled>Locked</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account panel</TabsContent>
  <TabsContent value="password">Password panel</TabsContent>
  <TabsContent value="locked">Locked panel</TabsContent>
  <TabsContent value="notifications">Notifications panel</TabsContent>
</Tabs>
