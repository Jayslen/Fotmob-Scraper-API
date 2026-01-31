import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  args: ['--disable-blink-features=AutomationControlled']
})

export async function newPage() {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 600, height: 600 },
    locale: 'en-US',
    timezoneId: 'America/New_York'
  })
  const page = await context.newPage()
  await page.route('**/*', (route) => {
    const blockTypes: string[] = ['font', 'media']
    if (blockTypes.includes(route.request().resourceType())) {
      route.abort()
    } else {
      route.continue()
    }
  })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    })
  })
  return { page, browser }
}
