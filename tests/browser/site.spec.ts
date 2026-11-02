import { test, expect } from '@playwright/test'
import { getCVData } from '../../lib/cv-data.ts'
import { getAllBlogPosts } from '../../lib/blog-posts.ts'
import { getBlogLinks } from '../../lib/blog-links.ts'

const blogEntryCount = getAllBlogPosts().length + getBlogLinks().length
const email = getCVData().personal.email

async function fontsReady(page: import('@playwright/test').Page) {
  await page.evaluate(() => document.fonts.ready)
}

test('main pages retain aligned cards, stable gutters, and shared insets', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const positions: { x: number; y: number }[] = []
    for (const [route, selector] of [
      ['/', '.about-profile'],
      ['/blog/', '[data-blog-panel="own"]'],
      ['/drawer/', '.drawer-gallery'],
      ['/cv/', '.cv-document'],
    ]) {
      await page.goto(route)
      await fontsReady(page)
      const card = page.locator(selector)
      const box = await card.boundingBox()
      expect(box).not.toBeNull()
      positions.push({ x: box!.x, y: box!.y })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      expect(
        await page.locator('html').evaluate((element) => getComputedStyle(element).scrollbarGutter),
      ).toBe('stable')
    }
    expect(positions).toEqual([positions[0], positions[0], positions[0], positions[0]])
    await expect(page.locator('.cv-document')).toHaveCSS('padding-left', '24px')
    const button = page.getByRole('button', { name: 'Print / Save as PDF' })
    await expect(button).toBeVisible()
    await page.emulateMedia({ media: 'print' })
    await expect(button).toBeHidden()
    await expect(page.locator('.cv-document')).toHaveCSS('padding-left', '0px')
    await page.emulateMedia({ media: 'screen' })
  }
})

test('Blog has two simple frames and only blue titles navigate', async ({ page }) => {
  await page.goto('/blog/')
  await expect(page.locator('[data-blog-panel]')).toHaveCount(2)
  await expect(page.locator('[data-blog-entry]')).toHaveCount(blogEntryCount)
  await expect(page.locator('[data-blog-panel="own"] hr')).toHaveCount(1)
  await expect(page.locator('[data-blog-panel="reading"] hr')).toHaveCount(1)
  const orwell = page
    .locator('[data-blog-entry]')
    .filter({ hasText: 'The function of the machine' })
  await expect(orwell.locator('p')).toContainText(
    'it is doing so already, via the camera and the radio.',
  )
  await orwell.locator('p').click()
  await expect(page).toHaveURL('/blog/')
  await orwell.locator('.post-list-meta').click()
  await expect(page).toHaveURL('/blog/')
  await expect(orwell.locator('h2 a')).toHaveClass(/text-blue-600/)
  await orwell.locator('h2 a').click()
  await expect(page).toHaveURL('/blog/the-function-of-the-machine/')
  await expect(page.locator('#post-subject')).toHaveText('The function of the machine')
  const back = page.getByRole('link', { name: 'Back to blog', exact: true })
  expect(await back.evaluate((element) => Boolean(element.closest('[data-post-letter]')))).toBe(
    true,
  )
  await back.click()
  await expect(page).toHaveURL('/blog/')
})

