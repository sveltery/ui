<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Card, CardHeader, CardContent } from '@sveltery/ui/card';
</script>
<!-- Actual pinned native scaffold and selected bodies; Basic/Override remain supplemental. -->
<ExampleWrapper data-gallery>
  <Example title="Basic"><Skeleton class="h-4 w-40" /></Example>
  <Example title="Avatar"><div class="flex w-full items-center gap-4"><Skeleton class="size-10 shrink-0 rounded-full" /><div class="grid gap-2"><Skeleton class="h-4 w-[150px]" /><Skeleton class="h-4 w-[100px]" /></div></div></Example>
  <Example title="Card"><Card class="w-full"><CardHeader><Skeleton class="h-4 w-2/3" /><Skeleton class="h-4 w-1/2" /></CardHeader><CardContent><Skeleton class="aspect-square w-full" /></CardContent></Card></Example>
  <Example title="Text"><div class="flex w-full flex-col gap-2"><Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-3/4" /></div></Example>
  <Example title="Form"><div class="flex w-full flex-col gap-7"><div class="flex flex-col gap-3"><Skeleton class="h-4 w-20" /><Skeleton class="h-10 w-full" /></div><div class="flex flex-col gap-3"><Skeleton class="h-4 w-24" /><Skeleton class="h-10 w-full" /></div><Skeleton class="h-9 w-24" /></div></Example>
  <Example title="Table"><div class="flex w-full flex-col gap-2">{#each [0, 1, 2] as row (row)}<div class="flex gap-4"><Skeleton class="h-4 flex-1" /><Skeleton class="h-4 w-24" /><Skeleton class="h-4 w-20" /></div>{/each}</div></Example>
  <Example title="Override"><Skeleton class="h-8 w-32 rounded-none bg-red-500 animate-none" data-slot="custom-skeleton" /></Example>
</ExampleWrapper>
