---
title: Forms
description: Build forms with validation, SvelteKit form actions and remote form functions.
---

<Callout title="In design">

The forms API is in design. This section will cover Field and Form, validation, integration with form libraries, SvelteKit form actions and remote form functions.

</Callout>

Sveltery Base ports the Base UI form model. Fields register with a form, report their validity and show errors next to the control. On top of that, Sveltery adds Svelte integrations in place of React's actions:

- **Form actions.** Progressive enhancement with `use:enhance`, with errors returned from the action shown on the matching field.
- **Remote form functions.** Pass a remote `form` to the form, and its fields, issues and pending state flow to every field control and label through context.
