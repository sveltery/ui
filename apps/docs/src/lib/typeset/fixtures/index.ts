// Port of shadcn's apps/v4/app/(app)/(typeset)/lib/fixtures at d2fba50. Upstream also keeps recipe, elements and
// tailwind fixtures, but offers none of them, so they are left out.
import { ARTICLE_HTML } from './article';
import { CHANGELOG_HTML } from './changelog';
import { CHAT_HTML } from './chat';
import { DOCS_HTML } from './docs';
import { NOTES_HTML } from './notes';

export { CHAT_QUESTION } from './chat';

export const FIXTURES = { docs: DOCS_HTML, chat: CHAT_HTML, article: ARTICLE_HTML, changelog: CHANGELOG_HTML, notes: NOTES_HTML } as const;

export const CONTENT_OPTIONS = [
  { value: 'docs', label: 'Docs' },
  { value: 'chat', label: 'Chat' },
  { value: 'article', label: 'Article' },
  { value: 'changelog', label: 'Changelog' },
  { value: 'notes', label: 'Notes' },
] as const;
