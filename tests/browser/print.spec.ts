import { test, expect } from '@playwright/test'

test.use({ hasTouch: true })

test('CV header aligns its update and decorates contact details', async ({ page }) => {
  await page.goto('/cv/')
  await page.evaluate(() => document.fonts.ready)
  const header = page.locator('.cv-profile')
  const metadata = header.locator('.cv-identity-heading .cv-document-label')
  await expect(metadata).toHaveText('Curriculum Vitae')
  const contactRow = header.locator('.cv-contact-row')
  const updated = contactRow.locator('.cv-updated')
  await expect(updated.locator('time')).toBeVisible()
  await expect(header.locator('.cv-identity-heading .cv-updated')).toHaveCount(0)

  const contacts = header.locator('.cv-contact-line li')
  await expect(contacts).toHaveCount(3)
  for (const contact of await contacts.all()) {
    await expect(contact.locator(':scope > svg.cv-contact-icon')).toBeVisible()
    await expect(contact.locator(':scope > svg.cv-contact-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  }

  for (const media of ['screen', 'print'] as const) {
    await page.emulateMedia({ media })
    for (const width of media === 'screen' ? [320, 390, 640, 768, 1280] : [768, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      const headingBox = await header.locator('.cv-identity-heading').boundingBox()
      const metadataBox = await metadata.boundingBox()
      const rowBox = await contactRow.boundingBox()
      const contactsBox = await header.locator('.cv-contact-line').boundingBox()
      const updatedBox = await updated.boundingBox()
      expect(headingBox && metadataBox && rowBox && contactsBox && updatedBox).toBeTruthy()
      expect(metadataBox!.x + metadataBox!.width).toBeCloseTo(headingBox!.x + headingBox!.width, 0)
      expect(updatedBox!.x + updatedBox!.width).toBeCloseTo(rowBox!.x + rowBox!.width, 0)
      if (media === 'print' || width >= 768) {
        expect(Math.abs(updatedBox!.y - contactsBox!.y)).toBeLessThan(6)
        expect(contactsBox!.x + contactsBox!.width).toBeLessThan(updatedBox!.x)
        expect(contactsBox!.height).toBeLessThan(25)
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
    }
  }
})

test('CV internship seasons stay on one line on desktop and in print', async ({ page }) => {
  await page.goto('/cv/')
  await page.evaluate(() => document.fonts.ready)
  const period = page
    .locator('.cv-career-entry')
    .filter({ hasText: 'Visual Intelligence Laboratory, ETRI' })
    .locator('.cv-career-period')
  await expect(period).toHaveText('Summer 2019, Winter & Summer 2020')

  for (const media of ['screen', 'print'] as const) {
    await page.emulateMedia({ media })
    for (const width of [768, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      const lines = await period.evaluate((element) => {
        const range = document.createRange()
        range.selectNodeContents(element)
        return range.getClientRects().length
      })
      expect(lines, `${media} at ${width}px`).toBe(1)
    }
  }

  await page.emulateMedia({ media: 'screen' })
  await page.setViewportSize({ width: 320, height: 900 })
  await expect(period).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('CV print control requests printing from touch and keyboard activation', async ({ page }) => {
  // Headless tests check activation, not the operating system's native print dialog.
  await page.addInitScript(() => {
    let requests = 0
    window.print = () => {
      document.documentElement.dataset.printRequests = String(++requests)
    }
  })
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/cv/')
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible()
    const button = page.getByRole('button', { name: 'Print / Save as PDF', exact: true })
    await expect(button).toBeEnabled()
    await button.tap()
    await expect(page.locator('html')).toHaveAttribute('data-print-requests', '1')
    await button.focus()
    await button.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-print-requests', '2')
  }
})
