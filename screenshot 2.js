const { chromium } = require('playwright');
(async () => {
  const serverUrl = 'http://127.0.0.1:8000/home.html';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(serverUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'home-preview.png', fullPage: true });
  const nextBtn = await page.$('button[data-step-next]');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'home-error.png', fullPage: true });
  }
  await browser.close();
})();
