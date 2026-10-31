import { test, expect } from '@playwright/test'

test.use({ hasTouch: true })

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
