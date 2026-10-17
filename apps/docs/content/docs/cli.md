---
title: CLI
description: Use the Sveltery UI CLI to add components to your project.
order: 6
---

The CLI ships as the `@sveltery/ui` package. Run it with `npx`, so you always get the latest version.

The CLI asks before it changes files. In a terminal that cannot answer prompts, such as CI, pass `--yes`. Without it, a command that needs an answer stops with `No terminal to confirm in. Re-run with --yes.`

## init

Use the `init` command to set up an existing SvelteKit or Vite app. It writes `components.json`, adds the theme to your CSS file and installs the base packages.

```bash
npx @sveltery/ui@latest init
```

`init` asks for a style, an icon library and a base color. Then it:

- writes [`components.json`](/docs/components-json).
- adds the `tw-animate-css` and `@sveltery/ui/tailwind.css` imports, the `dark` custom variant and the [theme tokens](/docs/theming) to your CSS file.
- installs `cn`, `class-variance-authority`, `tw-animate-css` and the icon package as dependencies, and `@sveltery/ui` as a dev dependency, because your CSS imports its `tailwind.css`.
- gives SvelteKit 3's `"#lib/*": "./src/lib/*"` mapping in `package.json` a `./src/lib/*/index.js` fallback, so TypeScript resolves imports such as `#lib/components/ui/button`.

`init` needs Svelte 5, Tailwind CSS 4, and `@sveltejs/kit` or `vite` in `package.json`. It uses the CSS file from the `--css` flag, else `tailwind.css` in an existing `components.json`. Without either, it takes `src/app.css` or the first CSS file under `src/`, whichever first contains `@import "tailwindcss"`.

Run `init` again at any time. A second run with the same choices leaves your files unchanged. With `-y`, it keeps the choices in your `components.json`.

To start from a preset, pass `--preset`. It takes a preset name such as `nova`, a preset code from the [Create page](/create), or the URL of an `/init` item. A preset sets the style, icon library, base color, theme, fonts, radius and menu look. Its fonts install as Fontsource packages.

```bash
npx @sveltery/ui@latest init --preset sera
```

`--preset` with no value lists the presets. Pick **Custom** to get a link to the Create page.

To create a new monorepo with a SvelteKit app in `apps/web` and the shared `@workspace/ui` package in `packages/ui`, pass `--monorepo` in an empty directory. `--name` sets the folder it creates, `sveltekit-monorepo` by default. `init` writes the theme and the button to `packages/ui`, gives `apps/web/components.json` the same settings, and installs the packages. Run in a monorepo it created, `init --monorepo` sets up both workspaces again and leaves your components alone. It asks for the settings before it creates anything. See [Monorepo](/docs/monorepo).

```bash
npx @sveltery/ui@latest init --monorepo
```

**Options**

```txt
Usage: sveltery init [options]

set up components.json, the theme and the base packages

Options:
  -y, --yes              use the defaults without prompting (default: false)
  -p, --preset [preset]  use a preset: a name such as nova, a preset code, or an
                         /init URL
  --style <name>         the component style
  --icons <library>      the icon library
  --base-color <name>    the base color of the theme
  --css <path>           the CSS file that imports Tailwind
  --rtl                  enable RTL support
  --no-rtl               disable RTL support
  --monorepo             scaffold a monorepo project
  -n, --name <name>      the name for the new project
  --cwd <path>           the project root (default: ".")
  --no-install           do not install packages
  -h, --help             display help for command
```

| Option | Values |
| --- | --- |
| `--style` | `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea` |
| `--icons` | `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon` |
| `--base-color` | `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist` or `taupe` |

`--preset` cannot be combined with `--style`, `--icons` or `--base-color`. With `-y` and no value, `--preset` uses `nova`.

`--rtl` writes `rtl: true` to `components.json`, so `add` turns physical classes into logical ones. It works with or without `--preset`. See [RTL](/docs/rtl).

---

## add

Use the `add` command to add components and their dependencies to your project.

```bash
npx @sveltery/ui@latest add button dialog
```

