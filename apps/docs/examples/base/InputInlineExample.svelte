<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<Field orientation="horizontal">
  <Input type="search" placeholder="Search..." />
  <Button>Search</Button>
</Field>
