# Local documentation and examples

This private SvelteKit app previews the bounded, unpublished Sveltery UI Dialog, Button and native Textarea and Skeleton. Start with the [SvelteKit installation/copy guide](../../docs/installation.md) for an independent consumer, the [Dialog API](../../docs/dialog.md) for adaptations, and [readiness gates](../../docs/readiness.md) for limits and review requirements.

## Run locally

From the repository root, use Node `>=24.15.0 <25` and pnpm `12.6.0` (or Corepack):

```sh
bash scripts/bootstrap.sh
source scripts/toolchain.sh
pnpm --filter @sveltery/ui build
pnpm --filter @sveltery/docs dev --port 5173
```

Open `http://127.0.0.1:5173`. `/dialog` is the Svelte interaction fixture; `/reference` is the pinned React comparison. `/button` is the minimal Button example and API/style fixture; `/button-reference` is the pinned React Button matrix. `/disabled-close` and `/native-content` exercise specific Base regressions. These are development fixtures, not a complete documentation site or parity claim.

## Source organization and credit

The structure follows the original [shadcn registry](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry):

| Path | Purpose |
| --- | --- |
| [registry/bases/base/ui/dialog](registry/bases/base/ui/dialog) | Ten Svelte Dialog wrappers |
| [registry/bases/base/ui/button](registry/bases/base/ui/button) | Styled Base Button and pinned variant/size API |
| [registry/bases/base/ui/textarea](registry/bases/base/ui/textarea) | Native styled Textarea |
| [registry/bases/base/ui/shared](registry/bases/base/ui/shared) | Shared class-merging helper and native close utility classes |
| [registry/styles/style-nova.css](registry/styles/style-nova.css) | Scoped Nova Dialog, Button and native Textarea styles |
| [examples/base](examples/base) | Svelte browser fixtures |
| [src/lib/theme.css](src/lib/theme.css) | Tailwind source registration and light theme tokens for this workspace |
| [../../packages/ui](../../packages/ui) | Packages the registry source without a second component copy |

Sveltery is independent and unofficial. Preserve the [original MIT credit](../../packages/ui/THIRD_PARTY_NOTICES.md) when deriving or copying wrappers/styles. The React fixtures also retain their [upstream license](../../tests/reference/LICENSE).

## Validate

From the repository root:

```sh
bash scripts/verify.sh
bash scripts/check-installation.sh
source scripts/toolchain.sh
pnpm exec playwright install chromium
pnpm test:browser
bash scripts/check-installation.sh --browser
```

The installation check extracts the exact scaffold from the guide, installs two fresh consumers outside the workspace, and checks/builds both archive and source-copy modes. `--browser` also runs the documented keyboard, labeling, focus-return, hydration and Nova-style checks in secured Chromium against those consumers. Hosted CI runs these alongside the existing regression suite. Browser installation or secured launch failures are blockers, not passing evidence; use a supported environment without changing sandbox policy. Review and CI must cover the final PR head before maintainers decide readiness and merge. Nothing here publishes packages or hosts the app.

`/textarea` previews five native Textarea states and form/binding probes; `/textarea-reference` executes the pinned React wrapper in the paired native scaffold. See [Textarea scope/provenance](../../docs/textarea.md).

`/skeleton` and `/skeleton-reference` execute the [bounded Skeleton examples](../../docs/skeleton.md), with avatar, text, form and table-shaped selections. Card composition remains deferred.
