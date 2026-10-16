<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle, type CardProps } from '$registry/bases/base/ui/card';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  let { ...props }: CardProps = $props();
</script>

<Card {...props}>
  <CardHeader>
    <CardTitle>Create an account</CardTitle>
    <CardDescription>
      Enter your information below to create your account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel for="name">Full Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" required />
        </Field>
        <Field>
          <FieldLabel for="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <FieldDescription>
            We'll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel for="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel for="confirm-password">
            Confirm Password
          </FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <FieldGroup>
          <Field>
            <Button type="submit">Create Account</Button>
            <Button variant="outline" type="button">
              Sign up with Google
            </Button>
            <FieldDescription class="px-6 text-center">
              Already have an account? <!-- svelte-ignore a11y_invalid_attribute --><a href="#">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  </CardContent>
</Card>

