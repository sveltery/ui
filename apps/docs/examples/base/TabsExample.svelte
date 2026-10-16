<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Input } from '$registry/bases/base/ui/input';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';

  const panel =
    'border style-vega:rounded-lg style-vega:p-6 style-nova:rounded-lg style-nova:p-4 style-lyra:rounded-none style-lyra:p-4 style-maia:rounded-xl style-maia:p-6 style-mira:rounded-md style-mira:p-4 style-luma:rounded-xl style-luma:p-6 style-rhea:rounded-xl style-rhea:p-6';
</script>

{#snippet TabsBasic()}
  <Example title="Basic">
    <Tabs value="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsLine()}
  <Example title="Line">
    <Tabs value="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsVariantsComparison()}
  <Example title="Variants Alignment">
    <div class="flex gap-4">
      <Tabs value="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs value="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </Example>
{/snippet}

{#snippet TabsDisabled()}
  <Example title="Disabled">
    <Tabs value="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="settings" disabled>Disabled</TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsWithIcons()}
  <Example title="With Icons">
    <Tabs value="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <IconPlaceholder
            lucide="AppWindowIcon"
            tabler="IconAppWindow"
            hugeicons="CursorInWindowIcon"
            phosphor="AppWindowIcon"
            remixicon="RiWindowLine"
          />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <IconPlaceholder
            lucide="CodeIcon"
            tabler="IconCode"
            hugeicons="CodeIcon"
            phosphor="CodeIcon"
            remixicon="RiCodeLine"
          />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsIconOnly()}
  <Example title="Icon Only">
    <Tabs value="home">
      <TabsList>
        <TabsTrigger value="home">
          <IconPlaceholder
            lucide="HomeIcon"
            tabler="IconHome"
            hugeicons="HomeIcon"
            phosphor="HouseIcon"
            remixicon="RiHomeLine"
          />
        </TabsTrigger>
        <TabsTrigger value="search">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="SearchIcon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </TabsTrigger>
        <TabsTrigger value="settings">
          <IconPlaceholder
            lucide="SettingsIcon"
            tabler="IconSettings"
            hugeicons="SettingsIcon"
            phosphor="GearIcon"
            remixicon="RiSettingsLine"
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsMultiple()}
  <Example title="Multiple">
    <Tabs value="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsWithContent()}
  <Example title="With Content">
    <Tabs value="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <div class={panel}>
        <TabsContent value="account">Manage your account preferences and profile information.</TabsContent>
        <TabsContent value="password">Update your password to keep your account secure.</TabsContent>
        <TabsContent value="notifications">Configure how you receive notifications and alerts.</TabsContent>
      </div>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsLineWithContent()}
  <Example title="Line With Content">
    <Tabs value="account">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <div class={panel}>
        <TabsContent value="account">Manage your account preferences and profile information.</TabsContent>
        <TabsContent value="password">Update your password to keep your account secure.</TabsContent>
        <TabsContent value="notifications">Configure how you receive notifications and alerts.</TabsContent>
      </div>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsLineDisabled()}
  <Example title="Line Disabled">
    <Tabs value="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsWithDropdown()}
  <Example title="With Dropdown">
    <Tabs value="overview">
      <div class="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, _state, content)}<Button variant="ghost" size="icon" class="size-8" {...props}>{@render content?.()}</Button>{/snippet}
            <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
            <span class="sr-only">More options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div class={panel}>
        <TabsContent value="overview">View your dashboard metrics and key performance indicators.</TabsContent>
        <TabsContent value="analytics">Detailed analytics and insights about your data.</TabsContent>
        <TabsContent value="reports">Generate and view custom reports.</TabsContent>
      </div>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsVertical()}
  <Example title="Vertical">
    <Tabs value="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <div class={panel}>
        <TabsContent value="account">Manage your account preferences and profile information.</TabsContent>
        <TabsContent value="password">
          Update your password to keep your account secure. Use a strong password with a mix of letters, numbers, and
          symbols.
        </TabsContent>
        <TabsContent value="notifications">
          Configure how you receive notifications and alerts. Choose which types of notifications you want to receive and
          how you want to receive them.
        </TabsContent>
      </div>
    </Tabs>
  </Example>
{/snippet}

{#snippet TabsWithInputAndButton()}
  <Example title="With Input and Button" containerClass="col-span-full">
    <Tabs value="overview" class="mx-auto w-full max-w-lg">
      <div class="flex items-center gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <Input placeholder="Search..." class="w-44" />
          <Button>Action</Button>
        </div>
      </div>
      <div class={panel}>
        <TabsContent value="overview">View your dashboard metrics and key performance indicators.</TabsContent>
        <TabsContent value="analytics">Detailed analytics and insights about your data.</TabsContent>
        <TabsContent value="reports">Generate and view custom reports.</TabsContent>
      </div>
    </Tabs>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render TabsBasic()}
  {@render TabsLine()}
  {@render TabsVariantsComparison()}
  {@render TabsDisabled()}
  {@render TabsWithIcons()}
  {@render TabsIconOnly()}
  {@render TabsMultiple()}
  {@render TabsWithContent()}
  {@render TabsLineWithContent()}
  {@render TabsLineDisabled()}
  {@render TabsWithDropdown()}
  {@render TabsVertical()}
  {@render TabsWithInputAndButton()}
</ExampleWrapper>
