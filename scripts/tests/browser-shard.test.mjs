import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { assignShards, specSeconds } from '../browser-shard.mjs';

test('the shards run every browser spec exactly once', () => {
  const specs = readdirSync('tests/browser', { recursive: true }).filter((file) => file.endsWith('.spec.ts')).sort();
  for (const total of [1, 4, 6]) {
    const listed = [];
    for (let current = 1; current <= total; current++) {
      const result = spawnSync(process.execPath, ['scripts/browser-shard.mjs', String(current), String(total)], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      listed.push(...result.stdout.split('\n').filter(Boolean));
    }
    assert.deepEqual(listed.sort(), specs, `${total} shards`);
  }
});

test('no shard runs longer than another by more than its slowest spec', () => {
  const seconds = specSeconds('tests/browser');
  const shards = assignShards(seconds, 4);
  const times = shards.map((shard) => shard.seconds);
  const slowestSpec = Math.max(...shards.map((shard) => Math.max(...shard.files.map((file) => seconds[file]))));
  assert.ok(Math.max(...times) - Math.min(...times) <= slowestSpec, String(times));
});

test('a spec with no recorded time counts as the median spec', () => {
  const dir = mkdtempSync(join(tmpdir(), 'browser-shard-'));
  writeFileSync(join(dir, 'timings.json'), JSON.stringify({ 'a.spec.ts': 1, 'b.spec.ts': 5, 'c.spec.ts': 9, 'gone.spec.ts': 100 }));
  for (const file of ['a', 'b', 'c', 'new']) writeFileSync(join(dir, `${file}.spec.ts`), '');
  assert.deepEqual(specSeconds(dir), { 'a.spec.ts': 1, 'b.spec.ts': 5, 'c.spec.ts': 9, 'new.spec.ts': 9 });
});
