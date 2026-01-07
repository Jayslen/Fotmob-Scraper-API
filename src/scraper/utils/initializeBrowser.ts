import { chromium } from 'playwright'

export async function initializeBrowser() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  await context.route('**/*', (route) => {
    const blockTypes: string[] = ['font', 'media']
    if (blockTypes.includes(route.request().resourceType())) {
      route.abort()
    } else {
      route.continue()
    }
  })
  const page = await context.newPage()
  return { browser, page }
}
