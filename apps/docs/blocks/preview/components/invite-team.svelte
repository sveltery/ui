<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Field, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@sveltery/ui/input-group';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Separator } from '@sveltery/ui/separator';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<Card>
  <CardHeader>
    <CardTitle>Invite Team</CardTitle>
    <CardDescription>Add members to your workspace</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <div class="flex flex-col gap-3">
      {#each [
            { email: "alex@example.com", role: "Editor" },
            { email: "sam@example.com", role: "Viewer" },
          ] as invite (invite.email)}
        <div class="flex items-center gap-2">
          <Input defaultValue={invite.email} class="flex-1" />
          <Select
            items={[
                  { label: "Admin", value: "admin" },
                  { label: "Editor", value: "editor" },
                  { label: "Viewer", value: "viewer" },
                ]}
            defaultValue={invite.role.toLowerCase()}
          >
            <SelectTrigger class="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end">
              <SelectGroup>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      {/each}
    </div>
    <Button variant="outline">
      <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" data-icon="inline-start" />
      Add another
    </Button>
    <Separator />
    <Field>
      <FieldLabel for="invite-link">Or share invite link</FieldLabel>
      <InputGroup>
        <InputGroupInput id="invite-link" defaultValue="https://app.co/invite/x8f2k" readonly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy link">
            <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="Copy01Icon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  </CardContent>
  <CardFooter>
    <Button class="w-full">Send Invites</Button>
  </CardFooter>
</Card>
