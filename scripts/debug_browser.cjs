const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
      if (msg.type() === 'error') {
          console.log('BROWSER ERROR:', msg.text());
      }
  });
  
  page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
  });

  // Load the page
  await page.goto('http://localhost:3000');
  
  // Wait for the app to initialize
  await new Promise(r => setTimeout(r, 2000));
  
  // Set language to English in localStorage
  await page.evaluate(() => {
      localStorage.setItem('andanzas-lang', 'en');
  });
  
  console.log('Reloading in English...');
  await page.reload();
  
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
