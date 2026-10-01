import { supportsNode } from './node-version.mjs';
if (!supportsNode(process.versions.node)) {
  console.error('Sveltery requires Node >=24.15.0 <25 for this reproducible toolchain.');
  process.exitCode = 1;
}