`add` fetches each item and the items it depends on. It shows the files it will write and the packages it will install, then asks you to continue. Files go to the `aliases.ui` directory in `components.json`, which is `src/lib/components/ui` by default. In a [monorepo](/docs/monorepo) app whose `aliases.ui` names another workspace package, such as `@workspace/ui/components`, the ui files and their packages go to that package.

If a file already exists and differs, `add` asks before it overwrites it. It skips identical files.

An argument that is a URL is fetched as is. Use it to add an item from [your own registry](/docs/registry).

```bash
npx @sveltery/ui@latest add https://example.com/r/hello-card.json
```

An argument such as `@acme/hello-card` installs `hello-card` from the registry that the `registries` key in `components.json` maps to `@acme`. See [Namespaces](/docs/registry/namespace).

```bash
npx @sveltery/ui@latest add @acme/hello-card
```

**Options**

```txt
Usage: sveltery add [options] [items...]

add components to the project

Arguments:
  items            item names, @namespace/item names, or URLs of registry items

Options:
  -y, --yes        do not ask to continue; changed files are skipped unless
                   --overwrite is set (default: false)
  -o, --overwrite  overwrite changed files (default: false)
  -a, --all        add every item (default: false)
  --dry-run        show the plan and stop (default: false)
  --diff [path]    show the diff of each file that would change, or of the file
                   matching path; implies --dry-run
  --view [path]    show the contents of each file that would be written, or of
                   the file matching path; implies --dry-run
  --no-install     do not install packages
  --cwd <path>     the project root (default: ".")
  -h, --help       display help for command
```

`--dry-run` prints the plan and writes nothing. Each file has a mark: `+` for a new file, `~` for a file that differs and `=` for an identical one.

```txt
Files:
  + src/lib/components/ui/button/Button.svelte (new)
  + src/lib/components/ui/button/index.ts (new)
  + src/lib/components/ui/button/types.ts (new)
  + src/lib/components/ui/button/variants.ts (new)
Packages:
  @sveltery/base@^0.2.0
```

`--diff` and `--view` imply `--dry-run`. They show what the plan would write, for any item address, including a URL.

- `--diff` prints a unified diff for each file that would change. A new file diffs from `/dev/null`. Your file is the `a/` side and the registry version is the `b/` side.
- `--view` prints the contents each file would have, after the project's transforms, under a line such as `src/lib/components/ui/button/Button.svelte (new, 8 lines)`.

Without a path, both show five files at most, and `--diff` skips identical files. Pass a path to show one file. It matches the project path exactly, or else every path that contains it. Put the item names before the flag, because the flag takes the next word as its path.

```bash
npx @sveltery/ui@latest add button --diff
npx @sveltery/ui@latest add https://example.com/r/hello-card.json --view hello-card
```

---

## diff

Use the `diff` command to see how the registry versions of your installed items differ from your files. It never writes anything.

```bash
npx @sveltery/ui@latest diff
```

An item counts as installed when any of its files exists in the project. With no names, `diff` checks every installed item of the configured registry and the items they depend on. A named item that is not installed is an error.

An argument that is a URL works like a name. `diff` fetches the item and its registry dependencies, as `add` does, and compares them with your files. The item must be installed, and the URL must be the one you added it with, because a project does not record where an item came from. An unnamed `diff` cannot know which URLs you used, so it does not check items that only a URL names. To check one, pass its URL.

```bash
npx @sveltery/ui@latest diff https://example.com/r/hello-card.json
```

`diff` prints a unified diff for each file that differs. Your file is the `a/` side and the registry version is the `b/` side, so `+` lines are what `update` would write. It ends with a count such as `3 files differ in 2 items`, or `Everything is up to date.`

**Options**

```txt
Usage: sveltery diff [options] [items...]

show how the registry versions of installed items differ from your files

Arguments:
  items         item names or URLs; every installed item of the registry when
                omitted

Options:
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## update

Use the `update` command to apply registry changes to your installed items.

```bash
npx @sveltery/ui@latest update
```

`update` plans the same files as `add`, including new files, new items an item now depends on and missing packages. For each changed file, it shows the diff and asks whether to overwrite it. The default answer is no. It writes new files without asking.

Like `diff`, it takes item names and URLs, and with no arguments it updates every installed item of the configured registry, but not items that only a URL names. To update one, pass its URL. See [diff](#diff).

```bash
npx @sveltery/ui@latest update https://example.com/r/hello-card.json
```

**Options**

```txt
Usage: sveltery update [options] [items...]

