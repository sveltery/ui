import { copyFileSync, cpSync } from 'node:fs';
copyFileSync('../../apps/docs/registry/styles/style-nova.css', 'dist/nova.css');
copyFileSync('../../apps/docs/registry/styles/themes.css', 'dist/themes.css');
copyFileSync('../../apps/docs/registry/styles/styles.css', 'dist/styles.css');
cpSync('../../apps/docs/registry/styles/scoped', 'dist/scoped', { recursive: true });
