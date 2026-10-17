<script lang="ts">
  import { AspectRatio } from '$registry/bases/base/ui/aspect-ratio';
</script>

<AspectRatio ratio={9 / 16} class="w-full max-w-[10rem] rounded-lg bg-muted">
  <img
    src="https://avatar.vercel.sh/shadcn1"
    alt="Photo"
    class="absolute inset-0 size-full rounded-lg object-cover grayscale dark:brightness-20"
  />
</AspectRatio>
