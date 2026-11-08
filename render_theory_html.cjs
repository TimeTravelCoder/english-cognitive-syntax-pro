const fs = require('fs'), path = require('path');

const root = 'C:/Users/Ming/Desktop/英语理论深化演进/英语理论深化演进';

const deps = 'C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';

const { marked } = require(deps + '/marked');

const { chromium } = require(deps + '/playwright');



const css = `

@page{size:A4;margin:19mm 17mm 20mm}@page:left{margin:19mm 20mm 20mm 15mm}@page:right{margin:19mm 15mm 20mm 20mm}*{box-sizing:border-box}body{margin:0;color:#202b36;font:11pt/1.75 "Times New Roman","Microsoft YaHei",serif;background:#eef1f5;hyphens:auto;-webkit-hyphens:auto}main{max-width:900px;margin:30px auto;background:white;padding:60px;box-shadow:0 6px 30px #21344b15}h1,h2,h3,h4,h5,h6{font-family:"Microsoft YaHei",sans-serif;line-height:1.45;break-after:avoid;overflow-wrap:anywhere}h1{font-size:25pt;color:#153955}h2{font-size:17pt;margin:1.8em 0 .7em;color:#153955;border-bottom:1px solid #c6d5df;padding-bottom:.35em}h3{font-size:13.5pt;color:#205771;margin:1.6em 0 .6em}h4,h5,h6{font-size:11.5pt;margin:1.3em 0 .5em}.step-card{margin:0.85em 0;padding:12px 16px;background:#f4f8fb;border-left:4px solid #205775;border-radius:4px;break-inside:avoid;box-shadow:0 1px 3px rgba(0,0,0,0.02)}.step-title{font:700 11pt/1.5 "Microsoft YaHei";color:#153955;margin-bottom:6px}.step-body{font-size:11pt;line-height:1.75}.subtopic-lead{font-size:11pt;font-weight:700;color:#153955;margin:1.15em 0 .45em;line-height:1.5;break-after:avoid;page-break-after:avoid;display:flex;align-items:center;gap:6px}.subtopic-bar{color:#205775;font-size:10.5pt;line-height:1}p{margin:.6em 0;orphans:3;widows:3}li{margin:.3em 0;orphans:3;widows:3}ul,ol{padding-left:1.8em}strong{color:#153955}a{color:#225c78;text-decoration:none}blockquote{margin:1.1em 0;padding:12px 18px;border:1px solid #cbdde9;border-left:5px solid #205775;background:#f4f8fb;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.02);orphans:3;widows:3}blockquote p{margin:.45em 0;line-height:1.68}blockquote p:first-of-type{margin-top:0}blockquote p:last-of-type{margin-bottom:0}blockquote.theory{border-left-color:#205775;border-color:#c8dce8;background:#f4f8fb}blockquote.example{border-left-color:#236965;border-color:#c4e2df;background:#f1f8f7}blockquote.practice{border-left-color:#96621f;border-color:#ebdcb8;background:#faf5eb}blockquote.warning{border-left-color:#b84e20;border-color:#f2d2c2;background:#fff5ef}blockquote.answer{border-left-color:#386f4a;border-color:#c6e4d0;background:#f1f8f3;break-inside:avoid}
blockquote.practice{break-inside:avoid !important;page-break-inside:avoid !important}.callout-label{break-after:avoid !important;page-break-after:avoid !important;font:700 10.5pt "Microsoft YaHei";color:#1b4a63;margin-bottom:8px;padding-bottom:5px;border-bottom:1px dashed #cfdfe9;letter-spacing:0.02em}blockquote.theory .callout-label{color:#1b4a63;border-bottom-color:#cfdfe9}blockquote.example .callout-label{color:#1b5450;border-bottom-color:#c4dedb}blockquote.practice .callout-label{color:#794e18;border-bottom-color:#e4d3ab}blockquote.warning .callout-label{color:#9c3e16;border-bottom-color:#edd0c0}blockquote.answer .callout-label{color:#29593a;border-bottom-color:#c3dfcd}code{font-family:Consolas,"Microsoft YaHei",monospace;font-size:.92em;white-space:normal;overflow-wrap:anywhere;background:#f1f3f5;padding:.1em .25em}pre{white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #d9e2e8;background:#f6f8fa;padding:12px;line-height:1.55}pre code{padding:0;background:none}table{border-collapse:collapse;width:100%;font-size:9.5pt;margin:1em 0}th,td{border:1px solid #cbd5dd;padding:7px 9px;vertical-align:top;overflow-wrap:anywhere}th{background:#eaf0f5;color:#163c55}thead{display:table-header-group}tr{break-inside:avoid}hr{border:0;border-top:1px solid #d9e2e8;margin:1.5em 0}img{max-width:100%}.cover{min-height:680px;display:flex;flex-direction:column;justify-content:center;break-after:page}.cover .kicker{font:11pt "Microsoft YaHei";color:#54758c;letter-spacing:.25em}.cover h1{font-size:32pt;line-height:1.5;margin:25px 0;border-left:6px solid #234f6b;padding-left:24px}.sub{color:#657786;font-size:12pt}.meta{margin-top:65px;color:#657786;font-size:10pt}.toc{break-after:page}.toc a{display:flex;gap:10px;align-items:baseline;margin:14px 0;font-size:10.5pt;line-height:1.6}.toc-name{flex:0 1 auto}.toc-dots{flex:1;min-width:20px;border-bottom:1px dotted #9eb0bd}.toc-pg{flex:none;min-width:20px;text-align:right}.chapter{break-before:page;font-size:22pt;border-top:4px solid #234f6b;padding-top:20px;margin-top:0}.chapter+hr{display:none}.note{color:#6b7a86;font-size:9pt}@media print{body{background:white}main{max-width:none;padding:0;margin:0;box-shadow:none}.cover{min-height:235mm}a{color:inherit}blockquote,th{print-color-adjust:exact}}

`;



