export function load({ cookies }) {
  return { open: cookies.get('sidebar_state') !== 'false' };
}
