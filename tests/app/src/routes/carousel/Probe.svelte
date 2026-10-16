<script lang="ts">
  import { useCarousel } from '@sveltery/components/carousel';
  const carousel = useCarousel();
</script>
<p data-testid="probe">{carousel.api?.slideNodes().length ?? 'no api'} slides, loop {carousel.opts?.loop}</p>
