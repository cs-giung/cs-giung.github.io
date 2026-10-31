import { test, expect } from '@playwright/test'

for (const hasTouch of [false, true]) {
  test.describe(hasTouch ? 'Touch devices with a mouse' : 'Mouse devices', () => {
    test.use({ hasTouch })

    test('Blog titles underline on hover and keyboard focus without decorating metadata', async ({
      page,
    }) => {
      await page.goto('/blog/')
      await page.evaluate(() => document.fonts.ready)
      for (const kind of ['internal', 'external', 'pdf']) {
        const row = page.locator(`[data-blog-entry][data-link-kind="${kind}"]`).first()
        const title = row.locator('h2 a')
        await expect(title).toHaveCSS('text-decoration-line', 'none')
        await title.hover()
        await expect(title).toHaveCSS('text-decoration-line', 'underline')
        await expect(title).toHaveCSS('text-underline-offset', '2px')
        await expect(row.locator('.post-list-meta')).toHaveCSS('text-decoration-line', 'none')
        if (await row.locator('p').count())
          await expect(row.locator('p')).toHaveCSS('text-decoration-line', 'none')
        await page.mouse.move(0, 0)
        await expect(title).toHaveCSS('text-decoration-line', 'none')
        await title.focus()
        await page.keyboard.press('Shift+Tab')
        await page.keyboard.press('Tab')
        await expect(title).toBeFocused()
        await expect(title).toHaveCSS('text-decoration-line', 'underline')
        await title.evaluate((element: HTMLElement) => element.blur())
        await expect(title).toHaveCSS('text-decoration-line', 'none')
      }
    })
  })
}
