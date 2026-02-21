const { chromium } = require("playwright");

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/seed/${seed}`;
    await page.goto(url);
    await page.waitForTimeout(5000);

    const numbers = await page.evaluate(() => {
      const text = document.documentElement.innerText;
      return (text.match(/-?\d+/g) || []).map(Number);
    });

    const pageSum = numbers.reduce((a, b) => a + b, 0);
    total += pageSum;

    console.log(`Seed ${seed} sum = ${pageSum}`);
  }

  console.log("FINAL_SUM =", total);
  await browser.close();
})();
