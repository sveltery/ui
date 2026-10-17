<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '$registry/bases/base/ui/pagination';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';
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
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </Example>
{/snippet}

{#snippet PaginationWithSelect()}
  <Example title="With Select">
    <div class="flex items-center justify-between gap-4">
      <Field orientation="horizontal" class="w-fit">
        <FieldLabel for="select-rows-per-page">Rows per page</FieldLabel>
        <Select defaultValue="25">
          <SelectTrigger class="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {#each ['10', '25', '50', '100'] as rows (rows)}
                <SelectItem value={rows}>{rows}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination class="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render PaginationBasic()}
  {@render PaginationSimple()}
  {@render PaginationWithSelect()}
</ExampleWrapper>
