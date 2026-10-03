# Pinned `cn` reference

The UI source at shadcn commit `d75a96ab781f3d659be1ad287347d5887ce9f2fc` imports the standalone `cn` package. Its lock selects `cn` 0.2.2. This directory preserves immutable source, the MIT license and all five original conformance programs from `shadcn-ui/cn` commit `788fe9bf71006c84e387c14b8d356f60f74956b6`, tag `cn@0.2.2`.

[The source manifest](../cn-sources.json) records Git blob identities, byte lengths, SHA-256 hashes, the published npm tarball integrity and exact oracle versions. The conformance scripts remain byte-exact. Their original relative package layout can be supplied by a temporary harness pointing both `packages/cn` and bare `cn` imports at the actual installed package. No engine, table, original test body or expectation is substituted.

These scripts validate a reusable framework-independent dependency. They add no shadcn UI component runtime-test credit and do not replace the original 133-file UI executable-test inventory. Public Unicode class-input witnesses are separately authored supplemental regressions. The dependency's benchmark, size gate, generated-source freshness check and Node 20/22 matrix are outside this integration's execution credit.
