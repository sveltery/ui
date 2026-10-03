import { createRoot } from 'react-dom/client';
import { ThemeProbe } from '../ThemeProbe';
import { LabelProbe } from '../../LabelProbe';
import { CardGallery } from '../../CardGallery';
import './reference.css';
// Diagnostic-only independent document: original Label body and complete
// original CSS, without production subsets or compatibility reset rules.
const labelDiagnostic = window.location.pathname === '/label';
const cardDiagnostic = window.location.pathname === '/card';
if (labelDiagnostic || cardDiagnostic) document.documentElement.className = 'style-nova';
createRoot(document.getElementById('root')!).render(<main className="p-8">{labelDiagnostic ? <LabelProbe /> : cardDiagnostic ? <CardGallery /> : <ThemeProbe />}</main>);
