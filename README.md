# Sveltery UI

Experimental, unreleased styled Svelte 5 Dialog and Button built on [Sveltery Base](https://github.com/sveltery/base), plus native Textarea, Skeleton and Kbd/KbdGroup requiring no Base primitive. The Dialog exports and bounded Button variants/sizes adapt the Base Dialog anatomy and Nova appearance from [shadcn-ui/ui at d75a96ab](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). Independent, unofficial project; not affiliated with MUI, Base UI, or shadcn. Original Sveltery code is [MIT](LICENSE); derived code retains [upstream notices](packages/ui/THIRD_PARTY_NOTICES.md).

The original implementation was preserved at recovery checkpoint `9614e55530eebb63ab735ebacb51848ff2e02f45`. This remains a bounded experimental slice, with no full wrapper or upstream behavior parity claim. Read [Textarea scope](docs/textarea.md), [Dialog adaptations](docs/dialog.md), [Button adaptations](docs/button.md) and [readiness gates](docs/readiness.md) before using it. The historical Base pin incorporates merged PR #13, the native focus fixes from PR #15 and standalone Button PR #17. The landed PR #13 checkout additionally consumes Base core audit repairs in PR #23 and reviewed Portal integration in PR #22, with consistent UI DOM-ref initialization; final UI browser CI and exact-head review remain required before readiness or merge.

```sh
bash scripts/bootstrap.sh
bash scripts/verify.sh
bash -c 'source scripts/toolchain.sh; pnpm exec playwright install chromium; pnpm test:browser'
```

Node >=24.15.0 <25 and pnpm 12.6.0 are required. Bootstrap rebuilds the private Base package from the exact Git SHA in [base.lock.json](scripts/base.lock.json), checks the tarball SHA-256, then installs the frozen workspace lockfile. No npm Base release is assumed. The package and local docs are private experiments; no publication or deployment is configured.

Source organization follows upstream: `apps/docs/registry/bases/base/ui/dialog` owns the ten Dialog wrappers and `apps/docs/registry/bases/base/ui/button` owns the styled Base Button, `apps/docs/registry/styles/style-nova.css` owns the scoped styles, and `apps/docs/examples/base` owns the examples. `packages/ui` packages that registry source rather than maintaining a second component copy. `/button` is the minimal Button example and style matrix; `/button-reference` renders the pinned React Button. `/dialog` is the Svelte example and `/reference` uses the actual pinned React primitives with the byte-exact upstream Dialog, Button and native Textarea wrappers.

Try the [SvelteKit installation and source-copy guide](docs/installation.md) for verified local archives, Nova prerequisites and a minimal accessible Dialog. See the [local docs app README](apps/docs/README.md) for fixture routes, source organization and validation commands.

The [upstream differences register](docs/upstream-differences.md) discloses inherited Base corrections, styled/API adaptations and the React 1.6.0 versus Base 1.8.0 evidence boundary.

The native `/textarea` and pinned `/textarea-reference` fixtures cover the bounded [Textarea slice](docs/textarea.md), owned by `registry/bases/base/ui/textarea` and exported through the current local archive.

The native `/skeleton` and pinned `/skeleton-reference` fixtures cover [Skeleton scope and omissions](docs/skeleton.md); the landed [SkeletonCard continuation](https://github.com/sveltery/ui/pull/19) adds the actual pinned Card shape; native Example/ExampleWrapper layout and full-gallery parity remain incomplete.

The native `/kbd` and pinned `/kbd-reference` fixtures cover [Kbd/KbdGroup scope and omissions](docs/kbd.md). The pinned group host remains `kbd`; display keys introduce no shortcut behavior.

The native `/table` and pinned `/table-reference` fixtures cover the [eight Table exports and Basic/Footer/Simple/With Badges examples](docs/table.md). With Badges uses six native spans; DropdownMenu, Select and Input compositions remain deferred; `/table-probe` and its paired reference exercise native semantics, refs and overflow.

The landed [native Card slice](docs/card.md) adds seven div parts, default/small sizes and seven actual dependency-available examples. It retains Table's actual landed main merge; five composition examples and full parity remain deferred. Card landed through [PR #17](https://github.com/sveltery/ui/pull/17); changed heads require fresh exact-head checks and independent/configured review.

The landed [native Label slice](docs/label.md) adds one native export and the bounded With Textarea example with documented native Field/Example substitutions; Checkbox/Input/Disabled compositions remain deferred.

The proposed native `/aspect-ratio` and paired `/aspect-ratio-reference` fixtures cover [AspectRatio](docs/aspect-ratio.md): the required ratio, exact source classes and caller-style replacement, with four bounded example bodies. Next Image and Example/ExampleWrapper framework scaffolds remain unimplemented.

The [native Empty slice](docs/empty.md) adds six div parts and supplemental `/empty-probe` and paired reference routes. All actual gallery functions remain deferred for missing configurable icons and/or InputGroup; source-derived native probes do not claim gallery parity.
