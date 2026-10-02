# Proposed three-engine acceptance gates

This continuation starts from verified Table main `af800a96b09df391f687cb6eeec5d31ed4b3826a`, whose tree matches reviewed Table head `4f83b5b7a3859093f810850de1ee3b56e0c16b25`. It keeps Playwright **1.63.0**, the frozen dependency lock, Base and shadcn pins, existing assertions and the separately marked native remote-field SSR diagnostic. Test discovery is evidence of configured inventory only; it does not establish successful browser execution or production readiness.

The shared [project definitions](../scripts/browser-projects.ts) configure Chromium, Firefox and WebKit in both the [main suite](../playwright.config.ts) and [fresh consumers](../scripts/installation-playwright.config.ts). Each runs with one worker and zero retries. A local `DIALOG_CHROMIUM_PATH` override applies to Chromium alone. Chromium retains explicit sandbox startup; Firefox and WebKit use their native engine launch configuration. No disabling flags, security preferences, permissions or system sandbox changes are added. Startup failures remain blocked execution, rather than acceptance evidence.

| Inventory at this continuation's starting checkout | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| Main component/reference suite, including the separately marked native diagnostic | 112 | 112 | 112 |
| Documented archive consumer | 21 | 21 | 21 |
| Experimental remote-field archive consumer | 10 | 10 | 10 |
| Documented source-copy consumer | 21 | 21 | 21 |
| Experimental remote-field source-copy consumer | 10 | 10 | 10 |

The [CI matrix](../.github/workflows/ci.yml) runs each engine independently with fail-fast disabled, installs only that official engine and its OS dependencies, and exercises both fresh consumer modes and phases. Chromium retains the existing `Dialog browser` check name; `Firefox browser` and `WebKit browser` are additional required execution evidence for this continuation. Engine-specific failure artifacts are retained. The 45-minute job budget permits investigation without changing individual test timeouts or allowing retries.

Run all configured engines with:

```sh
bash scripts/bootstrap.sh
bash scripts/verify.sh
bash -c 'source scripts/toolchain.sh; pnpm exec playwright install --with-deps chromium firefox webkit; pnpm test:browser'
bash scripts/check-installation.sh --browser
```

For an individual engine, use `pnpm test:browser --project firefox` after selecting the pinned toolchain. Set `SVELTERY_BROWSER_PROJECT=firefox` when running `bash scripts/check-installation.sh --browser`; the installer validates the project name and forwards it to both documented and experimental phases. Omitting the variable exercises all three projects. Main and consumer discovery each require all three engine inventories; discovery does not launch a browser.

Assertions retain their feature-specific provenance. Most current UI component probes are supplemental and source-derived, rather than copied upstream tests. Expanding the engine matrix provides no upstream-test-port credit. Compare genuine failures against the exact pinned React implementation in the same engine before repairing a port. Shared upstream defects retain their behavior and require an issue with an immutable source/reproducer; broad skips, changed expectations without source evidence and divergent parity claims are excluded.

At the configuration checkpoint, lint and discovery passed: 336 main cases, 63 documented-consumer cases and 30 experimental-consumer cases across the three engines. Fresh consumer counts apply separately to archive and source-copy modes. Hosted execution, final-head independent review, documented quota handling for the configured review provider, and parent approval remain outstanding. Local bootstrap encountered HTTP 503 before dependency selection; local checks use the already verified Base archive and frozen cached dependencies without claiming a fresh bootstrap. Final hosted bootstrap must pass.

Feature limitations remain: incomplete upstream compositions/scaffolds, full theme/gallery parity, live assistive technology and production readiness. Successful bounded tests in an engine do not complete those missing scopes.
