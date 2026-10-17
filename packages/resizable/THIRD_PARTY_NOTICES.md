# Third-party notices

The layout algorithm in `src/lib/layout.ts` is ported from [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by Brian Vaughn, under the MIT License below. That covers clamping a panel size with its collapse threshold, validating a layout, and adjusting a layout by a delta across a pair of panels. The component markup, the document-level pointer handling (hit regions, the page cursor, drags across nested groups), the keyboard behavior and the separator ARIA values in `src/lib/Group.svelte`, `src/lib/Panel.svelte`, `src/lib/Separator.svelte`, `src/lib/group-state.svelte.ts` and `src/lib/interaction.svelte.ts` follow react-resizable-panels 4.5.8.

`src/lib/stacking-order.ts` is ported from react-resizable-panels' fork of [stacking-order](https://github.com/Rich-Harris/stacking-order) 2.0.0 by Rich Harris (Copyright (c) Rich Harris), also under the MIT License.

MIT License

Copyright (c) 2018 Brian Vaughn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
