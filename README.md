# Sveltery UI

Sveltery UI is an unfaithful Svelte 5 port of [shadcn/ui](https://ui.shadcn.com), following its Base UI variant. It keeps shadcn/ui's component anatomy, class strings, styles and examples, and translates React idioms to Svelte ones, such as `class` for `className` and snippets for render functions. Where upstream has a bug or does not fit Svelte, it differs on purpose. [Differences from shadcn/ui](https://ui.sveltery.dev/docs/differences) lists each of those changes and why it was made.

The components are built on [Sveltery Base](https://base.sveltery.dev), which is in turn an unfaithful Svelte port of [Base UI](https://base-ui.com).

Sveltery UI is pre-1.0. Components and APIs can change between releases.

## Get started

Create a Svelte 5 app with Tailwind CSS 4, then run `init` and add components:

```sh
npx @sveltery/ui@latest init
npx @sveltery/ui@latest add button
```

Like shadcn/ui, the CLI copies component source into your project for you to own and edit. See [Installation](https://ui.sveltery.dev/docs/installation) and the [CLI reference](https://ui.sveltery.dev/docs/cli).

- Docs: [ui.sveltery.dev](https://ui.sveltery.dev)
- Components: [ui.sveltery.dev/docs/components](https://ui.sveltery.dev/docs/components)
- LLM docs: [ui.sveltery.dev/llms.txt](https://ui.sveltery.dev/llms.txt) indexes every docs page as Markdown.
- Agent skill: `npx skills add sveltery/ui` installs a skill that teaches coding agents the CLI and component conventions.

## Develop

Use Node 24 and pnpm 12.

```sh
pnpm install
pnpm verify                      # lint, type checks, unit tests, docs build, packaging smoke test
pnpm --filter @sveltery/docs dev # docs site with hot reload
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the repository layout and checks, and [AGENTS.md](AGENTS.md) for the porting rules.

## Credits

Sveltery UI exists because of the work of these projects and their contributors.

- [shadcn/ui](https://github.com/shadcn-ui/ui) by [shadcn](https://github.com/shadcn) and the [shadcn/ui contributors](https://github.com/shadcn-ui/ui/graphs/contributors). Its component design, class strings, styles, examples, CLI behavior and docs structure are the source of this port. The `@sveltery/svelte` message scroller and questionnaire also port shadcn/ui's React packages.
- [Base UI](https://github.com/mui/base-ui) by [MUI](https://mui.com) and the Base UI contributors. It is the headless layer underneath, through Sveltery Base.

The helper packages in `packages/` port these libraries:

| Package | Ports |
| --- | --- |
| `@sveltery/charts` | [Recharts](https://github.com/recharts/recharts) |
| `@sveltery/command` | [cmdk](https://github.com/pacocoursey/cmdk) by Paco Coursey |
| `@sveltery/day-picker` | [React DayPicker](https://github.com/gpbl/react-day-picker) by Giampaolo Bellavite and contributors |
| `@sveltery/input-otp` | [input-otp](https://github.com/guilhermerodz/input-otp) by Guilherme Rodz |
| `@sveltery/resizable` | [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by Brian Vaughn, including its fork of [stacking-order](https://github.com/Rich-Harris/stacking-order) by Rich Harris |

The registry's generated icons come from [Lucide](https://lucide.dev), [Tabler Icons](https://tabler.io/icons), [Phosphor Icons](https://phosphoricons.com), [Hugeicons](https://hugeicons.com) and [Remix Icon](https://remixicon.com).

## License

Original code is under the [MIT License](LICENSE), Copyright (c) 2026 Sveltery contributors.

Code derived from shadcn/ui keeps shadcn/ui's MIT notice, Copyright (c) 2023 shadcn. Each package that ports another library keeps that library's license in its own `THIRD_PARTY_NOTICES.md`. The notices are in:

- [apps/docs/registry/THIRD_PARTY_NOTICES.md](apps/docs/registry/THIRD_PARTY_NOTICES.md) for the registry components, styles and examples
- [apps/docs/registry/bases/base/ui/icons/licenses](apps/docs/registry/bases/base/ui/icons/licenses) for the icon libraries
- `packages/*/THIRD_PARTY_NOTICES.md` for each package, for example [packages/cli](packages/cli/THIRD_PARTY_NOTICES.md)

Sveltery UI is an independent project. It is not affiliated with or endorsed by shadcn, Vercel, MUI or Base UI.
