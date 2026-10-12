<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from '@sveltery/ui/alert';
  import { Avatar, AvatarFallback } from '@sveltery/ui/avatar';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { Label } from '@sveltery/ui/label';
  import { Separator } from '@sveltery/ui/separator';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Textarea } from '@sveltery/ui/textarea';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>{site.name}</title>
  <meta name="description" content={site.description} />
</svelte:head>

<section class="container-wrapper flex flex-col items-center gap-2 px-6 py-12 text-center md:py-20 lg:py-24">
  <a href="/docs/forms" class="mb-2 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium">Forms with remote functions are coming</a>
  <h1 class="max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:text-5xl xl:tracking-tighter">Build your component library in Svelte</h1>
  <p class="max-w-3xl text-base text-balance text-foreground sm:text-lg">{site.description}</p>
  <div class="flex w-full items-center justify-center gap-2 pt-2">
    <a href="/docs/installation" class={buttonVariants({ size: 'sm' })}>Get Started</a>
    <a href="/docs/components" class={buttonVariants({ size: 'sm', variant: 'ghost' })}>View Components</a>
  </div>
</section>

<section class="container-wrapper px-6 pb-16">
  <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Send feedback</CardTitle>
        <CardDescription>Tell us what to build next.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-2" onsubmit={(event) => event.preventDefault()}>
          <Label for="feedback">Message</Label>
          <Textarea id="feedback" name="feedback" placeholder="Components, docs, anything." />
        </form>
      </CardContent>
      <CardFooter class="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Send</Button>
      </CardFooter>
    </Card>
    <div class="flex flex-col gap-6">
      <Alert>
        <AlertTitle>Built on Sveltery Base</AlertTitle>
        <AlertDescription>Behavior, focus and accessibility come from headless primitives. The styles are yours to change.</AlertDescription>
      </Alert>
      <Card>
        <CardContent class="flex items-center gap-4">
          <Avatar><AvatarFallback>SV</AvatarFallback></Avatar>
          <div class="grid flex-1 gap-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter class="justify-between text-sm text-muted-foreground">
          Search the docs
          <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
        </CardFooter>
      </Card>
    </div>
  </div>
</section>
