<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/components/input-group';
  import { Kbd, KbdGroup } from '@sveltery/components/kbd';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Button } from '@sveltery/components/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@sveltery/components/tooltip';
</script>

{#snippet KbdBasic()}
  <Example title="Basic">
    <div class="flex items-center gap-2">
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘K</Kbd>
      <Kbd>Ctrl + B</Kbd>
    </div>
  </Example>
{/snippet}

{#snippet KbdModifierKeys()}
  <Example title="Modifier Keys">
    <div class="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>C</Kbd>
    </div>
  </Example>
{/snippet}

{#snippet KbdGroupExample()}
  <Example title="KbdGroup">
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  </Example>
{/snippet}

{#snippet KbdArrowKeys()}
  <Example title="Arrow Keys">
    <div class="flex items-center gap-2">
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  </Example>
{/snippet}

{#snippet KbdWithIcons()}
  <Example title="With Icons">
    <KbdGroup>
      <Kbd>
        <IconPlaceholder
          lucide="CircleDashedIcon"
          tabler="IconCircleDashed"
          hugeicons="DashedLineCircleIcon"
          phosphor="CircleDashedIcon"
          remixicon="RiLoaderLine"
        />
      </Kbd>
      <Kbd>
        <IconPlaceholder
          lucide="ArrowLeftIcon"
          tabler="IconArrowLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="ArrowLeftIcon"
          remixicon="RiArrowLeftLine"
        />
      </Kbd>
      <Kbd>
        <IconPlaceholder
          lucide="ArrowRightIcon"
          tabler="IconArrowRight"
          hugeicons="ArrowRight01Icon"
          phosphor="ArrowRightIcon"
          remixicon="RiArrowRightLine"
        />
      </Kbd>
    </KbdGroup>
  </Example>
{/snippet}

{#snippet KbdWithIconsAndText()}
  <Example title="With Icons and Text">
    <KbdGroup>
      <Kbd>
        <IconPlaceholder
          lucide="ArrowLeftIcon"
          tabler="IconArrowLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="ArrowLeftIcon"
          remixicon="RiArrowLeftLine"
        />
        Left
      </Kbd>
      <Kbd>
        <IconPlaceholder
          lucide="CircleDashedIcon"
          tabler="IconCircleDashed"
          hugeicons="DashedLineCircleIcon"
          phosphor="CircleDashedIcon"
          remixicon="RiLoaderLine"
        />
        Voice Enabled
      </Kbd>
    </KbdGroup>
  </Example>
{/snippet}

{#snippet KbdInInputGroup()}
  <Example title="InputGroup">
    <InputGroup>
      <InputGroupInput />
      <InputGroupAddon>
        <Kbd>Space</Kbd>
      </InputGroupAddon>
    </InputGroup>
  </Example>
{/snippet}

{#snippet KbdInTooltip()}
  <Example title="Tooltip">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button size="icon-sm" variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        <IconPlaceholder lucide="SaveIcon" tabler="IconDeviceFloppy" hugeicons="FloppyDiskIcon" phosphor="FloppyDiskIcon" remixicon="RiSaveLine" />
      </TooltipTrigger>
      <TooltipContent class="pr-1.5">
        <div class="flex items-center gap-2">
          Save Changes <Kbd>S</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  </Example>
{/snippet}

{#snippet KbdWithSamp()}
  <Example title="With samp">
    <Kbd>
      <samp>File</samp>
    </Kbd>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render KbdBasic()}
  {@render KbdModifierKeys()}
  {@render KbdGroupExample()}
  {@render KbdArrowKeys()}
  {@render KbdWithIcons()}
  {@render KbdWithIconsAndText()}
  {@render KbdInInputGroup()}
  {@render KbdInTooltip()}
  {@render KbdWithSamp()}
</ExampleWrapper>
