import { createRoot } from 'react-dom/client';
import { ThemeProbe } from '../ThemeProbe';
import './reference.css';
createRoot(document.getElementById('root')!).render(<main className="p-8"><ThemeProbe /></main>);
