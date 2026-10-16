<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Badge } from '@sveltery/components/badge';
  import { Button } from '@sveltery/components/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/components/empty';
  import { Field, FieldLabel } from '@sveltery/components/field';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/components/input-group';
  import { Spinner } from '@sveltery/components/spinner';
  import { IconPlaceholder } from '@sveltery/components/icons';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, content: Snippet | undefined)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render content?.()}</a>
{/snippet}

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

{#snippet SpinnerInInputGroup()}
  <Example title="In Input Group">
    <Field>
      <FieldLabel for="input-group-spinner">Input Group</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-spinner" />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </Field>
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
          <Button render={link} nativeButton={false}>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" render={link} nativeButton={false} class="text-muted-foreground">
          Learn more
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SpinnerBasic()}
  {@render SpinnerInButtons()}
  {@render SpinnerInBadges()}
  {@render SpinnerInInputGroup()}
  {@render SpinnerInEmpty()}
</ExampleWrapper>
