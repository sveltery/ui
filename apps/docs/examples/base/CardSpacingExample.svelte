<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';

  const spacingOptions = [
    { class: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
    { class: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
    { class: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
    { class: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' }
  ];

  let spacing = $state('4');
  const selectedSpacing = $derived(spacingOptions.find((option) => option.value === spacing));
</script>

<div class="mx-auto grid w-full max-w-sm gap-4">
  <ToggleGroup
    bind:value={
      () => [spacing],
      (value) => {
        if (value[0]) spacing = value[0];
      }
    }
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
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email below to login to your account</CardDescription>
      <CardAction>
        <Button variant="link">Sign Up</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label for="email-spacing">Email</Label>
            <Input id="email-spacing" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password-spacing">Password</Label>
              <!-- svelte-ignore a11y_invalid_attribute -->
              <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <Input id="password-spacing" type="password" required />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="submit" class="w-full">Login</Button>
      <Button variant="outline" class="w-full">Login with Google</Button>
    </CardFooter>
  </Card>
</div>
