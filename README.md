# Sveltery UI

Experimental, unreleased styled Svelte 5 Dialog and Button built on [Sveltery Base](https://github.com/sveltery/base). The Dialog exports and bounded Button variants/sizes adapt the Base Dialog anatomy and Nova appearance from [shadcn-ui/ui at d75a96ab](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). Independent, unofficial project; not affiliated with MUI, Base UI, or shadcn. Original Sveltery code is [MIT](LICENSE); derived code retains [upstream notices](packages/ui/THIRD_PARTY_NOTICES.md).

The original implementation was preserved at recovery checkpoint `9614e55530eebb63ab735ebacb51848ff2e02f45`. This remains a bounded experimental slice, with no full wrapper or upstream behavior parity claim. Read [Dialog adaptations](docs/dialog.md), [Button adaptations](docs/button.md) and [readiness gates](docs/readiness.md) before using it. The Base pin incorporates merged PR #13, the native focus fixes from PR #15 and standalone Button PR #17; final UI browser CI and exact-head review remain required before readiness or merge.

```sh
bash scripts/bootstrap.sh
bash scripts/verify.sh
bash -c 'source scripts/toolchain.sh; pnpm exec playwright install chromium; pnpm test:browser'
```

Node >=24.15.0 <25 and pnpm 12.6.0 are required. Bootstrap rebuilds the private Base package from the exact Git SHA in [base.lock.json](scripts/base.lock.json), checks the tarball SHA-256, then installs the frozen workspace lockfile. No npm Base release is assumed. The package and local docs are private experiments; no publication or deployment is configured.

Source organization follows upstream: `apps/docs/registry/bases/base/ui/dialog` owns the ten Dialog wrappers and `apps/docs/registry/bases/base/ui/button` owns the styled Base Button, `apps/docs/registry/styles/style-nova.css` owns the scoped styles, and `apps/docs/examples/base` owns the examples. `packages/ui` packages that registry source rather than maintaining a second component copy. `/button` is the minimal Button example and style matrix; `/button-reference` renders the pinned React Button. `/dialog` is the Svelte example and `/reference` uses the actual pinned React primitives with the byte-exact upstream Dialog and Button wrappers.

Try the [SvelteKit installation and source-copy guide](docs/installation.md) for verified local archives, Nova prerequisites and a minimal accessible Dialog. See the [local docs app README](apps/docs/README.md) for fixture routes, source organization and validation commands.
