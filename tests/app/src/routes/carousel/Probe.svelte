<script lang="ts">
  import { useCarousel } from '$registry/bases/base/ui/carousel';
  const carousel = useCarousel();
</script>
<p data-testid="probe">{carousel.api?.slideNodes().length ?? 'no api'} slides, loop {carousel.opts?.loop}</p>
