# Changelog

## 0.2.0

The port now matches cmdk 1.1.1's DOM.

- Items that do not match unmount, and the rest render in cmdk's ranked order. Each part leaves an anchor comment, and its List or Group renders it.
- Focus moves only when this menu's input or root has focus. A List outside Root keeps its markup order, and a Root nested in another List renders its parts in place.
- Group trims its value, as cmdk does.

## 0.1.0

First release.
