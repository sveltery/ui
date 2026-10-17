import { useDefaultLayout } from '@sveltery/resizable';

export function savedLayout(options: Parameters<typeof useDefaultLayout>[0]) {
  let saved: ReturnType<typeof useDefaultLayout> | undefined;
  $effect.root(() => {
    saved = useDefaultLayout(options);
  })();
  return saved!;
}
