import { test, expect } from '@playwright/test'

test.describe('Save, Load, and Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator')
  })

  test('should open save dialog', async ({ page }) => {
    // Click save button
    await page.getByRole('button', { name: /^save$/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/save.*load/i)).toBeVisible()

    // Should be on save tab
    await expect(page.getByRole('tab', { name: /^save$/i })).toHaveAttribute('data-state', 'active')
  })

  test('should open load dialog', async ({ page }) => {
    // Click load button
    await page.getByRole('button', { name: /^load$/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Can switch to load tab
    await page.getByRole('tab', { name: /^load$/i }).click()
    await expect(page.getByRole('tab', { name: /^load$/i })).toHaveAttribute('data-state', 'active')
  })

  test('should open export dialog', async ({ page }) => {
    // Click export dropdown
    await page.getByRole('button', { name: /export/i }).click()

    // Should see export options
    await expect(page.getByText(/export as pdf/i)).toBeVisible()
    await expect(page.getByText(/export.*csv/i)).toBeVisible()
  })

  test('should open share dialog', async ({ page }) => {
    // Click share button
    await page.getByRole('button', { name: /share/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/share your calculator/i)).toBeVisible()
  })

  test('should open template selector', async ({ page }) => {
    // Click template button
    await page.getByRole('button', { name: /template/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/start from a template/i)).toBeVisible()

    // Should show template options
    await expect(page.getByText(/YC Standard Deal/i)).toBeVisible()
    await expect(page.getByText(/Series A/i)).toBeVisible()
    await expect(page.getByText(/Bootstrap/i)).toBeVisible()
  })

  test('should load a template', async ({ page }) => {
    // Click template button
    await page.getByRole('button', { name: /template/i }).click()

    // Select YC template
    await page.getByText(/YC Standard Deal/i).click()

    // Load template
    await page.getByRole('button', { name: /load template/i }).click()

    // Dialog should close and data should be loaded
    // Check that founders were added
    await page.getByRole('button', { name: /founders/i }).click()
    await expect(page.getByText(/Founder 1/i)).toBeVisible()
  })

  test('should have undo/redo buttons', async ({ page }) => {
    // Check for undo/redo buttons
    const undoButton = page.getByTitle(/undo/i)
    const redoButton = page.getByTitle(/redo/i)

    await expect(undoButton).toBeVisible()
    await expect(redoButton).toBeVisible()

    // Should be disabled initially
    await expect(undoButton).toBeDisabled()
    await expect(redoButton).toBeDisabled()
  })
})
