<script lang="ts">
  // Two genuine immutable shadcn d75a96ab bodies; MIT: packages/ui/THIRD_PARTY_NOTICES.md.
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@sveltery/ui/card';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>
<!-- Only the two original image bodies; the existing seven-body gallery stays unchanged. -->
{#snippet buttonText()}Button{/snippet}
{#snippet CardWithImage()}<Example title="With Image"><Card size="default" class="relative mx-auto w-full max-w-sm pt-0"><div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" /><img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        /><CardHeader><CardTitle>Beautiful Landscape</CardTitle><CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription></CardHeader><CardFooter><Button class="w-full"><IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="Add01Icon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />{@render buttonText()}</Button></CardFooter></Card></Example>{/snippet}

{#snippet CardWithImageSmall()}<Example title="With Image (Small)"><Card size="sm" class="relative mx-auto w-full max-w-sm pt-0"><div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" /><img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        /><CardHeader><CardTitle>Beautiful Landscape</CardTitle><CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription></CardHeader><CardFooter><Button size="sm" class="w-full"><IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="Add01Icon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />{@render buttonText()}</Button></CardFooter></Card></Example>{/snippet}
<ExampleWrapper>{@render CardWithImage()}{@render CardWithImageSmall()}</ExampleWrapper>
