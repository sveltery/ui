<script lang="ts">
  import type { NativeSwitchProps } from './types.js';
  import { cn } from 'cn';
  let { class: classProp, size = 'default', ...props }: NativeSwitchProps = $props();
</script>
<!-- The input is the track; the thumb is its sibling and follows `:checked` through `peer-checked`. -->
<span data-slot="switch" data-size={size} class={cn('group/switch peer relative inline-grid shrink-0 items-center *:col-start-1 *:row-start-1 has-disabled:opacity-50', classProp)}>
  <input type="checkbox" role="switch" data-slot="native-switch" data-size={size} class="cn-native-switch peer m-0 appearance-none transition-all outline-none disabled:cursor-not-allowed" {...props} />
  <span data-slot="switch-thumb" class="cn-native-switch-thumb pointer-events-none block ring-0 transition-transform"></span>
</span>
