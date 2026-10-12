<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@sveltery/ui/avatar';
  import { Button } from '@sveltery/ui/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const sizes = ['sm', 'default', 'lg'] as const;
  const team = [
    { src: 'https://github.com/shadcn.png', alt: '@shadcn', fallback: 'CN' },
    { src: 'https://github.com/maxleiter.png', alt: '@maxleiter', fallback: 'LR' },
    { src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit', fallback: 'ER' },
  ];
</script>

{#snippet AvatarSizes()}
  <Example title="Sizes">
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      {/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet AvatarWithBadge()}
  <Example title="Badge">
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarImage src="https://github.com/jorgezreik.png" alt="@jorgezreik" />
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      {/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarFallback>JZ</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet AvatarWithBadgeIcon()}
  <Example title="Badge with Icon">
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </AvatarBadge>
        </Avatar>
      {/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as size (size)}
        <Avatar {size}>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
            />
          </AvatarBadge>
        </Avatar>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet AvatarGroupExample()}
  <Example title="Group">
    {#each sizes as size (size)}
      <AvatarGroup>
        {#each team as member (member.alt)}
          <Avatar {size}>
            <AvatarImage src={member.src} alt={member.alt} />
            <AvatarFallback>{member.fallback}</AvatarFallback>
          </Avatar>
        {/each}
      </AvatarGroup>
    {/each}
  </Example>
{/snippet}

{#snippet AvatarGroupWithCount()}
  <Example title="Group with Count">
    {#each sizes as size (size)}
      <AvatarGroup>
        {#each team as member (member.alt)}
          <Avatar {size}>
            <AvatarImage src={member.src} alt={member.alt} />
            <AvatarFallback>{member.fallback}</AvatarFallback>
          </Avatar>
        {/each}
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    {/each}
  </Example>
{/snippet}

{#snippet AvatarGroupWithIconCount()}
  <Example title="Group with Icon Count">
    {#each sizes as size (size)}
      <AvatarGroup>
        {#each team as member (member.alt)}
          <Avatar {size}>
            <AvatarImage src={member.src} alt={member.alt} class={size === 'lg' ? 'grayscale' : undefined} />
            <AvatarFallback>{member.fallback}</AvatarFallback>
          </Avatar>
        {/each}
        <AvatarGroupCount>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
        </AvatarGroupCount>
      </AvatarGroup>
    {/each}
  </Example>
{/snippet}

{#snippet AvatarInEmpty()}
  <Example title="In Empty">
    <Empty class="w-full flex-none border">
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup>
            {#each team as member (member.alt)}
              <Avatar size="lg">
                <AvatarImage src={member.src} alt={member.alt} class="grayscale" />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            {/each}
            <AvatarGroupCount>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
            </AvatarGroupCount>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render AvatarSizes()}
  {@render AvatarWithBadge()}
  {@render AvatarWithBadgeIcon()}
  {@render AvatarGroupExample()}
  {@render AvatarGroupWithCount()}
  {@render AvatarGroupWithIconCount()}
  {@render AvatarInEmpty()}
</ExampleWrapper>
