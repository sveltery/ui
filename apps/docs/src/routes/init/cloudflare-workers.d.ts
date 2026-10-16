// The Worker runtime module that adapter-cloudflare provides. The docs app does not depend on @cloudflare/workers-types.
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}
