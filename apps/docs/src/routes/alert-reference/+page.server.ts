import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { AlertGallery } from '../../../../../tests/reference/AlertGallery';
import type { IconLibraryName } from '../../../../../tests/reference/icons/config';
// Trusted local reference markup; no user content enters this source-derived harness.
export async function load({ url }: { url: URL }) {
  const selection = url.searchParams.get('library');
  const library: IconLibraryName = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'].includes(selection ?? '') ? selection as IconLibraryName : 'lucide';
  const html = await new Promise<string>((resolve, reject) => {
    const output = new PassThrough(); let markup = '';
    output.on('data', chunk => { markup += chunk; }); output.on('end', () => resolve(markup)); output.on('error', reject);
    // Explicit all-ready inline document: default chunking can still emit
    // completion scripts, which trusted {@html} insertion does not execute.
    const stream = renderToPipeableStream(createElement(AlertGallery, { library }), { progressiveChunkSize: Number.MAX_SAFE_INTEGER, onAllReady() { stream.pipe(output); }, onError: reject });
  });
  return { html, library };
}
