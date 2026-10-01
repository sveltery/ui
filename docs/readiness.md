# Dialog readiness

Recovery checkpoint: `9614e55530eebb63ab735ebacb51848ff2e02f45`, based on UI main `2c1290d650936a4ad482ae37072eb30dd7513082`. Existing refs and the disconnected task are preserved. Continuation uses a separate branch and worktree.

## Blocking gates

- Verify the updated Base pin `08d2790571eb54440b9e61d13917bc433aa92de8`, whose merge parents are baseline `318020c3476523e11802d9f4b1ada96369f1641a` and reviewed [PR #13](https://github.com/sveltery/base/pull/13) head `2446dec3089bfe1ed65f2afaab95aad7e4dd70cd`. Preserve the canceled deferral and disabled Close anchor assertions that exposed the baseline defects; no UI workaround, skip or weakened assertion is allowed.
- Pass lint, public type checks, actual Svelte DOM tests, SSR/client build and isolated tarball consumption.
- Pass hosted real Chromium keyboard, hydration, animation exit/reopen and computed Nova style tests on the final head, sandbox enabled and retries zero.
- Obtain an independent GPT-6.1-Sol high review of the final head, address all findings, and confirm automatic Codex review is Completed on that same head with all comments addressed.
- Parent decides readiness and merge only after the gates pass. No publication, deployment, credential changes, or protection bypass is authorized.

## Recovery observations

Fresh environment: Node 24.19.0, pinned pnpm 12.6.0. Remote checkpoint inventory and source access succeeded. The pinned Base tarball rebuilt with SHA-256 `28c31e70166bcbe07e8956715fbf1f84a9f7011b80f0842aa3456bbe0903a600`, matching the original checkpoint. Upstream Dialog and Button reference files match shadcn commit d75a96ab byte for byte.

Local `/usr/lib/chromium/chrome-sandbox` is mode 4755 and owned by nobody, so a supported secured browser is required for local execution. The existing Base hosted Ubuntu 22.04 setup supplies the browser CI model. No sandbox flags, system permissions, network policy or credentials are changed to get a passing result.

Execution results and review evidence will be recorded with exact commit SHAs. Prior checks or an earlier review do not establish readiness of a changed head.

Base merge was verified against the remote ref and local Git object parents before updating the source pin. The current archive SHA-256 is `67fa113eaba95095ab54faee335d33bdec01104811d17164fda581b1faf28779`; the original baseline checksum above records recovery provenance.

The preserved DOM assertions pass after refreshing the file dependency's integrity (`pnpm update @sveltery/base --recursive --lockfile-only`) and the frozen install. A lockfile-only generic install initially retained the previous archive resolution; bootstrap/verify now explicitly compare the lockfile integrity to the independently verified archive before acceptance.

## Local continuation validation

`bash scripts/verify.sh` passes on Node 24.19.0 / pnpm 12.6.0: archive and lock integrity, ESLint, library packaging, both Svelte/type checks (zero errors or warnings), all 10 actual DOM tests, docs SSR/client production build, isolated UI tarball SSR consumption and public type assertions, license/CSS/declaration presence and documentation checks. Source `svelte-package` required the library's explicit tsconfig to emit declarations; the consumer now requires and compiles those declarations outside the workspace.

`pnpm exec playwright test --list` discovers 12 browser tests. Official Chromium installation returns HTTP 403 from cdn.playwright.dev. A single secured local launch with `/usr/bin/chromium` aborts with SIGABRT at `setuid_sandbox_host.cc:166` before interactions, confirming the helper ownership blocker above. These are blocked executions, not passing browser evidence. Hosted CI and independent/automatic reviews are still pending at this checkpoint.
