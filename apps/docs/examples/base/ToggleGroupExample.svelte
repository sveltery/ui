<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field, FieldDescription, FieldLabel } from '@sveltery/ui/field';
  import { ToggleGroup, ToggleGroupItem } from '@sveltery/ui/toggle-group';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const fontWeights = [
    { value: 'light', label: 'Light', weight: 'font-light' },
    { value: 'normal', label: 'Normal', weight: 'font-normal' },
    { value: 'medium', label: 'Medium', weight: 'font-medium' },
    { value: 'bold', label: 'Bold', weight: 'font-bold' },
  ];
  let fontWeight = $state(['normal']);
</script>

{#snippet ToggleGroupBasic()}
  <Example title="Basic">
    <ToggleGroup multiple spacing={1}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupOutline()}
  <Example title="Outline">
    <ToggleGroup variant="outline" value={['all']}>
      <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="missed" aria-label="Toggle missed">
        Missed
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupOutlineWithIcons()}
  <Example title="Outline With Icons">
    <ToggleGroup variant="outline" multiple size="sm">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupSizes()}
  <Example title="Sizes">
    <div class="flex flex-col gap-4">
      <ToggleGroup size="sm" value={['top']} variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup value={['top']} variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  </Example>
{/snippet}

{#snippet ToggleGroupSpacing()}
  <Example title="With Spacing">
    <ToggleGroup size="sm" value={['top']} spacing={2}>
      <ToggleGroupItem value="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem value="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupWithIcons()}
  <Example title="With Icons">
    <ToggleGroup multiple variant="outline" spacing={2} size="sm">
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        class="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
      >
        <IconPlaceholder
          lucide="StarIcon"
          tabler="IconStar"
          hugeicons="StarIcon"
          phosphor="StarIcon"
          remixicon="RiStarLine"
        />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        class="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
      >
        <IconPlaceholder
          lucide="HeartIcon"
          tabler="IconHeart"
          hugeicons="FavouriteIcon"
          phosphor="HeartIcon"
          remixicon="RiHeartLine"
        />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        class="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
      >
        <IconPlaceholder
          lucide="BookmarkIcon"
          tabler="IconBookmark"
          hugeicons="BookmarkIcon"
          phosphor="BookmarkIcon"
          remixicon="RiBookmarkLine"
        />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupFilter()}
  <Example title="Filter">
    <ToggleGroup value={['all']} variant="outline" size="sm">
      <ToggleGroupItem value="all" aria-label="All">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="active" aria-label="Active">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="completed" aria-label="Completed">
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem value="archived" aria-label="Archived">
        Archived
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupDateRange()}
  <Example title="Date Range">
    <ToggleGroup
      value={['today']}
      variant="outline"
      size="sm"
      spacing={2}
    >
      <ToggleGroupItem value="today" aria-label="Today">
        Today
      </ToggleGroupItem>
      <ToggleGroupItem value="week" aria-label="This Week">
        This Week
      </ToggleGroupItem>
      <ToggleGroupItem value="month" aria-label="This Month">
        This Month
      </ToggleGroupItem>
      <ToggleGroupItem value="year" aria-label="This Year">
        This Year
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupSort()}
  <Example title="Sort">
    <ToggleGroup value={['newest']} variant="outline" size="sm">
      <ToggleGroupItem value="newest" aria-label="Newest">
        <IconPlaceholder
          lucide="ArrowDownIcon"
          tabler="IconArrowDown"
          hugeicons="ArrowDownIcon"
          phosphor="ArrowDownIcon"
          remixicon="RiArrowDownLine"
        />
        Newest
      </ToggleGroupItem>
      <ToggleGroupItem value="oldest" aria-label="Oldest">
        <IconPlaceholder
          lucide="ArrowUpIcon"
          tabler="IconArrowUp"
          hugeicons="ArrowUpIcon"
          phosphor="ArrowUpIcon"
          remixicon="RiArrowUpLine"
        />
        Oldest
      </ToggleGroupItem>
      <ToggleGroupItem value="popular" aria-label="Popular">
        <IconPlaceholder
          lucide="TrendingUpIcon"
          tabler="IconTrendingUp"
          hugeicons="TradeUpIcon"
          phosphor="TrendUpIcon"
          remixicon="RiLineChartLine"
        />
        Popular
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupVertical()}
  <Example title="Vertical">
    <ToggleGroup multiple orientation="vertical" spacing={1}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupVerticalOutline()}
  <Example title="Vertical Outline">
    <ToggleGroup
      variant="outline"
      value={['all']}
      orientation="vertical"
      size="sm"
    >
      <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="active" aria-label="Toggle active">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="completed" aria-label="Toggle completed">
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem value="archived" aria-label="Toggle archived">
        Archived
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupVerticalOutlineWithIcons()}
  <Example title="Vertical Outline With Icons">
    <ToggleGroup variant="outline" multiple orientation="vertical" size="sm">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupVerticalWithSpacing()}
  <Example title="Vertical With Spacing">
    <ToggleGroup
      size="sm"
      value={['top']}
      orientation="vertical"
      spacing={1}
    >
      <ToggleGroupItem value="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem value="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  </Example>
{/snippet}

{#snippet ToggleGroupFontWeightSelector()}
  <Example title="Font Weight Selector">
    <Field>
      <FieldLabel>Font Weight</FieldLabel>
      <ToggleGroup bind:value={fontWeight} variant="outline" spacing={2} size="lg">
        {#each fontWeights as { value, label, weight } (value)}
          <ToggleGroupItem
            {value}
            aria-label={label}
            class="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span class="text-2xl leading-none {weight}">Aa</span>
            <span class="text-xs text-muted-foreground">{label}</span>
          </ToggleGroupItem>
        {/each}
      </ToggleGroup>
      <FieldDescription>
        Use <code class="rounded-md bg-muted px-1 py-0.5 font-mono">font-{fontWeight[0]}</code> to set the font weight.
      </FieldDescription>
    </Field>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ToggleGroupBasic()}
  {@render ToggleGroupOutline()}
  {@render ToggleGroupOutlineWithIcons()}
  {@render ToggleGroupSizes()}
  {@render ToggleGroupSpacing()}
  {@render ToggleGroupWithIcons()}
  {@render ToggleGroupFilter()}
  {@render ToggleGroupDateRange()}
  {@render ToggleGroupSort()}
  {@render ToggleGroupVertical()}
  {@render ToggleGroupVerticalOutline()}
  {@render ToggleGroupVerticalOutlineWithIcons()}
  {@render ToggleGroupVerticalWithSpacing()}
  {@render ToggleGroupFontWeightSelector()}
</ExampleWrapper>
