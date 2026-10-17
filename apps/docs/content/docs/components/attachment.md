---
title: Attachment
description: Displays a file or image attachment with media, metadata, upload state, and actions.
style: rhea
---

<ComponentPreview name="base/AttachmentDemoExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

The `Attachment` component displays a file or image attachment, its media, name, and metadata, with optional actions and upload state. Use it for files and images in chat composers, message threads, and upload lists.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add attachment
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/attachment`.

<ComponentSource name="attachment" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '#lib/components/ui/attachment';
</script>
```

```svelte
<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove sales-dashboard.pdf">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Composition

Use the following composition to build an attachment:

```text
Attachment
├── AttachmentMedia
├── AttachmentContent
│   ├── AttachmentTitle
│   └── AttachmentDescription
├── AttachmentActions
│   └── AttachmentAction
└── AttachmentTrigger
```

Use `AttachmentGroup` to lay out multiple attachments in a scrollable row:

```text
AttachmentGroup
├── Attachment
└── Attachment
```

## Features

- Icon and image media through `AttachmentMedia`
- Upload states: `idle`, `uploading`, `processing`, `error`, and `done` with built-in styling and a shimmer while in progress
- Three sizes and horizontal or vertical orientation
- A full-card `AttachmentTrigger` that opens a link or dialog while the actions stay independently clickable
- Scrollable, snapping `AttachmentGroup` with an edge fade
- Customizable styling through the `class` prop on every part

## Image

Set `variant="image"` on `AttachmentMedia` and render an `<img>` inside it. Use `orientation="vertical"` to stack the media above the content.

<ComponentPreview name="base/AttachmentImageExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

## States

Set `state` to reflect the upload lifecycle. `uploading` and `processing` shimmer the title, and `error` switches to a destructive treatment.

<ComponentPreview name="base/AttachmentStatesExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

## Sizes

Use `size` to switch between `default`, `sm`, and `xs`.

<ComponentPreview name="base/AttachmentSizesExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

## Group

Wrap attachments in `AttachmentGroup` to lay them out in a horizontally scrollable, snapping row with an edge fade.

<ComponentPreview name="base/AttachmentGroupExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

## Trigger

Add an `AttachmentTrigger` to make the whole card open a link or dialog. It fills the card behind the actions, so the actions stay clickable.

<ComponentPreview name="base/AttachmentTriggerExample" class="theme-blue [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:bg-surface dark:[&_[data-slot=preview]]:bg-background" />

```svelte
<Dialog>
  <Attachment>
    <!-- media, content, actions -->
    <DialogTrigger>
      {#snippet render(props)}
        <AttachmentTrigger {...props} aria-label="Preview research-summary.pdf" />
      {/snippet}
    </DialogTrigger>
  </Attachment>
  <DialogContent><!-- ... --></DialogContent>
</Dialog>
```

## Accessibility

`AttachmentAction` renders a `Button`, and `AttachmentTrigger` renders a real `<button>` (or your element via `render`). Follow the guidance below so both are operable and announced.

### Label icon-only actions

`AttachmentAction` is usually icon-only, so give each one an `aria-label` describing the action and its target.

```svelte
<AttachmentAction aria-label="Remove sales-dashboard.pdf">
  <XIcon />
</AttachmentAction>
```

### Label the trigger

`AttachmentTrigger` covers the card with no text of its own, so give it an `aria-label` for what activating it does.

```svelte
<AttachmentTrigger>
  {#snippet render(props)}
    <a {...props} href={url} target="_blank" rel="noreferrer" aria-label="Open workspace.png"></a>
  {/snippet}
</AttachmentTrigger>
```

The trigger sits behind the actions in the stacking order, so an `AttachmentAction` and the `AttachmentTrigger` never trap each other — both remain separately focusable and clickable.

### Keyboard scrolling

An `AttachmentGroup` scrolls horizontally. When its attachments are interactive: a trigger or actions, keyboard users reach off-screen items by tabbing to them. For a row of presentational attachments, make the group itself focusable and scrollable by adding `tabindex={0}`, `role="group"`, and an `aria-label`.

### Meaning beyond color

The `error` state uses a destructive color. Keep the failure reason in `AttachmentDescription` so the state is not conveyed by color alone.

## API Reference

### Attachment

The root attachment container.

| Prop          | Type                                                         | Default        | Description                                       |
| ------------- | ------------------------------------------------------------ | -------------- | ------------------------------------------------- |
| `state`       | `"idle" \| "uploading" \| "processing" \| "error" \| "done"` | `"done"`       | The upload state. Drives styling and the shimmer. |
| `size`        | `"default" \| "sm" \| "xs"`                                  | `"default"`    | The attachment size.                              |
| `orientation` | `"horizontal" \| "vertical"`                                 | `"horizontal"` | Lay the media beside or above the content.        |
| `class`       | `string`                                                     | -              | Additional classes to apply to the root element.  |

### AttachmentMedia

The media slot for an icon or image preview.

| Prop      | Type                | Default  | Description                                    |
| --------- | ------------------- | -------- | ---------------------------------------------- |
| `variant` | `"icon" \| "image"` | `"icon"` | Whether the media holds an icon or an `<img>`. |
| `class`   | `string`            | -        | Additional classes to apply to the media slot. |

### AttachmentContent

Wraps the title and description.

| Prop    | Type     | Default | Description                                      |
| ------- | -------- | ------- | ------------------------------------------------ |
| `class` | `string` | -       | Additional classes to apply to the content slot. |

### AttachmentTitle

The attachment name. Shimmers while the attachment is `uploading` or `processing`.

| Prop    | Type     | Default | Description                               |
| ------- | -------- | ------- | ----------------------------------------- |
| `class` | `string` | -       | Additional classes to apply to the title. |

### AttachmentDescription

Secondary metadata such as the file type, size, or upload status.

| Prop    | Type     | Default | Description                                     |
| ------- | -------- | ------- | ----------------------------------------------- |
| `class` | `string` | -       | Additional classes to apply to the description. |

### AttachmentActions

A container for one or more actions, aligned to the end of the attachment.

| Prop    | Type     | Default | Description                                 |
| ------- | -------- | ------- | ------------------------------------------- |
| `class` | `string` | -       | Additional classes to apply to the actions. |

### AttachmentAction

An action button. Renders a [`Button`](/docs/components/button) and accepts all of its props.

| Prop       | Type                            | Default     | Description                              |
| ---------- | ------------------------------- | ----------- | ---------------------------------------- |
| `size`     | `ButtonProps["size"]`           | `"icon-xs"` | The button size.                         |
| `...props` | `ComponentProps<typeof Button>` | -           | Props spread to the underlying `Button`. |

### AttachmentTrigger

A full-card overlay that activates the attachment. Renders a `<button>` by default.

| Prop       | Type                                | Default | Description                                    |
| ---------- | ----------------------------------- | ------- | ---------------------------------------------- |
| `render`   | `Snippet<[props, state, children]>` | -       | Render as a different element, such as a link. |
| `...props` | `HTMLAttributes<HTMLElement>`       | -       | Props spread to the trigger element.           |

### AttachmentGroup

Lays out attachments in a horizontally scrollable, snapping row.

| Prop    | Type     | Default | Description                               |
| ------- | -------- | ------- | ----------------------------------------- |
| `class` | `string` | -       | Additional classes to apply to the group. |
