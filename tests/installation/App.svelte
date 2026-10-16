<script lang="ts">
  import * as Command from '@sveltery/command';
  import * as MessageScroller from '@sveltery/svelte/message-scroller';
  import * as Questionnaire from '@sveltery/svelte/questionnaire';
  import * as Resizable from '@sveltery/resizable';
</script>
<Command.Root data-slot="command"><Command.Input data-slot="command-input" placeholder="Search" /><Command.List data-slot="command-list"><Command.Empty data-slot="command-empty">No results.</Command.Empty><Command.Group data-slot="command-group" heading="Suggestions"><Command.Item data-slot="command-item">Calendar</Command.Item><Command.Item data-slot="command-item" value="calc">Calculator</Command.Item></Command.Group></Command.List></Command.Root>
<MessageScroller.Provider><MessageScroller.Root data-slot="message-scroller"><MessageScroller.Viewport data-slot="message-scroller-viewport"><MessageScroller.Content data-slot="message-scroller-content"><MessageScroller.Item data-slot="message-scroller-item" messageId="m1" scrollAnchor>Hello</MessageScroller.Item></MessageScroller.Content></MessageScroller.Viewport><MessageScroller.Button data-slot="message-scroller-button" /></MessageScroller.Root></MessageScroller.Provider>
<Questionnaire.Root data-slot="questionnaire" items={[{ name: 'size', choices: [{ value: 'small' }, { value: 'large' }] }, { name: 'color' }]} shortcuts="letters">
  <Questionnaire.Progress data-slot="questionnaire-progress" />
  <Questionnaire.Item data-slot="questionnaire-item" name="size"><Questionnaire.Title data-slot="questionnaire-title">Size</Questionnaire.Title><Questionnaire.Choices><Questionnaire.Choice data-slot="questionnaire-choice" value="small"><Questionnaire.ChoiceInput /><Questionnaire.ChoiceLabel>Small</Questionnaire.ChoiceLabel></Questionnaire.Choice><Questionnaire.Choice data-slot="questionnaire-choice" value="large"><Questionnaire.ChoiceInput /><Questionnaire.ChoiceLabel>Large</Questionnaire.ChoiceLabel></Questionnaire.Choice></Questionnaire.Choices></Questionnaire.Item>
  <Questionnaire.Item data-slot="questionnaire-item" name="color"><Questionnaire.Title data-slot="questionnaire-title">Color</Questionnaire.Title></Questionnaire.Item>
  <Questionnaire.Next data-slot="questionnaire-next" /><Questionnaire.Submit data-slot="questionnaire-submit" />
</Questionnaire.Root>
<Resizable.Group data-slot="resizable-panel-group"><Resizable.Panel data-slot="resizable-panel" defaultSize="30%">One</Resizable.Panel><Resizable.Separator data-slot="resizable-handle" /><Resizable.Panel data-slot="resizable-panel">Two</Resizable.Panel></Resizable.Group>
