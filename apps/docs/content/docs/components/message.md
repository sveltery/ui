---
title: Message
description: Displays a message in a conversation, with optional avatar, header, footer, and alignment.
style: rhea
---

<ComponentPreview name="base/MessageExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add message
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn
```

### Copy the component

Copy the following files into `src/lib/components/ui/message`.

<ComponentSource name="message" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from '$lib/components/ui/message';
</script>
```

```svelte
<Message align="end">
  <MessageAvatar>
    <img src="/avatar.png" alt="Rhea" />
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>Rhea</MessageHeader>
    <p>The build is green.</p>
    <MessageFooter>Read 2:14 PM</MessageFooter>
  </MessageContent>
</Message>
```
