# Repository guidance

Read [CONTRIBUTING.md](CONTRIBUTING.md), the pinned source contracts and the [upstream differences](docs/upstream-differences.md) before porting or reviewing changes. Inspect current main and any relevant repository skills before editing. Keep changes focused and preserve upstream attribution.

## Upstream porting policy

The pinned upstream is the implementation and behavior reference. Reproduce questioned behavior against that exact pin before changing the port. Preserve upstream behavior first, including suspected bugs. Track verified bugs shared with upstream in this repository's GitHub issues for later work; link the reproducer and source pin. Do not silently fix them while porting.

Keep three categories separate: fidelity repairs restore the pinned behavior; intentional differences change it, including local bug fixes; unimplemented scope remains incomplete and blocked. Neither merging a PR nor passing an assertion with a different expected result establishes approval or parity.

For every intentional difference, record the source and immutable pin, observable upstream and local behavior, rationale, test/run evidence, landed PR (or proposed PR until landing), and truthful decision status in the compatibility register. Record framework/API substitutions as well as behavioral fixes. Keep landed status separate from a specific acceptance decision; cite a recorded decision or state that one is not recorded. Divergent assertions earn no parity credit. Preserve MIT notices and assertion provenance, and retain explicit incomplete-parity limits.

Update the compatibility register and affected feature documentation together. Run the documented checks appropriate to the change and verify CI and independent review against the final head. Documentation validation establishes documentation consistency only, not new product parity.

## Source-first implementation review

Follow the [source mapping and review workflow](CONTRIBUTING.md#source-first-implementation-workflow) before writing a port. Read the complete immutable original wrapper and its transitive internal helpers, external dependencies and global/component CSS. Passing tests, authenticated fixture hashes or matching class strings alone do not establish implementation fidelity.

Keep the original primitive/native hosts, part and helper composition, branches/defaults, variants, literal classes/selectors, spread precedence and dependency graph recognizable. Reuse genuine framework-independent packages at their recorded versions. Adapt React-only components and React props, refs, events and children to the corresponding Svelte APIs with the smallest justified translation. Use canonical ported helpers/components rather than copying their appearance or replacing them with local test scaffolds. Keep headless behavior in Sveltery Base; that separately managed repository requires its own authorization for changes.

Each executable PR must include a source mapping table and an independent implementation/composition review of its exact final head, alongside the existing runtime and delivery checks. Review the original source independently of paired harness substitutions. Register every intentional API/behavior/architecture difference with truthful acceptance status. A failed source-fidelity review blocks a source-conforming merge and cannot be renamed passing behavior parity. Preserve earlier recorded decisions as explicit exceptions, without extending their scope implicitly.

The [implementation audit](docs/source-fidelity-audit.md) and [external dependency inventory](docs/external-dependencies.md) record the bounded starting point for this policy. This is a required human/agent review procedure; the repository does not yet have an automatic comprehensive structural comparison gate.
