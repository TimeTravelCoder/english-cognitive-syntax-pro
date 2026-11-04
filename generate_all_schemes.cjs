const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = __dirname;

const schemes = [
  {
    folder: '配色方案1_莫兰迪学术多色',
    palette: [
      ['青灰蓝', '#2b6cb0', '#edf4fb', '#b6d1ed'],
      ['鼠尾绿', '#2c7a7b', '#eef7f7', '#b2dcdb'],
      ['灰绿', '#2f855a', '#eff7f2', '#b3dec5'],
      ['淡靛', '#4c51bf', '#f1f2fb', '#c6c9f2'],
      ['松石暗', '#234e52', '#edf5f6', '#add1d4'],
      ['陶赭', '#975a16', '#faf4eb', '#ebd1af'],
      ['灰紫', '#553c9a', '#f5f1fa', '#d0c3eb'],
      ['暖驼', '#744210', '#faf3eb', '#e6caa6'],
    ],
    mixedColors: [
      { accent: '#2b6cb0', wash: '#edf4fb', line: '#b6d1ed' },
      { accent: '#2c7a7b', wash: '#eef7f7', line: '#b2dcdb' },
      { accent: '#975a16', wash: '#faf4eb', line: '#ebd1af' },
      { accent: '#553c9a', wash: '#f5f1fa', line: '#d0c3eb' },
      { accent: '#2f855a', wash: '#eff7f2', line: '#b3dec5' },
      { accent: '#4c51bf', wash: '#f1f2fb', line: '#c6c9f2' },
      { accent: '#744210', wash: '#faf3eb', line: '#e6caa6' },
      { accent: '#234e52', wash: '#edf5f6', line: '#add1d4' }
    ],
    extraCss: `
      .cover h1 { background: linear-gradient(100deg, #f0f4f8 0%, #fbf8f2 60%, #fff 100%); border-left-color: #2b6cb0; }
      blockquote.theory { border-left-color: var(--accent); background: var(--wash); }
      blockquote.practice { background: #faf6ee; border-left-color: #975a16; }
      blockquote.answer { background: #eff7f2; border-left-color: #2f855a; }
    `
  },
  {
    folder: '配色方案2_东方四时矿物多色',
    palette: [
      ['霁蓝', '#225a70', '#eef5f8', '#bcd5e0'],
      ['竹青', '#2a6a58', '#eff6f3', '#bfdad0'],
      ['黛碧', '#1e6775', '#eff7f8', '#b9dbe2'],
      ['暮靛', '#355c7d', '#f0f4f8', '#c2d2e4'],
      ['紫蒲', '#5c527f', '#f4f2f8', '#d1cbe2'],
      ['秋葵褐', '#855828', '#faf5ed', '#dfcfa9'],
      ['苍翠', '#256660', '#eff7f6', '#bbd9d5'],
      ['烟墨蓝', '#3a506b', '#f1f4f7', '#c5d0dc'],
    ],
    mixedColors: [
      { accent: '#225a70', wash: '#eef5f8', line: '#bcd5e0' },
      { accent: '#2a6a58', wash: '#eff6f3', line: '#bfdad0' },
      { accent: '#855828', wash: '#faf5ed', line: '#dfcfa9' },
      { accent: '#5c527f', wash: '#f4f2f8', line: '#d1cbe2' },
      { accent: '#1e6775', wash: '#eff7f8', line: '#b9dbe2' },
      { accent: '#355c7d', wash: '#f0f4f8', line: '#c2d2e4' },
      { accent: '#256660', wash: '#eff7f6', line: '#bbd9d5' },
      { accent: '#3a506b', wash: '#f1f4f7', line: '#c5d0dc' }
    ],
    extraCss: `
      .cover h1 { background: linear-gradient(100deg, #edf6f7 0%, #faf6ee 60%, #fff 100%); border-left-color: #225a70; }
      blockquote.theory { border-left-color: var(--accent); background: var(--wash); }
      blockquote.practice { background: #faf5ed; border-left-color: #855828; }
      blockquote.answer { background: #eff6f3; border-left-color: #2a6a58; }
    `
  },
  {
    folder: '配色方案3_科技极简双色对位',
    palette: [
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
      ['深海墨蓝', '#1d3557', '#f1f5f9', '#cbd5e1'],
    ],
    mixedColors: [
      { accent: '#1d3557', wash: '#f1f5f9', line: '#cbd5e1' },
      { accent: '#9c5b28', wash: '#fdf8f0', line: '#e7d3c0' },
      { accent: '#265a6e', wash: '#f0f6f9', line: '#b9d5e3' },
      { accent: '#3e6b48', wash: '#f0f7f3', line: '#bad5c3' }
    ],
    extraCss: `
      .cover h1 { background: linear-gradient(100deg, #edf2f7 0%, #fff 100%); border-left-color: #1d3557; }
      blockquote.theory { border-left-color: #1d3557; background: #f1f5f9; }
      blockquote.practice { background: #fdf8f0; border-left-color: #9c5b28; }
      blockquote.answer { background: #f0f7f3; border-left-color: #3e6b48; }
    `
  }
];

