<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@sveltery/ui/card';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
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
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="m@example.com" required />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel>Password</FieldLabel>
                <!-- svelte-ignore a11y_invalid_attribute -->
                <a href="#" class="ml-auto inline-block underline-offset-4 hover:underline">Forgot your password?</a>
              </div>
              <Input type="password" required />
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
</ExampleWrapper>
