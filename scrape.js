const { chromium } = require("playwright");

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/seed/${seed}`;
    await page.goto(url, { waitUntil: "networkidle" });

    // Extract ALL numbers from page text
    const numbers = await page.evaluate(() => {
      const text = document.body.innerText;
      const matches = text.match(/-?\d+(\.\d+)?/g) || [];
      return matches.map(Number);
    });

    const pageSum = numbers.reduce((a, b) => a + b, 0);
    total += pageSum;

    console.log(`Seed ${seed} sum = ${pageSum}`);
  }

  console.log("FINAL_SUM =", total);
  await browser.close();
})();