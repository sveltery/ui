// Genuine pinned shadcn config.test.ts describe block; byte-exact expectations. MIT: tests/reference/LICENSE.
// Only imports are adapted to the source-derived asset generator; CLI/preset/font suites remain unimplemented.
import { describe, expect, it } from "vitest"
import { buildThemeForPreset, DEFAULT_CONFIG } from "../../scripts/theme-assets.mjs"

describe("buildThemeForPreset", () => {
  it("builds a copyable registry theme item", () => {
    const result = buildThemeForPreset({
      ...DEFAULT_CONFIG,
      baseColor: "taupe",
      theme: "taupe",
      chartColor: "taupe",
      menuAccent: "bold",
      radius: "large",
    })

    expect(result).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "taupe-taupe",
      type: "registry:theme",
    })
    expect(result.cssVars?.light?.radius).toBe("0.875rem")
    expect(result.cssVars?.light?.accent).toBe(result.cssVars?.light?.primary)
    expect(result.cssVars?.dark?.accent).toBe(result.cssVars?.dark?.primary)
    expect(result.cssVars?.light?.background).toBeDefined()
    expect(result.cssVars?.dark?.background).toBeDefined()
    expect(result.css).toBeUndefined()
  })
})
