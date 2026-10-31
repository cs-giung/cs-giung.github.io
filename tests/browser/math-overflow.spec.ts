import { test, expect } from '@playwright/test'

test('formula fitting accounts for visual overflow beyond the measured layout boxes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 })
  await page.goto('/blog/notes-on-diffusion-models/')
  await page.evaluate(() => document.fonts.ready)
  // Model platform-dependent struts or glyph overhang without changing base widths.
  await page.addStyleTag({
    content:
      '.katex-html > .katex-base:not(.katex-tag)::after { content: ""; position: absolute; right: -64px; width: 64px; height: 1px; }',
  })
  await page.setViewportSize({ width: 321, height: 1000 })
  await expect
    .poll(() =>
      page.locator('[data-post-body] .katex-display').evaluateAll((nodes) =>
        nodes
          .filter((node) => node.scrollWidth > node.clientWidth + 1)
          .map((node, index) => ({
            index,
            width: node.clientWidth,
            scrollWidth: node.scrollWidth,
          })),
      ),
    )
    .toEqual([])
  await expect(page.locator('[data-post-body] .katex-display').first()).toHaveCSS(
    'overflow-x',
    'visible',
  )
})
