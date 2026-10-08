# Sveltery UI

Experimental, unreleased styled Svelte 5 Dialog and Button built on [Sveltery Base](https://github.com/sveltery/base), plus native Textarea, Skeleton and Kbd/KbdGroup requiring no Base primitive. The Dialog exports and bounded Button variants/sizes adapt the Base Dialog anatomy and Nova appearance from [shadcn-ui/ui at d75a96ab](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). Independent, unofficial project; not affiliated with MUI, Base UI, or shadcn. Original Sveltery code is [MIT](LICENSE); derived code retains [upstream notices](packages/ui/THIRD_PARTY_NOTICES.md).

The original implementation was preserved at recovery checkpoint `9614e55530eebb63ab735ebacb51848ff2e02f45`. This remains a bounded experimental slice, with no full wrapper or upstream behavior parity claim. Read [Textarea scope](docs/textarea.md), [Dialog adaptations](docs/dialog.md), [Button adaptations](docs/button.md) and [readiness gates](docs/readiness.md) before using it. The historical Base pin incorporates merged PR #13, the native focus fixes from PR #15 and standalone Button PR #17. The landed PR #13 checkout additionally consumes Base core audit repairs in PR #23 and reviewed Portal integration in PR #22, with consistent UI DOM-ref initialization; final UI browser CI and exact-head review remain required before readiness or merge.

```sh
bash scripts/bootstrap.sh
bash scripts/verify.sh
bash -c 'source scripts/toolchain.sh; pnpm exec playwright install --with-deps chromium firefox webkit; pnpm test:browser'
```

Node >=24.15.0 <25 and pnpm 12.6.0 are required. Bootstrap consumes the committed, private Base archive recorded in [base.lock.json](scripts/base.lock.json), verifies its SHA-256 and frozen-lock SHA-512 before installing the frozen workspace lockfile, and does not clone or build Base. No npm Base release is assumed. The package and local docs are private experiments; no publication or deployment is configured. The [frozen dependency delivery contract](docs/frozen-base-delivery.md) records the archive rebuilt from immutable Base `ea4e108e14ae8a73140bb7a360bc32454b19da4a`, after Base's restart; the [restart adoption](docs/upstream-differences.md#proposed-base-restart-adoption) records what changed. The archive adds no styled wrappers and does not fix the blocked native Input checked/reset cases.

Source organization follows upstream: `apps/docs/registry/bases/base/ui/dialog` owns the ten Dialog wrappers and `apps/docs/registry/bases/base/ui/button` owns the styled Base Button, `apps/docs/registry/styles/style-nova.css` owns the scoped styles, and `apps/docs/examples/base` owns the examples. `packages/ui` packages that registry source rather than maintaining a second component copy. `/button` is the minimal Button example and style matrix; `/button-reference` renders the pinned React Button. `/dialog` is the Svelte example and `/reference` uses the actual pinned React primitives with the byte-exact upstream Dialog, Button and native Textarea wrappers.

Try the [SvelteKit installation and source-copy guide](docs/installation.md) for verified local archives, Nova prerequisites and a minimal accessible Dialog. See the [local docs app README](apps/docs/README.md) for fixture routes, source organization and validation commands.

The [complete pinned registry catalog](docs/catalog.md) records all 62 original source entries, exact source/anatomy, locked dependency blockers and separate test provenance. The [current target selection](docs/target-scope.md) uses Base Toast, Combobox and Drawer and excludes the separate Command/cmdk and Sonner entries. Scope exclusions do not count as completed components.

The [upstream differences register](docs/upstream-differences.md) discloses inherited Base corrections, styled/API adaptations and the React 1.6.0 versus Base 1.8.0 evidence boundary. The [upstream test inventory](docs/upstream-tests.md) distinguishes actual shadcn suites, separately pinned Base UI conformance and local source-derived probes.

The proposed [three-engine acceptance gates](docs/browser-engines.md) run the retained main and fresh-consumer suites in Chromium, Firefox and WebKit. Configured inventory does not establish successful execution or complete the deferred component/gallery scopes.

The native `/textarea` and pinned `/textarea-reference` fixtures cover the bounded [Textarea slice](docs/textarea.md), owned by `registry/bases/base/ui/textarea` and exported through the current local archive.

The native `/skeleton` and pinned `/skeleton-reference` fixtures cover [Skeleton scope and omissions](docs/skeleton.md); the landed [SkeletonCard continuation](https://github.com/sveltery/ui/pull/19) adds the actual pinned Card shape; the selected gallery now uses the genuine Example/ExampleWrapper helpers from [PR #28](https://github.com/sveltery/ui/pull/28), with broader theme/gallery parity still incomplete.

The native `/kbd` and pinned `/kbd-reference` fixtures cover [Kbd/KbdGroup scope and omissions](docs/kbd.md). The pinned group host remains `kbd`; display keys introduce no shortcut behavior. Both icon functions remain unimplemented despite available helpers; InputGroup/Tooltip still require missing styled components.

The native `/table` and pinned `/table-reference` fixtures cover the [eight Table exports and Basic/Footer/Simple/With Badges examples](docs/table.md). With Badges uses six native spans; DropdownMenu, Select and Input compositions remain deferred; `/table-probe` and its paired reference exercise native semantics, refs and overflow.

The landed [native Card slice](docs/card.md) adds seven div parts, default/small sizes and seven selected actual example bodies under an unmigrated Example scaffold. It retains Table's actual landed main merge; five compositions remain unimplemented. Both image functions now have available helpers; Custom Spacing/Login/Meeting Notes still need styled ToggleGroup/Field/Input/Avatar parts. Card landed through [PR #17](https://github.com/sveltery/ui/pull/17); changed heads require fresh exact-head checks and independent/configured review.

The landed [native Label slice](docs/label.md) adds one native export and the bounded With Textarea example with documented native Field/Example substitutions; Checkbox/Input/Disabled compositions remain deferred.

The proposed native `/aspect-ratio` and paired `/aspect-ratio-reference` fixtures cover [AspectRatio](docs/aspect-ratio.md): the required ratio, exact source classes and caller-style replacement, with four bounded example bodies. The genuine Example/ExampleWrapper helpers are available but unmigrated in this gallery; Next Image remains a separate recorded framework substitution.

The [native Empty slice](docs/empty.md) adds six div parts and supplemental `/empty-probe` and paired reference routes. All six original gallery functions remain unimplemented. Basic/Muted Background/Icon/In Card now have available native helpers; Border/Muted Background Alt still require styled InputGroup parts. Source-derived native probes do not claim gallery parity.

The landed [native Alert slice](docs/alert.md) adds Alert, AlertTitle, AlertDescription and AlertAction, with `/alert` and paired `/alert-reference` fixtures for the bounded Basic example. With Icons/Destructive remain unimplemented despite available Example/icon helpers; With Actions still requires styled Badge, and Basic's scaffold is unmigrated. Full scaffold/theme parity remains incomplete; `/alert-probe` and its paired reference provide supplemental native selector and interaction evidence.

The proposed [native styled Separator](docs/separator.md) delegates the actual Base primitive and preserves the original wrapper classes under the complete genuine support CSS. All four genuine dependency-available gallery functions use the original Example helpers. Primitive genuine test ports and styled source-derived evidence are counted separately.
