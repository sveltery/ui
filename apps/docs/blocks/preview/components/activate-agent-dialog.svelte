<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Alert, AlertDescription } from '@sveltery/ui/alert';
  import { Badge } from '@sveltery/ui/badge';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@sveltery/ui/item';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

{#snippet feature(content: Snippet)}
  <Item size="xs" class="px-0">
    <ItemMedia variant="icon" class="self-start">
      <IconPlaceholder
        lucide="CheckCircle2Icon"
        tabler="IconCircleCheckFilled"
        hugeicons="CheckmarkCircle02Icon"
        phosphor="CheckCircleIcon"
        remixicon="RiCheckboxCircleLine"
        class="size-5 fill-primary text-primary-foreground"
      />
    </ItemMedia>
    <ItemContent>
      <ItemTitle
        class="inline leading-relaxed font-normal text-muted-foreground *:[strong]:font-medium *:[strong]:text-foreground"
      >
        {@render content()}
      </ItemTitle>
    </ItemContent>
  </Item>
{/snippet}

{#snippet codeReviews()}
  <strong>Code reviews</strong> with full codebase context to catch <strong>hard-to-find</strong> bugs.
{/snippet}

{#snippet codeSuggestions()}
  <strong>Code suggestions</strong> validated in sandboxes before you merge.
{/snippet}

{#snippet rootCause()}
  <strong>Root-cause analysis</strong> for production issues with deployment context.
  <Badge variant="secondary" class="bg-chart-1 text-chart-5">Requires Observability Plus</Badge>
{/snippet}

<Card>
  <CardHeader>
    <CardTitle>Ship faster & safer with Vercel Agent</CardTitle>
    <CardDescription>
      Your use is subject to Vercel's <a href="#">Public Beta Agreement</a> and <a href="#">AI Product Terms</a>.
    </CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <ItemGroup class="gap-0">
      {@render feature(codeReviews)}
      {@render feature(codeSuggestions)}
      {@render feature(rootCause)}
    </ItemGroup>
    <Alert>
      <AlertDescription>Pro teams get $100 in Vercel Agent trial credit for 2 weeks after activation.</AlertDescription>
    </Alert>
  </CardContent>
  <CardFooter class="justify-end gap-2">
    <Button variant="outline" class="style-sera:hidden">Cancel</Button>
    <Button class="style-sera:w-full">Enable with $100 credits</Button>
  </CardFooter>
</Card>
