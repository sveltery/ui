<!-- Each native control, and each UI part that forwards to a native element, takes Kit's `.as(...)` spread as it is. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Input } from '$registry/bases/base/ui/input';
  import { InputGroup, InputGroupInput, InputGroupTextarea } from '$registry/bases/base/ui/input-group';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
  import { NativeCheckbox } from '$registry/bases/base/ui/native-checkbox';
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
  import { NativeSlider } from '$registry/bases/base/ui/native-slider';
  import { NativeSwitch } from '$registry/bases/base/ui/native-switch';
  import { controlsForm as f } from './controls.remote';
  const topics = ['news', 'updates'];
  const fruits = ['apple', 'banana', 'grapes'];
  const formats = ['bold', 'italic'];
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  <form {...f} enctype="multipart/form-data">
    <label><NativeCheckbox {...f.fields.agree.as('checkbox')} data-testid="agree" />Agree</label>
    {#each f.fields.agree.issues() ?? [] as issue (issue.message)}<p data-testid="error">{issue.message}</p>{/each}
    <fieldset><legend>Topics</legend>
      {#each topics as topic (topic)}<label><NativeCheckbox {...f.fields.topics.as('checkbox', topic)} data-testid="topic-{topic}" />{topic}</label>{/each}
    </fieldset>
    <label><NativeSwitch {...f.fields.notify.as('checkbox')} data-testid="notify" />Notify</label>
    <label>Volume<NativeSlider {...f.fields.volume.as('range')} min={0} max={10} data-testid="volume" /></label>
    <label>Day<Input {...f.fields.day.as('date')} data-testid="day" /></label>
    <NativeSelect {...f.fields.fruits.as('select multiple')} aria-label="Fruits" data-testid="fruits">
      {#each fruits as fruit (fruit)}<NativeSelectOption value={fruit}>{fruit}</NativeSelectOption>{/each}
    </NativeSelect>
    {#each formats as format (format)}<label data-testid="format-{format}"><input class="sr-only" {...f.fields.format.as('checkbox', format)} />{format}</label>{/each}
    <label>OTP<InputOTP {...f.fields.code.as('text')} maxLength={6} data-testid="code"><InputOTPGroup>{#each { length: 6 } as _, index (index)}<InputOTPSlot {index} />{/each}</InputOTPGroup></InputOTP></label>
    <label>Code<Input {...f.fields.code2.as('text')} inputmode="numeric" autocomplete="one-time-code" maxlength={6} data-testid="code2" /></label>
    <label>Avatar<Input {...f.fields.avatar.as('file')} data-testid="avatar" /></label>
    <label>Color<Input {...f.fields.color.as('color')} data-testid="color" /></label>
    <InputGroup><InputGroupInput {...f.fields.note.as('text')} aria-label="Note" data-testid="note" /></InputGroup>
    <InputGroup><InputGroupTextarea {...f.fields.bio.as('text')} aria-label="Bio" data-testid="bio" /></InputGroup>
    <Button {...f.fields.action.as('submit', 'save')}>Save</Button>
  </form>
  <pre data-testid="debug">{JSON.stringify({ result: f.result ?? null })}</pre>
</main>
