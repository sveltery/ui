<script lang="ts">
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$ui/accordion/index.js';
  let { multiple = false, initial = [] }: { multiple?: boolean; initial?: string[] } = $props();
  // svelte-ignore state_referenced_locally
  let value = $state<unknown[]>(initial);
  export function read() { return value; }
  export function write(next: string[]) { value = next; }
</script>
<Accordion class="mx-auto" {multiple} bind:value>
  <AccordionItem value="a" class="item-a">
    <AccordionTrigger class="trigger-a">First</AccordionTrigger>
    <AccordionContent class="content-a">First content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Second</AccordionTrigger>
    <AccordionContent>Second content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="c" disabled>
    <AccordionTrigger>Third</AccordionTrigger>
    <AccordionContent>Third content</AccordionContent>
  </AccordionItem>
</Accordion>
