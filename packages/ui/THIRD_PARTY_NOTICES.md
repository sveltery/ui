# Third-party notices

Dialog and Button anatomy, Nova styles, executable style assertions and the React reference wrappers are derived from shadcn-ui/ui commit d75a96ab781f3d659be1ad287347d5887ce9f2fc. Source: https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry

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

The native Textarea wrapper, five-state example and scoped Nova Textarea styles derive from shadcn-ui/ui `d75a96ab781f3d659be1ad287347d5887ce9f2fc`, under the MIT notice above. Byte-exact source fixtures and hashes are recorded in `tests/reference/textarea-sources.json`; comparison tests are source-derived/local, not upstream Textarea test ports.

The native Skeleton wrapper, selected avatar/text/form/table-shaped examples and scoped Nova Skeleton styles derive from the same immutable shadcn-ui/ui commit under the MIT notice above. Source files, hashes and selection provenance are recorded in `tests/reference/skeleton-sources.json`; tests are source-derived local comparisons, not copied upstream tests. Card composition is deferred.

The native Kbd/KbdGroup wrappers, basic/modifier/grouped/arrows/samp examples and scoped Nova rules derive from the same immutable shadcn-ui/ui commit under the MIT notice above. Byte-exact source fixtures and hashes are in `tests/reference/kbd-sources.json`; comparison tests are source-derived local assertions. InputGroup, Tooltip and icon compositions remain deferred.

The eight native Table wrappers, Basic/Footer/Simple examples and scoped Nova Table styles derive from the same shadcn-ui/ui pin under the MIT notice above. Byte-exact wrapper, complete example and CSS hashes are recorded in `tests/reference/table-sources.json`; the paired assertions are source-derived/local rather than upstream Table test ports.
The seven native Card parts, seven selected actual examples and scoped Nova Card rules derive from the same immutable shadcn-ui/ui commit under the MIT notice above. Source files and hashes are in `tests/reference/card-sources.json`; comparison tests are source-derived local assertions. ToggleGroup, Field/Input, Avatar and icon compositions remain deferred.

The native Label wrapper, bounded With Textarea example and scoped Nova rules derive from the same immutable shadcn-ui/ui pin under the MIT notice above. Byte-exact source files and hashes are in `tests/reference/label-sources.json`; assertions are source-derived local probes. Native sections/headings/div replace Example/ExampleWrapper/Field; Checkbox/Input/Disabled compositions remain deferred.

The native AspectRatio wrapper and four selected ratio examples derive from the same immutable shadcn-ui/ui pin under the MIT notice above. Byte-exact wrapper/example sources and hashes are in `tests/reference/aspect-ratio-sources.json`; assertions are source-derived local comparisons. Native sections and img fill styling substitute Example/ExampleWrapper and Next Image; optimizer/loading/framework scaffold parity is unimplemented.

The four native Alert div wrappers, selected Basic example and scoped Nova rules derive from the same immutable shadcn-ui/ui pin under the MIT notice above. Exact bytes and hashes are in `tests/reference/alert-sources.json`; assertions are local and source-derived. Native sections/headings replace Example/ExampleWrapper. With Icons, Destructive and With Actions example compositions remain deferred due to missing configurable icons and Badge.

The six native Empty wrappers and scoped Nova Empty rules derive from the same immutable shadcn-ui/ui pin under the MIT notice above. Byte-exact wrapper, full unimplemented example source and scoped CSS hashes are in `tests/reference/empty-sources.json`. Assertions are source-derived local probes, not copied upstream tests or actual gallery ports. All six gallery compositions remain deferred for missing configurable icons and/or InputGroup. EmptyDescription keeps its actual div host despite the upstream paragraph-props annotation.

The proposed native Input wrapper, exact complete unimplemented gallery source and Nova Input section derive from shadcn-ui/ui `d75a96ab781f3d659be1ad287347d5887ce9f2fc` under the MIT notice above. Byte-exact fixtures/hashes are recorded in `tests/reference/input-sources.json`. Local wrapper comparisons are source-derived; separately executed Base React1.6 shared conformance bodies and raw sources retain the full Material-UI SAS MIT license in `tests/reference/base-input-1.6/UPSTREAM_LICENSE`. Their immutable release is `b34551d644f2e58ebf8fc1050d949f6654ceca6c`; they are not shadcn Input ordinary tests. The Base native checked-state dependency remains merge blocked and no intentional behavior repair is applied in UI.
