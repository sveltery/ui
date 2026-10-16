// Type-only: `pnpm --filter @sveltery/ui check` fails when the CLI's parsed shapes and the registry's served shapes drift apart.
import type * as Served from '../../../apps/docs/registry/types.js';
import type * as Parsed from '../src/registry.js';

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const assertSame = <T extends true>(): T | undefined => undefined;

assertSame<Same<Parsed.StyleName, Served.StyleName>>();
assertSame<Same<Parsed.BaseColor, Served.BaseColor>>();
assertSame<Same<Parsed.AccentColor, Served.AccentColor>>();
assertSame<Same<Parsed.IconLibraryName, Served.IconLibrary>>();
assertSame<Same<typeof Parsed.REGISTRY_VERSION, typeof Served.REGISTRY_VERSION>>();
assertSame<Same<Parsed.RegistryFile, Served.RegistryFile>>();
assertSame<Same<Parsed.CssVars, Served.CssVars>>();
assertSame<Same<Parsed.CssTree, Served.CssTree>>();
assertSame<Same<Parsed.RegistryBaseConfig, Served.RegistryBaseConfig>>();
assertSame<Same<Parsed.RegistryFont, Served.RegistryFont>>();
assertSame<Same<Parsed.RegistryItem, Served.RegistryItem>>();
assertSame<Same<Parsed.RegistryManifest, Served.RegistryManifest>>();
