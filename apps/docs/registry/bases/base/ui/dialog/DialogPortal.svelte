<script lang="ts">
  import { Dialog as Primitive, type DialogPortalProps } from '@sveltery/base/dialog';
  // Base ea4e108e aliases DialogPortalProps to an unexported internal interface; a local interface
  // keeps the packaged declaration portable without changing the props.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- the named local interface is the point.
  interface Props extends DialogPortalProps {}
  let { children, ...props }: Props = $props();
</script>
<Primitive.Portal data-slot="dialog-portal" {...props}>
  {@render children?.()}
</Primitive.Portal>
