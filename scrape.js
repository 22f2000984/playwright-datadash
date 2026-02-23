// const { request } = require("playwright");

// (async () => {
//   const seeds = [23,24,25,26,27,28,29,30,31,32];
//   let total = 0;

//   // Playwright HTTP client (CI-safe)
//   const context = await request.newContext();

//   for (const seed of seeds) {
//     const url = `https://exam.sanand.workers.dev/seed/${seed}`;

//     const response = await context.get(url);
//     const html = await response.text();

//     // Extract all numbers from HTML
//     const numbers = (html.match(/-?\d+(\.\d+)?/g) || []).map(Number);
//     const pageSum = numbers.reduce((a, b) => a + b, 0);

//     console.log(`Seed ${seed} sum = ${pageSum}`);
//     total += pageSum;
//   }

// //   console.log("FINAL_SUM =", total);
//   console.log("DEBUG_TOTAL", total);
//   console.log("FINAL_SUM =", total);
// })();
const { chromium } = require('playwright');

(async () => {
  const seeds = [23,24,25,26,27,28,29,30,31,32];
  let total = 0;
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const seed of seeds) {
    const page = await browser.newPage();
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;  // FIXED URL
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Extract ALL numbers from table cells (handles decimals, negatives)
    const numbers = await page.$$eval('table td, table th', cells => 
      cells.flatMap(cell => {
        const text = cell.textContent.trim();
        // Extract any number: 123, 45.67, -89.01, 1,234.56
        const matches = text.match(/-?\d+(?:,\d{3})*(?:\.\d+)?/g);
        return matches ? matches.map(n => parseFloat(n.replace(/,/g, ''))) : [];
      }).filter(n => !isNaN(n))
    );
    
    const pageSum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed} sum = ${pageSum}`);
    total += pageSum;
    await page.close();
  }
  
  await browser.close();
  console.log(`FINAL_SUM = ${total}`);
})();
