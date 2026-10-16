<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent } from '@sveltery/components/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@sveltery/components/empty';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/components/input-group';
  import { Kbd } from '@sveltery/components/kbd';
  import { IconPlaceholder } from '@sveltery/components/icons';
</script>

<Card>
  <CardContent>
    <Empty class="h-72">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup class="w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <Button variant="link">Go to homepage</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
