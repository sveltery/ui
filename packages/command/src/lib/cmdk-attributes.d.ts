// Lets the parts write cmdk's marker attributes, which upstream styles select on, as plain attributes.
import 'svelte/elements';

declare module 'svelte/elements' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- merging needs the original's type parameter
  interface HTMLAttributes<T extends EventTarget> {
    'cmdk-root'?: '';
    'cmdk-label'?: '';
    'cmdk-input'?: '';
    'cmdk-list'?: '';
    'cmdk-list-sizer'?: '';
    'cmdk-group'?: '';
    'cmdk-group-heading'?: '';
    'cmdk-group-items'?: '';
    'cmdk-item'?: '';
    'cmdk-separator'?: '';
    'cmdk-empty'?: '';
    'cmdk-loading'?: '';
  }
}
