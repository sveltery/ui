---
title: Progress
description: Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
---

<ComponentPreview name="base/ProgressExample" />

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
  import { Progress, ProgressLabel, ProgressValue } from '$lib/components/ui/progress';
</script>
```

```svelte
<Progress value={56}>
  <ProgressLabel>Upload progress</ProgressLabel>
  <ProgressValue />
</Progress>
```

## API reference

`Progress` is styled on top of the Sveltery Base `Progress` primitive, which reports the value to assistive technology. `Progress` renders the track and indicator after its children, so pass `ProgressLabel` and `ProgressValue` as children. `value` is a plain prop: pass a number, or `null` for an indeterminate bar. See the [Base UI Progress documentation](https://base-ui.com/react/components/progress) for the behavior it ports.
