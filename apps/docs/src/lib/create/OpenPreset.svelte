<!-- Port of shadcn's apps/v4/app/(app)/(create)/components/open-preset.tsx at af983e8. -->
<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@sveltery/ui/drawer';
  import { Field, FieldContent, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { parsePresetInput } from './config';
  import { getDesigner } from './designer.svelte';

  let { open = $bindable(false), mobile, class: className }: { open?: boolean; mobile: boolean; class?: string } = $props();

  const EXAMPLE = 'b2D0wqNxT';
  const designer = getDesigner();
  let input = $state('');
  const preset = $derived(parsePresetInput(input));
  const invalid = $derived(input.trim().length > 0 && preset === null);
  const triggerClass = $derived(`touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10! ${className ?? ''}`);

  // A closed dialog forgets what was typed, as upstream.
  const clear = (next: boolean) => next || (input = '');

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!preset) return;
    designer.open(preset);
    open = false;
    input = '';
  }
</script>

{#snippet fields()}
  <Field data-invalid={invalid || undefined}>
    <FieldLabel for="preset-code" class="sr-only">Preset code</FieldLabel>
    <FieldContent>
      <Input
        id="preset-code"
        bind:value={input}
        placeholder={`${EXAMPLE} or --preset ${EXAMPLE}`}
        autocapitalize="none"
        autocorrect="off"
        spellcheck={false}
        aria-invalid={invalid}
        class="h-10 md:h-8"
      />
    </FieldContent>
  </Field>
{/snippet}

{#if mobile}
  <Drawer bind:open onOpenChange={clear}>
    <DrawerTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" {...props} class={triggerClass}>{@render content?.()}</Button>{/snippet}
      Open
    </DrawerTrigger>
    <DrawerContent class="dark rounded-t-2xl!">
      <DrawerHeader>
        <DrawerTitle class="text-xl">Open Preset</DrawerTitle>
        <DrawerDescription>Paste a preset code to load a saved configuration.</DrawerDescription>
      </DrawerHeader>
      <form onsubmit={submit}>
        <div class="px-4 py-2">{@render fields()}</div>
        <DrawerFooter>
          <Button type="submit" class="h-10" disabled={!preset}>Open</Button>
          <DrawerClose>
            {#snippet render(props, _state, content)}<Button variant="outline" type="button" class="h-10" {...props}>{@render content?.()}</Button>{/snippet}
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  </Drawer>
{:else}
  <Dialog bind:open onOpenChange={clear}>
    <DialogTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" {...props} class={triggerClass}>{@render content?.()}</Button>{/snippet}
      Open Preset
    </DialogTrigger>
    <DialogContent class="dark">
      <form onsubmit={submit}>
        <DialogHeader>
          <DialogTitle>Open Preset</DialogTitle>
          <DialogDescription>Paste a preset code to load a saved configuration.</DialogDescription>
        </DialogHeader>
        <div class="py-4">{@render fields()}</div>
        <DialogFooter>
          <DialogClose>
            {#snippet render(props, _state, content)}<Button variant="outline" type="button" {...props}>{@render content?.()}</Button>{/snippet}
            Cancel
          </DialogClose>
          <Button type="submit" disabled={!preset}>Open</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
{/if}
