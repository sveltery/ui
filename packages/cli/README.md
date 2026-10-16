# @sveltery/cli

Add [Sveltery UI](https://github.com/sveltery/ui) components to a Svelte 5 app. The CLI copies each component's source into your project, so you own and edit it.

## Requirements

- Svelte 5 with SvelteKit or Vite.
- Tailwind CSS 4. If your app does not use Tailwind yet, run `npx sv add tailwindcss` first.

## Set up a project

```sh
npx @sveltery/cli@latest init
```

`init` asks for a style, an icon library and a base color. Then it:

- writes `components.json`,
- adds the theme tokens and the `@sveltery/cli/tailwind.css` import to your CSS file,
- installs `cn`, `class-variance-authority`, `tw-animate-css`, the icon package and `@sveltery/cli`, which ships the `tailwind.css` that your CSS imports.

Run it again at any time. A second run with the same choices leaves your files unchanged.

| Option | Description |
| --- | --- |
| `-y, --yes` | Use the defaults (or the flags) without prompting. |
| `--style <name>` | `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`. |
| `--icons <library>` | `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon`. |
| `--base-color <name>` | `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist` or `taupe`. |
| `--css <path>` | The CSS file that imports Tailwind. Defaults to `src/app.css`. |
| `--cwd <path>` | The project root. Defaults to the current directory. |
| `--no-install` | Do not install packages. |

## Add components

```sh
npx @sveltery/cli@latest add button dialog
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
npx @sveltery/cli@latest diff
npx @sveltery/cli@latest update
npx @sveltery/cli@latest list
```

An item counts as installed when any of its files exists under `aliases.ui`. With no names, `diff` and `update` act on every installed item and the items they depend on. A named item that is not installed is an error.

`diff [items...]` prints a unified diff for each file that differs from the registry. Your file is the `a/` side and the registry version is the `b/` side, so `+` lines are what `update` would write. It ends with a count such as `3 files differ in 2 items`, or `Everything is up to date.`. It never writes anything.

`update [items...]` plans the same files as `add`, including new files, new items an item now depends on and missing packages. For each changed file it shows the diff and asks whether to overwrite it. The default is no. New files are written without asking.

| Option | Description |
| --- | --- |
| `-y, --yes` | Overwrite changed files without asking. This discards your edits to them. |
| `--no-install` | Do not install packages. |
| `--cwd <path>` | The project root. Defaults to the current directory. |

`list` prints one line per item in the registry with its type, and `installed` when the item is in your project. Pass `--json` for an array of `{ name, type, installed }`.

## Use another registry

Set `SVELTERY_REGISTRY_URL` to the registry root, for example a preview deploy's `/r` URL. It takes precedence over the `registry` key in `components.json`.
