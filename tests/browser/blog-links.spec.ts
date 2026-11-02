import { test, expect } from '@playwright/test'

test('Dijkstra appears among excerpts with the requested plain gray description', async ({
  page,
}) => {
  const description =
    'The question of whether Machines Can Think, a question of which we now know that it is about as relevant as the question of whether Submarines Can Swim.'
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/blog/')
    const title = page.getByRole('link', { name: 'The threats to computing science', exact: true })
    const row = page.locator('[data-blog-group="reading"] [data-blog-entry]').filter({ has: title })
    await expect(row).toHaveCount(1)
    await expect(row.locator('[data-post-author]')).toHaveText('Edsger W. Dijkstra')
    await expect(row.locator('time')).toHaveText('1984')
    const note = row.locator(':scope > p')
    await expect(note).toHaveText(description)
    await expect(note).toHaveClass(/text-muted-foreground/)
    await expect(note.locator('a')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.getByRole('link', { name: 'The threats to computing science', exact: true }).click()
  await expect(page).toHaveURL('/blog/the-threats-to-computing-science/')
  await expect(
    page.getByRole('heading', { name: 'The threats to computing science', exact: true, level: 1 }),
  ).toBeVisible()
  const sources = page.locator('[data-post-source]')
  await expect(sources).toHaveCount(1)
  await expect(sources.getByRole('link')).toHaveAttribute(
    'href',
    'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD898.html',
  )
  const excerpts = (await page.locator('[data-post-body] p').allTextContents())
    .map((text) => text.trim())
    .filter((text) => text !== '[…]' && !text.startsWith('Selected excerpts'))
  const starts = [
    'The Fathers of the field had been pretty confusing:',
    'I called this focus on hardware a distortion',
    'Since the Romans have taught us',
    'The major attraction of the modern elixirs',
    'As I said earlier, the programmable computer',
  ]
  expect(excerpts).toHaveLength(starts.length)
  starts.forEach((start, index) => expect(excerpts[index].startsWith(start), start).toBe(true))
})

for (const hasTouch of [false, true]) {
  test.describe(hasTouch ? 'Touch devices with a mouse' : 'Mouse devices', () => {
    test.use({ hasTouch })

    test('Blog titles underline on hover and keyboard focus without decorating metadata', async ({
      page,
    }) => {
      await page.goto('/blog/')
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('[data-blog-entry][data-link-kind="pdf"]')).toHaveCount(0)
      for (const kind of ['internal', 'external']) {
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
