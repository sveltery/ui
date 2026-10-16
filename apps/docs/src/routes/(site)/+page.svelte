<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
  import { Avatar, AvatarFallback } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Kbd, KbdGroup } from '$registry/bases/base/ui/kbd';
  import { Label } from '$registry/bases/base/ui/label';
  import { Separator } from '$registry/bases/base/ui/separator';
  import { Skeleton } from '$registry/bases/base/ui/skeleton';
  import { Textarea } from '$registry/bases/base/ui/textarea';
  import { cn } from 'cn';
  import Announcement from '$lib/components/site/Announcement.svelte';
  import PageHeader from '$lib/components/site/PageHeader.svelte';
  import { lumaButtonVariants } from '$lib/components/site/luma-button';
  import { site } from '$lib/site';

  const title = 'Build your component library in Svelte';
  const metadataTitle = `${site.name} - ${title}`;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    alternateName: ['Sveltery', new URL(site.url).host],
    description: site.description,
    inLanguage: 'en-US',
    sameAs: [site.github],
  };
  const jsonLd = `<script type="application/ld+json">${JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c')}\u003c/script>`;
</script>

<svelte:head>
  <title>{metadataTitle}</title>
  <meta name="description" content={site.description} />
  <link rel="canonical" href="{site.url}/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={site.url} />
  <meta property="og:title" content={metadataTitle} />
  <meta property="og:description" content={site.description} />
  <meta property="og:site_name" content={site.name} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={metadataTitle} />
  <meta name="twitter:description" content={site.description} />
  {@html jsonLd}
</svelte:head>

<div class="flex flex-1 flex-col">
  <PageHeader {title} description={site.description} class="md:**:[.container]:pb-8 lg:**:[.container]:pb-12" headingClass="max-w-4xl">
    {#snippet announcement()}<Announcement />{/snippet}
    <a href="/docs/installation" data-slot="button" class={cn(lumaButtonVariants(), 'h-[35px]')}>Get Started</a>
    <a href="/docs/components" data-slot="button" class={lumaButtonVariants({ variant: 'secondary' })}>View Components</a>
  </PageHeader>
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
</div>
