import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Equity Calculator/i)
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')

    // Check hero section
    await expect(page.getByRole('heading', { name: /equity story/i })).toBeVisible()

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /start free/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /start from template/i })).toBeVisible()
  })

  test('should navigate to calculator', async ({ page }) => {
    await page.goto('/')

    // Click "Start Free" button
    await page.getByRole('link', { name: /start free/i }).click()

    // Should navigate to calculator page
    await expect(page).toHaveURL(/calculator/)
    await expect(page.getByRole('heading', { name: /timeline/i })).toBeVisible()
  })

  test('should show features section', async ({ page }) => {
    await page.goto('/')

    // Scroll to features
    await page.evaluate(() => {
      document.getElementById('features')?.scrollIntoView()
    })

    // Check for feature items
    await expect(page.getByText(/interactive timeline/i)).toBeVisible()
    await expect(page.getByText(/founder equity calculator/i)).toBeVisible()
  })

  test('should open template selector', async ({ page }) => {
    await page.goto('/')

    // Click "Start from Template"
    await page.getByRole('button', { name: /start from template/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/YC Standard Deal/i)).toBeVisible()
    await expect(page.getByText(/Series A/i)).toBeVisible()
  })
})
