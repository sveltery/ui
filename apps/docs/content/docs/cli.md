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

---

## add

Use the `add` command to add components and their dependencies to your project.

```bash
npx @sveltery/ui@latest add button dialog
```

`add` fetches each item and the items it depends on. It shows the files it will write and the packages it will install, then asks you to continue. Files go to the `aliases.ui` directory in `components.json`, which is `src/lib/components/ui` by default.

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

`view` prints one JSON array with an object for each argument, in the order you gave them. Each object is the item as the registry serves it, with the content of its files. It does not fetch the items they depend on. An argument is an item name, or the URL of an item.

The item name resolves in the style from `components.json`, or `nova` when there is none. The registry is `SVELTERY_REGISTRY_URL`, else the `registry` key of `components.json`, else the Sveltery registry.

**Options**

```txt
Usage: sveltery view [options] <items...>

view items from the registry

Arguments:
  items         item names, or URLs of registry items

Options:
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

---

## search

Use the `search` command to find items in the registry. `list` is an alias. It never writes anything and needs no `components.json`.

```bash
npx @sveltery/ui@latest search -q dialog
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

`--json` prints `pagination` and `items` instead. Each item has `name`, `title`, `type`, `description`, `registry` and `addCommandArgument`. This is `search -q dialog -t ui --json`:

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

The only registry is `@sveltery`, the Sveltery UI registry that `SVELTERY_REGISTRY_URL` or `components.json` points at. Pass it to be explicit. Any other registry is an error. See [differences](/docs/differences#search-takes-one-registry-and-no-installed-mark).

**Options**

```txt
Usage: sveltery search|list [options] [registries...]

search items from registries

Arguments:
  registries             the registries to search; the only one is @sveltery,
                         the default

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
- **Configuration.** The `style`, `iconLibrary`, `menuColor` and `menuAccent` from `components.json`, and the registry the CLI reads.
- **Preset.** The preset code that your `components.json` and CSS add up to, its values, and the [Create page](/create) link for it. A `*` marks a value that the project does not show, so it takes the style's default. Use `init --preset` with the code to make the same setup in another app.
- **Aliases** and **Resolved Paths.** Where each alias points, as absolute paths.
- **Installed Components.** The registry items that have a folder under `aliases.ui`.
- **Links.** The docs, the Markdown page and registry file of a component, and the `components.json` schema.

```txt
Configuration
  style        sera
  iconLibrary  lucide
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

## Environment variables

`SVELTERY_REGISTRY_URL` sets the registry root, for example a preview deploy's `/r` URL. It takes precedence over the `registry` key in `components.json`. `init` writes the URL it used to that key.

```bash
SVELTERY_REGISTRY_URL=https://preview.example.com/r npx @sveltery/ui@latest add button
```

## Not supported

The shadcn CLI has commands and options that this CLI does not have yet: `apply`, `migrate`, `eject` and `registry add`, local file paths as items, JavaScript output and the RTL transform. See [Registry](/docs/registry), [JavaScript](/docs/javascript) and [RTL](/docs/rtl) for what works today.