re-add installed items, showing each changed file's diff and asking before it
overwrites

Arguments:
  items         item names or URLs; every installed item of the registry when
                omitted

Options:
  -y, --yes     overwrite changed files without asking (default: false)
  --no-install  do not install packages
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

`-y` discards your edits to the changed files.

`diff` and `update` also take `@namespace/item` names.

---

## apply

Use the `apply` command to switch a project that ran `init` to another preset.

```bash
npx @sveltery/ui@latest apply sera
```

`apply` takes the same presets as `init --preset`: a preset name such as `nova`, a preset code from the [Create page](/create), or the URL of an `/init` item. It writes the preset's settings, theme and fonts the way `init --preset` does. Then it adds your installed items again and overwrites them, so a new style or icon library reaches your components. It lists those items and asks before it continues. The default answer is no, so commit or stash your changes first.

To apply part of a preset, pass `--only` with `theme`, `font` or both. A partial apply leaves your components alone and keeps `style` and `iconLibrary` in `components.json`. With `theme`, it changes the base color, menu color and menu accent in `components.json`, and the color variables in your CSS file. With `font`, it changes only your CSS file, which gets the font imports and variables, and installs the font packages.

```bash
npx @sveltery/ui@latest apply sera --only theme,font
```

`theme` sets the base color, the theme tokens, the radius and the menu look. `font` sets the fonts. An `/init` URL with an `only` parameter applies the same parts, and `--only` overrides it.

In a [monorepo](/docs/monorepo) app, `apply` also writes the style, icon library, base color, menu and RTL settings to the `components.json` of the ui package, re-adds the ui components with them, and installs the packages of the theme and the fonts in the ui package. A partial apply without `theme` leaves the ui package's `components.json` alone.

With no preset, `apply` prints a link to the Create page, where you can build one.

**Options**

```txt
Usage: sveltery apply [options] [preset]

apply a preset to a project that ran init

Arguments:
  preset             the preset: a name such as nova, a preset code, or an /init
                     URL

Options:
  --preset <preset>  the preset, as an option
  --only [parts]     apply only parts of the preset: theme, font
  -y, --yes          do not ask to continue (default: false)
  -s, --silent       do not print the plan or the package manager output
                     (default: false)
  --no-install       do not install packages
  --cwd <path>       the project root (default: ".")
  -h, --help         display help for command
```

The preset can be the argument or the `--preset` value. If you pass both, they must match. `--silent` hides the plan and the package manager output. Without `--yes`, `apply` still lists the items and asks.

---

## preset

