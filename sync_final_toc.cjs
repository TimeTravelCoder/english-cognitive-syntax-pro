const fs = require('fs'), path = require('path');
const { chromium } = require('C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const maps = JSON.parse(fs.readFileSync('排版成品/page-map.json', 'utf8'));
  for (const kind of ['理论', '练习']) {
    const title = `英语认知句法${kind}全书`;
    const file = path.resolve(`排版成品/${title}（排版版）.html`);
    const b = await chromium.launch({
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      headless: true
    });
    const p = await b.newPage();
    await p.goto('file:///' + file.replace(/\\/g, '/'));
    const state = await p.evaluate(pages => {
      const links = [...document.querySelectorAll('.toc > a')];
      for (const a of links) {
        const key = a.getAttribute('href').replace('#sec-', '');
        if (!pages[key]) throw Error('Missing page ' + key);
        a.querySelector('.toc-pg').textContent = pages[key];
      }
      const subLinks = [...document.querySelectorAll('.chapter-index a')];
      let subFilled = 0;
      for (const a of subLinks) {
        const key = a.getAttribute('href').replace('#', '');
        const pgEl = a.querySelector('.toc-pg');
        if (pgEl && pages[key]) {
          pgEl.textContent = pages[key];
          subFilled++;
        }
      }
      return {
        parts: links.length,
        subsections: subLinks.length,
        subFilled,
        brokenLinks: [...document.querySelectorAll('a[href^="#"]')]
          .filter(a => !document.getElementById(a.hash.slice(1)))
          .map(a => a.hash)
      };
    }, maps[kind]);
    await p.evaluate(() => document.fonts.ready);
    const updatedHtml = await p.content();
    fs.writeFileSync(file, updatedHtml);
    fs.writeFileSync(path.resolve(`定稿打印版/多元配色修订版/${title}（排版版）.html`), updatedHtml);
    await p.emulateMedia({ media: 'print' });
    await p.pdf({
      path: path.resolve(`排版成品/${title}（排版版）.pdf`),
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="width:100%;padding:0 17mm;font-size:8px;color:#667788;display:flex;justify-content:space-between"><span>${title}</span><span class="pageNumber"></span></div>`,
      preferCSSPageSize: true,
      timeout: 120000,
      outline: true
    });
    await b.close();
    console.log(kind, JSON.stringify(state));
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
