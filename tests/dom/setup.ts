// jsdom has no Element.scrollTo. Base's composite roots call it to keep the highlighted item in view.
// The SSR and registry tests run in the node environment, which has no Element.
if ('Element' in globalThis) Element.prototype.scrollTo ??= function () {};
