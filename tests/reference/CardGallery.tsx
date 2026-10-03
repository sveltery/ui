// Paired harness; actual selected example bodies remain unchanged in card-selected-examples.tsx.
import { useEffect, useState } from 'react';
import { Button } from './button';
import { ExampleWrapper } from './example-scaffold';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card';
import { CardDefault, CardSmall, CardContentEdgeToEdge, CardHeaderWithBorder, CardFooterWithBorder, CardHeaderWithBorderSmall, CardFooterWithBorderSmall } from './card-selected-examples';
export function CardGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}><ExampleWrapper>
    <CardDefault /><CardSmall /><CardContentEdgeToEdge /><CardHeaderWithBorder /><CardFooterWithBorder /><CardHeaderWithBorderSmall /><CardFooterWithBorderSmall />
  </ExampleWrapper><section className="grid gap-6">
    {/* Supplemental probes; these are not selected upstream examples. */}
    <section data-supplemental="action"><h2>Supplemental action grid</h2>
      <Card className="mx-auto w-full max-w-sm"><CardHeader><CardTitle>Action grid</CardTitle><CardDescription>Description occupies the second row.</CardDescription><CardAction><Button variant="outline" size="sm">Options</Button></CardAction></CardHeader><CardContent>Supplemental content</CardContent><CardFooter>Supplemental footer</CardFooter></Card>
    </section>
    <section data-supplemental="override"><h2>Supplemental overrides</h2>
      <Card size="sm" data-size="default" data-slot="custom-card" className="mx-auto w-full max-w-sm flex-row rounded-none gap-1 py-2"><CardHeader className="flex px-2"><CardTitle className="text-lg font-normal">Override title</CardTitle><CardDescription className="text-red-500">Override description</CardDescription><CardAction className="self-center">Override action</CardAction></CardHeader><CardContent className="px-1">Override content</CardContent><CardFooter className="justify-end px-3">Override footer</CardFooter></Card>
    </section>
  </section></div>;
}
