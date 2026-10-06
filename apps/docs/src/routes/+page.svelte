<script lang="ts">
  import { resolve } from '$app/paths';
</script>
<svelte:head><title>Sveltery UI — Dialog and Button preview</title></svelte:head>
<main class="mx-auto max-w-2xl p-8">
  <p class="mb-3 text-sm text-muted-foreground">Independent · Experimental · Unreleased</p>
  <h1 class="mb-4 text-3xl font-medium">Sveltery UI</h1>
  <p class="mb-6">Bounded Svelte Dialog and Button components with the Nova anatomy and appearance from shadcn. Built on Sveltery Base.</p>
  <a class="underline underline-offset-4" href={resolve('/dialog')}>Try the Dialog example</a>
  <p class="mt-3"><a class="underline underline-offset-4" href={resolve('/button')}>Try the Button example</a></p>
  <p class="mt-3"><a class="underline underline-offset-4" href={resolve('/textarea-gallery')}>Try the genuine Basic and Invalid Textarea galleries</a></p>
  <p class="mt-3"><a class="underline underline-offset-4" href={resolve('/button-gallery')}>Try the genuine six-body Button gallery</a></p>
  <p class="mt-6 text-sm text-muted-foreground">This preview covers contained dialogs and native controls. It does not establish complete Base UI or shadcn API compatibility.</p>
</main>
