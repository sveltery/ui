# Third-party notices

`src/lib/geometry.ts` is copied from [shadcn-ui/ui](https://github.com/shadcn-ui/ui) `packages/react/src/message-scroller/geometry.ts` (commit 30a58d4498f270af1c1e981a7d78a15cf5740841), with `.js` suffixes added to its imports. The scroll controller in `src/lib/scroller.svelte.ts` ports the behavior of that package's `use-message-scroller-controller.ts` and `use-message-scroller-commands.ts`: follow-bottom, turn anchoring with a tail spacer, prepend preservation, the opening position and visibility tracking. The component API, the constants in `src/lib/types.ts` and the tests in `tests/dom/message-scroller-geometry.test.ts` follow the same package. All of it is under the MIT License below.

MIT License

Copyright (c) 2023 shadcn

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
