export const load = ({ url }: { url: URL }): { kind: 'summary' | 'empty' | 'plaintext-only' } => {
  const kind = url.searchParams.get('kind');
  return { kind: kind === 'empty' || kind === 'plaintext-only' ? kind : 'summary' };
};
