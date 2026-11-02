import { test, expect } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('Blog figures load at phone and desktop widths without JavaScript', async ({ page }) => {
  for (const [slug, extension] of [
    ['aspects-of-scientific-method', 'png'],
    ['the-machine-of-speculative-knowledge', 'jpg'],
  ]) {
    const url = `/${slug}-figure-1.${extension}`
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`/blog/${slug}/`)
      const image = page.locator(`[data-post-body] img[src="${url}"]`)
      await image.scrollIntoViewIfNeeded()
      await expect(image).toBeVisible()
      await expect
        .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
        .toBeGreaterThan(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    expect((await page.request.get(url)).status()).toBe(200)
  }
})

test('retired PDF and figure URLs return 404', async ({ request }) => {
  for (const file of [
    'AdviceToAYoungMathematician.pdf',
    'TheHardwareLottery.pdf',
    'YouAndYourResearch.pdf',
    'Box1976_Figure1.png',
    'Swift1726_Figure1.jpg',
  ])
    expect((await request.get(`/${file}`)).status(), file).toBe(404)
})
