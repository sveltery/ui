<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { Input } from '@sveltery/components/input';
  import { cn } from 'cn';
  let { class: className, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex flex-col gap-6', className)} {...props}>
  <Card>
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <div class="flex items-center">
              <FieldLabel for="password">Password</FieldLabel>
              <!-- svelte-ignore a11y_invalid_attribute -->
              <a
                href="#"
                class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
            <Button variant="outline" type="button">
              Login with Google
            </Button>
            <FieldDescription class="text-center">
              Don't have an account? <!-- svelte-ignore a11y_invalid_attribute --><a href="#">Sign up</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</div>

