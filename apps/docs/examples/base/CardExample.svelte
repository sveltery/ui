<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '../../registry/bases/base/ui/card/index.js';
</script>
<!-- Selected actual pinned example bodies translated to Svelte; native Example scaffold substitutes layout only.
     CustomSpacing (ToggleGroup), Login (Field/Input), MeetingNotes (Avatar/icons), Image and ImageSmall (icons) remain deferred. -->
<section data-gallery class="grid gap-6">
<section><h2>Default Size</h2>
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
            &quot;default&quot; for standard spacing and sizing.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>
</section>
<section><h2>Small Size</h2>
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
            &quot;sm&quot; for a more compact appearance.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" class="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>
</section>
<section><h2>Content Edge to Edge</h2>
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
              and to follow your organization&apos;s acceptable use policies.
            </p>
          </div>
        </CardContent>
        <CardFooter class="justify-end gap-2">
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </CardFooter>
      </Card>
</section>
<section><h2>Header with Border</h2>
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
</section>
<section><h2>Footer with Border</h2>
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
</section>
<section><h2>Header with Border (Small)</h2>
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
</section>
<section><h2>Footer with Border (Small)</h2>
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
</section>
  <!-- Supplemental probes; these are not selected upstream examples. -->
  <section data-supplemental="action"><h2>Supplemental action grid</h2>
    <Card class="mx-auto w-full max-w-sm"><CardHeader><CardTitle>Action grid</CardTitle><CardDescription>Description occupies the second row.</CardDescription><CardAction><Button variant="outline" size="sm">Options</Button></CardAction></CardHeader><CardContent>Supplemental content</CardContent><CardFooter>Supplemental footer</CardFooter></Card>
  </section>
  <section data-supplemental="override"><h2>Supplemental overrides</h2>
    <Card size="sm" data-size="default" data-slot="custom-card" class="mx-auto w-full max-w-sm flex-row rounded-none gap-1 py-2"><CardHeader class="flex px-2"><CardTitle class="text-lg font-normal">Override title</CardTitle><CardDescription class="text-red-500">Override description</CardDescription><CardAction class="self-center">Override action</CardAction></CardHeader><CardContent class="px-1">Override content</CardContent><CardFooter class="justify-end px-3">Override footer</CardFooter></Card>
  </section>
</section>
