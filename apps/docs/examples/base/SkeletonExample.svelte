<script lang="ts">
  import { Skeleton } from '@sveltery/ui/skeleton';
</script>
<!-- Pinned native example bodies; Example layout is substituted and Card remains deferred. -->
<section data-gallery class="grid gap-6">
  <section><h2>Basic</h2><Skeleton class="h-4 w-40" /></section>
  <section><h2>Avatar</h2><div class="flex w-full items-center gap-4"><Skeleton class="size-10 shrink-0 rounded-full" /><div class="grid gap-2"><Skeleton class="h-4 w-[150px]" /><Skeleton class="h-4 w-[100px]" /></div></div></section>
  <section><h2>Text</h2><div class="flex w-full flex-col gap-2"><Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-3/4" /></div></section>
  <section><h2>Form</h2><div class="flex w-full flex-col gap-7"><div class="flex flex-col gap-3"><Skeleton class="h-4 w-20" /><Skeleton class="h-10 w-full" /></div><div class="flex flex-col gap-3"><Skeleton class="h-4 w-24" /><Skeleton class="h-10 w-full" /></div><Skeleton class="h-9 w-24" /></div></section>
  <section><h2>Table</h2><div class="flex w-full flex-col gap-2">{#each [0, 1, 2] as row (row)}<div class="flex gap-4"><Skeleton class="h-4 flex-1" /><Skeleton class="h-4 w-24" /><Skeleton class="h-4 w-20" /></div>{/each}</div></section>
  <section><h2>Override</h2><Skeleton class="h-8 w-32 rounded-none bg-red-500 animate-none" data-slot="custom-skeleton" /></section>
</section>
