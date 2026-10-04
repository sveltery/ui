import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repo = fileURLToPath(new URL('../../', import.meta.url));

// Authored infrastructure regressions. The real bootstrap/checker run against
// isolated UI files; command witnesses prove that rejection precedes install.
// These negative probes do not replace the genuine frozen-install gate.
for (const scenario of ['missing archive', 'tampered archive', 'mismatched lock']) {
  test(`archive-only bootstrap rejects ${scenario} before installation`, () => {
    const fixture = mkdtempSync(join(tmpdir(), 'sveltery-frozen-base-delivery-'));
    try {
      mkdirSync(join(fixture, 'scripts'));
      mkdirSync(join(fixture, '.vendor'));
      mkdirSync(join(fixture, 'bin'));
      for (const name of ['bootstrap.sh', 'toolchain.sh', 'check-node.mjs', 'node-version.mjs', 'check-base.mjs', 'base.lock.json', 'prepare-base.sh']) {
        cpSync(join(repo, 'scripts', name), join(fixture, 'scripts', name));
      }
      for (const name of ['package.json', 'pnpm-lock.yaml']) cpSync(join(repo, name), join(fixture, name));
      const archive = join(fixture, '.vendor/sveltery-base-0.0.0.tgz');
      cpSync(join(repo, '.vendor/sveltery-base-0.0.0.tgz'), archive);
      if (scenario === 'missing archive') unlinkSync(archive);
      if (scenario === 'tampered archive') {
        const bytes = readFileSync(archive);
        bytes[bytes.length - 1] ^= 1;
        writeFileSync(archive, bytes);
      }
      if (scenario === 'mismatched lock') {
        const lock = join(fixture, 'pnpm-lock.yaml');
        const source = readFileSync(lock, 'utf8');
        const changed = source.replace(/(resolution: \{integrity: sha512-)[^,]+(, tarball: file:\.vendor\/sveltery-base-0\.0\.0\.tgz\})/u, '$1invalid$2');
        assert.notEqual(changed, source, 'fixture must actually replace the archive integrity');
        writeFileSync(lock, changed);
      }
      writeFileSync(join(fixture, 'bin/pnpm'), `#!/usr/bin/env bash
if [[ "$#" == 1 && "$1" == --version ]]; then
  printf '%s\\n' 12.6.0
  exit 0
fi
printf '%s\\n' "$*" >> "$PWD/pnpm-install-invocations"
exit 97
`, { mode: 0o755 });
      writeFileSync(join(fixture, 'bin/git'), `#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$PWD/git-invocations"
exit 98
`, { mode: 0o755 });
      const result = spawnSync('bash', ['scripts/bootstrap.sh'], {
        cwd: fixture,
        env: { ...process.env, PATH: `${join(fixture, 'bin')}:${process.env.PATH}`, COREPACK_HOME: join(fixture, '.checks/corepack'), XDG_CACHE_HOME: join(fixture, '.checks/cache'), XDG_DATA_HOME: join(fixture, '.checks/data') },
        encoding: 'utf8',
        timeout: 10_000
      });
      assert.ifError(result.error);
      assert.notEqual(result.status, 0, 'invalid delivery must stop bootstrap');
      assert.equal(existsSync(join(fixture, 'pnpm-install-invocations')), false, 'installer must not run');
      assert.equal(existsSync(join(fixture, 'git-invocations')), false, 'no Base Git operation may run');
      assert.equal(existsSync(join(fixture, '.checks/base')), false, 'no Base checkout may be created');
      assert.equal(existsSync(join(fixture, 'node_modules')), false, 'no workspace installation may occur');
      const message = scenario === 'missing archive' ? /ENOENT/u : scenario === 'tampered archive' ? /Pinned Base tarball changed/u : /Frozen lockfile does not match the verified Base archive/u;
      assert.match(result.stderr, message, 'actual archive/lock checker must reject the intended mismatch');
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  });
}
