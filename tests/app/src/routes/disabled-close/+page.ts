export function load({ url }: { url: URL }) { return { disabled: !url.searchParams.has('enabled') }; }
