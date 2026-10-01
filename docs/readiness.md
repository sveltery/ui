# Dialog readiness

Recovery checkpoint: `9614e55530eebb63ab735ebacb51848ff2e02f45`, based on UI main `2c1290d650936a4ad482ae37072eb30dd7513082`. Existing refs and the disconnected task are preserved. Continuation uses a separate branch and worktree.

## Blocking gates

- Preserve the three native interactive-content browser regressions and pass them with the corrected verified Base pin below. The previous pin omitted summaries and valid contenteditable values, wrapping Tab at a preceding Close. No UI focus shim, explicit tabindex on native targets, weakened assertion or skipped test is allowed.
- Verify Base pin `de6b35688d23c818dd240e9b73eee6bce53e0490`, whose merge parents are main `ed9a00305c9c000625127c5122bec0499a2ed8d8` and reviewed [PR #15](https://github.com/sveltery/base/pull/15) head `755fd2859f90f4e42714c5d97ea5d1d323f6e4a0`. It also retains [PR #13](https://github.com/sveltery/base/pull/13). Preserve the canceled deferral and disabled Close anchor assertions that exposed the earlier defects; no UI workaround, skip or weakened assertion is allowed.
- Pass lint, public type checks, actual Svelte DOM tests, SSR/client build and isolated tarball consumption.
- Pass hosted real Chromium keyboard, hydration, animation exit/reopen and computed Nova style tests on the final head, sandbox enabled and retries zero.
- Obtain an independent GPT-6.1-Sol high review of the final head, address all findings, and confirm automatic Codex review is Completed on that same head with all comments addressed.
- Parent decides readiness and merge only after the gates pass. No publication, deployment, credential changes, or protection bypass is authorized.

## Recovery observations

Fresh environment: Node 24.19.0, pinned pnpm 12.6.0. Remote checkpoint inventory and source access succeeded. The pinned Base tarball rebuilt with SHA-256 `28c31e70166bcbe07e8956715fbf1f84a9f7011b80f0842aa3456bbe0903a600`, matching the original checkpoint. Upstream Dialog and Button reference files match shadcn commit d75a96ab byte for byte.

Local `/usr/lib/chromium/chrome-sandbox` is mode 4755 and owned by nobody, so a supported secured browser is required for local execution. The existing Base hosted Ubuntu 22.04 setup supplies the browser CI model. No sandbox flags, system permissions, network policy or credentials are changed to get a passing result.

Execution results and review evidence will be recorded with exact commit SHAs. Prior checks or an earlier review do not establish readiness of a changed head.

Base PR #15's merge was verified against the remote main ref and local Git object parents before updating the source pin. Its complete source tree matches reviewed head `755fd2859f90f4e42714c5d97ea5d1d323f6e4a0`; [post-merge CI](https://github.com/sveltery/base/actions/runs/36893546708) passed Standards, Verification and all 189 secured browser cases. The archive SHA-256 is `04ef536d7c688dee1d6ad49a869b75f50f8ff6ea7454a2241bd4a7ba9fd09f7f`; the original baseline checksum above records recovery provenance.

The preserved DOM assertions pass after refreshing the file dependency's integrity (`pnpm update @sveltery/base --recursive --lockfile-only`) and the frozen install. A lockfile-only generic install initially retained the previous archive resolution; bootstrap/verify now explicitly compare the lockfile integrity to the independently verified archive before acceptance.

Automatic review found inconsistent peer settings in the old `.npmrc` and lockfile. The pinned pnpm 12 toolchain uses [workspace configuration](https://pnpm.io/settings) for these non-authentication settings: `engineStrict: true` and `autoInstallPeers: false` now live in `pnpm-workspace.yaml`, and the regenerated lockfile records `autoInstallPeers: false`. The obsolete `.npmrc` is removed; dependency versions and package resolutions are unchanged. Effective configuration, full bootstrap with a frozen install, and full verification are checked again for this correction.

## Historical continuation validation before the native focus audit

`bash scripts/verify.sh` passes on Node 24.19.0 / pnpm 12.6.0: archive and lock integrity, ESLint, library packaging, both Svelte/type checks (zero errors or warnings), all 10 actual DOM tests, docs SSR/client production build, isolated UI tarball SSR consumption and public type assertions, license/CSS/declaration presence and documentation checks. Source `svelte-package` required the library's explicit tsconfig to emit declarations; the consumer now requires and compiles those declarations outside the workspace.

`pnpm exec playwright test --list` discovers 12 browser tests. Official Chromium installation returns HTTP 403 from cdn.playwright.dev. A single secured local launch with `/usr/bin/chromium` aborts with SIGABRT at `setuid_sandbox_host.cc:166` before interactions, confirming the helper ownership blocker above. These are blocked executions, not passing browser evidence. Hosted CI and independent/automatic reviews are still pending at this checkpoint.

The first hosted browser run at `4f6a50d` executed secured Chromium and exposed fixture issues: tests interacting before hydration, a reactive attachment-counter feedback loop, a generic-role expectation for text in a polite live region, and an initially open fixture without an assigned Trigger owner. Follow-up waits for actual hydration, counts attachments through `untrack`, expects the native text accessibility snapshot, and explicitly supplies the initial Trigger ID/owner through supported Base props. The original Base regression assertions remain unchanged. Final hosted execution and independent review must cover this follow-up head.

## Native focus regression evidence

The [hosted baseline run](https://github.com/sveltery/ui/actions/runs/36886122710) at UI `509052213a42ae9549c67f8d63805c385466fe83` with Base `08d2790571eb54440b9e61d13917bc433aa92de8` passed the original 12 browser cases and failed all three new native interactive-content cases at the first trusted Tab from Close. Targets are an explicit summary in open details, `contenteditable=""`, and `contenteditable="plaintext-only"`. No target tabindex, focus shim or changed original assertion was added. Final acceptance must rerun these preserved assertions with the corrected verified Base pin; the bounded [focus limits](dialog.md) remain documented.

## Bounded Button continuation

UI baseline `a1a60b8598c03dc50f76cf03be91a7ac9511ec55` adds the installation guide. The Button slice advances Base to merged PR #17 at `4dd04e495fc9f5bb6a0bb872fe103563d49535b1`, with archive SHA-256 `0f15a815e69e8553b2c67f8b5315ee7334c8b001cc0fcf1efde09c5e5c4289d6`; Dialog and overlay source trees are unchanged from the previously verified pin. Bootstrap rebuilds and compares both checksum and lock integrity. Preserve all existing Dialog regressions and fresh installation consumer gates.

The [Button scope and provenance](button.md) add six variants, eight sizes, Svelte render/class/ref composition, native forms and disabled/focus behavior. Style assertions were committed first. Final-head local/hosted evidence and both reviews are recorded in the draft PR; this ledger does not substitute earlier results for final-head evidence. No merge, deployment, publication, credentials, permissions or security change is authorized.

## Bounded native Textarea continuation

Continue verified UI main `cfb9b42f3f1d2ff672d6609bf947faa088d68bd1` with [native Textarea](textarea.md), preserving Base `4dd04e495fc9f5bb6a0bb872fe103563d49535b1`, its archive and the frozen lockfile. The pinned shadcn wrapper and Nova rule require no missing Base primitive. Scope includes the five native example states, source-derived paired comparisons, refs/attachments/binding/forms, package exports, fresh consumers, mobile/desktop light styles and retained Button/Dialog regressions. It does not assert a copied upstream Textarea test inventory. Full local and secured hosted CI, independent exact-head GPT-6.1 Sol high review and completed configured automatic review remain gates recorded in the draft PR. Parent holds merge; no publication, deployment, settings or security change is authorized.
