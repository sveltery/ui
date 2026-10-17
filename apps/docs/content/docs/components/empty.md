---
title: Empty
description: Use the Empty component to display an empty state.
---

<ComponentPreview name="base/EmptyDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add empty
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/empty`.

<ComponentSource name="empty" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '#lib/components/ui/empty';
</script>
```

```svelte
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <FolderIcon />
    </EmptyMedia>
    <EmptyTitle>No data</EmptyTitle>
    <EmptyDescription>No data found</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Add data</Button>
  </EmptyContent>
</Empty>
```

## Composition

Use the following composition to build an `Empty` state:

```text
Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent
```

## Outline

Use the `border` utility class to create an outline empty state.

<ComponentPreview name="base/EmptyOutlineExample" />

## Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.

<ComponentPreview name="base/EmptyBackgroundExample" />

## Avatar

Use the `EmptyMedia` component to display an avatar in the empty state.

<ComponentPreview name="base/EmptyAvatarExample" />

## Avatar Group

Use the `EmptyMedia` component to display an avatar group in the empty state.

<ComponentPreview name="base/EmptyAvatarGroupExample" />

## InputGroup

You can add an `InputGroup` component to the `EmptyContent` component.

<ComponentPreview name="base/EmptyInputGroupExample" />

## RTL

Wrap the empty state in a [DirectionProvider](/docs/components/direction) and set `dir` on `Empty`. Use the buttons to switch the language.

<ComponentPreview name="base/EmptyRtlExample" align="start" />

## API Reference

### Empty

The main component of the empty state. Wraps the `EmptyHeader` and `EmptyContent` components.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<Empty>
  <EmptyHeader />
  <EmptyContent />
</Empty>
```

### EmptyHeader

The `EmptyHeader` component wraps the empty media, title, and description.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<EmptyHeader>
  <EmptyMedia />
  <EmptyTitle />
  <EmptyDescription />
</EmptyHeader>
```

### EmptyMedia

Use the `EmptyMedia` component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.

| Prop      | Type                    | Default   |
| --------- | ----------------------- | --------- |
| `variant` | `"default"` \| `"icon"` | `default` |
| `class`   | `string`                |           |

```svelte
<EmptyMedia variant="icon">
  <Icon />
</EmptyMedia>
```

```svelte
<EmptyMedia>
  <Avatar>
    <AvatarImage src="..." />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</EmptyMedia>
```

### EmptyTitle

Use the `EmptyTitle` component to display the title of the empty state.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<EmptyTitle>No data</EmptyTitle>
```

### EmptyDescription

Use the `EmptyDescription` component to display the description of the empty state.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<EmptyDescription>You do not have any notifications.</EmptyDescription>
```

### EmptyContent

Use the `EmptyContent` component to display the content of the empty state such as a button, input or a link.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<EmptyContent>
  <Button>Add Project</Button>
</EmptyContent>
```
