// External diagnostic provider/marker/override; genuine selected original invocation stays intact.
import { ExampleWrapper } from './example-scaffold';
import { Kbd } from './kbd';
import { IconLibraryProvider } from './icons/search-params';
import type { IconLibraryName } from './icons/config';
import { KbdBasic, KbdModifierKeys, KbdGroupExample, KbdArrowKeys, KbdWithIcons, KbdWithIconsAndText, KbdWithSamp } from './kbd-selected-examples';
export function KbdGallery({ library = 'lucide' }: { library?: IconLibraryName }) {
  return (
    <IconLibraryProvider library={library}>
      <div data-gallery="">
        <ExampleWrapper>
          <KbdBasic />
          <KbdModifierKeys />
          <KbdGroupExample />
          <KbdArrowKeys />
          <KbdWithIcons />
          <KbdWithIconsAndText />
          <KbdWithSamp />
        </ExampleWrapper>
        <Kbd data-testid="override" className="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd>
      </div>
    </IconLibraryProvider>
  );
}
