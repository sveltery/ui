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

**Options**

```txt
Usage: sveltery add [options] [items...]

add components to the project

Arguments:
  items            item names, or URLs of registry items

Options:
  -y, --yes        do not ask to continue; changed files are skipped unless
                   --overwrite is set (default: false)
  -o, --overwrite  overwrite changed files (default: false)
  -a, --all        add every item (default: false)
  --dry-run        show the plan and stop (default: false)
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

---

## diff

Use the `diff` command to see how the registry versions of your installed items differ from your files. It never writes anything.

```bash
npx @sveltery/ui@latest diff
```

An item counts as installed when any of its files exists under `aliases.ui`. With no names, `diff` checks every installed item and the items they depend on. A named item that is not installed is an error.

`diff` prints a unified diff for each file that differs. Your file is the `a/` side and the registry version is the `b/` side, so `+` lines are what `update` would write. It ends with a count such as `3 files differ in 2 items`, or `Everything is up to date.`

**Options**

```txt
Usage: sveltery diff [options] [items...]

show how the registry versions of installed items differ from your files

Arguments:
  items         item names; every installed item when omitted

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

**Options**

```txt
Usage: sveltery update [options] [items...]

re-add installed items, showing each changed file's diff and asking before it
overwrites

Arguments:
  items         item names; every installed item when omitted

Options:
  -y, --yes     overwrite changed files without asking (default: false)
  --no-install  do not install packages
  --cwd <path>  the project root (default: ".")
  -h, --help    display help for command
```

`-y` discards your edits to the changed files.

`diff` and `update` take item names only. They do not check items that you added by URL.

---

## list

Use the `list` command to see every item in the registry. Items in your project are marked `installed`.

```bash
npx @sveltery/ui@latest list
```

```txt
accordion           registry:ui
alert               registry:ui
alert-dialog        registry:ui
```

Pass `--json` for an array of `{ name, type, installed }`.

**Options**

```txt
Usage: sveltery list [options]

list the registry's items and mark the installed ones

Options:
  --json        print the items as JSON (default: false)
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

The shadcn CLI has commands and options that this CLI does not have yet: `apply`, `preset`, `view`, `search`, `build`, `docs`, `info`, `migrate` and `eject`, namespaced registries, local file paths as items, JavaScript output and the RTL transform. See [Registry](/docs/registry), [JavaScript](/docs/javascript) and [RTL](/docs/rtl) for what works today.
