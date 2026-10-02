# Upstream test provenance

The immutable styled source is [shadcn-ui/ui `d75a96ab781f3d659be1ad287347d5887ce9f2fc`](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc), Git tree `b5fe6239eadcaa7167662cc28e55b4f7911a1e1e`. The [test inventory](../tests/reference/shadcn-test-inventory.json) records every test-related path, immutable Git blob, SHA-256 and byte length found in the complete 5,828-path tree. There are **133 executable test source files and six snapshot artifacts**, or 139 test-related files in total. Snapshots are not separate test suites. Counts describe files, not assertions, parameterized executions or completed ports.

## Available suites and scope

| Pinned scope | Executable test sources | Snapshot artifacts | Actual product tested |
| --- | --- | --- | --- |
| `apps/v4` | 17 | 0 | App configuration/routes, registry health, Calendar source/JSON migration and registry configuration |
| `packages/helpers` | 12 | 0 | Chat/data/stream helpers and AI adapters |
| `packages/react` | 7 | 0 | MessageScroller geometry/runtime/browser/performance and Questionnaire runtime/SSR/browser |
| `packages/registry` | 56 | 5 | Registry resolution/schema/API, CLI installation and source transformers |
| `packages/shadcn` | 34 | 1 | CLI commands, migrations, templates and style/source transformers |
| `packages/tests` | 7 | 0 | Actual CLI commands against project/registry fixtures |

The only tests below `apps/v4/registry` are [calendar.test.ts](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/calendar.test.ts) and [config.test.ts](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/config.test.ts). Calendar checks react-day-picker v10 class-key spelling in source and published JSON; configuration checks font/theme/preset generation and schema behavior, including the real `buildThemeForPreset` assertion. They are genuine shadcn tests but do not exercise the current native wrappers. Porting an applicable theme/configuration assertion requires implementing and executing its actual source contract with the original expectations; copying its filename supplies no credit.

The seven React runtime/geometry suites live under `packages/react/src/message-scroller` and `packages/react/src/questionnaire`. **MessageScroller and Questionnaire are actual entries in the pinned Base registry and remain required project scope.** Their [MessageScroller wrapper](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/message-scroller.tsx) and [Questionnaire wrapper](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/questionnaire.tsx) use the separately packaged `@shadcn/react` cores, rather than Base UI primitives. These genuine upstream suites are applicable to those unimplemented entries and remain unported; absence of current exports does not remove them from project scope. MessageScroller has geometry, runtime/SSR/hydration, browser and performance suites; Questionnaire has runtime, SSR and browser suites. Generic JSX Input/Button fixtures in CLI transformation tests establish transformer behavior, not those elements' runtime behavior.

The complete tree, test sources, test configuration and imports were audited. No component runtime test suite exists in this pin for the current or assigned bounded Dialog, Button, Textarea, Skeleton, Kbd, Table, Card, Label, AspectRatio, Alert, Empty, Input, InputGroup, Field, Badge, Separator, Progress or Spinner wrappers. This absence is scoped to the recorded tree and products; it is not a claim that shadcn has no executable tests. Existing source-derived paired wrapper probes remain supplemental local evidence and must not be relabeled as copied upstream tests.

## Separate official gallery templates

Pinned [build-test-app.mts](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/scripts/build-test-app.mts) generates components/examples into the separate official [shadcn-ui/ui-test-apps](https://github.com/shadcn-ui/ui-test-apps) repository. That reference fixes no external commit. A separate read-only audit used observed commit [`8868c03b4c1f394f310bb4728d754454c327502c`](https://github.com/shadcn-ui/ui-test-apps/tree/8868c03b4c1f394f310bb4728d754454c327502c), tree `a233f4aa282e1b2876f46dc8dd4ad4349af36095`; its full 58-path inventory and package-manifest hashes are recorded alongside the shadcn inventory.

All tracked files were checked for test/spec/e2e/Playwright/Vitest/Jest/Cypress paths and source assertion declarations. None exist. The root and Next Base/Radix package scripts expose dev/build/lint/start only. These are manual gallery templates, not a missing maintained component assertion suite. This separate audit earns no test-port credit and is not certified by the original shadcn pin.

## Assertion provenance and acceptance

Shadcn tests, Base UI tests and local supplements have separate source identities. Pinned shadcn Dialog, Button and Input wrappers import `@base-ui/react` 1.6.0; real primitive conformance suites belong to [Base UI v1.6.0, immutable commit `b34551d644f2e58ebf8fc1050d949f6654ceca6c`](https://github.com/mui/base-ui/tree/b34551d644f2e58ebf8fc1050d949f6654ceca6c). They must retain that provenance when adapted to Svelte. The Sveltery Base dependency's 1.8.0 behavior provenance remains separate; passing selected 1.6.0 assertions establishes no complete cross-version parity.

Each genuine port must record its original declaration/assertion, immutable source/hash and MIT attribution, harness or framework substitutions, applicable scope, executed result and remaining omissions. Preserve original behavioral expectations. A failing local implementation requires a fidelity repair; a reproduced defect shared with the pinned source requires a tracked issue and separate correction decision. Do not silently weaken expectations, fix shared defects or give divergent/framework assertions ordinary source parity credit. Shared conformance helpers, ordinary component declarations, parameterized executions and supplemental probes must have distinct inventories.

This audit changes documentation and provenance data only. It executes no copied test suite and establishes no new functionality, behavioral acceptance, complete parity or production readiness. Applicable genuine tests and all final implementation checks remain required.

## Reproducing the inventory

Read the complete tree at the recorded commit with `git ls-tree -r --name-only d75a96ab781f3d659be1ad287347d5887ce9f2fc`. Discover test/spec paths using the recorded filename pattern; classify `.snap` entries separately from executable source extensions. Inspect the Vitest workspace/configuration and additional test/e2e/framework paths, then read all discovered suites and relevant imports before deciding applicability. Compute each exact source blob's SHA-256 and byte length; the JSON records Git blobs and a checksum of the full LF-terminated path listing. Apply the same complete-tree/source/package-script inspection to the independently pinned gallery repository. This documents discovery evidence rather than replacing executable test validation.
