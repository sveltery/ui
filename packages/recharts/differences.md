# Differences from recharts

@sveltery/recharts ports [recharts](https://github.com/recharts/recharts) 3.8.0 to Svelte 5. It matches recharts' DOM and mechanism, and differs only where Svelte cannot do what React does or where recharts is plainly broken. Each entry names the upstream file and line at [`v3.8.0`](https://github.com/recharts/recharts/tree/v3.8.0/src), what this port does instead, and why.

## API

### Hooks return a box

**Upstream:** Hooks return values, for example `useChartWidth(): number | undefined` in [`context/chartLayoutContext.tsx:95`](https://github.com/recharts/recharts/blob/v3.8.0/src/context/chartLayoutContext.tsx#L95). The component re-renders when the value changes and calls the hook again.

**Here:** Hooks return `Box<T> = { readonly current: T }`. Read `.current` in the template, a `$derived` or an effect, and it stays live.

**Why:** A Svelte component runs its script once. A plain value read at initialisation would never change.

### `class` instead of `className`

**Upstream:** Charts and components take `className`, for example [`chart/CartesianChart.tsx:83`](https://github.com/recharts/recharts/blob/v3.8.0/src/chart/CartesianChart.tsx#L83).

**Here:** They take `class`. Snippet arguments carry `class` too. Inside the port, components read the React name and `attrs()` writes the DOM attribute, so the rendered markup is the same.

**Why:** `class` is the attribute name in Svelte, and `className` on a Svelte element would be written to the DOM as is.

### Snippets instead of elements and render functions

**Upstream:** Children are React nodes, and render props are elements or functions, for example `children: (time: number) => ReactNode` in [`animation/JavascriptAnimate.tsx:22`](https://github.com/recharts/recharts/blob/v3.8.0/src/animation/JavascriptAnimate.tsx#L22).

**Here:** Children and render props are snippets, and a snippet receives what upstream's function would receive. That covers Bar's `shape`, `activeBar` and `background`, the `dot` and `activeDot` of Line, Area and Radar, Pie's `shape`, `activeShape`, `inactiveShape`, `label` and `labelLine`, the `shape` of Radar and RadialBar, RadialBar's `activeShape` and `background`, the `content` of Label, LabelList, Tooltip and Legend, Tooltip's `cursor` and the axes' `tick`. Where upstream clones an element with the parent's props, the snippet gets the same merged props and places the spread itself. Tooltip and Legend give the parent's props the last word ([`component/Tooltip.tsx:60`](https://github.com/recharts/recharts/blob/v3.8.0/src/component/Tooltip.tsx#L60), [`component/Legend.tsx:43`](https://github.com/recharts/recharts/blob/v3.8.0/src/component/Legend.tsx#L43)), so `<Content own {...props} />` matches them. A shape element's own props win in [`util/ActiveShapeUtils.tsx:94`](https://github.com/recharts/recharts/blob/v3.8.0/src/util/ActiveShapeUtils.tsx#L94), so there the spread goes first.

A Pie `label` snippet renders its own markup. Upstream's label function may return a string or a number instead of an element, and Pie then wraps it in a `Text` with the class `recharts-pie-label-text` ([`polar/Pie.tsx:569-583`](https://github.com/recharts/recharts/blob/v3.8.0/src/polar/Pie.tsx#L569-L583)). A snippet that wants that text renders `Text` itself.

**Why:** Svelte has no element values to pass around or clone, and a snippet renders markup, so it cannot hand a value back.

## Mechanism

### Cells register through context

**Upstream:** A graphical item finds its cells by walking its children with `findAllByType(props.children, Cell)`, for example [`cartesian/Bar.tsx:955`](https://github.com/recharts/recharts/blob/v3.8.0/src/cartesian/Bar.tsx#L955). The cells come back in the order they are written.

**Here:** A graphical item provides a cell registry through context, and each `Cell` registers there during initialisation. A registered entry has upstream's element shape (`{ type: Cell, props, key: null }`), so the vendored selectors read it unchanged. A cell whose props change keeps its place. A cell added to a list joins the end, so a cell inserted in the middle of a keyed `{#each}` lands last. Key the cells by index, or leave the `{#each}` unkeyed, which is what upstream's `data.map((entry, index) => <Cell key={`cell-${index}`} />)` amounts to.

**Why:** Svelte children are an opaque snippet. Nothing can walk them.

### Graphical item ids come from `$props.id()`

**Upstream:** A generated id is `recharts-<type>-` followed by React's `useId()`, in [`util/useUniqueId.ts:18-25`](https://github.com/recharts/recharts/blob/v3.8.0/src/util/useUniqueId.ts#L18-L25).

**Here:** The suffix comes from `$props.id()`. An `id` prop still wins, as upstream.

**Why:** `$props.id()` is Svelte's server-stable id. Its format differs from React's, so generated ids differ in their suffix.

### The clip path id is taken once per chart

**Upstream:** [`container/ClipPathProvider.tsx:19`](https://github.com/recharts/recharts/blob/v3.8.0/src/container/ClipPathProvider.tsx#L19) builds `` `${uniqueId('recharts')}-clip` `` as `useState`'s initial value on every render. `useState` keeps the first id, but the global counter advances on each render, so the ids of charts mounted later depend on how often earlier charts rendered.

**Here:** Each chart takes one id when it is created, so ids follow mount order. On a page where every chart mounts and renders once, the ids are the same as upstream's.

**Why:** Svelte runs the script once, and the extra increments are a render-count side effect, not behavior anyone relies on.

### Portals are separate Svelte roots

**Upstream:** `ZIndexLayer` renders its children into the layer's `g` with `createPortal`, in [`zIndex/ZIndexLayer.tsx:109`](https://github.com/recharts/recharts/blob/v3.8.0/src/zIndex/ZIndexLayer.tsx#L109). The portal stays part of the parent's tree.

**Here:** `Portal` mounts the content as a child root in the target, with the contexts of the place it is declared (`getAllContexts()`), and unmounts it on teardown. The content sees the same contexts and lands in the same `g`. It mounts in the portal's effect, one flush after the component that declares it.

**Why:** Svelte cannot render part of a component's template into another element.

### Values entering the store are copies

**Upstream:** Data and settings go into the redux store by reference, for example `state.chartData = castDraft(action.payload)` in [`state/chartDataSlice.ts:59`](https://github.com/recharts/recharts/blob/v3.8.0/src/state/chartDataSlice.ts#L59). Immer then deep-freezes them, so the caller's `data` array and its items are frozen after the first render.

**Here:** Values from props pass through `toStoreValue`, which copies plain objects and arrays and keeps functions, class instances, DOM nodes and already-frozen values by reference. The store freezes the copy, and the caller's data stays mutable. Because the copy reads every nested field inside an effect, mutating a `$state` data array updates the chart.

**Why:** Freezing a Svelte `$state` proxy throws, so passing reactive data would crash the chart.

### Registration effects run before paint

**Upstream:** Components register with the store in `useEffect`, for example [`context/chartDataContext.tsx:12-23`](https://github.com/recharts/recharts/blob/v3.8.0/src/context/chartDataContext.tsx#L12-L23). React runs these after the browser paints the first frame.

**Here:** The same registrations run in `$effect`, in the same order, which Svelte flushes in a microtask before the browser paints. The store's notifications are batched to the next animation frame in both, so the DOM at rest is the same. Only intermediate frames can differ.

**Why:** Svelte has no after-paint effect.

### Tooltip and Legend portals go in front of the svg

**Upstream:** Tooltip and Legend portal into the chart's wrapper div with `createPortal`, in [`component/Tooltip.tsx:408`](https://github.com/recharts/recharts/blob/v3.8.0/src/component/Tooltip.tsx#L408) and [`component/Legend.tsx:265`](https://github.com/recharts/recharts/blob/v3.8.0/src/component/Legend.tsx#L265). In the rendered DOM the portal content comes before the svg.

**Here:** The portals mount after the svg exists, so they insert their content before the wrapper's `svg` child. A `portal` prop still appends to the element it names.

**Why:** A Svelte portal mounts in an effect, one flush after the svg. Without the anchor it would land after the svg, and the DOM order would differ from upstream's.

### Animation ids compare props shallowly

**Upstream:** `useAnimationId` issues a new id whenever the props object differs by reference, in [`util/useAnimationId.tsx:18-26`](https://github.com/recharts/recharts/blob/v3.8.0/src/util/useAnimationId.tsx#L18-L26). Props are a new object on every render, so every render of the parent starts a new animation.

**Here:** It takes a getter and issues a new id when the returned object differs shallowly from the last one. Bar passes all its props, Line its points and Area its points and baseline, as upstream's callers do.

**Why:** Svelte has no re-render, so a reference check would never fire, and a fresh object per read would fire on every frame. A shallow check fires when upstream's inputs change.

### Refs read during render are read on the render's triggers

**Upstream:** The animated items keep the last frame in a ref, write it while rendering a frame and read it when the component renders, for example `previousRectanglesRef` in [`cartesian/Bar.tsx:780`](https://github.com/recharts/recharts/blob/v3.8.0/src/cartesian/Bar.tsx#L780) and [`cartesian/Bar.tsx:848`](https://github.com/recharts/recharts/blob/v3.8.0/src/cartesian/Bar.tsx#L848). The component renders when a new animation starts and when the animation starts or ends.

**Here:** The ref is a plain variable that the frame writes, read through a `$derived` that depends on the animation id and the animating flag. It sees the same values at the same moments as upstream's render.

**Why:** A `$state` ref written during a frame would make each frame depend on the last one and loop. A plain variable read in the template would never update.

### RadialBar's labels and children stay mounted across animations

**Upstream:** `RadialBarSectors` renders the `RadialBarLabelListProvider`, the label list from the `label` prop and the RadialBar's children on every animation frame, around the frame's sectors ([`polar/RadialBar.tsx:141-184`](https://github.com/recharts/recharts/blob/v3.8.0/src/polar/RadialBar.tsx#L141-L184)). React keeps the children mounted from frame to frame.

**Here:** The provider, the label list and the children sit beside the keyed animation block, with the final sectors, and only the sectors render per frame. They show and hide on the same animating flag, so the DOM at rest and during the animation is the same. Only the first render of an animated RadialBar differs: before the animation's start callback hides the labels, they sit at the final sectors, where upstream places them at the frame-zero sectors.

**Why:** A new animation id remounts the keyed block. Cells among the children would unregister and register again, which builds a new cells array, new sectors and a new animation id, and the animation would restart forever.
