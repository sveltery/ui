<script lang="ts">
  import { cn } from 'cn';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';
  import { languageOptions, type Language } from './language.svelte';

  let {
    value = $bindable(),
    languages = ['en', 'ar', 'he'],
    class: className,
  }: { value: Language; languages?: Language[]; class?: string } = $props();
</script>

<Select items={languageOptions} bind:value>
  <SelectTrigger size="sm" class={cn('w-36', className)} dir="ltr" data-name="language-selector">
    <SelectValue />
  </SelectTrigger>
  <SelectContent dir="ltr" class="data-open:animate-none data-closed:animate-none">
    <SelectGroup>
      {#each languageOptions.filter((option) => languages.includes(option.value)) as option (option.value)}
        <SelectItem value={option.value}>{option.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
