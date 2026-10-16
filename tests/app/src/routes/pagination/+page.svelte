<script lang="ts">
  import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '$registry/bases/base/ui/pagination';
  let keys = $state(0);
</script>

<Pagination class="p-8">
  <PaginationContent>
    <PaginationItem><PaginationLink href="#page-1" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#page-2">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#page-3" onkeydown={() => keys++} onkeyup={() => keys++}>3</PaginationLink></PaginationItem>
  </PaginationContent>
</Pagination>
<output data-testid="keys">{keys}</output>
