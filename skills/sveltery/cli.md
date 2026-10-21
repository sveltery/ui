# Sveltery UI CLI Reference

The CLI is the `@sveltery/ui` package, with the bin `sveltery`. It reads `components.json`.

> **IMPORTANT:** Run it with the project's package runner: `npx @sveltery/ui@latest`, `pnpm dlx @sveltery/ui@latest` or `bunx @sveltery/ui@latest`. Examples below use `npx @sveltery/ui@latest`.

> **IMPORTANT:** Use only the flags on this page. If a flag is not listed, it does not exist. The CLI detects the package manager itself. There is no `--package-manager`, `--path`, `--template`, `--base`, `--defaults` or `--force` flag.

> **IMPORTANT:** The CLI asks before it changes files. Where nothing can answer a prompt, pass `--yes`. Without it, the command stops with `No terminal to confirm in. Re-run with --yes.`

The full reference is [ui.sveltery.dev/docs/cli.md](https://ui.sveltery.dev/docs/cli.md). It wins over this page.

## Contents

- Commands: init, apply, add, diff, update, search, view, docs, info, preset, build, migrate, eject
- Presets
- Environment variables

---

## Commands

### `init`: set up a project

```bash
npx @sveltery/ui@latest init [options]
```

Sets up an existing SvelteKit or Vite app. It writes `components.json`, adds the theme tokens and the `@sveltery/ui/tailwind.css` import to the CSS file, and installs `cn`, `class-variance-authority`, `tw-animate-css` and the icon package. It needs Svelte 5, Tailwind CSS 4, and `@sveltejs/kit` or `vite` in `package.json`. A second run with the same choices changes nothing.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--yes` | `-y` | Use the defaults without prompting | `false` |
| `--preset [preset]` | `-p` | A preset name, a preset code or an `/init` URL. No value lists the presets | — |
| `--style <name>` | | `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea` | — |
| `--icons <library>` | | `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon` | — |
| `--base-color <name>` | | `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist` or `taupe` | — |
| `--css <path>` | | The CSS file that imports Tailwind | detected |
| `--rtl` / `--no-rtl` | | Turn RTL support on or off | — |
| `--monorepo` | | Create a SvelteKit monorepo in an empty directory | — |
| `--name <name>` | `-n` | The folder `--monorepo` creates | `sveltekit-monorepo` |
| `--cwd <path>` | | The project root | `.` |
| `--no-install` | | Do not install packages | — |

`--preset` cannot be combined with `--style`, `--icons` or `--base-color`. `init` does not create a new single app. To start one, create a SvelteKit app with `npx sv create`, add Tailwind CSS 4, then run `init`.

### `apply`: switch a project to another preset

```bash
npx @sveltery/ui@latest apply [preset] [options]
```

Writes the preset's settings, theme and fonts, then re-adds every installed item and overwrites it. It lists the items and asks first. The default answer is no.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--preset <preset>` | | The preset, as an option. Must match the argument if both are given | — |
| `--only [parts]` | | Apply only `theme`, `font` or `theme,font`. Leaves components alone | — |
| `--yes` | `-y` | Do not ask to continue | `false` |
| `--silent` | `-s` | Hide the plan and the package manager output | `false` |
| `--no-install` | | Do not install packages | — |
| `--cwd <path>` | | The project root | `.` |

With no preset, `apply` prints a link to the Create page.

### `add`: add components

> **IMPORTANT:** To compare local components with the registry, use `add --dry-run`, `--diff`, `--view` or the `diff` command. Never fetch raw files from GitHub.

```bash
npx @sveltery/ui@latest add [items...] [options]
```

Takes item names (`button`), namespaced names (`@acme/hello-card`), public GitHub items (`owner/repo/item` or `owner/repo/item#ref`) and item URLs. Local file paths are not supported. Files go to `aliases.ui`, in a folder per item, such as `src/lib/components/ui/button/Button.svelte`.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--yes` | `-y` | Do not ask. Changed files are skipped unless `--overwrite` is set | `false` |
| `--overwrite` | `-o` | Overwrite changed files | `false` |
| `--all` | `-a` | Add every item | `false` |
| `--dry-run` | | Print the plan and stop | `false` |
| `--diff [path]` | | Print the diff of each changed file, or of the file matching `path`. Implies `--dry-run` | — |
| `--view [path]` | | Print the contents each file would have, or the file matching `path`. Implies `--dry-run` | — |
| `--no-install` | | Do not install packages | — |
| `--cwd <path>` | | The project root | `.` |

Put item names before `--diff` or `--view`, because the flag takes the next word as its path. Without a path, both show at most five files. A path matches the project path exactly, or else every path that contains it.

```bash
npx @sveltery/ui@latest add button --dry-run
npx @sveltery/ui@latest add button --diff
npx @sveltery/ui@latest add button --diff Button.svelte
npx @sveltery/ui@latest add https://example.com/r/hello-card.json --view hello-card
```

`--dry-run` marks each file `+` (new), `~` (differs) or `=` (identical).

**When to use a dry run:**

- The user asks what `add` will change → `--dry-run`.
- Files exist and may be edited → `--diff` before overwriting.
- The user wants to read an item's source before installing it → `--view`.

### `diff`: compare installed items with the registry

```bash
npx @sveltery/ui@latest diff [items...] [options]
```

Prints a unified diff for each installed file that differs from the registry. Your file is the `a/` side, so `+` lines are what `update` would write. With no items, it checks every installed item of the configured registry. An item added by URL or from GitHub needs that same address. It never writes.

| Flag | Description | Default |
| --- | --- | --- |
| `--cwd <path>` | The project root | `.` |

### `update`: apply registry changes to installed items

```bash
npx @sveltery/ui@latest update [items...] [options]
```

Shows the diff of each changed file and asks before it overwrites. The default answer is no. New files are written without asking.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--yes` | `-y` | Overwrite changed files without asking. Discards local edits | `false` |
| `--no-install` | | Do not install packages | — |
| `--cwd <path>` | | The project root | `.` |

### `search`: search registries

```bash
npx @sveltery/ui@latest search [registries...] [options]
```

Alias: `list`. `@sveltery` is the Sveltery UI registry and needs no `components.json`. With no registries, it searches every namespace in `registries` except `@sveltery`. It also takes `owner/repo[#ref]` and registry URLs.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--query <query>` | `-q` | The query | — |
| `--type <type>` | `-t` | `ui`, `block`, `lib`, `theme`, `base` or `font`. Comma-separated | — |
| `--limit <number>` | `-l` | Items to show. `0` shows all | `100` |
| `--offset <number>` | `-o` | Items to skip | `0` |
| `--json` | | Print JSON | `false` |
| `--cwd <path>` | | The project root | `.` |

```bash
npx @sveltery/ui@latest search @sveltery -q dialog
npx @sveltery/ui@latest search @sveltery -t block --json
```

### `view`: print registry items

```bash
npx @sveltery/ui@latest view <items...> [options]
```

Prints a JSON array with each item and its file contents, as the registry serves it. It does not fetch dependencies or apply the project's transforms. Prefer `add --view` when the user wants to see what lands in their project.

| Flag | Description | Default |
| --- | --- | --- |
| `--cwd <path>` | The project root | `.` |

### `docs`: get docs links

```bash
npx @sveltery/ui@latest docs <components...> [options]
```

Prints each component's links. Fetch them.

```txt
button
  - docs      https://ui.sveltery.dev/docs/components/button
  - examples  https://ui.sveltery.dev/docs/components/button.md
  - api       https://base-ui.com/react/components/button.md
```

- `docs` is the page.
- `examples` is the page as Markdown with every example's source inlined. It is the Svelte API.
- `api` is the Base UI reference for the behavior the component ports. Its code is React. Read it for behavior, not syntax.

| Flag | Description | Default |
| --- | --- | --- |
| `--json` | Print `{ base, results }` | `false` |
| `--cwd <path>` | The project root | `.` |

### `info`: project information

```bash
npx @sveltery/ui@latest info --json
```

Works in any folder. `--json` prints an object:

| Field | Meaning |
| --- | --- |
| `project.framework` | `SvelteKit`, `Vite` or `Manual` |
| `project.frameworkVersion` | SvelteKit's version, or Vite's |
| `project.svelteVersion` | Svelte's version |
| `project.tailwindVersion` | Tailwind CSS's version |
| `project.srcDirectory` | Whether the project has `src/` |
| `project.tailwindCss` | The CSS file that imports Tailwind |
| `project.importAlias` | `$lib` or `#lib` in SvelteKit |
| `config.style` | The component style |
| `config.iconLibrary` | The icon library |
| `config.rtl` | Whether RTL is on |
| `config.menuColor`, `config.menuAccent` | The menu look |
| `config.aliases` | `components`, `ui`, `utils`, `lib`, `hooks` |
| `config.resolvedPaths` | Absolute paths for each alias, `cwd` and `tailwindCss` |
| `config.registry` | The registry URL the CLI reads |
| `preset` | The preset code and values the project adds up to |
| `components` | Installed items |
| `links` | Templated docs, Markdown, registry and schema URLs |

`project`, `config` and `preset` are `null` without a `package.json` or `components.json`.

| Flag | Description | Default |
| --- | --- | --- |
| `--json` | Print JSON | `false` |
| `--cwd <path>` | The project root | `.` |

### `preset`: read presets

None of these write a file.

```bash
npx @sveltery/ui@latest preset decode <code> [--json]
npx @sveltery/ui@latest preset url <code>
npx @sveltery/ui@latest preset open <code>
npx @sveltery/ui@latest preset resolve [--json] [--cwd <path>]
```

- `decode` prints what a code sets. A `*` marks a value an older code implied.
- `url` prints the Create page link for a code. `open` also opens it.
- `resolve` (alias `preset info`) prints the preset the project's `components.json` and CSS add up to. A `*` marks a value that falls back to the style's default.

### `build`: build a registry

```bash
npx @sveltery/ui@latest build [registry] [options]
```

Reads `registry.json` and writes one JSON file per item, plus `registry.json`, to `static/r`. See [registry.md](./registry.md).

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--output <path>` | `-o` | The output directory. Use `./public/r` in a Vite app without SvelteKit | `./static/r` |
| `--cwd <path>` | `-c` | The working directory | `.` |

### `migrate`: change code already in the project

```bash
npx @sveltery/ui@latest migrate [migration] [path] [options]
```

| Migration | What it changes |
| --- | --- |
| `icons` | Swaps the icon library in installed components, then sets `iconLibrary` |
| `base-color` | Swaps the theme's base color in the CSS file, then sets `tailwind.baseColor` |
| `cn` | Moves `clsx`, `tailwind-merge` and `cnfast` imports to the `cn` package |
| `rtl` | Changes physical classes to logical ones, then sets `rtl: true` |

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--list` | `-l` | List the migrations | `false` |
| `--yes` | `-y` | Skip the confirmation | `false` |
| `--from <name>` | `-f` | The base color or icon library to migrate from | — |
| `--to <name>` | `-t` | The base color or icon library to migrate to | — |
| `--no-install` | | Do not install or remove packages | — |
| `--cwd <path>` | | The project root | `.` |

With `--yes`, pass `--to`.

```bash
npx @sveltery/ui@latest migrate icons --from lucide --to phosphor
npx @sveltery/ui@latest migrate base-color --to stone
```

### `eject`: drop the `@sveltery/ui` dev dependency

Replaces the `@sveltery/ui/tailwind.css` import with its contents and removes the package.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--yes` | `-y` | Do not ask | `false` |
| `--silent` | `-s` | Hide warnings and package manager output | `false` |
| `--cwd <path>` | | The project root | `.` |

---

## Presets

`--preset` takes three forms:

1. **Name:** `--preset sera`.
2. **Code:** `--preset b4xFeBLg4O`, from the [Create page](https://ui.sveltery.dev/create).
3. **URL:** the URL of an `/init` item.

> **IMPORTANT:** Preset codes are opaque. Never decode or build them by hand. Pass them to `init --preset` or `apply`, and read them with `preset decode`.

A preset sets the style, icon library, base color, theme, fonts, radius and menu look. Its fonts install as Fontsource packages.

## Environment Variables

`SVELTERY_REGISTRY_URL` sets the registry root, such as a preview deploy's `/r` URL. It takes precedence over `registry` in `components.json`.

## Not Supported

`registry add`, local file paths as items, JavaScript output, an MCP server and a `create` command for new apps. Do not suggest them.
