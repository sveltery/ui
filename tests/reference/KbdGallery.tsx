// Supplemental harness for the exact selected upstream example bodies. MIT attribution: LICENSE.
import { ExampleWrapper } from './example-scaffold';
import { Kbd } from './kbd';
import { KbdBasic, KbdModifierKeys, KbdGroupExample, KbdArrowKeys, KbdWithSamp } from './kbd-selected-examples';
export function KbdGallery() { return <ExampleWrapper data-gallery><KbdBasic /><KbdModifierKeys /><KbdGroupExample /><KbdArrowKeys /><KbdWithSamp /><Kbd data-testid="override" className="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd></ExampleWrapper>; }
