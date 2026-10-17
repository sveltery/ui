<script lang="ts">
  let { amount }: { amount: number } = $props();

  const formatted = $derived(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount));
</script>

<div class="text-right font-medium">{formatted}</div>