test('external Blog links follow excerpts on phones and desktops', async ({ page }) => {
  await page.goto('/blog/')
  await fontsReady(page)
  const panel = page.locator('[data-blog-panel="reading"]')
  const excerpts = panel.locator('[data-blog-group="reading"]')
  const divider = panel.locator('hr')
  const links = panel.locator('[data-blog-group="links"]')
  await expect(links.locator('[data-blog-entry]')).toHaveCount(getBlogLinks().length)
  await expect(excerpts.locator('[data-link-kind="external"]')).toHaveCount(0)
  await expect(links.locator('[data-link-kind="internal"]')).toHaveCount(0)
  await expect(links.locator('h2')).toHaveText(
    [...getBlogLinks()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((link) => `${link.title} (External link, opens in a new tab)`),
  )
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const [excerptBox, dividerBox, linksBox] = await Promise.all([
      excerpts.boundingBox(),
      divider.boundingBox(),
      links.boundingBox(),
    ])
    expect(excerptBox && dividerBox && linksBox).toBeTruthy()
    expect(dividerBox!.y).toBeGreaterThanOrEqual(excerptBox!.y + excerptBox!.height)
    expect(linksBox!.y).toBeGreaterThanOrEqual(dividerBox!.y + dividerBox!.height)
    expect(linksBox!.x).toBe(excerptBox!.x)
    expect(linksBox!.width).toBe(excerptBox!.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('desktop contents and footnotes flank the article and retain working targets', async ({
  page,
}) => {
  await page.goto('/blog/blue-from-indigo/')
  await fontsReady(page)
  const toc = page.getByRole('navigation', { name: 'Table of contents' })
  const article = page.locator('[data-post-letter]')
  const notes = page.locator('.post-footnotes')
  const [left, center, right] = await Promise.all([
    toc.boundingBox(),
    article.boundingBox(),
    notes.boundingBox(),
  ])
  expect(left!.x + left!.width).toBeLessThanOrEqual(center!.x + 1)
  expect(right!.x).toBeGreaterThanOrEqual(center!.x + center!.width - 1)
  await expect(page.locator('section[data-footnotes]')).toHaveCount(1)
  const headingLink = toc.locator('a').nth(2)
  await headingLink.click()
  await expect(headingLink).toHaveAttribute('aria-current', 'location')
  const reference = page.locator('a[data-footnote-ref]').first()
  const refId = await reference.getAttribute('id')
  const target = await reference.getAttribute('href')
  await reference.click()
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe(target)
  await page.locator(target!).locator('a[data-footnote-backref]').first().click()
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe(`#${refId}`)
  await page.setViewportSize({ width: 390, height: 1000 })
  await expect(toc.locator('details')).not.toHaveAttribute('open')
  const [bodyBox, noteBox] = await Promise.all([article.boundingBox(), notes.boundingBox()])
  expect(noteBox!.y).toBeGreaterThanOrEqual(bodyBox!.y + bodyBox!.height - 1)
  await expect(page.locator('[data-post-body]')).toHaveCSS('font-size', '15px')
  await expect(page.locator('[data-post-envelope]')).toHaveCSS('font-size', '14px')
  await expect(page.locator('#post-subject')).toHaveCSS('font-size', '14px')
})

test('formulas fit without clipping, expand accessibly, and resize for print', async ({ page }) => {
  for (const slug of [
    'notes-on-diffusion-models',
    'notes-on-schrodinger-bridges',
    'notes-on-deep-generative-models',
    'scribbles-on-series-expansion',
  ]) {
    await page.goto(`/blog/${slug}/`)
    await fontsReady(page)
    await expect(page.locator('.katex-error')).toHaveCount(0)
    expect(await page.locator('[data-post-body] .katex-display').count()).toBeGreaterThan(0)
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(
          () =>
            page.locator('[data-post-body] .katex-display').evaluateAll((nodes) =>
              nodes.flatMap((node, index) =>
                node.hasAttribute('data-math-fitted') && node.scrollWidth <= node.clientWidth + 1
                  ? []
                  : [
                      {
                        index,
                        fitted: node.hasAttribute('data-math-fitted'),
                        width: node.clientWidth,
                        scrollWidth: node.scrollWidth,
                      },
                    ],
              ),
            ),
          { message: `${slug}: formulas must fit at ${width}px` },
        )
        .toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 })
  const expand = page.getByRole('button', { name: /Expand formula/ }).first()
  await expect(expand).toBeVisible()
  await expand.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Expanded formula' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.katex')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(expand).toBeFocused()
  await page.emulateMedia({ media: 'print' })
  await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeHidden()
  await expect(page.getByRole('button', { name: /Expand formula/ })).toHaveCount(0)
  await expect(page.locator('[data-post-body]')).toHaveCSS('font-size', '14.6667px')
  expect((await page.pdf({ format: 'A4', displayHeaderFooter: false })).byteLength).toBeGreaterThan(
    10_000,
  )
})

test('contact email restores and copies after hydration while exported HTML stays obfuscated', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  for (const route of ['/', '/cv/']) {
    const response = await page.goto(route)
    expect(await response!.text()).not.toContain(email)
    const link = page.locator('[data-email-contact] a')
    await expect(link).toHaveText(email)
    await expect(link).toHaveAttribute('href', `mailto:${email}`)
    await link.evaluate((element) => {
      const range = document.createRange()
      range.selectNodeContents(element)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    })
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+C' : 'Control+C')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email)
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
    await expect(link).toHaveText(email)
  }
})

test('native disclosures, endnotes and email fallback work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  try {
    const page = await context.newPage()
    await page.goto('/blog/blue-from-indigo/')
    await page.locator('.post-toc summary').click()
    await expect(page.locator('.post-toc details')).toHaveAttribute('open')
    await page.locator('.post-toc a').first().click()
    expect(new URL(page.url()).hash).not.toBe('')
    await page.goto('/cv/')
    await expect(page.locator('[data-email-contact]')).toContainText('[at]')
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0)
    await page.goto('/about/')
    await expect(page).toHaveURL('/')
  } finally {
    await context.close()
  }
})
