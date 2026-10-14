export function load({ cookies, url }) {
  return { open: cookies.get('sidebar_state') !== 'false', rtl: url.searchParams.has('rtl') };
}
