# Frozen Base dependency delivery

Ordinary UI bootstrap consumes the committed `.vendor/sveltery-base-0.0.0.tgz` archive. It does not clone, install, build, test or package the separately managed Base project. The existing checker authenticates the archive and its frozen lockfile resolution before `pnpm install --frozen-lockfile`; a missing archive, changed archive or mismatched lockfile stops bootstrap before installation.

## Proposed current c160 delivery

The current Draft dependency proposal consumes Base `c1600456d3b4e72910d42823b9df69280c74a262` from its authenticated existing hosted package. Read [source, archive and compatibility gates](base-pin-upgrade.md#proposed-c160-frozen-dependency-adoption). The candidate is213537 bytes/676 regular members, SHA-256 `e6b9b94b7184c492a09881cd8f3fa798bdb973f3db0a5f7b3c69b9160f4e068a` and frozen integrity `sha512-CHhArdachwDhitl3kNYO7PLIOImIAtHOFMq09bfVMdOOXQ3v6X3xYx5uQ19qEKawp2xT3SrrqM2S8BuajL1ydg==`. Its complete inventory, raw source and export targets are authenticated; all579 generated member bytes also independently reproduce in memory. UI compatibility gates remain pending. All bootstrap/checker negatives remain strict. The optional Kit patch is shipped but unapplied. Candidate disabled chorded-mousedown conflicts with retained UI assertions, and this Draft remains blocked.

## Historical f884 delivery record

The following exact-byte delivery statements describe the prior frozen f884 checkpoint. Its225-member archive/hash, notices, reconstruction limits and checks are retained as historical evidence; they do not describe the new current archive or certify this changed dependency head.

## Preserved dependency provenance

| Item | Immutable identity |
| --- | --- |
| Base source | `f884f3bb265485ef8e422e43a75eb3055db11fab` in [base.lock.json](../scripts/base.lock.json) |
| Package | Private `@sveltery/base` `0.0.0` |
| Archive | `.vendor/sveltery-base-0.0.0.tgz`, 67,626 bytes |
| Archive SHA-256 | `915dd6aebd304a7a9c384b0dd5eecd589722686897079fb6dec2961608c564fd` |
| Frozen integrity | `sha512-ZkJimKxdfu+92S3kZNL6m3WS9Pob65l0xIeTlI6OYFHM+Sw1S8U8qdYlJcD0kFLljLD+E/la+0n5aCZTdEprsQ==` in [pnpm-lock.yaml](../pnpm-lock.yaml) |

This is a byte copy of the existing UI-owned archive retained with accepted UI main `b6d7251f85200b3ff82db98bb942387f56327b18`. No new Base source checkout, build, repack or dependency update produces it. Its 225 unique regular files have safe `package/` paths and retain their original 0644 member modes. The archive includes the original MIT license and complete third-party notice, including the Material-UI copyright and permission notice. Its package manifest retains `esm-env` 1.2.2, the original Svelte peer, and no install or prepare lifecycle script.

The archive is tracked with Git mode 100644. Its checkout filesystem permissions depend on the local umask; the clean verification checkout has mode 0600. These containing-file permissions do not change its bytes or the 0644 modes inside it. Only this named root archive is permitted by the `.vendor` ignore exception. Other generated vendor contents, including nested vendor directories, remain ignored.

## Current delivery and historical reconstruction

The [Avatar/Accordion upgrade record](base-pin-upgrade.md#source-package-and-archive-audit) describes the earlier archive build and ordinary-bootstrap reconstruction. That source/build evidence and its checksums remain historical and unchanged. This document and the current [installation guide](installation.md) supersede its statements that the archive is uncommitted and rebuilt by ordinary bootstrap. Current delivery does not advance the Base pin, claim a new build, or repeat those historical Base operations.

[prepare-base.sh](../scripts/prepare-base.sh) remains unchanged as a historical manual reconstruction utility outside ordinary bootstrap and CI. Running it performs Base repository and build operations and requires separate explicit authorization for the separately managed Base project. Neither its presence nor this delivery change grants that authorization.

## Source and gate mapping

| Accepted source | Current change | Preserved boundary |
| --- | --- | --- |
| [bootstrap.sh](../scripts/bootstrap.sh) previously called Base preparation | Remove that call; keep toolchain selection, archive/lock authentication and frozen UI installation in their original order | No Base project operation during ordinary bootstrap |
| `.vendor/` previously ignored the entire directory | Ignore its contents except the single byte-authenticated archive | No additional vendor artifact or dependency pin update |
| Existing retained archive | Track the exact existing package bytes and notices | No component, helper, API, CSS, behavior or package-content change |
| [check-base.mjs](../scripts/check-base.mjs), source pin and frozen lock | Unchanged SHA-256 and SHA-512 checks before installation | No checksum refresh or weakened failure expectation |
| Existing hosted workflows and verification scripts | Unchanged jobs invoke the corrected ordinary bootstrap | All existing checks, secured browsers, retries, selectors and consumer gates remain required |

The delivery PR must demonstrate a clean UI-only checkout, archive-only frozen bootstrap, missing/tampered-archive and mismatched-lock preinstall failures, full unchanged UI verification and all four fresh documented/experimental archive/source-copy type/SSR/client phases. Secured hosted browser acceptance, independent exact-head source review, configured review disposition, PM approval, developer-owned guarded merge and fresh post-merge gates remain required. Private raw logs and hash-bound receipts belong in the PR/handoff; previous runs do not certify a changed head. This document records the delivery contract, not completed acceptance.

This change adds no ordinary copied upstream test credit, styled component or gallery completion, new Base behavior acceptance, cross-version equivalence, full-library readiness, publication or deployment. Known native Input checked/reset failures, Avatar explicit-zero-delay/version limits and the historical `d46882b` Firefox Label reference failure with its unresolved cause retain their existing boundaries.
