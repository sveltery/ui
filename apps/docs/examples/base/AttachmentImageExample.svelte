<script lang="ts">
  import XIcon from '@lucide/svelte/icons/x';
  import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger
  } from '$registry/bases/base/ui/attachment';

  const images = [
    {
      name: 'workspace.png',
      meta: 'PNG · 820 KB',
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
      alt: 'Workspace'
    },
    {
      name: 'desk-reference.jpg',
      meta: 'JPG · 1.1 MB',
      src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
      alt: 'Desk'
    },
    {
      name: 'office-reference.jpg',
      meta: 'JPG · 940 KB',
      src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
      alt: 'Office'
    }
  ];
</script>

<div class="mx-auto w-full max-w-sm py-12">
  <AttachmentGroup class="w-full">
    {#each images as image (image.name)}
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src={image.src} alt={image.alt} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{image.name}</AttachmentTitle>
          <AttachmentDescription>{image.meta}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label={`Remove ${image.name}`}>
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger>
          {#snippet render(props)}
            <a {...props} href={image.src} target="_blank" rel="noreferrer" aria-label={`Open ${image.name}`}></a>
          {/snippet}
        </AttachmentTrigger>
      </Attachment>
    {/each}
  </AttachmentGroup>
</div>
