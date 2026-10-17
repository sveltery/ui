#!/usr/bin/env node
// Prints the spec files for one Chromium CI shard, one per line and relative to the test directory, for `playwright test --test-list`.
// Playwright's own --shard splits by test count in file order, which put the slow create, dashboard and docs specs on one shard.
// tests/browser/timings.json holds each spec's summed test seconds; a spec missing from it counts as the median.
// Each CI shard uploads its JSON report as a chromium-report-<shard> artifact. To refresh the table, download all four from one main run:
//   node scripts/browser-shard.mjs --record chromium-report-*/report.json
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Playwright's default testMatch.
const isTestFile = /\.(spec|test)\.[cm]?[jt]sx?$/;

export function assignShards(seconds, total) {
  const shards = Array.from({ length: total }, () => ({ seconds: 0, files: [] }));
  for (const [file, cost] of Object.entries(seconds).sort(([a, x], [b, y]) => y - x || a.localeCompare(b))) {
    const lightest = shards.reduce((min, shard) => (shard.seconds < min.seconds ? shard : min));
    lightest.seconds += cost;
    lightest.files.push(file);
  }
  return shards;
}

export function specSeconds(dir) {
  const timings = JSON.parse(readFileSync(`${dir}/timings.json`, 'utf8'));
  const known = Object.values(timings).sort((a, b) => a - b);
  const median = known[Math.floor(known.length / 2)] ?? 1;
  const specs = readdirSync(dir, { recursive: true }).filter((file) => isTestFile.test(file));
  return Object.fromEntries(specs.map((file) => [file, timings[file] ?? median]));
}

export function recordedSeconds(...reports) {
  const seconds = {};
  const visit = (suite) => {
    for (const spec of suite.specs ?? []) {
      const ms = spec.tests.flatMap((test) => test.results).reduce((sum, result) => sum + result.duration, 0);
      seconds[spec.file] = (seconds[spec.file] ?? 0) + ms / 1000;
    }
    for (const child of suite.suites ?? []) visit(child);
  };
  for (const suite of reports.flatMap((report) => report.suites)) visit(suite);
  return Object.fromEntries(Object.entries(seconds).sort(([a], [b]) => a.localeCompare(b)).map(([file, total]) => [file, Math.max(1, Math.round(total))]));
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv[2] === '--record') {
  const reports = process.argv.slice(3).map((file) => JSON.parse(readFileSync(file, 'utf8')));
  writeFileSync('tests/browser/timings.json', `${JSON.stringify(recordedSeconds(...reports), null, 2)}\n`);
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [current, total] = process.argv.slice(2).map(Number);
  if (!(total >= 1 && current >= 1 && current <= total)) throw new Error('usage: browser-shard.mjs <current> <total>');
  const dir = 'tests/browser';
  for (const file of assignShards(specSeconds(dir), total)[current - 1].files) console.log(file);
}
