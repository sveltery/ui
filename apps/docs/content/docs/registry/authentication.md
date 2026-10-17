---
title: Authentication
description: Serve private registry items and send credentials from the CLI.
order: 6
---

A registry can require credentials, so that only your team or your customers install its items. The CLI sends credentials that a [namespace](/docs/registry/namespace) in `components.json` names, and it reads their values from environment variables.

## Send credentials

### Bearer token

Most registries take a token in the `Authorization` header:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Set the token in `.env.local`, and keep that file out of git:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
```

### API key

Some registries take keys in their own headers:

```json title="components.json"
{
  "registries": {
    "@company": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "X-API-Key": "${API_KEY}",
        "X-Workspace-Id": "${WORKSPACE_ID}"
      }
    }
  }
}
```

### Query parameter

`params` adds a query string to each request:

```json title="components.json"
{
  "registries": {
    "@internal": {
      "url": "https://registry.company.com/{name}.json",
      "params": {
        "token": "${ACCESS_TOKEN}"
      }
    }
  }
}
```

`@internal/button` then fetches `https://registry.company.com/button.json?token=your_token`. A query string ends up in server logs more often than a header, so prefer a header.

### Where the values come from

The CLI replaces each `${VAR}` with the environment variable of that name. It looks in the process environment first, then in these files in the project root, in this order:

1. `.env.local`
2. `.env.development.local`
3. `.env.development`
4. `.env`

If a variable that a namespace uses is not set, the command stops before it sends a request and names the variable.

The CLI sends the headers only with requests for that namespace's items. It does not send them to the project's registry or to item URLs.

## Check credentials on the server

A registry behind credentials cannot be a folder of static files, because a static host serves them to anyone. In a SvelteKit app, run [`build`](/docs/cli#build) with `--output ./src/lib/server/r`, declare the token, and serve the items from a route that checks it:

```ts title="src/env.ts"
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  REGISTRY_TOKEN: { description: 'The token the CLI sends to install registry items.' },
});
```

```ts title="src/routes/r/[name].json/+server.ts"
import { json } from '@sveltejs/kit';
import { REGISTRY_TOKEN } from '$app/env/private';
import type { RequestHandler } from './$types';

const items = import.meta.glob('/src/lib/server/r/*.json', { eager: true, import: 'default' });

export const GET: RequestHandler = ({ params, request }) => {
  if (request.headers.get('authorization') !== `Bearer ${REGISTRY_TOKEN}`) {
    return json({ error: 'Unauthorized', message: 'Set REGISTRY_TOKEN in your .env.local file.' }, { status: 401 });
  }
  const item = items[`/src/lib/server/r/${params.name}.json`];
  if (!item) return json({ error: 'Not found', message: `No item named ${params.name}.` }, { status: 404 });
  return json(item);
};
```

`src/env.ts` declares the variable, so the server does not start without `REGISTRY_TOKEN`. Return `401` when the credentials are missing or wrong, and `403` when they are valid but do not grant this item.

## Error messages

When a request fails, the CLI prints the `detail` or `message` field of a JSON response body, after the `error` field in brackets. Use it to tell users what to do:

```ts
return json({ error: 'Forbidden', message: 'Your subscription has expired. Renew it at company.com/billing.' }, { status: 403 });
```

The CLI prints:

```txt
You are not authorized to access the item at https://registry.company.com/button.json. If this is a remote registry, you may need to authenticate.
[Forbidden] Your subscription has expired. Renew it at company.com/billing.
Check your authentication credentials and environment variables.
```

## Test your registry

Run `add` with the token set for one command:

```bash
REGISTRY_TOKEN=your_token npx @sveltery/ui@latest add @private/button --dry-run
```
