<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@sveltery/components/item';
  import { Progress, ProgressLabel, ProgressValue } from '@sveltery/components/progress';
  import { Slider } from '@sveltery/components/slider';

  let value = $state(50);

  const files = [
    { id: '1', name: 'document.pdf', progress: 45, timeRemaining: '2m 30s' },
    { id: '2', name: 'presentation.pptx', progress: 78, timeRemaining: '45s' },
    { id: '3', name: 'spreadsheet.xlsx', progress: 12, timeRemaining: '5m 12s' },
    { id: '4', name: 'image.jpg', progress: 100, timeRemaining: 'Complete' },
  ];
</script>

{#snippet ProgressValues()}
  <Example title="Progress Bar">
    <div class="flex w-full flex-col gap-4">
      <Progress value={0} />
      <Progress value={25} class="w-full" />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  </Example>
{/snippet}

{#snippet ProgressWithLabel()}
  <Example title="With Label">
    <Progress value={56}>
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  </Example>
{/snippet}

{#snippet ProgressControlled()}
  <Example title="Controlled">
    <div class="flex w-full flex-col gap-4">
      <Progress {value} class="w-full" />
      <Slider bind:value min={0} max={100} step={1} />
    </div>
  </Example>
{/snippet}

{#snippet FileUploadList()}
  <Example title="File Upload List">
    <ItemGroup>
      {#each files as file (file.id)}
        <Item size="xs" class="px-0">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="FileIcon"
              tabler="IconFile"
              hugeicons="FileIcon"
              phosphor="FileIcon"
              remixicon="RiFileLine"
              class="size-5"
            />
          </ItemMedia>
          <ItemContent class="inline-block truncate">
            <ItemTitle class="inline">{file.name}</ItemTitle>
          </ItemContent>
          <ItemContent>
            <Progress value={file.progress} class="w-32" />
          </ItemContent>
          <ItemActions class="w-16 justify-end">
            <span class="text-sm text-muted-foreground">{file.timeRemaining}</span>
          </ItemActions>
        </Item>
      {/each}
    </ItemGroup>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ProgressValues()}
  {@render ProgressWithLabel()}
  {@render ProgressControlled()}
  {@render FileUploadList()}
</ExampleWrapper>
