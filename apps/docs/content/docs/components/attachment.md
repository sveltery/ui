---
title: Attachment
description: Displays a file or image attachment with media, metadata, upload state, and actions.
style: rhea
---

<ComponentPreview name="base/AttachmentExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/attachment`.

<ComponentSource name="attachment" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '$lib/components/ui/attachment';
</script>
```

```svelte
<Attachment state="uploading">
  <AttachmentMedia>
    <FileIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>report.pdf</AttachmentTitle>
    <AttachmentDescription>Uploading, 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove attachment">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

`state` is one of `idle`, `uploading`, `processing`, `error` or `done`, and sets `data-state` for styling.

## Trigger

`AttachmentTrigger` covers the whole attachment with a button, so a click anywhere opens a preview. Pass a `render` snippet to make it a link or another component's trigger. Spread `props` onto it.

```svelte
<AttachmentTrigger aria-label="Preview report.pdf" onclick={openPreview} />
```
