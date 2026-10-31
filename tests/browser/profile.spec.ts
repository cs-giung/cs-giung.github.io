import { test, expect, type Page } from '@playwright/test'
import { getCVData } from '../../lib/cv-data.ts'

const personal = getCVData().personal

async function expectPortrait(page: Page) {
  const image = page.locator('.about-profile-image img')
  await expect(image).toBeVisible()
  await expect(image).toHaveAttribute('src', personal.profile_image)
  await expect(image).toHaveAttribute('alt', personal.name)
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
    )
    .toBe(true)
  return image
}

test('portrait loads at phone widths, after cached reloads, and after navigation', async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const image = await expectPortrait(page)
    await expect(image).toHaveCSS('width', width >= 768 ? '160px' : '128px')
    await page.reload()
    await expectPortrait(page)
  }
  await page.getByRole('link', { name: 'BLOG', exact: true }).click()
  await page.getByRole('link', { name: 'ABOUT', exact: true }).click()
  await expectPortrait(page)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('portrait is in the initial HTML and loads natively, including print layout', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    const response = await page.goto('/')
    const html = await response!.text()
    expect(html).toMatch(/<img\b[^>]*data-slot="avatar"/)
    const image = await expectPortrait(page)
    const asset = await page.request.get(personal.profile_image)
    expect(asset.status()).toBe(200)
    expect(asset.headers()['content-type']).toMatch(/^image\//)
    await page.emulateMedia({ media: 'print' })
    await expect(image).toHaveCSS('width', '96px')
    await expect(image).toHaveCSS('height', '96px')
  })
})
