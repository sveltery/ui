<!-- Port of the New Project tab of shadcn's apps/v4/app/(app)/(create)/components/project-form.tsx at af983e8. -->
<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sveltery/ui/tabs';
  import { PACKAGE_MANAGERS, packageManager, type PackageManager } from '$lib/package-manager.svelte';
  import { initCommand } from './config';
  import { getDesigner } from './designer.svelte';
  import IconSvg from './IconSvg.svelte';
  import { PICKER_ICONS } from './options';

  let { cli }: { cli: string } = $props();

  const designer = getDesigner();
  const command = $derived(initCommand(packageManager.current, cli, designer.code));
  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => packageManager.restore());

  async function copy() {
    await navigator.clipboard.writeText(command);
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), 2000);
  }
</script>

<Dialog>
  <DialogTrigger>
    {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
    Get Code
  </DialogTrigger>
  <DialogContent class="dark top-[64px] no-scrollbar flex max-h-[calc(100svh-2rem)] translate-y-0 flex-col rounded-2xl p-0 shadow-xl **:data-[slot=dialog-close]:top-4.5 **:data-[slot=dialog-close]:right-4 sm:max-w-md">
    <div class="flex min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-2xl">
      <DialogHeader class="border-b px-6 py-5">
        <DialogTitle>New Project</DialogTitle>
        <DialogDescription>Run this command to create a project with your preset.</DialogDescription>
      </DialogHeader>
      <DialogFooter class="m-0 min-w-0 p-6">
        <div class="flex w-full min-w-0 flex-col gap-3">
          <Tabs value={packageManager.current} onValueChange={(value) => packageManager.set(value as PackageManager)} class="min-w-0 gap-0 overflow-hidden rounded-xl border-0 ring-1 ring-border">
            <div class="flex items-center gap-2 py-1 pr-1.5 pl-1">
              <TabsList class="bg-transparent font-mono">
                {#each PACKAGE_MANAGERS as manager (manager)}
                  <TabsTrigger value={manager} class="py-0 leading-none data-[state=active]:shadow-none">{manager}</TabsTrigger>
                {/each}
              </TabsList>
              <Button size="icon-sm" variant="ghost" class="ml-auto" onclick={copy}>
                <IconSvg icon={copied ? PICKER_ICONS.check : PICKER_ICONS.copy} />
                <span class="sr-only">Copy command</span>
              </Button>
            </div>
            {#each PACKAGE_MANAGERS as manager (manager)}
              <TabsContent value={manager}>
                <div class="relative overflow-hidden border-t bg-popover p-3">
                  <div class="no-scrollbar overflow-x-auto">
                    <code data-slot="init-command" class="font-mono text-sm whitespace-nowrap">{initCommand(manager, cli, designer.code)}</code>
                  </div>
                </div>
              </TabsContent>
            {/each}
          </Tabs>
          <Button onclick={copy} class="h-9 w-full">{copied ? 'Copied' : 'Copy Command'}</Button>
        </div>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>
