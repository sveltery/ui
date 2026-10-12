<script lang="ts">
  import { cn } from 'cn';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Badge } from '@sveltery/ui/badge';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { Spinner } from '@sveltery/ui/spinner';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

{#snippet SpinnerBasic()}
  <Example title="Basic">
    <div class="flex items-center gap-6">
      <Spinner />
      <Spinner class="size-6" />
    </div>
  </Example>
{/snippet}

{#snippet SpinnerInButtons()}
  <Example title="In Buttons">
    <div class="flex flex-wrap items-center gap-4">
      <Button>
        <Spinner data-icon="inline-start" /> Submit
      </Button>
      <Button disabled>
        <Spinner data-icon="inline-start" /> Disabled
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" /> Outline
      </Button>
      <Button variant="outline" size="icon" disabled>
        <Spinner data-icon="inline-start" />
        <span class="sr-only">Loading...</span>
      </Button>
    </div>
  </Example>
{/snippet}

{#snippet SpinnerInBadges()}
  <Example title="In Badges" class="items-center justify-center">
    <div class="flex flex-wrap items-center justify-center gap-4">
      <Badge>
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
    </div>
  </Example>
{/snippet}

{#snippet SpinnerInEmpty()}
  <Example title="In Empty State" containerClass="lg:col-span-full">
    <Empty class="min-h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" class={buttonVariants()}>Create project</a>
          <Button variant="outline">Import project</Button>
        </div>
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="#" class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
          Learn more
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </a>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SpinnerBasic()}
  {@render SpinnerInButtons()}
  {@render SpinnerInBadges()}
  {@render SpinnerInEmpty()}
</ExampleWrapper>
