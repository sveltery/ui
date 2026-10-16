<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Button } from '@sveltery/components/button';
  import { Toggle } from '@sveltery/components/toggle';
  import { IconPlaceholder } from '@sveltery/components/icons';
</script>

{#snippet ToggleBasic()}
  <Example title="Basic">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle bold" pressed>
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </Toggle>
    </div>
  </Example>
{/snippet}

{#snippet ToggleOutline()}
  <Example title="Outline">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
        Bold
      </Toggle>
    </div>
  </Example>
{/snippet}

{#snippet ToggleSizes()}
  <Example title="Sizes">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle small" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle default" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle large" size="lg">
        Large
      </Toggle>
    </div>
  </Example>
{/snippet}

{#snippet ToggleWithButtonText()}
  <Example title="With Button Text">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm" size="sm">
          Toggle
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button size="default" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Toggle
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button size="lg" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg" size="lg">
          Toggle
        </Toggle>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet ToggleWithButtonIcon()}
  <Example title="With Button Icon">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon-sm">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </Button>
        <Toggle
          variant="outline"
          aria-label="Toggle default icon"
          size="default"
        >
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon-lg">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </Toggle>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet ToggleWithButtonIconText()}
  <Example title="With Button Icon + Text">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
            data-icon="inline-start"
          />
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
          Toggle
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button size="default" variant="outline">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
            data-icon="inline-start"
          />
          Button
        </Button>
        <Toggle
          variant="outline"
          aria-label="Toggle default icon text"
          size="default"
        >
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
          Toggle
        </Toggle>
      </div>
      <div class="flex items-center gap-2">
        <Button size="lg" variant="outline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
            data-icon="inline-start"
          />
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
          Toggle
        </Toggle>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet ToggleDisabled()}
  <Example title="Disabled">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle disabled" disabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
        Disabled
      </Toggle>
    </div>
  </Example>
{/snippet}

{#snippet ToggleWithIcon()}
  <Example title="With Icon">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle bookmark" pressed>
        <IconPlaceholder
          lucide="BookmarkIcon"
          tabler="IconBookmark"
          hugeicons="BookmarkIcon"
          phosphor="BookmarkIcon"
          remixicon="RiBookmarkLine"
          class="group-data-pressed/toggle:fill-accent-foreground"
        />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bookmark outline">
        <IconPlaceholder
          lucide="BookmarkIcon"
          tabler="IconBookmark"
          hugeicons="BookmarkIcon"
          phosphor="BookmarkIcon"
          remixicon="RiBookmarkLine"
          class="group-data-pressed/toggle:fill-accent-foreground"
        />
        Bookmark
      </Toggle>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ToggleBasic()}
  {@render ToggleOutline()}
  {@render ToggleSizes()}
  {@render ToggleWithButtonText()}
  {@render ToggleWithButtonIcon()}
  {@render ToggleWithButtonIconText()}
  {@render ToggleDisabled()}
  {@render ToggleWithIcon()}
</ExampleWrapper>
