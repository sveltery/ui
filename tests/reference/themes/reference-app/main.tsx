import { createRoot } from 'react-dom/client';
import { ThemeProbe } from '../ThemeProbe';
import { LabelProbe } from '../../LabelProbe';
import { AvatarGallery } from '../../AvatarGallery';
import { AvatarSupplementalProbe } from '../../AvatarSupplementalProbe';
import type { IconLibraryName } from '../../icons/config';
import { CardGallery } from '../../CardGallery';
import { AspectRatioGallery } from '../../AspectRatioGallery';
import { KbdGallery } from '../../KbdGallery';
import './reference.css';
// Diagnostic-only independent document: original Label body and complete
// original CSS, without production subsets or compatibility reset rules.
const labelDiagnostic = window.location.pathname === '/label';
const cardDiagnostic = window.location.pathname === '/card';
const avatarDiagnostic = window.location.pathname === '/avatar';
const avatarProbeDiagnostic = window.location.pathname === '/avatar-probe';
const aspectRatioDiagnostic = window.location.pathname === '/aspect-ratio';
const kbdDiagnostic = window.location.pathname === '/kbd';
const library = new URLSearchParams(window.location.search).get('library') as IconLibraryName | null;
if (labelDiagnostic || cardDiagnostic || avatarDiagnostic || avatarProbeDiagnostic || aspectRatioDiagnostic || kbdDiagnostic) document.documentElement.className = 'style-nova';
createRoot(document.getElementById('root')!).render(<main className="p-8">{labelDiagnostic ? <LabelProbe /> : cardDiagnostic ? <CardGallery /> : avatarDiagnostic ? <AvatarGallery library={library ?? 'lucide'} /> : avatarProbeDiagnostic ? <AvatarSupplementalProbe /> : aspectRatioDiagnostic ? <AspectRatioGallery /> : kbdDiagnostic ? <KbdGallery library={library ?? 'lucide'} /> : <ThemeProbe />}</main>);
