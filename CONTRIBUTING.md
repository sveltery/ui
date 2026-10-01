# Contributing

Sveltery UI contains a bounded experimental styled Dialog and Button. Keep readiness blocked until the relevant [Sveltery Base](https://github.com/sveltery/base) foundations and browser behavior are proven. Keep this repository's current status explicit; documentation checks do not establish component functionality.

For documentation changes, use Node >=24.15.0 <25 and run:

```sh
node .github/check-docs.mjs
```

The `Documentation` CI check validates the MIT license notice, required project documents, local Markdown file links and whitespace. It does not install dependencies, build an app or run component tests. Keep links relative where possible, use LF line endings and end text files with a newline.

Open a focused pull request explaining the change and recording validation. Obtain independent review of the final head and verify the hosted check for that same SHA before merge. Preserve any upstream attribution when adding derived materials.

Executable changes require pinned dependency tooling, lint, types, runtime tests, SSR/client builds, package-consumer checks and real browser behavior tests in the same reviewed setup. Run `bash scripts/bootstrap.sh` and `bash scripts/verify.sh`, plus secured browser CI. Read [readiness gates](docs/readiness.md). Use idiomatic Svelte state and derived values, effects only for external synchronization, and reliable cleanup. Include cancellation and callback-order assertions where applicable. Publication or deployment requires separate, explicit approval; no release process is active for this placeholder.

Proposed `main` protection, to apply only after a green hosted check and exact maintainer approval: require PRs, require the `Documentation` check with branches up to date, resolve review conversations, block force pushes and deletion, and apply to administrators. Use zero mandatory GitHub human approvals while operating with a single maintainer; keep independent source review in the merge procedure. This proposal does not assert settings are active.

## Upstream porting policy

The pinned upstream is the behavior reference. Reproduce questioned behavior against that exact pin before changing the port. Preserve upstream behavior first, including suspected bugs. Track verified bugs shared with upstream in this repository's GitHub issues for later work; link the reproducer and source pin. Do not silently fix them while porting.

Keep three categories separate: fidelity repairs restore the pinned behavior; intentional differences change it, including local bug fixes; unimplemented scope remains incomplete and blocked. Neither merging a PR nor passing an assertion with a different expected result establishes approval or parity.

For every intentional difference, record the source and immutable pin, observable upstream and local behavior, rationale, test/run evidence, landed PR (or proposed PR until landing), and truthful decision status in the compatibility register. Record framework/API substitutions as well as behavioral fixes. Keep landed status separate from a specific acceptance decision; cite a recorded decision or state that one is not recorded. Divergent assertions earn no parity credit. Preserve MIT notices and assertion provenance, and retain explicit incomplete-parity limits.

Use the [upstream differences](docs/upstream-differences.md) as the central index, with links to feature-specific evidence and remaining scope.
