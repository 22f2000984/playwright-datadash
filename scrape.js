const { request } = require("playwright");

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;

  // Playwright HTTP client (CI-safe)
  const context = await request.newContext();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/seed/${seed}`;

    const response = await context.get(url);
    const html = await response.text();

    // Extract all numbers from HTML
    const numbers = (html.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    const pageSum = numbers.reduce((a, b) => a + b, 0);

    console.log(`Seed ${seed} sum = ${pageSum}`);
    total += pageSum;
  }

//   console.log("FINAL_SUM =", total);
  console.log("DEBUG_TOTAL", total);
  console.log("FINAL_SUM =", total);
})();