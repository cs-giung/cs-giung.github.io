import { expect, test, type Page } from '@playwright/test'
import { drawerImages } from '../../lib/drawer-data'
import { INITIAL_EAGER_IMAGE_COUNT } from '../../lib/drawer-loading'

const orderedImages = drawerImages.toSorted((a, b) => b.year - a.year)

test.use({ hasTouch: true })

async function expectInitialViewportLoading(page: Page) {
  const images = await page.locator('.drawer-image img').evaluateAll((elements) =>
    elements.map((element) => {
      const { top, bottom } = element.getBoundingClientRect()
      return {
        loading: element.getAttribute('loading'),
        visible: top < innerHeight && bottom > 0,
        below: top >= innerHeight,
      }
    }),
  )
  const visible = images.filter((image) => image.visible)
  const below = images.filter((image, index) => image.below && index >= INITIAL_EAGER_IMAGE_COUNT)
  expect(visible.length).toBeGreaterThan(0)
  expect(visible.every((image) => image.loading === 'eager')).toBe(true)
  expect(below.length).toBeGreaterThan(0)
  expect(below.every((image) => image.loading === 'lazy')).toBe(true)
}

test('Drawer eagerly loads the initial viewport across phone and desktop layouts', async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 900],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto('/drawer/', { waitUntil: 'networkidle' })
    await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
    await expectInitialViewportLoading(page)
  }
  await expect(page.locator('img[src="/drawer/2022-445100c4.webp"]')).toHaveAttribute(
    'loading',
    'eager',
  )
})

test('Drawer updates the fold on height-only resizing without promoting the scrolled gallery', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 500 })
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  const eagerImages = page.locator('.drawer-image img[loading="eager"]')
  const initialCount = await eagerImages.count()
  await page.setViewportSize({ width: 1440, height: 1100 })
  await expect.poll(() => eagerImages.count()).toBeGreaterThan(initialCount)
  await expectInitialViewportLoading(page)
  const last = page.locator('.drawer-image img').last()
  await last.scrollIntoViewIfNeeded()
  await page.setViewportSize({ width: 1440, height: 600 })
  await expect(last).toHaveAttribute('loading', 'lazy')
  await expect.poll(() => eagerImages.count()).toBeLessThan(orderedImages.length)
})

test('Drawer measures loading on client navigation and without ResizeObserver', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ResizeObserver', { value: undefined, configurable: true })
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/', { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: 'DRAWER', exact: true }).click()
  await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
  await expectInitialViewportLoading(page)
  for (const width of [390, 375]) {
    await page.setViewportSize({ width, height: 844 })
    await expect
      .poll(() =>
        page
          .locator('.drawer-gallery')
          .evaluate((gallery) =>
            Math.abs(
              Number(gallery.getAttribute('data-gallery-width')) -
                gallery.getBoundingClientRect().width,
            ),
          ),
      )
      .toBeLessThan(1)
    await expectInitialViewportLoading(page)
  }
})

test('Drawer shows uncropped images and hover captions without horizontal overflow', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/drawer/', { waitUntil: 'networkidle' })
    await expect(page.getByRole('link', { name: 'DRAWER', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
    await expect(page.locator('.drawer-item')).toHaveCount(orderedImages.length)
    expect(
      await page.locator('.drawer-item button').evaluateAll((buttons) =>
        buttons.every((button) => {
          const caption = document.getElementById(button.getAttribute('aria-describedby')!)
          return caption?.closest('figure') === button.closest('figure')
        }),
      ),
    ).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    for (const image of await page.locator('.drawer-image img').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) => element.complete && element.naturalHeight === 512,
          ),
        )
        .toBe(true)
      const dimensions = await image.evaluate((element: HTMLImageElement) => ({
        rendered: element.getBoundingClientRect().width / element.getBoundingClientRect().height,
        original: element.naturalWidth / element.naturalHeight,
      }))
      expect(dimensions.rendered).toBeCloseTo(dimensions.original, 2)
    }
    const item = page.locator('.drawer-item').first()
    const caption = item.locator('figcaption')
    await page.mouse.move(0, 0)
    await expect(caption).toBeHidden()
    await item.locator('button').hover()
    await expect(caption).toBeVisible()
    await caption.getByRole('link', { name: 'Source' }).hover()
    await expect(caption).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(caption).toBeHidden()
  }
})

