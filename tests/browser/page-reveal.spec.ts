import { test, expect, type Page } from '@playwright/test'

test.use({ reducedMotion: 'no-preference' })

async function recordReveals(page: Page, pause = false) {
  await page.addInitScript((pauseAnimations) => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (frames, timing) {
      const animation = animate.call(this, frames, timing)
      if (this instanceof HTMLElement && this.hasAttribute('data-reveal')) {
        this.dataset.testRevealCount = String(Number(this.dataset.testRevealCount || 0) + 1)
        this.dataset.testRevealDuration = String(
          typeof timing === 'object' ? timing.duration : timing,
        )
        if (pauseAnimations) animation.pause()
      }
      return animation
    }
  }, pause)
}

const routes = [
  ['/', '[data-slot="card"]'],
  ['/blog/', '[data-blog-panel]'],
  ['/cv/', '.cv-document'],
  ['/drawer/', '.drawer-gallery > li'],
  ['/blog/the-hardware-lottery/', '[data-post-letter]'],
] as const

test('page boxes rise once and settle without transforms or fading', async ({ page }) => {
  await recordReveals(page)
  for (const [route, selector] of routes) {
    await page.goto(route)
    const target = page.locator(selector).first()
    await expect(target).toHaveAttribute('data-test-reveal-count', '1')
    await expect(target).toHaveAttribute('data-test-reveal-duration', '560')
    await expect(target).toHaveCSS('opacity', '1')
    await expect.poll(() => target.evaluate((element) => element.getAnimations().length)).toBe(0)
    await expect(target).toHaveCSS('transform', 'none')
  }
})

test('offscreen images reveal on entry but never replay on scrolling back', async ({ page }) => {
  await recordReveals(page)
  await page.setViewportSize({ width: 900, height: 600 })
  await page.goto('/drawer/')
  await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
  const last = page.locator('.drawer-gallery > li').last()
  await expect(last).not.toHaveAttribute('data-test-reveal-count')
  await last.scrollIntoViewIfNeeded()
  await expect(last).toHaveAttribute('data-test-reveal-count', '1')
  await expect.poll(() => last.evaluate((element) => element.getAnimations().length)).toBe(0)
  await page.evaluate(() => window.scrollTo(0, 0))
  await last.scrollIntoViewIfNeeded()
  await expect(last).toHaveAttribute('data-test-reveal-count', '1')
})

test('client navigation initializes the next page without a full reload', async ({ page }) => {
  await recordReveals(page)
  await page.goto('/')
  for (const [href, selector] of [
    ['/blog', '[data-blog-panel]'],
    ['/cv', '.cv-document'],
    ['/drawer', '.drawer-gallery > li'],
  ]) {
    await page.locator(`nav a[href^="${href}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
    await expect(page.locator(selector).first()).toHaveAttribute('data-test-reveal-count', '1')
  }
})

test('focus, reduced motion, and printing cancel active reveals', async ({ page }) => {
  await recordReveals(page, true)
  for (const action of ['focus', 'reduce', 'print']) {
    await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' })
    await page.goto('/cv/')
    const document = page.locator('.cv-document')
    await expect(document).toHaveAttribute('data-test-reveal-count', '1')
    expect(await document.evaluate((element) => element.getAnimations().length)).toBe(1)
    if (action === 'focus')
      await page.getByRole('button', { name: 'Print / Save as PDF', exact: true }).focus()
    else if (action === 'reduce') await page.emulateMedia({ reducedMotion: 'reduce' })
    else await page.emulateMedia({ media: 'print' })
    await expect.poll(() => document.evaluate((element) => element.getAnimations().length)).toBe(0)
    await expect(document).toHaveCSS('transform', 'none')
    await expect(document).toHaveCSS('opacity', '1')
  }
})

test('keyboard focus stops image motion and can reach its caption link', async ({ page }) => {
  await recordReveals(page, true)
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  const item = page.locator('.drawer-item').first()
  const tile = page.locator('.drawer-gallery > li').first()
  await expect(tile).toHaveAttribute('data-test-reveal-count', '1')
  await page.getByRole('link', { name: 'DRAWER', exact: true }).focus()
  await page.keyboard.press('Tab')
  await expect(item.locator('button')).toBeFocused()
  await expect.poll(() => tile.evaluate((element) => element.getAnimations().length)).toBe(0)
  await expect(item.locator('figcaption')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(item.locator('figcaption a')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(item.locator('button')).toBeFocused()
  await expect(item.locator('figcaption')).toBeHidden()
})

test('reduced motion and deep links do not start any reveals', async ({ page }) => {
  await recordReveals(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/blog/')
  await expect(page.locator('[data-blog-panel]').first()).toBeVisible()
  await expect(page.locator('[data-test-reveal-count]')).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/blog/the-hardware-lottery/#post-subject')
  await expect(page.locator('#post-subject')).toBeVisible()
  await expect(page.locator('[data-test-reveal-count]')).toHaveCount(0)
})

test('missing animation APIs leave content visible and navigation working', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, 'IntersectionObserver')
    Reflect.deleteProperty(Element.prototype, 'animate')
  })
  await page.goto('/blog/')
  const panel = page.locator('[data-blog-panel]').first()
  await expect(panel).toBeVisible()
  await expect(panel).toHaveCSS('transform', 'none')
  await expect(panel).toHaveCSS('opacity', '1')
  await page.getByRole('link', { name: 'The hardware lottery', exact: true }).click()
  await expect(page).toHaveURL('/blog/the-hardware-lottery/')
  await expect(page.locator('#post-subject')).toHaveText('The hardware lottery')
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('all pages expose their content without hidden or translated boxes', async ({ page }) => {
    for (const [route, selector] of routes) {
      await page.goto(route)
      const target = page.locator(selector).first()
      await expect(target).toBeVisible()
      await expect(target).toHaveCSS('transform', 'none')
      await expect(target).toHaveCSS('opacity', '1')
    }
  })
})
