Describe the concrete problem and resulting behavior. Keep experimental status, missing scope and Base readiness accurate. Record the immutable original source pin and the final PR head used by review/checks.

For executable ports, include the source mapping below or link to a tracked contract containing it. Documentation-only changes may mark the implementation rows/checks not applicable and explain why.

| Original immutable source/export | Local source/export | Host, dependencies and composition | Branches/defaults, variants/classes and spread order | Required framework translation or intentional difference | Independent source and runtime evidence |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

- [ ] Complete original implementation, transitive helpers/dependencies and global/component CSS read before coding.
- [ ] Genuine available helpers/components and framework-independent packages reused; missing prerequisites remain explicit.
- [ ] API/behavior/architecture differences recorded with evidence and actual acceptance status; earlier decisions preserved within their scope.
- [ ] Independent implementation/composition review covers the exact final head, including reference-harness substitutions.
- [ ] Relevant lint, type, genuine/supplemental runtime, SSR/client build, package/source-copy and secured browser gates pass on that head; evidence categories remain distinct.
- [ ] `node .github/check-docs.mjs` passes, and hosted `Documentation` passes on the final reviewed head.
- [ ] Original license notices and source/test attribution retained.
- [ ] Concrete exact-head PM approval received before the owning developer performs an expected-head-guarded merge; required post-merge checks verified before completion.

See [CONTRIBUTING.md](../CONTRIBUTING.md#source-first-implementation-workflow) for the required workflow. Authenticated fixtures and passing tests alone do not establish production implementation fidelity. Publication or deployment requires separate approval.
