<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import { Global } from '../util/Global.js';
  import { usePrefersReducedMotion } from '../util/usePrefersReducedMotion.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import configUpdate from './configUpdate.js';
  import { configEasing } from './easing.js';
  import { defaultJavascriptAnimateProps, type JavascriptAnimateProps } from './JavascriptAnimate.js';
  import { useAnimationManager } from './useAnimationManager.svelte.js';

  type Props = Omit<JavascriptAnimateProps, 'children'> & { children: Snippet<[number]> };
  type TimeAsObject = { t: number };

  let outsideProps: Props = $props();
  const resolved = rechartsProps<Props, typeof defaultJavascriptAnimateProps>(() => outsideProps, defaultJavascriptAnimateProps);

  const from: TimeAsObject = { t: 0 };
  const to: TimeAsObject = { t: 1 };

  const prefersReducedMotion = usePrefersReducedMotion();
  const isActive = $derived(resolved.isActive === 'auto' ? !Global.isSsr && !prefersReducedMotion.current : resolved.isActive);
  const animationManager = useAnimationManager(
    () => resolved.animationId,
    () => resolved.animationManager,
  );

  let style = $state.raw<TimeAsObject>(untrack(() => isActive) ? from : to);
  let stopJSAnimation: (() => void) | null = null;

  $effect(() => {
    if (!isActive) {
      style = to;
    }
  });

  $effect(() => {
    if (!isActive || !resolved.canBegin) return;
    const { duration, easing, begin, onAnimationStart, onAnimationEnd } = resolved;
    const manager = animationManager.current;
    untrack(() => {
      const startAnimation = configUpdate<TimeAsObject>(
        from,
        to,
        configEasing(easing),
        duration,
        (next) => {
          style = next;
        },
        manager.getTimeoutController(),
      );
      const onAnimationActive = () => {
        stopJSAnimation = startAnimation();
      };
      manager.start([onAnimationStart, begin, onAnimationActive, duration, onAnimationEnd]);
    });
    return () => {
      manager.stop();
      stopJSAnimation?.();
      onAnimationEnd();
    };
  });
</script>

{@render outsideProps.children(style.t)}
