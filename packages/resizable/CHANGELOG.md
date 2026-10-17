# Changelog

## 0.2.0

Breaking. The package now runs react-resizable-panels 4.5.8's own framework-free code, and its API follows upstream.

- Bind `groupRef` for `getLayout` and `setLayout`, `panelRef` for the panel methods, and `elementRef` for the element. Use `useDefaultLayout` to persist a layout.
- Removed: `bind:layout`, `savedLayout`, the exported layout helpers, `collapsedThreshold`, `isUserInteraction`, the separator's `disabled` and `disableDoubleClick`, and `data-collapsed`.
- Group, Panel and Separator render upstream's markup. Panel wraps its content in an inner element that takes `class` and `style`.
- Pointer handling moves to the document, with hit regions around each separator and one drag across nested groups. A drag expands a collapsed panel once it passes `minSize`.
- `resize()` takes every size unit, as upstream's 4.11.0 fix does.

## 0.1.0

First release.
