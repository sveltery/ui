// Actual pinned example functions below; Example and Next Image substitutes are supplemental.
import type { ComponentProps } from 'react';
import { AspectRatio } from './aspect-ratio';
function Example({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return <section><h2>{title}</h2><div className={className}>{children}</div></section>;
}
function Image({ fill, style, ...props }: Omit<ComponentProps<'img'>, 'src'> & { src: string; fill?: boolean }) {
  return <img {...props} style={{ ...(fill ? { position: 'absolute', inset: 0 } as const : {}), ...style }} />;
}
export function AspectRatioGallery() { return <section data-aspect-ratio-gallery className="grid max-w-4xl gap-6 2xl:max-w-4xl"><AspectRatio16x9 /><AspectRatio21x9 /><AspectRatio1x1 /><AspectRatio9x16 /></section>; }

function AspectRatio16x9() {
  return (
    <Example title="16:9" className="items-center justify-center">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-lg bg-muted style-luma:rounded-3xl"
      >
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio1x1() {
  return (
    <Example title="1:1" className="items-start">
      <AspectRatio
        ratio={1 / 1}
        className="rounded-lg bg-muted style-luma:rounded-3xl"
      >
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio9x16() {
  return (
    <Example title="9:16" className="items-center justify-center">
      <AspectRatio
        ratio={9 / 16}
        className="rounded-lg bg-muted style-luma:rounded-3xl"
      >
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio21x9() {
  return (
    <Example title="21:9" className="items-center justify-center">
      <AspectRatio
        ratio={21 / 9}
        className="rounded-lg bg-muted style-luma:rounded-3xl"
      >
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
        />
      </AspectRatio>
    </Example>
  )
}
