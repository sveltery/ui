---
title: Card
description: Displays a card with header, content, and footer.
---

<ComponentPreview name="base/CardExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/card`.

<ComponentSource name="card" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>
```

```svelte
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Image card

Place an image above `CardHeader` and drop the top padding with `pt-0`. Put a `Badge` or an action next to the footer content with `ml-auto`. Here the footer opens an `AlertDialog`.

<ComponentPreview name="base/ComponentExample" />
