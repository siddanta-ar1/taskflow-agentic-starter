import { expect, test } from "@playwright/test"

test("landing page shows the waitlist form", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Ship work, not status updates" })).toBeVisible()
  await expect(page.getByPlaceholder("Enter your work email")).toBeVisible()
})

test("board redirects signed-out users to login", async ({ page }) => {
  await page.goto("/board")
  await expect(page).toHaveURL(/\/login/)
})
