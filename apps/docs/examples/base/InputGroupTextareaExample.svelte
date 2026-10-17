<script lang="ts">
  import IconBrandJavascript from '@tabler/icons-svelte-runes/icons/brand-javascript';
  import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
  import IconCornerDownLeft from '@tabler/icons-svelte-runes/icons/corner-down-left';
  import IconRefresh from '@tabler/icons-svelte-runes/icons/refresh';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '$registry/bases/base/ui/input-group';
</script>

<div class="grid w-full max-w-md gap-4">
  <InputGroup>
    <InputGroupTextarea id="textarea-code-32" placeholder="console.log('Hello, world!');" class="min-h-[200px]" />
    <InputGroupAddon align="block-end" class="border-t">
      <InputGroupText>Line 1, Column 1</InputGroupText>
      <InputGroupButton size="sm" class="ml-auto" variant="default">
        Run <IconCornerDownLeft />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon align="block-start" class="border-b">
      <InputGroupText class="font-mono font-medium">
        <IconBrandJavascript />
        script.js
      </InputGroupText>
      <InputGroupButton class="ml-auto" size="icon-xs">
        <IconRefresh />
      </InputGroupButton>
      <InputGroupButton variant="ghost" size="icon-xs">
        <IconCopy />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</div>
