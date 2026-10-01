# Contributing

Sveltery UI contains a bounded experimental styled Dialog. Keep readiness blocked until the relevant [Sveltery Base](https://github.com/sveltery/base) foundations and browser behavior are proven. Keep this repository's current status explicit; documentation checks do not establish component functionality.

For documentation changes, use Node 24.x and run:

```sh
node .github/check-docs.mjs
```

The `Documentation` CI check validates the MIT license notice, required project documents, local Markdown file links and whitespace. It does not install dependencies, build an app or run component tests. Keep links relative where possible, use LF line endings and end text files with a newline.

Open a focused pull request explaining the change and recording validation. Obtain independent review of the final head and verify the hosted check for that same SHA before merge. Preserve any upstream attribution when adding derived materials.

Executable changes require pinned dependency tooling, lint, types, runtime tests, SSR/client builds, package-consumer checks and real browser behavior tests in the same reviewed setup. Run `bash scripts/bootstrap.sh` and `bash scripts/verify.sh`, plus secured browser CI. Read [readiness gates](docs/readiness.md). Use idiomatic Svelte state and derived values, effects only for external synchronization, and reliable cleanup. Include cancellation and callback-order assertions where applicable. Publication or deployment requires separate, explicit approval; no release process is active for this placeholder.

Proposed `main` protection, to apply only after a green hosted check and exact maintainer approval: require PRs, require the `Documentation` check with branches up to date, resolve review conversations, block force pushes and deletion, and apply to administrators. Use zero mandatory GitHub human approvals while operating with a single maintainer; keep independent source review in the merge procedure. This proposal does not assert settings are active.
