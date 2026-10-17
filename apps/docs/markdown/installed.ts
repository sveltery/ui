import { CliError } from '../../../packages/cli/src/parse';
import { applyTransforms, type TransformContext } from '../../../packages/cli/src/transforms';

/** The Code view shows what `npx @sveltery/ui@latest init -y` then `add` writes: the nova style with Lucide icons. */
export const SOURCE_CONFIG: TransformContext = { iconLibrary: 'lucide', fontHeading: false };

/**
 * Writes docs source the way an app that ran `add` has it, like upstream's `formatCode`: registry imports
 * take the CLI's default aliases for a SvelteKit 3 app (`#lib/...`), and icon placeholders become Lucide icons.
 */
export function asInstalled(content: string, target: string) {
  const imports = content.replace(/'\$registry\/bases\/base\/(?:components\/)?/g, "'#lib/components/");
  try {
    return applyTransforms({ target, content: imports }, SOURCE_CONFIG).content;
  } catch (error) {
    // A placeholder that picks its icon at runtime, as the icon preview's grid does, stays as written, as upstream leaves it.
    if (error instanceof CliError) return imports;
    throw error;
  }
}
