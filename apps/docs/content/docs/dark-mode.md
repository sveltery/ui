---
title: Dark Mode
description: Add a dark mode toggle to a SvelteKit app.
order: 3
---

The components switch to their dark tokens when an ancestor has the `dark` class. To add dark mode, set that class on `<html>`.

<Steps>

### Apply the mode before the first paint

Add this script to `src/app.html`, inside `<head>`. It reads the saved mode, falls back to the system setting, and sets the class before the page renders. Without it, the page flashes light before it turns dark.

```html title="src/app.html"
<script>
  try {
    const stored = localStorage.getItem('theme');
    const dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch {}
</script>
```

### Add a toggle

```svelte title="src/lib/components/mode-toggle.svelte"
<script lang="ts">
  import { Button } from '$lib/components/ui/button';

  function toggle() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>

<Button variant="ghost" size="icon" onclick={toggle} aria-label="Toggle theme">◐</Button>
```

</Steps>

This site uses the same approach. The toggle in the header calls a `ColorMode` class that keeps the current mode in `$state`.
