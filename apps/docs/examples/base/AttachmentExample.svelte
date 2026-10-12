<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger,
  } from '@sveltery/ui/attachment';
  import { Button } from '@sveltery/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@sveltery/ui/dialog';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  let isVisible = $state(true);
</script>

{#snippet AttachmentFiles()}
  <Example title="Files" class="gap-8">
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Horizontal
      </div>
      <div class="flex flex-col gap-3">
        <Attachment class="w-full">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileTextIcon"
              tabler="IconFileText"
              hugeicons="FileIcon"
              phosphor="FileTextIcon"
              remixicon="RiFileTextLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove sales-dashboard.pdf">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="TableIcon"
              tabler="IconTable"
              hugeicons="TableIcon"
              phosphor="TableIcon"
              remixicon="RiTableLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>customer-import.csv</AttachmentTitle>
            <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove customer-import.csv">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileCodeIcon"
              tabler="IconFileCode"
              hugeicons="File01Icon"
              phosphor="FileCodeIcon"
              remixicon="RiFileCodeLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
            <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove message-renderer.tsx">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </div>
    </div>
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Vertical
      </div>
      <AttachmentGroup class="w-full">
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileTextIcon"
              tabler="IconFileText"
              hugeicons="FileIcon"
              phosphor="FileTextIcon"
              remixicon="RiFileTextLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove sales-dashboard.pdf">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="TableIcon"
              tabler="IconTable"
              hugeicons="TableIcon"
              phosphor="TableIcon"
              remixicon="RiTableLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>customer-import.csv</AttachmentTitle>
            <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove customer-import.csv">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileCodeIcon"
              tabler="IconFileCode"
              hugeicons="File01Icon"
              phosphor="FileCodeIcon"
              remixicon="RiFileCodeLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
            <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove message-renderer.tsx">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileArchiveIcon"
              tabler="IconFileZip"
              hugeicons="File01Icon"
              phosphor="FileZipIcon"
              remixicon="RiFileZipLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>source-assets.zip</AttachmentTitle>
            <AttachmentDescription>ZIP · 4.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove source-assets.zip">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="PresentationIcon"
              tabler="IconPresentation"
              hugeicons="Presentation01Icon"
              phosphor="PresentationIcon"
              remixicon="RiSlideshowLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>quarterly-review.key</AttachmentTitle>
            <AttachmentDescription>Keynote · 9 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove quarterly-review.key">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
    </div>
  </Example>

{/snippet}

{#snippet AttachmentContentOnly()}
  <Example title="Content Only" class="gap-8">
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Title
      </div>
      <div class="flex flex-col gap-3">
        <Attachment class="w-full">
          <AttachmentContent>
            <AttachmentTitle>React Documentation</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove React Documentation">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentContent>
            <AttachmentTitle>Tailwind CSS</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove Tailwind CSS">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" class="w-48">
          <AttachmentContent>
            <AttachmentTitle>shadcn/ui</AttachmentTitle>
          </AttachmentContent>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" aria-label="Open shadcn/ui"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
      </div>
    </div>
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Title and Description
      </div>
      <div class="flex flex-col gap-3">
        <Attachment class="w-full">
          <AttachmentContent>
            <AttachmentTitle>Building accessible components</AttachmentTitle>
            <AttachmentDescription>
              react.dev · 8 min read
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove Building accessible components">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentContent>
            <AttachmentTitle>Utility-first CSS framework</AttachmentTitle>
            <AttachmentDescription>tailwindcss.com</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove Utility-first CSS framework">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" class="w-full max-w-80">
          <AttachmentContent>
            <AttachmentTitle>Compound components in React</AttachmentTitle>
            <AttachmentDescription>ui.shadcn.com/docs</AttachmentDescription>
          </AttachmentContent>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://ui.shadcn.com/docs" target="_blank" rel="noopener noreferrer" aria-label="Open Compound components in React"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
      </div>
    </div>
  </Example>

{/snippet}

{#snippet AttachmentImages()}
  <Example title="Images" class="gap-8">
    <div class="flex w-full flex-col gap-3">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Horizontal
      </div>
      <div class="flex flex-col gap-2">
        <Attachment class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open workspace.png"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
              alt="Desk"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>desk-reference.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 1.1 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove desk-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open desk-reference.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 940 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove office-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open office-reference.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
      </div>
    </div>
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Vertical
      </div>
      <AttachmentGroup class="w-full">
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open workspace.png"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
              alt="Desk"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>desk-reference.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 1.1 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove desk-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open desk-reference.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 940 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove office-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open office-reference.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop&q=80"
              alt="Outdoor patio"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>patio-reference.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 1.6 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove patio-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open patio-reference.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop&q=80"
              alt="House exterior"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>house-exterior.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 1.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove house-exterior.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger>
            {#snippet render(props)}
              <a {...props} href="https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop&q=80" target="_blank" rel="noreferrer" aria-label="Open house-exterior.jpg"></a>
            {/snippet}
          </AttachmentTrigger>
        </Attachment>
      </AttachmentGroup>
    </div>
  </Example>

{/snippet}

{#snippet AttachmentImageStates()}
  <Example title="Image States" class="gap-8">
    <div class="flex w-full flex-col gap-3">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Horizontal
      </div>
      <div class="flex flex-col gap-2">
        <Attachment state="idle" class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Ready to upload</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove office-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="uploading" class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>Uploading · 72%</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="processing" class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
              alt="Desk"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>desk-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Processing image</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove desk-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="error" class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Upload failed</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Retry image upload">
              <IconPlaceholder
                lucide="RefreshCwIcon"
                tabler="IconRefresh"
                hugeicons="RefreshIcon"
                phosphor="ArrowClockwiseIcon"
                remixicon="RiRefreshLine"
              />
            </AttachmentAction>
            <AttachmentAction aria-label="Remove attachment">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="done" class="w-full">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>Uploaded · 1.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </div>
    </div>
    <div class="flex w-full flex-col gap-2">
      <div class="px-1 text-xs font-medium text-muted-foreground">
        Vertical
      </div>
      <AttachmentGroup class="w-full">
        <Attachment state="idle" orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Ready</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove office-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="uploading" orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>Uploading</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="processing" orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
              alt="Desk"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>desk-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Processing</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove desk-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="error" orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
              alt="Office"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>office-reference.jpg</AttachmentTitle>
            <AttachmentDescription>Failed</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Retry office-reference.jpg">
              <IconPlaceholder
                lucide="RefreshCwIcon"
                tabler="IconRefresh"
                hugeicons="RefreshIcon"
                phosphor="ArrowClockwiseIcon"
                remixicon="RiRefreshLine"
              />
            </AttachmentAction>
            <AttachmentAction aria-label="Remove office-reference.jpg">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="done" orientation="vertical">
          <AttachmentMedia variant="image">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
              alt="Workspace"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>Done</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove workspace.png">
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
    </div>
  </Example>

{/snippet}

{#snippet AttachmentSizes()}
  <Example title="Sizes" class="gap-3">
    <Attachment size="default" class="w-full">
      <AttachmentMedia>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="FileIcon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Default attachment</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
    <Attachment size="sm" class="w-full">
      <AttachmentMedia>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="FileIcon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Small attachment</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
    <Attachment size="xs" class="w-full">
      <AttachmentMedia>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="FileIcon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Extra small attachment</AttachmentTitle>
      </AttachmentContent>
    </Attachment>
  </Example>

{/snippet}

{#snippet AttachmentScrollableGroup()}
  <Example title="Scrollable Group" class="gap-4">
    <AttachmentGroup class="w-full">
      <Attachment class="w-64">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileText"
            hugeicons="FileIcon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>briefing-notes.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 1.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove briefing-notes.pdf">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-64">
        <AttachmentMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
            alt="Workspace"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>workspace.png</AttachmentTitle>
          <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove workspace.png">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-64">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="TableIcon"
            tabler="IconTable"
            hugeicons="TableIcon"
            phosphor="TableIcon"
            remixicon="RiTableLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>customers.csv</AttachmentTitle>
          <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove customers.csv">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-64">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileCodeIcon"
            tabler="IconFileCode"
            hugeicons="File01Icon"
            phosphor="FileCodeIcon"
            remixicon="RiFileCodeLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TSX · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove renderer.tsx">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
    <AttachmentGroup class="w-full">
      <Attachment orientation="vertical">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileText"
            hugeicons="FileIcon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>invoice.pdf</AttachmentTitle>
          <AttachmentDescription>PDF</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove invoice.pdf">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image" class="aspect-square w-full">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
            alt="Desk"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>desk.jpg</AttachmentTitle>
          <AttachmentDescription>JPG</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove desk.jpg">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileArchiveIcon"
            tabler="IconFileZip"
            hugeicons="File01Icon"
            phosphor="FileZipIcon"
            remixicon="RiFileZipLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>assets.zip</AttachmentTitle>
          <AttachmentDescription>ZIP</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove assets.zip">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image" class="aspect-square w-full">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
            alt="Office"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>office.jpg</AttachmentTitle>
          <AttachmentDescription>JPG</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove office.jpg">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileText"
            hugeicons="FileIcon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.pdf</AttachmentTitle>
          <AttachmentDescription>PDF</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove notes.pdf">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  </Example>

{/snippet}

{#snippet AttachmentTriggers()}
  <Example title="Triggers" class="gap-3">
    {#if isVisible}
      <Attachment class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileText"
            hugeicons="FileIcon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>contract-review.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 820 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download attachment">
            <IconPlaceholder
              lucide="DownloadIcon"
              tabler="IconDownload"
              hugeicons="Download01Icon"
              phosphor="DownloadIcon"
              remixicon="RiDownloadLine"
            />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove attachment" onclick={() => (isVisible = false)}>
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger>
          {#snippet render(props)}
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a {...props} href="#" target="_blank" rel="noreferrer" aria-label="Open contract-review.pdf"></a>
          {/snippet}
        </AttachmentTrigger>
      </Attachment>
    {:else}
      <Button variant="outline" onclick={() => (isVisible = true)}>Restore attachment</Button>
    {/if}
    <Dialog>
      <Attachment class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileSearchIcon"
            tabler="IconFileSearch"
            hugeicons="FileSearchIcon"
            phosphor="FileMagnifyingGlassIcon"
            remixicon="RiFileSearchLine"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>research-summary.pdf</AttachmentTitle>
          <AttachmentDescription>Open preview dialog</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Copy link">
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove research-summary.pdf">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </AttachmentAction>
        </AttachmentActions>
        <DialogTrigger>
          {#snippet render(props)}
            <AttachmentTrigger {...props} aria-label="Preview research-summary.pdf" />
          {/snippet}
        </DialogTrigger>
      </Attachment>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>research-summary.pdf</DialogTitle>
          <DialogDescription>
            Attachment triggers can open dialogs while actions remain independently reachable.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render AttachmentFiles()}
  {@render AttachmentContentOnly()}
  {@render AttachmentImages()}
  {@render AttachmentImageStates()}
  {@render AttachmentSizes()}
  {@render AttachmentScrollableGroup()}
  {@render AttachmentTriggers()}
</ExampleWrapper>