Use the `preset` command to read, share and open [preset](/docs/cli#init) codes. None of its subcommands writes a file.

```bash
npx @sveltery/ui@latest preset decode b4xFeBLg4O
```

```txt
  code         b4xFeBLg4O
  version      b
  style        sera
  baseColor    taupe
  theme        taupe
  chartColor   taupe
  iconLibrary  lucide
  font         noto-sans
  fontHeading  playfair-display
  radius       default
  menuAccent   subtle
  menuColor    default
  url          https://ui.sveltery.dev/create?preset=b4xFeBLg4O
```

- `preset decode <code>` prints what a code sets. An older code does not carry every value, so `decode` fills in the chart color the older code implied, marks it with `*` and says so. `--json` prints `code`, `version`, `values`, `derived` and `url`.
- `preset url <code>` prints the link to the [Create page](/create) with the code loaded.
- `preset open <code>` prints that link and opens it in your browser, with `open` on macOS, `start` on Windows and `xdg-open` elsewhere.
- `preset resolve` (alias `preset info`) reads your `components.json` and CSS file and prints the preset they add up to, in the same form as `decode`. A `*` marks a value your project does not show, which takes the style's default. `--json` prints `code`, `values` and `fallbacks`, or `null` when there is no `components.json`.

The Create page link uses the origin of `SVELTERY_REGISTRY_URL`, and `https://ui.sveltery.dev` without it. `preset resolve` also honors the `registry` key in `components.json`, with `SVELTERY_REGISTRY_URL` taking precedence. A code that is not a preset code is an error. See [differences](/docs/differences#preset-resolve-reads-the-css-of-a-svelte-project) for how `resolve` differs from the shadcn CLI.

**Options**

```txt
Usage: sveltery preset [options] [command]

manage presets

Options:
  -h, --help               display help for command

Commands:
  decode [options] <code>  decode a preset code
  url <code>               get the create URL for a preset code
  open <code>              open a preset code in the browser
  resolve|info [options]   resolve a preset from your project
```

```txt
Usage: sveltery preset decode [options] <code>

decode a preset code

Arguments:
  code        the preset code to decode

Options:
  --json      output as JSON. (default: false)
  -h, --help  display help for command
```

```txt
Usage: sveltery preset url [options] <code>

get the create URL for a preset code

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

```txt
Usage: sveltery preset open [options] <code>

open a preset code in the browser

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

```txt
Usage: sveltery preset resolve|info [options]

resolve a preset from your project

Options:
  --json        output as JSON. (default: false)
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## view

Use the `view` command to print registry items as JSON. It never writes anything and needs no `components.json`.

```bash
npx @sveltery/ui@latest view button
```

`view` prints one JSON array with an object for each argument, in the order you gave them. Each object is the item as the registry serves it, with the content of its files. It does not fetch the items they depend on. An argument is an item name, an `@namespace/item` name from the [`registries`](/docs/registry/namespace) of `components.json`, or the URL of an item.

The item name resolves in the style from `components.json`, or `nova` when there is none. The registry is `SVELTERY_REGISTRY_URL`, else the `registry` key of `components.json`, else the Sveltery registry.

**Options**

```txt
Usage: sveltery view [options] <items...>

view items from the registry

Arguments:
  items         item names, @namespace/item names, or URLs of registry items

Options:
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## search

Use the `search` command to find items in registries. `list` is an alias. It never writes anything. `@sveltery` is the Sveltery UI registry that `SVELTERY_REGISTRY_URL` or `components.json` points at, and searching it needs no `components.json`:

```bash
npx @sveltery/ui@latest search @sveltery -q dialog
```

```txt
Found 3 items matching "dialog" in @sveltery
Showing 1-3 of 3

- dialog (ui)
- alert-dialog (ui)
- sidebar-13 (block) — A sidebar in a dialog.
```

`search` ranks the items by how well the query matches their name, title and description, as the shadcn CLI does. With no query it prints every item in registry order: the components, then the blocks. A line shows the argument to give `add`, the item type and a shortened description.

`--type` keeps items of one type. It takes `ui`, `block`, `lib`, `theme`, `base` or `font`, or the same with a `registry:` prefix, and several types separated by commas. `--limit` and `--offset` page through the results, and the last line gives the `--offset` of the next page. `--limit 0` shows everything.

`--json` prints `pagination` and `items` instead. Each item has `name`, `title`, `type`, `description`, `registry` and `addCommandArgument`. This is `search @sveltery -q dialog -t ui --json`:

```json
{
  "pagination": { "total": 2, "offset": 0, "limit": 100, "hasMore": false },
  "items": [
    {
      "name": "dialog",
      "title": "Dialog",
      "type": "registry:ui",
      "registry": "@sveltery",
      "addCommandArgument": "dialog"
    },
    {
      "name": "alert-dialog",
      "title": "Alert Dialog",
      "type": "registry:ui",
      "registry": "@sveltery",
      "addCommandArgument": "alert-dialog"
    }
  ]
}
```

With no argument, `search` searches every [namespace](/docs/registry/namespace) in the `registries` of `components.json`, in the order they are listed, except `@sveltery`. Upstream leaves out its built-in registries in the same way. It fetches at most eight registries at once. Without a `components.json`, or when `registries` lists no other namespace, it stops and asks you to name a registry. A registry that fails, or needs an environment variable that is not set, is skipped: a `Skipped @acme: ...` line names it, and `--json` lists it under `errors`. When every registry fails, `search` prints them and exits with code 1. To search some registries only, pass them:

```bash
npx @sveltery/ui@latest search @acme -q card
```

`search` fetches the namespace's item named `registry`, such as `https://acme.com/r/registry.json`, which is the `registry.json` that `build` writes. It sends the query, the types, `--limit` and `--offset` as the `q`, `type`, `limit` and `offset` query parameters. With several registries, it sends no `offset`, and `limit` is `--offset` plus `--limit`, as upstream does. A registry that answers with `pagination` has filtered and paged the items itself, and `search` prints its page as it is. Otherwise `search` filters and ranks the items. A result from a namespace gives `add` the `@acme/name` form. When you pass registries, a missing environment variable stops the search before any request is sent.

`search` also takes the URL of a registry's `registry.json`, with the same query parameters, and gives `add` the URL of each item, such as `https://acme.com/r/card.json`:

```bash
npx @sveltery/ui@latest search https://acme.com/r/registry.json
```

A GitHub source, `owner/repo` or `owner/repo#ref`, reads the `registry.json` at the root of a public repository, at the default branch or at the branch, tag or commit after `#`. `search` filters it itself and gives each result as `owner/repo/name`. `add` does not install that form yet. See [differences](/docs/differences#search-reads-a-github-registry-at-its-ref-without-include-or-sign-in).

Pass several registries to search them together. Each line then names its registry. A registry named twice is searched twice, as upstream does. A namespace that `registries` does not list is an error. See [differences](/docs/differences#search-gives-sveltery-items-by-bare-name-and-looks-up-no-directory).

**Options**

```txt
Usage: sveltery search|list [options] [registries...]

search items from registries

Arguments:
  registries             the registry addresses to search. Supports namespaces,
                         GitHub sources and URLs. When omitted, searches all
                         registries configured in components.json.

Options:
  -q, --query <query>    query string
  -t, --type <type>      filter by item type, e.g. ui, block. Comma-separated
                         for multiple.
  -l, --limit <number>   maximum number of items to display (default: "100")
  -o, --offset <number>  number of items to skip (default: "0")
  --json                 output as JSON. (default: false)
  --cwd <path>           the project root (default: ".")
  -h, --help             display help for command
```

---

## build

Use the `build` command to generate the JSON files of [your own registry](/docs/registry/getting-started).

```bash
npx @sveltery/ui@latest build
```

`build` reads `registry.json` and writes one item file per item to `static/r`, such as `static/r/hello-card.json`, with each file's source in `content`. It also writes `static/r/registry.json`. A SvelteKit app serves the `static` folder, so the items are at `/r/<name>.json`.

**Options**

```txt
Usage: sveltery build [options] [registry]

build components for a registry

Arguments:
  registry             path to registry.json file (default: "./registry.json")

Options:
  -o, --output <path>  destination directory for json files (default:
                       "./static/r")
  -c, --cwd <path>     the working directory (default: ".")
  -h, --help           display help for command
```

To change the output directory, use the `--output` option. In a Vite app without SvelteKit, pass `./public/r`.

```bash
npx @sveltery/ui@latest build --output ./public/r
```

---

## docs

Use the `docs` command to get the links to a component's docs, its examples and its API reference. It never writes anything and needs no `components.json`.

```bash
npx @sveltery/ui@latest docs button dropdown-menu
```

```txt
button
  - docs      https://ui.sveltery.dev/docs/components/button
  - examples  https://ui.sveltery.dev/docs/components/button.md
  - api       https://base-ui.com/react/components/button.md

dropdown-menu
  - docs      https://ui.sveltery.dev/docs/components/dropdown-menu
  - examples  https://ui.sveltery.dev/docs/components/dropdown-menu.md
  - api       https://base-ui.com/react/components/menu.md
```

`docs` reads the links from the `meta.links` of each item in the registry's [`index.json`](/docs/registry/registry-json). `docs` is the page. `examples` is the same page as Markdown, with the source of every example inlined, so an agent can read it. `api` is the Base UI API reference as Markdown, which only a component styled on a Base UI component has. A name that is not in the registry is an error, and an item or block that has no links prints a warning.

`--json` prints `{ base, results }`, where each result has `component`, `base` and `links`. `base` is always `base`, because the Base UI variant is the only one.

**Options**

```txt
Usage: sveltery docs [options] <components...>

get docs, api references and usage examples for components

Arguments:
  components    component names

Options:
  --json        output as JSON. (default: false)
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## info

Use the `info` command to see how the CLI reads your project. It never writes anything and works in any folder, with or without `components.json`.

```bash
npx @sveltery/ui@latest info
```

`info` prints these groups:

- **Project.** The framework (`SvelteKit`, `Vite` or `Manual`) and its version, and the Svelte and Tailwind CSS versions. A version is the one in `node_modules` when the package is installed, else the one in `package.json`. It also shows whether the project has a `src` folder, the CSS file that imports Tailwind, and the import alias (`$lib` or `#lib`) of a SvelteKit app.
- **Configuration.** The `style`, `iconLibrary`, `rtl`, `menuColor` and `menuAccent` from `components.json`, and the registry the CLI reads.
- **Preset.** The preset code that your `components.json` and CSS add up to, its values, and the [Create page](/create) link for it. A `*` marks a value that the project does not show, so it takes the style's default. Use `init --preset` with the code to make the same setup in another app.
- **Aliases** and **Resolved Paths.** Where each alias points, as absolute paths.
- **Installed Components.** The registry items that have a folder under `aliases.ui`.
- **Links.** The docs, the Markdown page and registry file of a component, and the `components.json` schema.

```txt
Configuration
  style        sera
  iconLibrary  lucide
  rtl          No
  menuColor    default
  menuAccent   subtle
  registry     https://ui.sveltery.dev/r

Preset
  code         b4xFeBLg4O
  version      b
  style        sera
  baseColor    taupe
  theme        taupe
  chartColor   taupe
  iconLibrary  lucide
  font         noto-sans
  fontHeading  playfair-display
  radius       default
  menuAccent   subtle
  menuColor    default
  url          https://ui.sveltery.dev/create?preset=b4xFeBLg4O
```

Pass `--json` for the same data as an object with `project`, `config`, `preset`, `components` and `links`. `project`, `config` and `preset` are `null` when there is no `package.json` or `components.json`. See [differences](/docs/differences#info-reports-a-svelte-project) for what it leaves out from the shadcn CLI.

**Options**

```txt
Usage: sveltery info [options]

get information about your project

Options:
  --json        output as JSON. (default: false)
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## migrate

Use the `migrate` command to change code that is already in your project.

```bash
npx @sveltery/ui@latest migrate icons --to tabler
```

Run `migrate --list` to see the migrations. Each one asks before it writes. The default answer is yes.

| Migration | What it changes |
| --- | --- |
| `icons` | Swaps the icon library in your installed components, then sets `iconLibrary` in `components.json`. |
| `base-color` | Swaps the theme's base color in your CSS file, then sets `tailwind.baseColor` in `components.json`. |
| `cn` | Moves `clsx`, `tailwind-merge` and `cnfast` imports in your `.svelte`, `.ts` and `.js` files to the `cn` package. |
| `rtl` | Changes physical classes in your installed components to logical ones for right-to-left layouts, then sets `rtl: true` in `components.json`. |

There is no `radix` migration. In shadcn/ui, it moves `@radix-ui/react-*` imports to the `radix-ui` package, and a Svelte project has no such imports.

Pass a file, a directory or a glob pattern to migrate only those files. By default, `icons` and `rtl` migrate the `aliases.ui` directory and `cn` migrates every source file in the project. A glob pattern needs Node 22 or later. A file that does not parse, such as a module with `</script>` in a string, stays as it is, and `migrate` lists it.

### icons

`icons` changes each icon's import, its tags and the attributes that pass it as a value. It installs the new library's package. It maps each icon to the one the registry's components use for it. An icon with no match, or one used outside the markup, stays as it is, and `migrate` lists it. Hugeicons wraps each icon in `<HugeiconsIcon icon={...} />`, so an icon moves to or from Hugeicons only where it is a self-closing tag.

```bash
npx @sveltery/ui@latest migrate icons --from lucide --to phosphor
```

A run with a path leaves `iconLibrary` in `components.json` as it is.

### base-color

`base-color` changes only the theme tokens that still have the old base color's value. It keeps tokens that you changed, or that a preset's theme color set, and it lists them.

```bash
npx @sveltery/ui@latest migrate base-color --to stone
```

### cn

`cn` replaces `twMerge(clsx(...))` with `cn(...)`. It replaces an exported helper that only returns `twMerge(clsx(inputs))`, such as `cn` in a shadcn-svelte `utils.ts`, with `export { cn } from 'cn'`. It does not need `components.json`.

```bash
npx @sveltery/ui@latest migrate cn
```

`cn` installs the `cn` package before it writes. After a run without a path, it removes `clsx`, `tailwind-merge` and `cnfast` if no file imports them. It lists what you must change by hand, such as a dynamic import, an `export ... from` declaration or a CommonJS `require`. It needs Tailwind CSS 4 and `tailwind-merge` 3.

### rtl

`rtl` rewrites the components you already installed for right-to-left layouts. It changes physical classes such as `ml-2` and `left-0` to logical ones such as `ms-2` and `start-0`, the same transform `add` applies in an RTL project.

```bash
npx @sveltery/ui@latest migrate rtl
npx @sveltery/ui@latest migrate rtl "src/lib/components/ui/dropdown-menu/**"
```

It sets `rtl: true` in `components.json`, also after a run with a path. It lists the calendar, pagination and sidebar files it finds for you to check by hand. The icons that `add` would flip lose their flip marker when an LTR project adds them, so run `update` afterwards to get them back. See [Manual Migration](/docs/rtl#manual-migration-optional).

**Options**

```txt
Usage: sveltery migrate [options] [migration] [path]

run a migration

Arguments:
  migration          the migration to run
  path               a file, directory or glob pattern to migrate

Options:
  -l, --list         list all migrations (default: false)
  -y, --yes          skip the confirmation prompt (default: false)
  -f, --from <name>  the base color or icon library to migrate from
  -t, --to <name>    the base color or icon library to migrate to
  --no-install       do not install or remove packages
  --cwd <path>       the project root (default: ".")
  -h, --help         display help for command
```

`icons` asks for a missing `--from` or `--to`, and offers `iconLibrary` from `components.json` as the source. `base-color` takes `tailwind.baseColor` from `components.json` as the source, and asks only for a missing `--to`. With `--yes`, neither asks, so pass `--to`. `cn` and `rtl` do not use `--from` or `--to`.

---

## eject

Use the `eject` command to drop the `@sveltery/ui` package from your project. Your CSS file imports `@sveltery/ui/tailwind.css`, which holds the custom variants and animations the components use.

```bash
npx @sveltery/ui@latest eject
```

`eject` replaces that import with the file's contents, under a comment that names the version. Then it removes `@sveltery/ui` from `package.json` with your package manager. It asks before it changes anything. The default answer is no.

After `eject`, updates to `tailwind.css` no longer reach your project. You can still run the CLI with `npx`. A later `init` or `apply` adds the import and the dev dependency again.

**Options**

```txt
Usage: sveltery eject [options]

inline @sveltery/ui/tailwind.css into your CSS file and remove the @sveltery/ui
dependency

Options:
  -y, --yes     do not ask to continue (default: false)
  -s, --silent  do not print the warnings or the package manager output
                (default: false)
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## Environment variables

`SVELTERY_REGISTRY_URL` sets the registry root, for example a preview deploy's `/r` URL. It takes precedence over the `registry` key in `components.json`. `init` writes the URL it used to that key.

```bash
SVELTERY_REGISTRY_URL=https://preview.example.com/r npx @sveltery/ui@latest add button
```

## Not supported

The shadcn CLI has commands and options that this CLI does not have yet: `registry add`, local file paths as items, GitHub items such as `owner/repo/item` and JavaScript output. See [Registry](/docs/registry) and [JavaScript](/docs/javascript) for what works today.
