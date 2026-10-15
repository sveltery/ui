// jsdom has no Element.scrollTo. Base's composite lists call it to keep the highlighted item in view.
// SSR suites run in the node environment, which has no Element at all.
if (typeof Element !== 'undefined') Element.prototype.scrollTo ??= () => {};
