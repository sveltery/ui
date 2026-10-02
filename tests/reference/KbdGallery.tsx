// Supported function bodies extracted from byte-exact kbd-example.tsx. MIT attribution: LICENSE.
// Only Example's section/heading scaffold replaces the upstream Example component.
import type { ReactNode } from 'react';
import { Kbd, KbdGroup } from './kbd';
function Example({ title, children }: { title: string; children: ReactNode }) { return <section data-example><h2>{title}</h2>{children}</section>; }
function KbdBasic() { return <Example title="Basic"><div className="flex items-center gap-2"><Kbd>Ctrl</Kbd><Kbd>⌘K</Kbd><Kbd>Ctrl + B</Kbd></div></Example>; }
function KbdModifierKeys() { return <Example title="Modifier Keys"><div className="flex items-center gap-2"><Kbd>⌘</Kbd><Kbd>C</Kbd></div></Example>; }
function KbdGroupExample() { return <Example title="KbdGroup"><KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup></Example>; }
function KbdArrowKeys() { return <Example title="Arrow Keys"><div className="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd></div></Example>; }
function KbdWithSamp() { return <Example title="With samp"><Kbd><samp>File</samp></Kbd></Example>; }
export function KbdGallery() { return <section data-gallery className="grid gap-6"><KbdBasic /><KbdModifierKeys /><KbdGroupExample /><KbdArrowKeys /><KbdWithSamp /><Kbd data-testid="override" className="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd></section>; }