test('Drawer justifies completed rows and left-aligns a capped final row', async ({ page }) => {
  for (const width of [320, 390, 640, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/drawer/', { waitUntil: 'networkidle' })
    const gallery = page.locator('.drawer-gallery')
    await expect(gallery).toHaveAttribute('data-layout-ready', 'true')
    const box = await gallery.boundingBox()
    expect(box).not.toBeNull()
    const tiles = await gallery.locator(':scope > li').evaluateAll((items) =>
      items.map((item) => {
        const image = item.querySelector('img')!.getBoundingClientRect()
        return {
          year: Number(item.getAttribute('data-year')),
          row: Number(item.getAttribute('data-row')),
          justified: item.getAttribute('data-justified') === 'true',
          x: image.x,
          y: image.y,
          right: image.right,
          height: image.height,
          captionHeight: item.querySelector('figcaption')!.getBoundingClientRect().height,
        }
      }),
    )
    expect(tiles.map((tile) => tile.year)).toEqual(orderedImages.map((entry) => entry.year))
    const rows = [...new Set(tiles.map((tile) => tile.row))].map((row) =>
      tiles.filter((tile) => tile.row === row),
    )
    for (const [index, row] of rows.entries()) {
      expect(row[0].x).toBeCloseTo(box!.x, 0)
      expect(row.at(-1)!.right).toBeLessThanOrEqual(box!.x + box!.width + 1)
      for (const tile of row) {
        expect(tile.height).toBeCloseTo(row[0].height, 1)
        expect(tile.captionHeight).toBeLessThanOrEqual(tile.height + 1)
      }
      if (index < rows.length - 1 || row[0].justified) {
        expect(row[0].justified).toBe(true)
        expect(row.at(-1)!.right).toBeCloseTo(box!.x + box!.width, 0)
      } else {
        expect(row[0].height).toBeLessThanOrEqual(box!.width < 480 ? 160 : 192)
      }
    }
    if (width >= 640) expect(rows.some((row) => row.length > 1)).toBe(true)
    expect(tiles.at(-1)!.y).toBe(Math.max(...tiles.map((tile) => tile.y)))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('Drawer fills the final mobile row without shrinking or cropping its image', async ({
  page,
}) => {
  for (const width of [320, 375, 390, 511]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/drawer/', { waitUntil: 'networkidle' })
    const gallery = page.locator('.drawer-gallery')
    await expect(gallery).toHaveAttribute('data-layout-ready', 'true')
    const last = gallery.locator(':scope > li').last()
    await expect(last).toHaveAttribute('data-row', String(orderedImages.length - 1))
    await expect(last).toHaveAttribute('data-justified', 'true')
    const image = last.locator('img')
    await image.scrollIntoViewIfNeeded()
    const box = await gallery.boundingBox()
    const dimensions = await image.evaluate((element: HTMLImageElement) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      aspect: Number(element.getAttribute('width')) / Number(element.getAttribute('height')),
    }))
    expect(dimensions.width).toBeCloseTo(box!.width, 0)
    expect(dimensions.width / dimensions.height).toBeCloseTo(dimensions.aspect, 2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('Drawer keeps a narrow portrait caption and its source inside the image', async ({ page }) => {
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
  // Keep this stress case stable as new images change the gallery's row packing.
  await page.addStyleTag({
    content:
      '.drawer-gallery > li[data-image="/drawer/1969-4f1ead2e.webp"] { --drawer-render-width: 115px !important; --drawer-render-height: 143px !important; }',
  })
  const item = page.locator('li[data-image="/drawer/1969-4f1ead2e.webp"]')
  await item.locator('button').hover()
  const image = await item.locator('img').boundingBox()
  const caption = await item.locator('figcaption').boundingBox()
  const source = await item.getByRole('link', { name: 'Source' }).boundingBox()
  expect(image && caption && source).toBeTruthy()
  expect(caption!.y).toBeGreaterThanOrEqual(image!.y - 1)
  expect(source!.y + source!.height).toBeLessThanOrEqual(image!.y + image!.height + 1)
  await expect(item.locator('figcaption')).toHaveText('1969 · Source')
  await expect(item.getByRole('link', { name: /Source:/ })).toHaveAttribute(
    'aria-label',
    /Adam Cuerden/,
  )
})

test('Drawer supports keyboard captions, pinning, Escape, and visible print captions', async ({
  page,
}) => {
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  const item = page.locator('.drawer-item').first()
  const button = item.locator('button')
  const caption = item.locator('figcaption')
  await page.getByRole('link', { name: 'DRAWER', exact: true }).focus()
  await page.keyboard.press('Tab')
  await expect(button).toBeFocused()
  await expect(caption).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(caption.getByRole('link')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(button).toBeFocused()
  await expect(caption).toBeHidden()
  await button.press('Space')
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: 'BLOG', exact: true }).focus()
  await expect(caption).toBeVisible()
  await button.focus()
  await button.press('Enter')
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await expect(caption).toBeHidden()
  await page.emulateMedia({ media: 'print' })
  for (const printed of await page.locator('figcaption').all()) await expect(printed).toBeVisible()
})

test('Drawer shares one Escape listener, closes all pins, and cleans up on navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const callbacks = new Set<unknown>()
    const add = document.addEventListener.bind(document)
    const remove = document.removeEventListener.bind(document)
    document.addEventListener = ((...args: Parameters<typeof add>) => {
      if (args[0] === 'keydown') callbacks.add(args[1])
      add(...args)
    }) as typeof document.addEventListener
    document.removeEventListener = ((...args: Parameters<typeof remove>) => {
      if (args[0] === 'keydown') callbacks.delete(args[1])
      remove(...args)
    }) as typeof document.removeEventListener
    Object.defineProperty(window, 'testKeydownCount', { get: () => callbacks.size })
  })
  const keydownCount = () => page.evaluate(() => Reflect.get(window, 'testKeydownCount') as number)
  await page.goto('/blog/', { waitUntil: 'networkidle' })
  const baseline = await keydownCount()
  for (let visit = 0; visit < 2; visit++) {
    await page.getByRole('link', { name: 'DRAWER', exact: true }).click()
    await expect(page.locator('.drawer-gallery')).toHaveAttribute('data-layout-ready', 'true')
    await expect.poll(keydownCount).toBe(baseline + 1)
    const buttons = page.locator('.drawer-item button')
    await buttons.nth(0).press('Space')
    await buttons.nth(1).press('Space')
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true')
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true')
    const blog = page.getByRole('link', { name: 'BLOG', exact: true })
    await blog.focus()
    await page.keyboard.press('Escape')
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'false')
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.drawer-item').nth(0).locator('figcaption')).toBeHidden()
    await expect(page.locator('.drawer-item').nth(1).locator('figcaption')).toBeHidden()
    await blog.click()
    await expect.poll(keydownCount).toBe(baseline)
  }
})

test('Drawer captions toggle on touch without leaving the gallery', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  const item = page.locator('.drawer-item').last()
  const button = item.locator('button')
  const caption = item.locator('figcaption')
  await button.tap()
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await expect(caption).toBeVisible()
  await button.tap()
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await expect(caption).toBeHidden()
  await expect(page).toHaveURL('/drawer/')
})

test('Drawer reflows on resize without losing a pinned caption', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/drawer/', { waitUntil: 'networkidle' })
  const gallery = page.locator('.drawer-gallery')
  const button = page.locator('.drawer-item').first().locator('button')
  await button.press('Space')
  for (const width of [640, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect
      .poll(() =>
        gallery.evaluate((element) =>
          Math.abs(
            Number(element.getAttribute('data-gallery-width')) -
              element.getBoundingClientRect().width,
          ),
        ),
      )
      .toBeLessThan(1)
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.drawer-item').first().locator('figcaption')).toBeVisible()
  }
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Drawer images, captions, and source links remain available', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto('/drawer/')
    for (const item of await page.locator('.drawer-item').all()) {
      await item.scrollIntoViewIfNeeded()
      await expect(item.locator('figcaption')).toBeVisible()
      await expect(item.getByRole('link', { name: 'Source' })).toBeVisible()
      await expect
        .poll(() =>
          item
            .locator('img')
            .evaluate((image: HTMLImageElement) => image.complete && image.naturalHeight === 512),
        )
        .toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
})
