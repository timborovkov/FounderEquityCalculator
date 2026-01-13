import { test, expect } from '@playwright/test'

test.describe('Calculator Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator')
  })

  test('should load calculator page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /timeline/i })).toBeVisible()
    await expect(page.getByText(/timeline view/i)).toBeVisible()
    await expect(page.getByText(/table view/i)).toBeVisible()
  })

  test('should add company information', async ({ page }) => {
    // Switch to table view and company section
    await page.getByRole('tab', { name: /table view/i }).click()

    // Click company setup in sidebar
    await page.getByRole('button', { name: /company setup/i }).click()

    // Fill in company name
    await page.getByLabel(/company name/i).fill('Test Startup Inc')

    // Check that the value was entered
    await expect(page.getByLabel(/company name/i)).toHaveValue('Test Startup Inc')
  })

  test('should add a founder', async ({ page }) => {
    // Navigate to founders section
    await page.getByRole('tab', { name: /table view/i }).click()
    await page.getByRole('button', { name: /founders/i }).click()

    // Click add founder button
    await page
      .getByRole('button', { name: /add founder/i })
      .first()
      .click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill in founder details
    await page.getByLabel(/founder name/i).fill('John Doe')
    await page.getByLabel(/equity percentage/i).fill('50')

    // Save founder
    await page.getByRole('button', { name: /^add founder$/i }).click()

    // Check that founder was added
    await expect(page.getByText('John Doe')).toBeVisible()
  })

  test('should add a funding round', async ({ page }) => {
    // Navigate to rounds section
    await page.getByRole('tab', { name: /table view/i }).click()
    await page.getByRole('button', { name: /funding rounds/i }).click()

    // Click add round button
    await page
      .getByRole('button', { name: /add round/i })
      .first()
      .click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill in round details
    await page.getByLabel(/pre-money valuation/i).fill('5000000')
    await page.getByLabel(/investment amount/i).fill('1000000')

    // Save round
    await page
      .getByRole('button', { name: /add round/i })
      .last()
      .click()

    // Check that round was added (look for valuation display)
    await expect(page.getByText(/5\.00M/i)).toBeVisible()
  })

  test('should navigate between sections using sidebar', async ({ page }) => {
    await page.getByRole('tab', { name: /table view/i }).click()

    // Click through different sections
    await page.getByRole('button', { name: /company setup/i }).click()
    await expect(page.getByText(/company information/i)).toBeVisible()

    await page.getByRole('button', { name: /^founders$/i }).click()
    await expect(page.getByText(/founder equity/i)).toBeVisible()

    await page.getByRole('button', { name: /cap table/i }).click()
    await expect(page.getByText(/ownership breakdown/i)).toBeVisible()

    await page.getByRole('button', { name: /charts/i }).click()
    await expect(page.getByRole('tab', { name: /ownership/i })).toBeVisible()
  })

  test('should switch between timeline and table views', async ({ page }) => {
    // Start on timeline view
    await expect(page.getByRole('tab', { name: /timeline view/i })).toHaveAttribute(
      'data-state',
      'active'
    )

    // Switch to table view
    await page.getByRole('tab', { name: /table view/i }).click()
    await expect(page.getByRole('tab', { name: /table view/i })).toHaveAttribute(
      'data-state',
      'active'
    )

    // Switch back to timeline view
    await page.getByRole('tab', { name: /timeline view/i }).click()
    await expect(page.getByRole('tab', { name: /timeline view/i })).toHaveAttribute(
      'data-state',
      'active'
    )
  })

  test('should show summary panel with metrics', async ({ page }) => {
    // Check that summary panel is visible
    await expect(page.getByText(/summary.*insights/i)).toBeVisible()

    // Check for key metrics sections
    await expect(page.getByText(/key metrics/i)).toBeVisible()
    await expect(page.getByText(/ownership/i)).toBeVisible()
  })
})
