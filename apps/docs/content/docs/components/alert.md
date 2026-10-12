---
title: Alert
description: Displays a callout for user attention.
---

<ComponentPreview name="base/AlertExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/alert`.

<ComponentSource name="alert" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
</script>
```

```svelte
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app by copying their source.</AlertDescription>
  <AlertAction>
    <Button variant="outline">Enable</Button>
  </AlertAction>
</Alert>
```
