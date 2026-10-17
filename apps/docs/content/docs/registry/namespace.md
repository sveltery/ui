---
title: Namespaces
description: Install items from several registries with names such as @acme/hello-card.
order: 5
---

A namespace gives a registry a short name. Once `components.json` maps `@acme` to a registry, `@acme/hello-card` installs the `hello-card` item from it:

```bash
npx @sveltery/ui@latest add @acme/hello-card
```

There is no central list of namespaces. Each project maps the namespaces it uses, so you can install from public, private and company registries side by side.

## Configure a namespace

Add the namespace to `registries` in `components.json`. The value is the URL of an item, with `{name}` where the item name goes:

```json title="components.json"
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```

`@acme/hello-card` then resolves to `https://acme.com/r/hello-card.json`.

A namespace starts with `@` and holds letters, digits, hyphens and underscores, such as `@acme` or `@my-company`.

### URL placeholders

- `{name}` is required. The CLI replaces it with the item name, the part after the slash. The item name cannot contain `${`, `?`, `#` or a `..` segment, so a name in `registryDependencies` cannot read your environment variables or leave the namespace's path.
- `{style}` is optional. The CLI replaces it with the project's `style`, such as `nova`.

```json title="components.json"
{
  "registries": {
    "@acme": "https://acme.com/r/styles/{style}/{name}.json"
  }
}
```

### Headers and query parameters

To send headers or query parameters, give an object:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      },
      "params": {
        "version": "latest"
      }
    }
  }
}
```

`${VAR}` reads an environment variable, so tokens stay out of `components.json`. See [Authentication](/docs/registry/authentication).

### The built-in namespace

`@sveltery` names the registry in the `registry` key of `components.json`, which is Sveltery UI's own registry unless you changed it. `@sveltery/button` installs the same item as `button`. A `@sveltery` entry in `registries` replaces it.

## Use namespaced items

`add`, `diff`, `update` and `view` take `@namespace/item` names:

```bash
npx @sveltery/ui@latest add @acme/hello-card @internal/auth-form
npx @sveltery/ui@latest diff @acme/hello-card
```

An item's `registryDependencies` can name items of any namespace:

```json title="hello-card.json"
{
  "registryDependencies": ["button", "@acme/format-name", "https://example.com/r/avatar.json"]
}
```

- A plain name such as `button` is an item of the project's registry, even inside an `@acme` item.
- `@acme/format-name` resolves through the `@acme` entry of the project that installs the item, so tell your users which namespace to configure.
- A URL is fetched as is.

## Errors

A namespace that `registries` does not list stops the command:

```txt
Unknown registry "@acme". Make sure it is defined under "registries" in your components.json file:
{
  "registries": {
    "@acme": "[URL_TO_REGISTRY]"
  }
}
```

A `${VAR}` that is not set stops the command before it requests that namespace's items:

```txt
Registry "@private" requires the following environment variables:

  • REGISTRY_TOKEN

Set the required environment variables to your .env or .env.local file.
```

A `401` or `403` response names the item URL, then the server's `message`, `detail` or `error`. Error messages show each `${VAR}` as written in `components.json`, not its value:

```txt
You are not authorized to access the item at https://api.company.com/registry/button.json. If this is a remote registry, you may need to authenticate.
Check your authentication credentials and environment variables.
```

A `registries` entry without `{name}`, or a key without `@`, makes `components.json` invalid.

## Run your own namespace

Build your items with [`build`](/docs/cli#build) and serve them, as [Getting Started](/docs/registry/getting-started) shows. Then tell your users which entry to add:

```json title="components.json"
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```