(async () => {

  console.log('Starting Theory HTML rendering...');

  const title = '英语认知句法理论全书';

  const src = fs.readFileSync(path.join(root, `【合集】${title}.md`), 'utf8');

  const names = [...src.matchAll(/<h1 id="sec-(\d+)">([^<]+)<\/h1>/g)];

  console.log(`Found ${names.length} chapters.`);



  let body = src.slice(src.indexOf('<h1 id="sec-1">')).replace(/<h1 id="sec-(\d+)">/g, '<h1 class="chapter" id="sec-$1">');

  body = body.replace(/(\|[^|\r\n]+(?:\|[^|\r\n]+)*\|)[ \t]*(?:\r?\n[ \t]*)+(?=\|)/g, '$1\n');

  body = body.replace(/\n>[ \t]*\r?\n(?=>[ \t]*\[!)/g, '\n\n<!-- callout-sep -->\n\n');

  body = body.replace(/(\n>[^\n\r]*\r?\n)(?:[ \t]*\r?\n)+(?=>[ \t]*\[!)/g, '$1\n<!-- callout-sep -->\n\n');

  while (/(\n>[^\n\r]*)\r?\n(?:[ \t]*\r?\n)+(?=>)/.test(body)) {

    body = body.replace(/(\n>[^\n\r]*)\r?\n(?:[ \t]*\r?\n)+(?=>)/g, '$1\n');

  }



  const maths = [];

  body = body.replace(/\$\$[\s\S]*?\$\$|(?<!\$)\$[^\n$]+\$(?!\$)/g, m => {

    maths.push(m);

    return 'MATHPLACEHOLDER' + (maths.length - 1) + 'END';

  });



  let rendered = marked.parse(body, { gfm: true });

  rendered = rendered.replace(/MATHPLACEHOLDER(\d+)END/g, (_, i) => maths[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

  rendered = rendered.replace(/<blockquote>\s*<p>\[!([^\]]+)\](?:<br>|\n)?/g, (_, t) => {

    const type = /example/.test(t) ? 'example' : /practice/.test(t) ? 'practice' : /warning|danger/.test(t) ? 'warning' : /answer/.test(t) ? 'answer' : 'theory';

    const icon = type === 'example' ? '🔍 经典例句与场景' : type === 'practice' ? '📝 专项练习与记录' : type === 'warning' ? '⚠️ 易错陷阱与预警' : type === 'answer' ? '💡 参考答案与解析' : '📌 核心要点与体系提示';

    return `<blockquote class="${type}"><div class="callout-label">${icon}</div><p>`;

  });



  const pageMapFile = path.join(root, '排版成品/page-map.json');

  const pages = fs.existsSync(pageMapFile) ? JSON.parse(fs.readFileSync(pageMapFile, 'utf8'))['理论'] : {};

  if (!pages['9']) pages['9'] = '208'; // initial projection for chapter 9



  const toc = names.map(m => `<a href="#sec-${m[1]}"><span class="toc-name">${m[2]}</span><span class="toc-dots"></span><span class="toc-pg">${pages?.[m[1]] || ''}</span></a>`).join('');

  const fullHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body><main><section class="cover"><div class="kicker">ENGLISH · COGNITIVE SYNTAX</div><h1>${title}</h1><div class="sub">思维模型 · 句法结构 · 阅读与表达</div><div class="meta">共 ${names.length} 篇<br>统一编号 · 系统编排 · A4 阅读打印版</div></section><nav class="toc"><h2>目录</h2>${toc}<p class="note">点击篇名可跳转；页码对应配套 PDF。</p></nav>${rendered}</main></body></html>`;



  const outFile = path.resolve(root, '排版成品', `${title}（排版版）.html`);

  fs.writeFileSync(outFile, fullHtml);

  console.log('HTML written, launching browser for DOM transforms & diagrams...');



  const browser = await chromium.launch({

    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',

    headless: true

  });

  const page = await browser.newPage();

  await page.goto('file:///' + outFile.replace(/\\/g, '/'));

  await page.evaluate(() => document.fonts.ready);



  await page.evaluate(() => {

    window.MathJax = {

      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$']], packages: { '[+]': ['noerrors'] } },

      svg: { fontCache: 'none' },

      startup: { typeset: false }

    };

  });

  await page.addScriptTag({ path: path.resolve(root, 'tmp/pdfs/mathjax.js') });

  await page.evaluate(async () => {

    await MathJax.startup.promise;

    await MathJax.typesetPromise();

  });

  console.log('MathJax rendered.');



  await page.addScriptTag({ path: path.resolve(root, 'tmp/pdfs/mermaid.js') });

  const diagrams = await page.evaluate(async () => {

    mermaid.initialize({

      startOnLoad: false,

      securityLevel: 'loose',

      theme: 'neutral',

      flowchart: { useMaxWidth: true, htmlLabels: true, nodeSpacing: 35, rankSpacing: 45, padding: 18 },

      themeVariables: { fontFamily: 'Microsoft YaHei', fontSize: '16px' }

    });

    let ok = 0, cards = 0, vertical = 0, errors = [];

    function wrap(code) {

      return code.replace(/(flowchart|graph)\s+LR/, '$1 TD').replace(/"([^"\n]+)"/g, (all, label) =>

        '"' + label.split(/<br\s*\/?\s*>/i).map(part => {

          if (part.length <= 48) return part;

          const words = part.split(/\s+/);

          if (words.length < 2) return part;

          const lines = [];

          let line = '';

          for (const word of words) {

            if (line && line.length + word.length + 1 > 46) { lines.push(line); line = word; }

            else line += (line ? ' ' : '') + word;

          }

          if (line) lines.push(line);

          return lines.join('<br/>');

        }).join('<br/>') + '"'

      );

    }

    for (const [i, e] of [...document.querySelectorAll('code.language-mermaid')].entries()) {

      try {

        let code = e.textContent;

        const clean = code.replace(/(\w+)\s*[\[(]+\s*"[^"]+"[\])]+/g, '$1');

        const edges = [...clean.matchAll(/(\w+)\s*-->(?:\|[^|]*\|)?\s*(\w+)/g)];

        const roots = new Set(edges.map(x => x[1]));

        const div = document.createElement('div');

        div.className = 'diagram';

        if (edges.length >= 3 && roots.size === 1 && !/\.->|---|<--/.test(code)) {

          const nodes = new Map([...code.matchAll(/(\w+)\s*[\[(]+\s*"([^"]+)"/g)].map(m => [m[1], m[2]]));

          const root = [...roots][0];

          if (!nodes.has(root) || edges.some(x => !nodes.has(x[2]))) throw Error('Node parse ' + i);

          const group = document.createElement('section');

          group.className = 'classification';

          const h = document.createElement('div');

          h.className = 'classification-heading';

          h.textContent = nodes.get(root).replace(/<br\s*\/?\s*>/gi, ' · ');

          group.append(h);

          const grid = document.createElement('div');

          grid.className = 'classification-grid';

          for (const edge of edges) {

            const label = nodes.get(edge[2]);

            let parts = label.split(/<br\s*\/?\s*>/i);

            if (parts.length === 1 && label.includes('：')) parts = [label.slice(0, label.indexOf('：')), label.slice(label.indexOf('：') + 1)];

            const card = document.createElement('div');

            card.className = 'classification-card';

            const title = document.createElement('div');

            title.className = 'classification-title';

            title.textContent = parts.shift();

            card.append(title);

            if (parts.length) {

              const text = document.createElement('div');

              text.className = 'classification-detail';

              text.textContent = parts.join(' · ');

              card.append(text);

            }

            grid.append(card);

          }

          group.append(grid);

          div.append(group);

          cards++;

        } else {

          let result = await mermaid.render('diagram' + i, code);

          div.innerHTML = result.svg;

          document.body.append(div);

          const box = div.querySelector('svg').viewBox.baseVal;

          if (/(?:flowchart|graph)\s+LR/.test(code) && (box.width > 780 || box.width / box.height > 3.5)) {

            code = wrap(code);

            result = await mermaid.render('readable' + i, code);

            div.innerHTML = result.svg;

            vertical++;

          }

          div.remove();

        }

        const idMap = new Map();

        for (const node of div.querySelectorAll('[id]')) {

          const old = node.id;

          const id = 'book-diagram-' + i + '-' + old;

          idMap.set(old, id);

          node.id = id;

        }

        for (const node of div.querySelectorAll('*')) for (const attr of [...node.attributes]) {

          let value = attr.value;

          if (attr.name === 'id') continue;

          value = value.replace(/url\(\s*(["']?)#([^\s)'" ]+)\1\s*\)/g, (all, q, id) => idMap.has(id) ? 'url(' + q + '#' + idMap.get(id) + q + ')' : all);

          if (['href', 'xlink:href'].includes(attr.name) && value.startsWith('#') && idMap.has(value.slice(1))) value = '#' + idMap.get(value.slice(1));

          if (['aria-labelledby', 'aria-describedby'].includes(attr.name)) value = value.split(/\s+/).map(id => idMap.get(id) || id).join(' ');

          if (value !== attr.value) node.setAttribute(attr.name, value);

        }

        for (const style of div.querySelectorAll('style')) style.textContent = style.textContent.replace(/#([A-Za-z_][\w-]*)/g, (all, id) => idMap.has(id) ? '#' + idMap.get(id) : all);

        e.parentElement.replaceWith(div);

        ok++;

      } catch (err) {

        errors.push(String(err));

      }

    }

    for (const h of document.querySelectorAll('main h2,main h3,main h4,main h5,main h6,.subtopic-lead')) {

      const m = /^(\d+(?:\.\d+)+)\s/.exec(h.textContent);

      if (m) h.id = 's-' + m[1].replace(/\./g, '-');

    }

    for (const a of document.querySelectorAll('.toc > a')) {

      const start = document.getElementById(a.getAttribute('href').slice(1));

      if (!start) continue;

      const nodes = [];

      let node = start.nextElementSibling;

      while (node && !node.matches('.chapter')) {

        if (node.tagName === 'H2') nodes.push(node);

        node = node.nextElementSibling;

      }

      if (nodes.length) {

        const details = document.createElement('details');

        details.className = 'chapter-index';

        details.open = true;

        const summary = document.createElement('summary');

        summary.textContent = '展开/收起本篇章节';

        details.append(summary);

        for (const h of nodes) {

          const link = document.createElement('a');

          link.href = '#' + h.id;

          const nameSpan = document.createElement('span');

          nameSpan.className = 'toc-name';

          nameSpan.textContent = h.textContent;

          const dotsSpan = document.createElement('span');

          dotsSpan.className = 'toc-dots';

          const pgSpan = document.createElement('span');

          pgSpan.className = 'toc-pg';

          link.append(nameSpan, dotsSpan, pgSpan);

          details.append(link);

        }

        a.after(details);

      }

    }

    return { ok, cards, vertical, errors };

  });



  console.log('Mermaid and headings rendered:', JSON.stringify(diagrams));



  // Add styles

  await page.addStyleTag({ content: 'mjx-container svg{max-width:100%;height:auto} .diagram{margin:1em 0;break-inside:avoid;text-align:center}.diagram svg{max-width:100%;max-height:185mm;height:auto}mjx-container[display="true"]{overflow-wrap:normal;max-width:100%;font-size:90%;break-inside:avoid}' });

  await page.addStyleTag({ content: '.classification{text-align:left;margin:1em 0}.classification-heading{font:700 12pt/1.6 "Microsoft YaHei";color:#153955;padding:12px 16px;background:#eaf0f5;border-left:4px solid #53788b;break-after:avoid}.classification-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.classification-card{border:1px solid #cbd5dd;background:#fafcfd;padding:14px 16px;break-inside:avoid;min-width:0}.classification-title{font:700 11pt/1.6 "Microsoft YaHei";color:#205771;margin-bottom:7px}.classification-detail{font:11.5pt/1.8 "Times New Roman","Microsoft YaHei",serif;overflow-wrap:anywhere}.diagram:has(.classification){break-inside:auto}blockquote{break-inside:avoid}h2,h3,h4{scroll-margin-top:20px}.toc>a{font-weight:700;margin:12px 0 4px}.chapter-index{padding:0 0 6px 16px;color:#3d5666;font-size:9.5pt}.chapter-index a{display:flex;gap:8px;align-items:baseline;margin:3.5px 0;padding-left:6px;font-size:9.5pt;line-height:1.45;color:#3d5666}.chapter-index summary{cursor:pointer;color:#54758c;font-size:9pt;margin-bottom:4px}.sublead{break-after:avoid}@media screen and (max-width:650px){main{padding:25px 20px;margin:0}.classification-grid{grid-template-columns:1fr}}@media print{.classification-card,.classification-heading{print-color-adjust:exact}.classification-grid{display:block !important;gap:0}.classification-card{break-inside:avoid;margin-bottom:12px;width:100%}.classification-detail{font-size:10.5pt}.chapter-index{display:block !important}.chapter-index summary,.volume-navigation,.toc .note{display:none !important}}' });

  await page.addStyleTag({ content: '.structure-map{text-align:left}.structure-map table{font-size:10pt;line-height:1.65;table-layout:fixed}.structure-map th:first-child{width:22%}.structure-map th:nth-child(2){width:43%}.structure-map p{font-size:10pt}.volume-navigation{font-size:10pt}blockquote{break-inside:auto;orphans:3;widows:3}.diagram-caption{break-after:avoid}.diagram-caption+div{margin-top:.5em}.subtopic-lead{break-after:avoid;page-break-after:avoid}.subtopic-lead+p{break-after:avoid;page-break-after:avoid}p:has(+table),p:has(+.diagram){break-after:avoid;page-break-after:avoid}table{break-inside:auto;margin:0.85em 0}tr{break-inside:avoid;page-break-inside:avoid}th,td{padding:6px 8px;font-size:9pt;line-height:1.55}' });



  // Volume navigation and bidirectional cross-book links (Theory <-> Practice)

  const pracHtmlPath = path.resolve(root, '排版成品', '英语认知句法练习全书（排版版）.html');

  const pracHtmlRaw = fs.existsSync(pracHtmlPath) ? fs.readFileSync(pracHtmlPath, 'utf8') : '';

  const validPracticeIds = [...new Set([...pracHtmlRaw.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))];



  const crossLinksCount = await page.evaluate((pracIdsArr) => {

    const pracIds = new Set(pracIdsArr);

    const files = { 理论: '英语认知句法理论全书（排版版）.html', 练习: '英语认知句法练习全书（排版版）.html' };

    let linkedCount = 0;



    // 1. Add top volume navigation link in .toc

    const toc = document.querySelector('.toc');

    if (toc && !toc.querySelector('.volume-navigation')) {

      const bar = document.createElement('p');

      bar.className = 'volume-navigation';

      const link = document.createElement('a');

      link.href = files['练习'] + '#sec-1';

      link.textContent = '打开配套练习全书';

      bar.append(link);

      toc.append(bar);

      linkedCount++;

    }



    // 2. Link 1.2 index table rows (Col 1 -> #sec-X, Col 3 -> Practice #sec-X)

    for (const table of document.querySelectorAll('table')) {

      if (!/配套练习全书/.test(table.querySelector('thead')?.textContent || '')) continue;

      for (const row of table.querySelectorAll('tbody tr')) {

        const c0 = row.cells[0];

        const c2 = row.cells[2];

        const m0 = /第\s*([1-9])\s*篇/.exec(c0?.textContent || '');

        if (m0 && !c0.querySelector('a')) {

          c0.innerHTML = `<a href="#sec-${m0[1]}">${c0.textContent}</a>`;

          linkedCount++;

        }

        if (c2 && !c2.querySelector('a')) {

          c2.innerHTML = c2.innerHTML.replace(/练习第\s*([1-9])\s*篇/, (full, ch) => {

            linkedCount++;

            return `<a href="${files['练习']}#sec-${ch}">${full}</a>`;

          });

        }

      }

    }



    // 3. Walk text nodes in <main> to link Practice & Theory chapters, sections, and questions

    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);

    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);



    for (const node of nodes) {

      const parent = node.parentElement;

      if (!parent || parent.closest('a,code,pre,svg,mjx-container,script,style,h1,h2,h3,h4,h5,h6,.toc,.cover,.subtopic-lead,.diagram')) continue;

      const inPracticeBox = !!parent.closest('blockquote.practice');

      const blockText = parent.closest('blockquote,p,li')?.textContent || '';

      const chMatch = /练习(?:全书)?\s*第\s*([1-9])\s*篇/.exec(blockText) || /^(\d+)\./.exec((blockText.match(/(\d+\.\d+)/) || [])[1] || '');

      const defaultPracCh = chMatch ? chMatch[1] : null;



      const text = node.textContent;

      const matches = [];

      const addMatch = (index, len, href) => {

        if (!href) return;

        const end = index + len;

        if (matches.some(x => (index >= x.index && index < x.end) || (end > x.index && end <= x.end))) return;

        matches.push({ index, end, text: text.slice(index, end), href });

      };



      // 3a. Explicit book chapter references: 练习全书第X篇 / 练习第X篇 / 理论第X篇 / 本书第X篇

      for (const m of text.matchAll(/(练习(?:全书)?|理论(?:全书)?|本书)\s*第\s*([1-9])\s*篇/g)) {

        const isPrac = m[1].startsWith('练习');

        const targetId = 'sec-' + m[2];

        if (isPrac && pracIds.has(targetId)) {

          addMatch(m.index, m[0].length, files['练习'] + '#' + targetId);

        } else if (!isPrac && document.getElementById(targetId)) {

          addMatch(m.index, m[0].length, '#' + targetId);

        }

      }



      // 3b. Section references: X.Y(.Z)节 / 小节

      for (const m of text.matchAll(/(\d+(?:\.\d+)+)(?:\s*[—–-]\s*\d+(?:\.\d+)+)?\s*小?节/g)) {

        const secId = 's-' + m[1].replace(/\./g, '-');

        const before = text.slice(Math.max(0, m.index - 12), m.index);

        const explicitlyTheory = /理论(?:全书)?|本书|见\s*$/.test(before) && !/练习/.test(before);

        const explicitlyPrac = /练习/.test(before) || (inPracticeBox && !explicitlyTheory);

        if (explicitlyPrac && pracIds.has(secId)) {

          addMatch(m.index, m[0].length, files['练习'] + '#' + secId);

        } else if (!explicitlyPrac && document.getElementById(secId)) {

          addMatch(m.index, m[0].length, '#' + secId);

        } else if (inPracticeBox && document.getElementById(secId)) {

          addMatch(m.index, m[0].length, '#' + secId);

        }

      }



      // 3c. Inside blockquote.practice: link question ranges (第N—M题 / 写作组N / 阅读组N)

      if (inPracticeBox) {

        for (const m of text.matchAll(/写作组\s*(\d+)(?:\s*[—–-]\s*\d+)?/g)) {

          const qid = 'P4-Core-' + m[1];

          if (pracIds.has(qid)) addMatch(m.index, m[0].length, files['练习'] + '#' + qid);

        }

        for (const m of text.matchAll(/阅读组\s*(\d+)(?:\s*[—–-]\s*\d+)?/g)) {

          const qid = 'P5-Core-' + m[1];

          if (pracIds.has(qid)) addMatch(m.index, m[0].length, files['练习'] + '#' + qid);

        }

        if (defaultPracCh) {

          for (const m of text.matchAll(/第\s*(\d+)(?:\s*[—–-]\s*\d+)?\s*题/g)) {

            const qid = `P${defaultPracCh}-Q${m[1]}`;

            if (pracIds.has(qid)) addMatch(m.index, m[0].length, files['练习'] + '#' + qid);

          }

        }

      }



      if (!matches.length) continue;

      matches.sort((a, b) => a.index - b.index);

      const frag = document.createDocumentFragment();

      let cursor = 0;

      for (const m of matches) {

        frag.append(text.slice(cursor, m.index));

        const a = document.createElement('a');

        a.href = m.href;

        a.textContent = m.text;

        frag.append(a);

        cursor = m.end;

        linkedCount++;

      }

      frag.append(text.slice(cursor));

      node.replaceWith(frag);

    }

    return linkedCount;

  }, validPracticeIds);

  console.log('Cross-book & internal links generated in Theory HTML:', crossLinksCount);



  // Remove scripts and write full HTML

  await page.evaluate(() => document.querySelectorAll('script').forEach(e => e.remove()));

  const finalContent = await page.content();

  fs.writeFileSync(outFile, finalContent);

  console.log('Successfully updated:', outFile);



  await page.emulateMedia({ media: 'print' });

  const outPdf = path.resolve(root, '排版成品', `${title}（排版版）.pdf`);

  await page.pdf({

    path: outPdf,

    format: 'A4',

    printBackground: true,

    displayHeaderFooter: true,

    headerTemplate: '<div></div>',

    footerTemplate: `<div style="width:100%;padding:0 17mm;font-size:8px;color:#667788;display:flex;justify-content:space-between"><span>${title}</span><span class="pageNumber"></span></div>`,

    preferCSSPageSize: true,

    timeout: 120000,

    outline: true

  });

  console.log('Successfully generated PDF:', outPdf);



  // Also copy to 定稿打印版/多元配色修订版/

  const colorizeOut = path.resolve(root, '定稿打印版/多元配色修订版', `${title}（排版版）.html`);

  fs.writeFileSync(colorizeOut, finalContent);

  console.log('Successfully updated:', colorizeOut);



  // Generate Standalone Chapter 9 HTML

  console.log('Generating standalone Chapter 9 HTML...');

  const ch9Start = finalContent.indexOf('<h1 class="chapter" id="sec-9">');

  const ch9End = finalContent.lastIndexOf('</main>');

  const ch9Body = finalContent.slice(ch9Start, ch9End);

  const standaloneHtml = `<!doctype html>

<html lang="zh-CN">

<head>

  <meta charset="utf-8">

  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>英语认知句法理论全书 · 第9篇 中英互译：双向认知转换与句法重构</title>

  <style>${css}</style>

  <style>

    .standalone-nav { margin-bottom: 25px; padding-bottom: 12px; border-bottom: 1px solid #d9e2e8; font-size: 10pt; }

    .standalone-nav a { margin-right: 15px; color: #205775; font-weight: bold; }

  </style>

</head>

<body>

  <main>

    <div class="standalone-nav">

      <a href="英语认知句法理论全书（排版版）.html#sec-9">← 返回全书第9篇</a>

      <a href="英语认知句法理论全书（排版版）.html">← 理论全书首页</a>

      <a href="英语认知句法练习全书_第9篇_中英互译练习.html">📝 对映训练：第9篇练习全书</a>

    </div>

    ${ch9Body}

  </main>

</body>

</html>`;

  const standaloneFile = path.resolve(root, '排版成品', `英语认知句法理论全书_第9篇_中英互译理论.html`);

  fs.writeFileSync(standaloneFile, standaloneHtml);

  console.log('Successfully generated standalone file:', standaloneFile);



  await page.close();

  await browser.close();

  console.log('All HTML synchronization complete!');

})().catch(e => {

  console.error(e);

  process.exit(1);

});

