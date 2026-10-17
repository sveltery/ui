---
title: Avatar
description: An image element with a fallback for representing the user.
---

<ComponentPreview name="base/AvatarDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add avatar
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/avatar`.

<ComponentSource name="avatar" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Avatar, AvatarFallback, AvatarImage } from '#lib/components/ui/avatar';
</script>
```

```svelte
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## Composition

Use the following composition to build an `Avatar`:

```text
Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge
```

Use the following composition to build an `AvatarGroup`:

```text
AvatarGroup
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
└── AvatarGroupCount
```

## Basic

A basic avatar component with an image and a fallback.

<ComponentPreview name="base/AvatarBasicExample" />

## Badge

Use the `AvatarBadge` component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar.

<ComponentPreview name="base/AvatarBadgeExample" />

Use the `class` prop to add custom styles to the badge such as custom colors, sizes, etc.

```svelte
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
  <AvatarBadge class="bg-green-600 dark:bg-green-800" />
</Avatar>
```

## Badge with Icon

You can also use an icon inside `<AvatarBadge>`.

<ComponentPreview name="base/AvatarBadgeIconExample" />

## Avatar Group

Use the `AvatarGroup` component to add a group of avatars.

<ComponentPreview name="base/AvatarGroupExample" />

## Avatar Group Count

Use `<AvatarGroupCount>` to add a count to the group.

<ComponentPreview name="base/AvatarGroupCountExample" />

## Avatar Group with Icon

You can also use an icon inside `<AvatarGroupCount>`.

<ComponentPreview name="base/AvatarGroupCountIconExample" />

## Sizes

Use the `size` prop to change the size of the avatar.

<ComponentPreview name="base/AvatarSizeExample" />

## Dropdown

You can use the `Avatar` component as a trigger for a dropdown menu.

<ComponentPreview name="base/AvatarDropdownExample" />

## RTL

Wrap the avatars in a [DirectionProvider](/docs/components/direction) and set `dir` on their container. Use the language selector to switch the language.

<ComponentPreview name="base/AvatarRtlExample" direction="rtl" />

## API Reference

### Avatar

The `Avatar` component is the root component that wraps the avatar image and fallback.

| Prop    | Type                        | Default     |
| ------- | --------------------------- | ----------- |
| `size`  | `"default" \| "sm" \| "lg"` | `"default"` |
| `class` | `string`                    | -           |

### AvatarImage

The `AvatarImage` component displays the avatar image. It accepts all Base UI Avatar Image props.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `src`   | `string` | -       |
| `alt`   | `string` | -       |
| `class` | `string` | -       |

### AvatarFallback

The `AvatarFallback` component displays a fallback when the image fails to load. It accepts all Base UI Avatar Fallback props.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### AvatarBadge

The `AvatarBadge` component displays a badge indicator on the avatar, typically positioned at the bottom right.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### AvatarGroup

The `AvatarGroup` component displays a group of avatars with overlapping styling.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### AvatarGroupCount

The `AvatarGroupCount` component displays a count indicator in an avatar group, typically showing the number of additional avatars.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

For more information about Base UI Avatar props, see the [Base UI documentation](https://base-ui.com/react/components/avatar#api-reference).