const baseCss = `
  :root{--accent:#205775;--wash:#edf5fa;--line:#b8d5e5}
  body{color:#25313d;background:#edf2f4}
  h1,h2,h3,h4,h5,h6{color:var(--accent)}.step-card{background:var(--wash);border-left-color:var(--accent)}.step-title{color:var(--accent)}.subtopic-lead{color:var(--accent);font-size:11pt;font-weight:700;margin:1.15em 0 .45em;line-height:1.5;break-after:avoid}.subtopic-lead strong{color:var(--accent)}.subtopic-bar{color:var(--accent);font-size:10.5pt}
  h2{border-bottom-color:var(--line)}
  .chapter{border-top-color:var(--accent)}
  strong{color:var(--accent)}
  a{color:var(--accent)}
  .cover .kicker{color:var(--accent)}.cover h1{color:var(--accent);border-left-color:var(--accent);background:linear-gradient(90deg,var(--wash) 0%,#ffffff 85%)}
  .cover .sub{color:#576d7e}.cover .meta{color:#6e7782}
  .toc h2{color:var(--accent);border-bottom-color:var(--line)}
  .toc a{color:var(--accent)}
  blockquote{margin:1.1em 0;padding:12px 18px;border:1px solid #cbdde9;border-left:5px solid var(--accent);background:var(--wash);border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.02)}
  blockquote p{margin:.45em 0;line-height:1.68}
  blockquote p:first-of-type{margin-top:0}
  blockquote p:last-of-type{margin-bottom:0}
  .callout-label{font:700 10.5pt "Microsoft YaHei";color:var(--accent);margin-bottom:8px;padding-bottom:5px;border-bottom:1px dashed var(--line);letter-spacing:0.02em}
  blockquote.theory{border-left-color:var(--accent);background:var(--wash)}
  blockquote.example{border-left-color:#236965;border-color:#c4e2df;background:#f1f8f7}
  blockquote.example .callout-label{color:#1b5450;border-bottom-color:#c4dedb}
  blockquote.practice{background:#faf5eb;border-left-color:#96621f;border-color:#ebdcb8}
  blockquote.practice .callout-label{color:#794e18;border-bottom-color:#e4d3ab}
  blockquote.warning{border-left-color:#b84e20;border-color:#f2d2c2;background:#fff5ef}
  blockquote.warning .callout-label{color:#9c3e16;border-bottom-color:#edd0c0}
  blockquote.answer{background:#f1f8f3;border-left-color:#386f4a;border-color:#c6e4d0}
  blockquote.answer .callout-label{color:#29593a;border-bottom-color:#c3dfcd}
  blockquote strong{color:var(--accent)}
  code{background:#eff2f6;color:#30465a}
  pre{background:var(--wash);border-color:var(--line)}
  pre code{color:#25313d;background:none}
  th,td{border-color:var(--line)}
  th{background:var(--accent);color:white}th strong,th code{color:white;background:none}
  tbody tr:nth-child(even) td{background:var(--wash)}
  .classification-heading{background:var(--accent);color:white}
  .classification-card{border-color:var(--line);background:#fff}
  .classification-title{color:var(--accent)}
  .writing-line{border-bottom-color:#acb8c2}
  @media print{body{background:white}a{color:var(--accent)}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });

  for (const s of schemes) {
    const destDir = path.join(root, '定稿打印版', s.folder);
    fs.mkdirSync(destDir, { recursive: true });

    for (const kind of ['理论', '练习']) {
      const name = `英语认知句法${kind}全书（排版版）`;
      const srcHtml = path.join(root, '排版成品', name + '.html');
      const destHtml = path.join(destDir, name + '.html');
      const destPdf = path.join(destDir, name + '.pdf');

      fs.copyFileSync(srcHtml, destHtml);

      const page = await browser.newPage();
      await page.goto('file:///' + destHtml.replace(/\\/g, '/'));
      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => document.fonts.ready);

      const before = await page.evaluate(() => ({
        text: document.querySelector('main').innerText.replace(/\s+/g, ''),
        items: document.querySelectorAll('.exercise-item').length,
        spaces: document.querySelectorAll('.answer-space').length,
        lines: document.querySelectorAll('.writing-line').length
      }));

      await page.evaluate(({ palette, mixedColors }) => {
        let chapter = 0;
        for (const el of document.querySelector('main').children) {
          if (el.matches('.chapter')) chapter = Number(el.id.replace('sec-', ''));
          if (chapter) {
            const [label, accent, wash, line] = palette[(chapter - 1) % palette.length];
            el.style.setProperty('--accent', accent);
            el.style.setProperty('--wash', wash);
            el.style.setProperty('--line', line);
            el.dataset.colorChapter = chapter;
          }
        }
        for (const a of document.querySelectorAll('.toc > a')) {
          const n = Number(a.hash.replace('#sec-', ''));
          if (n) a.style.setProperty('--accent', palette[(n - 1) % palette.length][1]);
        }

        // Apply diversified multi-color hierarchy within sections:
        let h2Idx = 0;
        for (const h2 of document.querySelectorAll('main h2')) {
          if (h2.closest('.toc')) continue;
          const c = mixedColors[h2Idx % mixedColors.length];
          h2.style.setProperty('--accent', c.accent);
          h2.style.setProperty('--line', c.line);
          h2Idx++;
        }

        let h3Idx = 0;
        for (const h3 of document.querySelectorAll('main h3')) {
          const c = mixedColors[(h3Idx + 2) % mixedColors.length];
          h3.style.setProperty('--accent', c.accent);
          h3Idx++;
        }

        let bqIdx = 0;
        for (const bq of document.querySelectorAll('blockquote.theory')) {
          const c = mixedColors[(bqIdx + 1) % mixedColors.length];
          bq.style.setProperty('--accent', c.accent);
          bq.style.setProperty('--wash', c.wash);
          bqIdx++;
        }

        let tblIdx = 0;
        for (const tbl of document.querySelectorAll('table')) {
          const c = mixedColors[(tblIdx + 3) % mixedColors.length];
          tbl.style.setProperty('--accent', c.accent);
          tbl.style.setProperty('--wash', c.wash);
          tbl.style.setProperty('--line', c.line);
          tblIdx++;
        }

        let stepIdx = 0;
        for (const step of document.querySelectorAll('.step-card')) {
          const c = mixedColors[(stepIdx + 2) % mixedColors.length];
          step.style.setProperty('--accent', c.accent);
          step.style.setProperty('--wash', c.wash);
          stepIdx++;
        }

        let subIdx = 0;
        for (const sub of document.querySelectorAll('.subtopic-lead')) {
          const c = mixedColors[(subIdx + 4) % mixedColors.length];
          sub.style.setProperty('--accent', c.accent);
          subIdx++;
        }
      }, { palette: s.palette, mixedColors: s.mixedColors });

      await page.addStyleTag({ content: baseCss + '\n' + s.extraCss });

      const after = await page.evaluate(() => ({
        text: document.querySelector('main').innerText.replace(/\s+/g, ''),
        items: document.querySelectorAll('.exercise-item').length,
        spaces: document.querySelectorAll('.answer-space').length,
        lines: document.querySelectorAll('.writing-line').length,
        overflow: [...document.querySelectorAll('table,pre,blockquote')].filter(e => e.scrollWidth > e.clientWidth + 3).length
      }));

      if (before.text !== after.text || before.items !== after.items || before.spaces !== after.spaces || before.lines !== after.lines || after.overflow) {
        throw Error(`Mismatch in ${s.folder} ${kind}`);
      }

      fs.writeFileSync(destHtml, await page.content());
      await page.pdf({
        path: destPdf,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `<div style="width:100%;padding:0 17mm;font-size:8px;color:#667788;display:flex;justify-content:space-between"><span>英语认知句法${kind}全书</span><span class="pageNumber"></span></div>`,
        preferCSSPageSize: true,
        timeout: 120000,
        outline: true
      });

      await page.close();
      console.log(`Generated: ${s.folder} - ${kind}`);
    }
  }

  await browser.close();
  console.log('All 3 schemes generated successfully.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
