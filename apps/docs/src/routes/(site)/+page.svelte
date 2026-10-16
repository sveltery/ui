<script lang="ts">
  import { cn } from 'cn';
  import CardsDemo from './cards/CardsDemo.svelte';
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
  <div class="container-wrapper flex-1 p-0">
    <div class="container overflow-hidden md:px-0 lg:max-w-none">
      <section class="-mx-4 w-[140vw] overflow-hidden md:hidden">
        <img src="/images/cards-light.png" width="2560" height="2764" alt="Cards built with Sveltery UI" class="block h-auto w-full dark:hidden" />
        <img src="/images/cards-dark.png" width="2560" height="2764" alt="Cards built with Sveltery UI" class="hidden h-auto w-full dark:block" />
      </section>
      <section class="hidden md:block">
        <CardsDemo />
      </section>
    </div>
  </div>
</div>
