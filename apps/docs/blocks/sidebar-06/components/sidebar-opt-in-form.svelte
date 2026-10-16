<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { SidebarInput } from '@sveltery/components/sidebar';
</script>

<Card class="gap-2 py-4 shadow-none">
  <CardHeader class="px-4">
    <CardTitle class="text-sm">Subscribe to our newsletter</CardTitle>
    <CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
  </CardHeader>
  <CardContent class="px-4">
    <form>
      <div class="grid gap-2.5">
        <SidebarInput type="email" placeholder="Email" />
        <Button class="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none">Subscribe</Button>
      </div>
    </form>
  </CardContent>
</Card>
