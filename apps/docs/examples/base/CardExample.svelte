<script lang="ts">
  import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Card, CardAction, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '$registry/bases/base/ui/card';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Input } from '$registry/bases/base/ui/input';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';

  const spacingOptions = [
    { class: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
    { class: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
    { class: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
    { class: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
  ];

  let spacing = $state('4');
  const selectedSpacing = $derived(spacingOptions.find((option) => option.value === spacing));
</script>

<ExampleWrapper>
  <Example title="Default Size">
    <Card size="default" class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          This card uses the default size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that defaults to
          "default" for standard spacing and sizing.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" class="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  </Example>
  <Example title="Small Size">
    <Card size="sm" class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>
          This card uses the small size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          "sm" for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" class="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  </Example>
  <Example title="Content Edge to Edge">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>
          Review the terms before accepting the agreement.
        </CardDescription>
      </CardHeader>
      <CardContent class="-mb-(--card-spacing) px-0">
        <div class="max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
          <p>
            These terms govern your use of the workspace, including access to
            shared documents, project files, and collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring
            that your team has the appropriate permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When
            those changes materially affect your workflow, we will notify your
            workspace administrators.
          </p>
          <p>
            By continuing, you agree to keep your account credentials secure
            and to follow your organization's acceptable use policies.
          </p>
        </div>
      </CardContent>
      <CardFooter class="justify-end gap-2">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
  </Example>

  <Example title="Custom Spacing">
    <div class="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        value={[spacing]}
        onValueChange={(value) => {
          if (value[0]) spacing = value[0];
        }}
        variant="outline"
        size="sm"
        class="justify-center"
      >
        {#each spacingOptions as option (option.value)}
          <ToggleGroupItem value={option.value}>{option.label}</ToggleGroupItem>
        {/each}
      </ToggleGroup>
      <Card class={selectedSpacing?.class}>
        <CardHeader>
          <CardTitle>Release Health</CardTitle>
          <CardDescription>Track readiness across launch signals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2 rounded-lg bg-muted/50 p-3 text-sm style-lyra:rounded-none style-sera:rounded-none">
            <div class="flex items-center justify-between gap-2">
              <span class="text-muted-foreground">Checks passed</span>
              <span class="font-medium">24 / 26</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-muted-foreground">Open blockers</span>
              <span class="font-medium">2</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </Example>

  <Example title="Header with Border">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader class="border-b">
        <CardTitle>Header with Border</CardTitle>
        <CardDescription>
          This is a card with a header that has a bottom border.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The header has a border-b class applied, creating a visual
          separation between the header and content sections.
        </p>
      </CardContent>
    </Card>
  </Example>
  <Example title="Footer with Border">
    <Card class="mx-auto w-full max-w-sm">
      <CardContent>
        <p>
          The footer has a border-t class applied, creating a visual
          separation between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter class="border-t">
        <Button variant="outline" class="w-full">
          Footer with Border
        </Button>
      </CardFooter>
    </Card>
  </Example>
  <Example title="Header with Border (Small)">
    <Card size="sm" class="mx-auto w-full max-w-sm">
      <CardHeader class="border-b">
        <CardTitle>Header with Border</CardTitle>
        <CardDescription>
          This is a small card with a header that has a bottom border.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The header has a border-b class applied, creating a visual
          separation between the header and content sections.
        </p>
      </CardContent>
    </Card>
  </Example>
  <Example title="Footer with Border (Small)">
    <Card size="sm" class="mx-auto w-full max-w-sm">
      <CardContent>
        <p>
          The footer has a border-t class applied, creating a visual
          separation between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter class="border-t">
        <Button variant="outline" size="sm" class="w-full">
          Footer with Border
        </Button>
      </CardFooter>
    </Card>
  </Example>

  <Example title="With Image">
    <Card size="default" class="relative mx-auto w-full max-w-sm pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
      <div class="relative z-20 aspect-video w-full bg-muted"></div>
      <CardHeader>
        <CardTitle>Beautiful Landscape</CardTitle>
        <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button class="w-full">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="Add01Icon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-start"
          />
          Button
        </Button>
      </CardFooter>
    </Card>
  </Example>

  <Example title="With Image (Small)">
    <Card size="sm" class="relative mx-auto w-full max-w-sm pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
      <div class="relative z-20 aspect-video w-full bg-muted"></div>
      <CardHeader>
        <CardTitle>Beautiful Landscape</CardTitle>
        <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" class="w-full">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="Add01Icon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-start"
          />
          Button
        </Button>
      </CardFooter>
    </Card>
  </Example>

  <Example title="Login">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel for="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password">Password</FieldLabel>
                <!-- svelte-ignore a11y_invalid_attribute -->
                <a href="#" class="ml-auto inline-block underline-offset-4 hover:underline">Forgot your password?</a>
              </div>
              <Input id="password" type="password" required />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Button type="submit" class="w-full">Login</Button>
        <Button variant="outline" class="w-full">Login with Google</Button>
        <div class="mt-4 text-center">
          Don&apos;t have an account?
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" class="underline underline-offset-4">Sign up</a>
        </div>
      </CardFooter>
    </Card>
  </Example>

  <Example title="Meeting Notes">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Meeting Notes</CardTitle>
        <CardDescription>Transcript from the meeting with the client.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              lucide="CaptionsIcon"
              tabler="IconTextCaption"
              hugeicons="TextCheckIcon"
              phosphor="TextTIcon"
              remixicon="RiTextWrap"
              data-icon="inline-start"
            />
            Transcribe
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
        <ol class="mt-4 flex list-decimal flex-col gap-2 pl-6">
          <li>New analytics widgets for daily/weekly metrics</li>
          <li>Simplified navigation menu</li>
          <li>Dark mode support</li>
          <li>Timeline: 6 weeks</li>
          <li>Follow-up meeting scheduled for next Tuesday</li>
        </ol>
      </CardContent>
      <CardFooter>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+8</AvatarGroupCount>
        </AvatarGroup>
      </CardFooter>
    </Card>
  </Example>
</ExampleWrapper>
