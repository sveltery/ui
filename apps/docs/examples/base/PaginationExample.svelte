<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@sveltery/ui/pagination';
</script>

{#snippet PaginationBasic()}
  <Example title="Basic">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </Example>
{/snippet}

{#snippet PaginationSimple()}
  <Example title="Simple">
    <Pagination>
      <PaginationContent>
        {#each [1, 2, 3, 4, 5] as page (page)}
          <PaginationItem>
            <PaginationLink href="#" isActive={page === 2}>{page}</PaginationLink>
          </PaginationItem>
        {/each}
      </PaginationContent>
    </Pagination>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render PaginationBasic()}
  {@render PaginationSimple()}
</ExampleWrapper>
