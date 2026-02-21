const { chromium } = require("playwright");

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/seed/${seed}`;

    let pageSum = 0;

    // 🔑 Listen for JSON responses
    page.on("response", async (response) => {
      try {
        const ct = response.headers()["content-type"] || "";
        if (ct.includes("application/json")) {
          const data = await response.json();
          const nums = JSON.stringify(data).match(/-?\d+(\.\d+)?/g) || [];
          pageSum += nums.map(Number).reduce((a, b) => a + b, 0);
        }
      } catch (_) {}
    });

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // allow async fetches

    console.log(`Seed ${seed} sum = ${pageSum}`);
    total += pageSum;
  }

  console.log("FINAL_SUM =", total);
  await browser.close();
})();