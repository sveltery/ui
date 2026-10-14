<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';

  type Props = HTMLAttributes<HTMLDivElement> & {
    active?: boolean;
    processing?: boolean;
    deviceId?: string;
    barWidth?: number;
    barHeight?: number;
    barGap?: number;
    barRadius?: number;
    barColor?: string;
    fadeEdges?: boolean;
    fadeWidth?: number;
    height?: string | number;
    sensitivity?: number;
    smoothingTimeConstant?: number;
    fftSize?: number;
    historySize?: number;
    updateRate?: number;
    mode?: 'scrolling' | 'static';
    onError?: (error: Error) => void;
    onStreamReady?: (stream: MediaStream) => void;
    onStreamEnd?: () => void;
  };

  let {
    active = false,
    processing = false,
    deviceId,
    barWidth = 3,
    barGap = 1,
    barRadius = 1.5,
    barColor,
    fadeEdges = true,
    fadeWidth = 24,
    barHeight: baseBarHeight = 4,
    height = 64,
    sensitivity = 1,
    smoothingTimeConstant = 0.8,
    fftSize = 256,
    historySize = 60,
    updateRate = 30,
    mode = 'static',
    onError,
    onStreamReady,
    onStreamEnd,
    class: className,
    ...props
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined;
  let container: HTMLDivElement | undefined = $state();
  let history: number[] = [];
  let analyser: AnalyserNode | null = null;
  let audioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let lastUpdate = 0;
  let lastActiveData: number[] = [];
  let transitionProgress = 0;
  let staticBars: number[] = [];
  let needsRedraw = true;
  let gradientCache: CanvasGradient | null = null;
  let lastWidth = 0;

  const heightStyle = $derived(typeof height === 'number' ? `${height}px` : height);

  $effect(() => {
    if (!canvas || !container) return;
    const target = canvas;
    const host = container;
    const resizeObserver = new ResizeObserver(() => {
      const rect = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      target.width = rect.width * dpr;
      target.height = rect.height * dpr;
      target.style.width = `${rect.width}px`;
      target.style.height = `${rect.height}px`;
      target.getContext('2d')?.scale(dpr, dpr);
      gradientCache = null;
      lastWidth = rect.width;
      needsRedraw = true;
    });
    resizeObserver.observe(host);
    return () => resizeObserver.disconnect();
  });

  $effect(() => {
    const isProcessing = processing;
    const isActive = active;
    const width = barWidth;
    const gap = barGap;
    const currentMode = mode;
    if (isProcessing && !isActive) {
      let time = 0;
      let frame = 0;
      transitionProgress = 0;
      const animateProcessing = () => {
        time += 0.03;
        transitionProgress = Math.min(1, transitionProgress + 0.02);
        const processingData: number[] = [];
        const barCount = Math.floor((container?.getBoundingClientRect().width || 200) / (width + gap));
        const half = currentMode === 'static' ? Math.floor(barCount / 2) : barCount / 2;
        for (let i = 0; i < barCount; i++) {
          const normalizedPosition = (i - half) / half;
          const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;
          const wave1 =
            currentMode === 'static'
              ? Math.sin(time * 1.5 + normalizedPosition * 3) * 0.25
              : Math.sin(time * 1.5 + i * 0.15) * 0.25;
          const wave2 =
            currentMode === 'static'
              ? Math.sin(time * 0.8 - normalizedPosition * 2) * 0.2
              : Math.sin(time * 0.8 - i * 0.1) * 0.2;
          const wave3 =
            currentMode === 'static' ? Math.cos(time * 2 + normalizedPosition) * 0.15 : Math.cos(time * 2 + i * 0.05) * 0.15;
          const processingValue = (0.2 + wave1 + wave2 + wave3) * centerWeight;
          let finalValue = processingValue;
          if (lastActiveData.length > 0 && transitionProgress < 1) {
            const lastDataIndex =
              currentMode === 'static'
                ? Math.min(i, lastActiveData.length - 1)
                : Math.floor((i / barCount) * lastActiveData.length);
            const lastValue = lastActiveData[lastDataIndex] || 0;
            finalValue = lastValue * (1 - transitionProgress) + processingValue * transitionProgress;
          }
          processingData.push(Math.max(0.05, Math.min(1, finalValue)));
        }
        if (currentMode === 'static') staticBars = processingData;
        else history = processingData;
        needsRedraw = true;
        frame = requestAnimationFrame(animateProcessing);
      };
      animateProcessing();
      return () => cancelAnimationFrame(frame);
    }
    if (!isActive && !isProcessing) {
      const hasData = currentMode === 'static' ? staticBars.length > 0 : history.length > 0;
      if (!hasData) return;
      let fadeProgress = 0;
      let frame = 0;
      const fadeToIdle = () => {
        fadeProgress += 0.03;
        if (fadeProgress < 1) {
          const fade = (value: number) => value * (1 - fadeProgress);
          if (currentMode === 'static') staticBars = staticBars.map(fade);
          else history = history.map(fade);
          needsRedraw = true;
          frame = requestAnimationFrame(fadeToIdle);
        } else if (currentMode === 'static') {
          staticBars = [];
        } else {
          history = [];
        }
      };
      fadeToIdle();
      return () => cancelAnimationFrame(frame);
    }
  });

  function stopMicrophone() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      onStreamEnd?.();
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      audioContext = null;
    }
  }

  $effect(() => {
    const isActive = active;
    const device = deviceId;
    const size = fftSize;
    const smoothing = smoothingTimeConstant;
    if (!isActive) {
      stopMicrophone();
      return;
    }
    const audio = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    };
    const setupMicrophone = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          audio: device ? { deviceId: { exact: device }, ...audio } : audio
        });
        stream = media;
        onStreamReady?.(media);
        const Constructor =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const context = new Constructor();
        const node = context.createAnalyser();
        node.fftSize = size;
        node.smoothingTimeConstant = smoothing;
        context.createMediaStreamSource(media).connect(node);
        audioContext = context;
        analyser = node;
        history = [];
      } catch (error) {
        onError?.(error as Error);
      }
    };
    setupMicrophone();
    return stopMicrophone;
  });

  $effect(() => {
    if (!canvas) return;
    const target = canvas;
    const ctx = target.getContext('2d');
    if (!ctx) return;
    let rafId = 0;

    const drawBar = (x: number, y: number, bh: number, value: number, color: string) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4 + value * 0.6;
      if (barRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, bh, barRadius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, bh);
      }
    };

    const sampleBars = (relevantData: Uint8Array, count: number, reverse: boolean) => {
      const bars: number[] = [];
      for (let n = 0; n < count; n++) {
        const i = reverse ? count - 1 - n : n;
        const dataIndex = Math.floor((i / count) * relevantData.length);
        const value = Math.min(1, (relevantData[dataIndex] / 255) * sensitivity);
        bars.push(Math.max(0.05, value));
      }
      return bars;
    };

    const animate = (currentTime: number) => {
      const rect = target.getBoundingClientRect();
      if (active && currentTime - lastUpdate > updateRate) {
        lastUpdate = currentTime;
        if (analyser) {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const startFreq = Math.floor(dataArray.length * 0.05);
          const endFreq = Math.floor(dataArray.length * 0.4);
          const relevantData = dataArray.slice(startFreq, endFreq);
          if (mode === 'static') {
            const half = Math.floor(Math.floor(rect.width / (barWidth + barGap)) / 2);
            const newBars = [...sampleBars(relevantData, half, true), ...sampleBars(relevantData, half, false)];
            staticBars = newBars;
            lastActiveData = newBars;
          } else {
            let sum = 0;
            for (let i = 0; i < relevantData.length; i++) sum += relevantData[i];
            const average = (sum / relevantData.length / 255) * sensitivity;
            history.push(Math.min(1, Math.max(0.05, average)));
            lastActiveData = [...history];
            if (history.length > historySize) history.shift();
          }
          needsRedraw = true;
        }
      }
      if (!needsRedraw && !active) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      needsRedraw = active;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const computedBarColor = barColor || getComputedStyle(target).color || '#000';
      const step = barWidth + barGap;
      const barCount = Math.floor(rect.width / step);
      const centerY = rect.height / 2;
      if (mode === 'static') {
        for (let i = 0; i < barCount && i < staticBars.length; i++) {
          const value = staticBars[i] || 0.1;
          const bh = Math.max(baseBarHeight, value * rect.height * 0.8);
          drawBar(i * step, centerY - bh / 2, bh, value, computedBarColor);
        }
      } else {
        for (let i = 0; i < barCount && i < history.length; i++) {
          const value = history[history.length - 1 - i] || 0.1;
          const bh = Math.max(baseBarHeight, value * rect.height * 0.8);
          drawBar(rect.width - (i + 1) * step, centerY - bh / 2, bh, value, computedBarColor);
        }
      }
      if (fadeEdges && fadeWidth > 0 && rect.width > 0) {
        if (!gradientCache || lastWidth !== rect.width) {
          const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
          const fadePercent = Math.min(0.3, fadeWidth / rect.width);
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(fadePercent, 'rgba(255,255,255,0)');
          gradient.addColorStop(1 - fadePercent, 'rgba(255,255,255,0)');
          gradient.addColorStop(1, 'rgba(255,255,255,1)');
          gradientCache = gradient;
          lastWidth = rect.width;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradientCache;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  });
</script>

<div
  bind:this={container}
  class={cn('relative h-full w-full', className)}
  style="height: {heightStyle}"
  aria-label={active ? 'Live audio waveform' : processing ? 'Processing audio' : 'Audio waveform idle'}
  role="img"
  {...props}
>
  {#if !active && !processing}
    <div class="absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-2 border-dotted border-muted-foreground/20"></div>
  {/if}
  <canvas bind:this={canvas} class="block h-full w-full" aria-hidden="true"></canvas>
</div>
