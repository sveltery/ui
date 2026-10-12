<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@sveltery/ui/breadcrumb';
</script>

{#snippet BreadcrumbBasic()}
  <Example title="Basic" class="items-center justify-center">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Example>
{/snippet}

{#snippet BreadcrumbWithLink()}
  <Example title="With Link" class="items-center justify-center">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            {#snippet render(props)}
              <!-- svelte-ignore a11y_invalid_attribute -->
              <a {...props} href="#">Home</a>
            {/snippet}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            {#snippet render(props)}
              <!-- svelte-ignore a11y_invalid_attribute -->
              <a {...props} href="#">Components</a>
            {/snippet}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render BreadcrumbBasic()}
  {@render BreadcrumbWithLink()}
</ExampleWrapper>
