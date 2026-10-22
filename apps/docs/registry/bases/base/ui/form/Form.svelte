<script lang="ts">
  import { Form as Primitive, type FormProps } from '@sveltery/base/form';
  let props: FormProps = $props();
</script>
<Primitive data-slot="form" {...props} />
