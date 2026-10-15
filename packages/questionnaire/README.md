# @sveltery/questionnaire

A step-by-step questionnaire for Svelte 5. It shows one question at a time inside a form, tracks answers and validation, and supports skipping, previous and next, and keyboard shortcuts for choices. It ports the behavior of the questionnaire in [shadcn/ui](https://github.com/shadcn-ui/ui), renders plain elements and ships no styles.

## Install

```sh
npm install @sveltery/questionnaire
```

## Usage

```svelte
<script lang="ts">
  import * as Questionnaire from '@sveltery/questionnaire';
</script>

<Questionnaire.Root items={[{ name: 'size', required: true }, { name: 'notes' }]} shortcuts="letters">
  <Questionnaire.Progress />
  <Questionnaire.Item name="size">
    <Questionnaire.Title>Pick a size</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="small">Small</Questionnaire.Choice>
      <Questionnaire.Choice value="large">Large</Questionnaire.Choice>
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
  <Questionnaire.Item name="notes">
    <Questionnaire.Title>Anything else?</Questionnaire.Title>
    <Questionnaire.Input />
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Next />
  <Questionnaire.Submit />
</Questionnaire.Root>
```

`Root` renders a `<form>`, so the answers submit with it like any other form fields.

The styled version lives in `@sveltery/ui/questionnaire`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
