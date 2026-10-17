---
title: Menubar
description: A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
---

<ComponentPreview name="base/MenubarDemoExample" align="start" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add menubar
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/menubar`. The component builds on `dropdown-menu`, so copy that component too.

<ComponentSource name="menubar" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '#lib/components/ui/menubar';
</script>
```

```svelte
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarGroup>
        <MenubarItem>
          New Tab <MenubarShortcut>⌘T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>New Window</MenubarItem>
      </MenubarGroup>
      <MenubarSeparator />
      <MenubarGroup>
        <MenubarItem>Share</MenubarItem>
        <MenubarItem>Print</MenubarItem>
      </MenubarGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

Click a trigger to open its menu. While a menu is open, hovering another trigger or pressing ArrowLeft and ArrowRight switches to that menu. Escape closes the menu and returns focus to its trigger.

## Composition

Use the following composition to build a `Menubar`:

```text
Menubar
├── MenubarMenu
│   ├── MenubarTrigger
│   └── MenubarContent
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   ├── MenubarItem
│       │   └── MenubarItem
│       ├── MenubarSeparator
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   ├── MenubarCheckboxItem
│       │   └── MenubarCheckboxItem
│       ├── MenubarSeparator
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   └── MenubarRadioGroup
│       │       ├── MenubarRadioItem
│       │       └── MenubarRadioItem
│       └── MenubarSub
│           ├── MenubarSubTrigger
│           └── MenubarSubContent
│               └── MenubarGroup
│                   ├── MenubarLabel
│                   ├── MenubarItem
│                   └── MenubarItem
└── MenubarMenu
    ├── MenubarTrigger
    └── MenubarContent
        └── MenubarGroup
            ├── MenubarLabel
            ├── MenubarItem
            └── MenubarItem
```

## Checkbox

Use `MenubarCheckboxItem` for toggleable options. Bind `checked` to read or change the state.

<ComponentPreview name="base/MenubarCheckboxExample" align="start" />

## Radio

Use `MenubarRadioGroup` and `MenubarRadioItem` for single-select options. Bind `value` on the group.

<ComponentPreview name="base/MenubarRadioExample" align="start" />

## Submenu

Use `MenubarSub`, `MenubarSubTrigger`, and `MenubarSubContent` for nested menus.

<ComponentPreview name="base/MenubarSubmenuExample" align="start" />

## With Icons

<ComponentPreview name="base/MenubarIconsExample" align="start" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the menubar in a [DirectionProvider](/docs/components/direction) and set `dir` on `Menubar` and `MenubarContent`. Use the language selector to switch the language.

<ComponentPreview name="base/MenubarRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Menubar](https://base-ui.com/react/components/menubar#api-reference) documentation.

`Menubar` is styled on top of the Sveltery Base `Menubar` and `Menu` primitives, which own the roving focus between triggers, keyboard navigation, typeahead and dismissal. `MenubarMenu` and `MenubarSub` are the Base menu roots. `MenubarContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. `MenubarItem` takes `inset` and `variant` (`default` or `destructive`).
