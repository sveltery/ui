<script lang="ts">
  import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@sveltery/ui/pagination';
</script>

<Pagination class="p-8">
  <PaginationContent>
    <PaginationItem><PaginationLink href="#page-1" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#page-2">2</PaginationLink></PaginationItem>
  </PaginationContent>
</Pagination>
