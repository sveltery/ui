# Three-engine acceptance gates

This continuation starts from verified Table main `af800a96b09df391f687cb6eeec5d31ed4b3826a` and integrates approved main `29c53008c0874011565979243e604dd3e03c0896`, including Base, scaffolds, themes, public icons, the pinned catalog and genuine MessageScroller geometry-test prerequisite. Playwright **1.63.0**, the frozen dependency lock and source pins remain unchanged. Expanding browser execution earns no upstream test-port credit; each existing test retains its own provenance.

The shared [project definitions](../scripts/browser-projects.ts) configure Chromium, Firefox and WebKit for the [complete dev app suite](../playwright.config.ts) and [fresh consumers](../scripts/installation-playwright.config.ts). Each runs with one worker and zero retries. Chromium retains explicit sandbox startup and its optional local `DIALOG_CHROMIUM_PATH` override. Firefox and WebKit use native engine launch defaults. No disabling flags, security preferences, permission changes or system sandbox changes are introduced.

| Configured inventory after approved public-icon and catalog integration | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| Main component/reference suite, including the separately marked native remote-field diagnostic | 125 | 125 | 125 |
| Documented archive consumer | 26 | 26 | 26 |
| Experimental remote-field archive consumer | 10 | 10 | 10 |
| Documented source-copy consumer | 26 | 26 | 26 |
| Experimental remote-field source-copy consumer | 10 | 10 | 10 |

Discovery establishes inventory only. The [CI matrix](../.github/workflows/ci.yml) installs each official engine and its OS dependencies independently, with fail-fast disabled. It retains the existing Chromium `Dialog browser` name and adds `Firefox browser` and `WebKit browser`. Each engine runs the complete main suite and both fresh modes/phases; fresh checks still execute after a main-suite failure, and every failure keeps the job red. Engine-specific failure artifacts and the 45-minute job budget preserve diagnostic evidence without changing individual assertion timeouts or adding retries.

```sh
bash scripts/bootstrap.sh
bash scripts/verify.sh
bash -c 'source scripts/toolchain.sh; pnpm exec playwright install --with-deps chromium firefox webkit; pnpm test:browser'
bash scripts/check-installation.sh --browser
```

For one engine, run `pnpm test:browser --project firefox` with the pinned toolchain. Set `SVELTERY_BROWSER_PROJECT=firefox` for `bash scripts/check-installation.sh --browser`; the installer validates the selector and forwards it to both documented and experimental phases. Omitting it runs all three engines.

## Source-derived harness conditions and native browser limitations

The [immutable diagnostic record](../tests/reference/browser-native-evidence.json) identifies [run 37067050448](https://github.com/sveltery/ui/actions/runs/37067050448), exact head `0a642227cccc1b892bab2487ecd049fe4a76ccb9`, job IDs, original dev/fresh outcomes and actual React/Svelte/native witnesses. All diagnostic engine jobs were red. These witnesses are supplemental, rather than copied ordinary upstream tests, and do not certify the repaired final head.

- **Dev startup:** Firefox and WebKit canceled initial warm-up module imports before the identity navigation. Vite logged the nested remote fixture's generated tsconfig changing and requesting a full reload. Kit writes that file when its new Vite process starts; pre-generation alone does not prevent a later rewrite. The actual remote server now becomes ready before the parent Docs watcher starts. Both cold-load and identity-navigation errors still feed the same empty-error assertion. The Alert script gate additionally requires intercepted requests; all SSR/ref/attachment identities remain required. Success of this ordering change still requires final-head browser execution.
- **Dialog exit:** Actual pinned React and Svelte retain Nova's `exit` name and `0.1s` duration. WebKit can sample its first frame after that finite duration. A test-only play-state rule pauses the real CSS animation, requires a nonempty set of actual `exit` CSSAnimations and paused playback, observes closed popup/overlay presence, then resumes and requires removal. Firefox also exposes running CSSTransitions; CSS animation play-state does not control those separate objects. Count, duration, presence, removal and the original stale-close/reopen checks remain. No component source or animation duration changes.
- **Disabled focusable Button:** Firefox cycles a lone focusable native/React/Svelte host back to itself; Chromium and WebKit temporarily focus the body. All three traverse to an explicit following native button. The two affected supplemental fixtures now include that following control. The original not-focused assertion remains and also requires the exact following Tab destination; all disabled pointer/keyboard callback guards remain.
- **Alert offset resolution:** The pinned source rule is absolute `top-2 right-2`, compiled to twice `--spacing`. With native spacing `0.25rem` and root font `16px`, Firefox reports top `8px` and right `6px` for actual React, Svelte and an independently styled native div in the same containing block. Chromium and WebKit report `8px` for both. The helper retains literal spacing/root-font/absolute/top assertions and compares right with that independent native calc witness. It adds no engine branch or widget style repair.
- **Label association:** After changing `for` to the second input, Firefox retains the first input's previously queried `input.labels` association in actual pinned React, Svelte and pure HTML. Its supplemental accessible-name observation consequently still names that first input. All three engines resolve `label.control` to the second input and trusted label activation focuses it. The helper primes an equivalent native flex label/child/two-input witness, asserts its new control, updated target name and trusted focus, and compares the actual old association/name with that native result. Exact updated `for`, props/styles, second-input name, real label activation, focus and click counts remain. This records a native-browser limitation; it does not claim the old input has an empty observed name in Firefox or establish live assistive-technology behavior.

Shared Table measurements wait for actual finite animations to settle after class-based palette changes. Infinite animations are excluded from that precondition; all exact palette and geometry assertions remain unchanged, including the separately approved scaffold sizing expectations.

## Removed production-preview experiment

The same diagnostic head temporarily built and previewed the complete Docs app while independently running the original dev suite and fresh dev consumers. Chromium passed 127 preview cases and failed two; Firefox passed 115 and failed 14; WebKit passed 122 and failed seven. The dev module-delay pattern missed the built icon chunks, exact unminified theme-token string assertions encountered equivalent minified CSS lexemes, and WebKit bypassed several script-only SSR delay preconditions before hydration. Chromium and Firefox did intercept real hashed Alert entry/chunk scripts; this did not certify all production gates. No production UI defect or production acceptance is inferred from that incompatible experiment. The temporary mode, duplicate CI pass, console diagnostics and probe-only route are removed; the final main and fresh flows keep their original dev path.

## Current evidence boundary

At the integrated diagnostic head, full local verification passed 321 DOM cases, paired SSR, builds and package/public-type gates; archive and source-copy documented/experimental type/build phases passed. The recorded Chromium dev run passed 129 cases and all four fresh phases; WebKit passed 128 dev cases with the remaining cold Alert import failure and all fresh phases; Firefox retained thirteen dev failures and failed two cases in its first documented archive phase, blocking the later phases. Those historical counts include temporary witnesses and predate public icons.

Current discovery selects 375 main cases, 78 documented-consumer cases and 30 experimental-consumer cases across the three engines, with consumer counts applying separately to archive and source-copy modes. Repaired exact-final-head hosted execution, independent review, configured automatic-review evidence or the documented provider-quota waiver, and explicit parent approval remain required. Local checks use the verified Base archive and frozen cached dependencies; hosted bootstrap must pass. Full registry delivery, incomplete compositions, live assistive technology and production readiness retain their separately documented limits.
