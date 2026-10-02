<script lang="ts">
  // Supplemental style/theme harness using actual implemented wrappers, not a ported upstream gallery.
  import { onMount } from 'svelte';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@sveltery/ui/card';
  import { Textarea } from '@sveltery/ui/textarea';
  import { Label } from '@sveltery/ui/label';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@sveltery/ui/table';
  import { Alert, AlertTitle, AlertDescription, AlertAction } from '@sveltery/ui/alert';
  import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@sveltery/ui/empty';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@sveltery/ui/dialog';
  const styles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
  const bases = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'];
  const accents = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow'];
  let hydrated = $state(false);
  let style = $state('nova');
  let base = $state('neutral');
  let accent = $state('base');
  let dark = $state(false);
  onMount(() => { hydrated = true; });
  $effect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const classes = [`style-${style}`, `theme-${base}`, ...(accent === 'base' ? [] : [`theme-${accent}`]), ...(dark ? ['dark'] : [])];
    const previous = root.className;
    root.classList.add(...classes);
    return () => { root.className = previous; };
  });
</script>
<main class="p-8" data-hydrated={hydrated}>
  <div class="mb-6 flex flex-wrap gap-4">
    <label>Style <select bind:value={style}>{#each styles as item (item)}<option value={item}>{item}</option>{/each}</select></label>
    <label>Base color <select bind:value={base}>{#each bases as item (item)}<option value={item}>{item}</option>{/each}</select></label>
    <label>Accent <select bind:value={accent}><option value="base">Base</option>{#each accents as item (item)}<option value={item}>{item}</option>{/each}</select></label>
    <button type="button" aria-pressed={dark} onclick={() => { dark = !dark; }}>Dark mode</button>
  </div>
  <div data-theme-gallery class="grid gap-6">
    <div class="flex flex-wrap gap-2">
      <Button>Default</Button><Button variant="outline">Outline</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Destructive</Button><Button variant="link">Link</Button>
    </div>
    <Card><CardHeader><CardTitle>Theme card</CardTitle><CardDescription>Card description</CardDescription><CardAction>Action</CardAction></CardHeader><CardContent>Card content</CardContent><CardFooter>Card footer</CardFooter></Card>
    <div class="grid gap-2"><Label for="theme-notes">Notes</Label><Textarea id="theme-notes" placeholder="Write a note" aria-invalid="true" /><Textarea disabled placeholder="Disabled note" /></div>
    <Skeleton class="h-4 w-32" />
    <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
    <Table><TableCaption>Theme ledger</TableCaption><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader><TableBody><TableRow data-state="selected"><TableCell>Example</TableCell><TableCell>$10</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell>Total</TableCell><TableCell>$10</TableCell></TableRow></TableFooter></Table>
    <Alert variant="destructive"><AlertTitle>Theme alert</AlertTitle><AlertDescription>Alert description</AlertDescription><AlertAction>Action</AlertAction></Alert>
    <Empty><EmptyHeader><EmptyMedia variant="icon"><span>?</span></EmptyMedia><EmptyTitle>Nothing here</EmptyTitle><EmptyDescription>Empty description</EmptyDescription></EmptyHeader><EmptyContent>Empty content</EmptyContent></Empty>
    <AspectRatio ratio={16 / 9} class="bg-muted">Ratio</AspectRatio>
    <Dialog><DialogTrigger>Open theme dialog</DialogTrigger><DialogContent showCloseButton={false}><DialogHeader><DialogTitle>Theme dialog</DialogTitle><DialogDescription>Dialog description</DialogDescription></DialogHeader><DialogFooter><DialogClose>Done</DialogClose></DialogFooter></DialogContent></Dialog>
  </div>
</main>
