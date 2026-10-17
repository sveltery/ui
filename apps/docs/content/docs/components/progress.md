---
title: Progress
description: Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
---

<ComponentPreview name="base/ProgressDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add progress
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/progress`.

<ComponentSource name="progress" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Progress, ProgressLabel, ProgressValue } from '#lib/components/ui/progress';
</script>
```

```svelte
<Progress value={33} />
```

`value` is a plain prop: pass a number, or `null` for an indeterminate bar.

## Composition

### With label and value

Use `ProgressLabel` and `ProgressValue` to add a label and value display.

```svelte
<script lang="ts">
  import { Progress, ProgressLabel, ProgressValue } from '#lib/components/ui/progress';
</script>

<Progress value={56} class="w-full max-w-sm">
  <ProgressLabel>Upload progress</ProgressLabel>
  <ProgressValue />
</Progress>
```

```text
Progress
├── ProgressLabel
├── ProgressValue
└── ProgressTrack
    └── ProgressIndicator
```

`Progress` renders the track and indicator after its children, so pass `ProgressLabel` and `ProgressValue` as children.

## Label

Use `ProgressLabel` and `ProgressValue` to add a label and value display.

<ComponentPreview name="base/ProgressLabelExample" />

## Controlled

A progress bar that can be controlled by a slider.

<ComponentPreview name="base/ProgressControlledExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the progress bar in a [DirectionProvider](/docs/components/direction) and set `dir` on `Progress`. Use the language selector to switch the language.

<ComponentPreview name="base/ProgressRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Progress](https://base-ui.com/react/components/progress#api-reference) documentation.

`Progress` is styled on top of the Sveltery Base `Progress` primitive, which reports the value to assistive technology. `ProgressValue` takes an optional `children` snippet that receives the formatted value and the raw value.
