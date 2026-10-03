# Contributing

Sveltery UI contains a bounded experimental subset of the modern shadcn Base registry. The [implementation audit](docs/source-fidelity-audit.md) records the eleven landed families at its immutable checkpoint. Keep readiness blocked until the relevant [Sveltery Base](https://github.com/sveltery/base) foundations and browser behavior are proven. Keep this repository's current status explicit; documentation checks do not establish component functionality.

For documentation changes, use Node >=24.15.0 <25 and run:

```sh
node .github/check-docs.mjs
```

The `Documentation` CI check validates the MIT license notice, required project documents, local Markdown file links and whitespace. It does not install dependencies, build an app or run component tests. Keep links relative where possible, use LF line endings and end text files with a newline.

Open a focused pull request explaining the change and recording validation. Obtain independent review of the final head and verify the hosted check for that same SHA before merge. Preserve any upstream attribution when adding derived materials.

Executable changes require pinned dependency tooling, lint, types, runtime tests, SSR/client builds, package-consumer checks and real browser behavior tests in the same reviewed setup. Run `bash scripts/bootstrap.sh` and `bash scripts/verify.sh`, plus secured browser CI. Read [readiness gates](docs/readiness.md). Use idiomatic Svelte state and derived values, effects only for external synchronization, and reliable cleanup. Include cancellation and callback-order assertions where applicable. Publication or deployment requires separate, explicit approval; no release process is active for this placeholder.

Proposed `main` protection, to apply only after a green hosted check and exact maintainer approval: require PRs, require the `Documentation` check with branches up to date, resolve review conversations, block force pushes and deletion, and apply to administrators. Use zero mandatory GitHub human approvals while operating with a single maintainer; keep independent source review in the merge procedure. This proposal does not assert settings are active.

## Upstream porting policy

The pinned upstream is the implementation and behavior reference. Reproduce questioned behavior against that exact pin before changing the port. Preserve upstream behavior first, including suspected bugs. Track verified bugs shared with upstream in this repository's GitHub issues for later work; link the reproducer and source pin. Do not silently fix them while porting.

Keep three categories separate: fidelity repairs restore the pinned behavior; intentional differences change it, including local bug fixes; unimplemented scope remains incomplete and blocked. Neither merging a PR nor passing an assertion with a different expected result establishes approval or parity.

For every intentional difference, record the source and immutable pin, observable upstream and local behavior, rationale, test/run evidence, landed PR (or proposed PR until landing), and truthful decision status in the compatibility register. Record framework/API substitutions as well as behavioral fixes. Keep landed status separate from a specific acceptance decision; cite a recorded decision or state that one is not recorded. Divergent assertions earn no parity credit. Preserve MIT notices and assertion provenance, and retain explicit incomplete-parity limits.

Use the [upstream differences](docs/upstream-differences.md) as the central index, with links to feature-specific evidence and remaining scope.

## Source-first implementation workflow

Read the [current target selection](docs/target-scope.md) before interpreting the historical source inventory or choosing work. The separate Command and Sonner entries are excluded from current delivery; selected Toast, Combobox and Drawer follow their actual Base-native originals. Do not introduce a Command facade, cmdk/Sonner/Vaul port or substitute engine for this selection. All other selected families retain their original source contracts and readiness gates.

Before writing executable code:

1. Read the complete original file at the immutable shadcn pin, its transitive internal helpers, external imports, registry metadata and relevant global/component CSS. Read the actual consumed Base API rather than assuming version or API equivalence. Record the source paths, immutable pins and authenticated original bytes.
2. Map every changed export/helper to its primitive or native host, internal/external dependencies, child composition, branches/defaults, variants, literal class/selectors and caller prop spread order. Identify missing prerequisites before substituting anything. Missing functionality remains blocked scope.
3. Reuse the same framework-independent packages and recorded versions. Translate React-only bindings into native Svelte components; keep the original helper/component graph where available. Use a render snippet for a supported composition API rather than copying another component's classes. Keep headless state machines and primitive behavior in the separately managed Base dependency.
4. Describe each necessary React-to-Svelte change in refs/attachments, native events, snippets, CSS representation, binding and file boundaries. Additional APIs, callback semantics, caches, renderer loading policy, default styles or condensed helpers are intentional differences, not automatic framework exceptions. Record them in the [compatibility register](docs/upstream-differences.md) and affected contracts with evidence and actual acceptance status. Preserve the scope of earlier explicit decisions.
5. Port genuine immutable upstream tests when they exist and retain their expectations. Keep dependency conformance, source-derived supplemental checks, copied original runtime suites and reference-only executions separate. A test harness must use the genuine available helpers, packages and global CSS; a paired handmade substitute cannot establish original source/composition fidelity. Reproduce suspected original defects with the complete pinned source and environment before labeling them shared bugs.

Include this mapping in the PR description or a linked tracked contract. Use one row for each changed component/helper, and identify all affected parts when a family contains several exports:

| Original immutable source/export | Local source/export | Host, dependencies and composition | Branches/defaults, variants/classes and spread order | Required framework translation or intentional difference | Independent source and runtime evidence |
| --- | --- | --- | --- | --- | --- |
| Full pin, path and named export/helper | Production path and named export/helper | Original → local correspondence; missing scope separately | Original → local correspondence, including override precedence | Reason and compatibility decision link/status | Exact-head review and relevant checks; provenance category |

Independent review must read the original implementation and compare the mapping with actual production code at the final PR head. It must cover imports and helper composition, not only fixture hashes, class lists or rendered snapshots. Reviewers must check that any independent reference retains the actual source implementation and available dependency/CSS environment, and that omitted scope and intentional differences receive no parity credit.

Run the existing checks appropriate to the change. Source/composition review and behavior verification are separate gates: passing runtime tests does not override a source-fidelity finding. Resolve that finding or obtain an explicit recorded exception within the authorized project scope before merge; do not weaken original expectations or relabel divergent evidence. The PM approves the concrete exact head only after independent review and its hosted checks pass. The owning developer merges with an expected-head guard; verify the resulting merge commit/tree and its required post-merge checks before recording completion.

This review procedure is enforced through contributor instructions and the PR checklist. Existing provenance checks authenticate particular source fixtures/sections; no comprehensive automated production implementation-equivalence check is claimed. See the [audit](docs/source-fidelity-audit.md) and [dependency inventory](docs/external-dependencies.md) for the recorded starting point and remaining repairs.
