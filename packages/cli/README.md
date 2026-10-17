# @sveltery/ui

Add [Sveltery UI](https://ui.sveltery.dev) components to a Svelte 5 app. The CLI copies each component's source into your project, so you own and edit it.

## Requirements

- Svelte 5 with SvelteKit or Vite.
- Tailwind CSS 4. If your app does not use Tailwind yet, run `npx sv add tailwindcss` first.

## Set up a project

```sh
npx @sveltery/ui@latest init
```

`init` asks for a style, an icon library and a base color. Then it:

- writes `components.json`,
- adds the theme tokens and the `@sveltery/ui/tailwind.css` import to your CSS file,
- installs `cn`, `class-variance-authority`, `tw-animate-css`, the icon package and `@sveltery/ui`, which ships the `tailwind.css` that your CSS imports.

Run it again at any time. A second run with the same choices leaves your files unchanged.

To start from a preset instead, pass `--preset`. It takes a preset name such as `nova`, a preset code from the [Create page](https://ui.sveltery.dev/create), or the URL of an `/init` item. A preset sets the style, icon library, base color, theme, fonts, radius and menu look, and its fonts install as fontsource packages. `--preset` with no value lists the presets, and **Custom** prints the Create page link.

```sh
npx @sveltery/ui@latest init --preset b0
```

| Option | Description |
| --- | --- |
| `-y, --yes` | Use the defaults (or the flags) without prompting. |
| `-p, --preset [name\|code\|url]` | Use a preset. Cannot be combined with `--style`, `--icons` or `--base-color`. With `-y` and no value, uses `nova`. |
| `--style <name>` | `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`. |
| `--icons <library>` | `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon`. |
| `--base-color <name>` | `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist` or `taupe`. |
| `--css <path>` | The CSS file that imports Tailwind. Defaults to `src/app.css`. |
| `--cwd <path>` | The project root. Defaults to the current directory. |
| `--no-install` | Do not install packages. |

## Add components

```sh
npx @sveltery/ui@latest add button dialog
```

`add` fetches each component and the components it depends on. It shows the files it will write and the packages it will install, then asks you to continue. Files go to the `aliases.ui` directory in `components.json`, which is `src/lib/components/ui` by default.

If a file already exists and differs, `add` asks before it overwrites it. Identical files are skipped.

| Option | Description |
| --- | --- |
| `-y, --yes` | Do not ask to continue. Changed files are skipped unless you also pass `-o`. |
| `-o, --overwrite` | Overwrite changed files without asking. |
| `-a, --all` | Add every component. |
| `--dry-run` | Show the plan and stop. |
| `--no-install` | Do not install packages. |
| `--cwd <path>` | The project root. Defaults to the current directory. |

An argument that is a URL is fetched as is, so you can add an item from another registry that uses the same format.

## See and apply upstream changes

```sh
npx @sveltery/ui@latest diff
npx @sveltery/ui@latest update
```

An item counts as installed when any of its files exists under `aliases.ui`. With no names, `diff` and `update` act on every installed item and the items they depend on. A named item that is not installed is an error.

`diff [items...]` prints a unified diff for each file that differs from the registry. Your file is the `a/` side and the registry version is the `b/` side, so `+` lines are what `update` would write. It ends with a count such as `3 files differ in 2 items`, or `Everything is up to date.`. It never writes anything.

`update [items...]` plans the same files as `add`, including new files, new items an item now depends on and missing packages. For each changed file it shows the diff and asks whether to overwrite it. The default is no. New files are written without asking.

| Option | Description |
| --- | --- |
| `-y, --yes` | Overwrite changed files without asking. This discards your edits to them. |
| `--no-install` | Do not install packages. |
| `--cwd <path>` | The project root. Defaults to the current directory. |

## Search the registry

```sh
npx @sveltery/ui@latest search -q dialog
```

`search` (alias `list`) prints the items in the registry, with a type and a description. It needs no `components.json`.

| Option | Description |
| --- | --- |
| `-q, --query <query>` | Rank and keep the items that match the query in their name, title or description. |
| `-t, --type <type>` | Keep one item type, such as `ui` or `block`. Comma-separate several. |
| `-l, --limit <number>` | Show at most this many items. Defaults to 100. |
| `-o, --offset <number>` | Skip this many items. Defaults to 0. |
| `--json` | Print `{ pagination, items }` as JSON. |
| `--cwd <path>` | The project root. Defaults to the current directory. |

## Use another registry

Set `SVELTERY_REGISTRY_URL` to the registry root, for example a preview deploy's `/r` URL. It takes precedence over the `registry` key in `components.json`.
