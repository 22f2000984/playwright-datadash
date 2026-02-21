const { chromium } = require("playwright");

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/seed/${seed}`;
    await page.goto(url);

    const numbers = await page.$$eval("table td", tds =>
      tds
        .map(td => td.innerText.trim())
        .filter(v => v.match(/^-?\d+(\.\d+)?$/))
        .map(Number)
    );

    total += numbers.reduce((a, b) => a + b, 0);
  }

  console.log("FINAL_SUM =", total);
  await browser.close();
})();