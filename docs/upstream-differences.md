# Upstream differences

Sveltery UI mirrors shadcn/ui. This file lists the deliberate differences that are not React-versus-Svelte translations.

## No Sonner component

shadcn/ui ships both Sonner (`sonner.tsx`, on the `sonner` library) and Toast (on Base UI Toast). Sveltery UI ships only Toast. Toast already has sonner's behavior (stacking, swipe to dismiss, typed toasts, promise toasts), so a second toast system would be redundant. This is Hugo Hsi's decision of 2026-10-14.

Where upstream code imports `toast` from `sonner`, Sveltery UI imports `toast` from `@sveltery/ui/toast` and calls `toast.add({ title, description })` or `toast.promise()`. This covers the docs examples and blocks too.

## Forms pages use SvelteKit forms instead of React Hook Form

shadcn/ui's form pages build on React Hook Form and TanStack Form. Sveltery UI's form pages use SvelteKit's own form handling: a plain `<form {...f}>` with remote form spreads (`f.fields.x.as()`) or a form action, the plain `Field` with `data-invalid`, and `FieldError errors={f.fields.x.issues()}`. The markup matches shadcn's style. This is Hugo Hsi's decision of 2026-10-14.

React Hook Form focuses the first invalid field after a failed submit, and SvelteKit's forms do not. Base Form (`@sveltery/base/form`) does, when each control sits in a Base `Field.Root`. See the Base forms handbook for that setup.
