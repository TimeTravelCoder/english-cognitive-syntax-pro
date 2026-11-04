const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=__dirname;
const palette=[
 ['海蓝','#205775','#edf5fa','#b8d5e5'],
 ['松绿','#28685b','#eef7f2','#b9d9cb'],
 ['青碧','#166777','#eef8fa','#b3dce2'],
 ['紫灰','#65518a','#f5f1fa','#d4c8e7'],
 ['靛蓝','#3d5d91','#f0f4fb','#c1cfe5'],
 ['陶红','#99503c','#fcf3ef','#e6c5b8'],
 ['深青','#246b69','#eef8f6','#badbd6'],
 ['棕金','#886222','#faf6ec','#e2d1ad'],
];

const css=`
:root{--accent:#205775;--wash:#edf5fa;--line:#b8d5e5}
body{color:#25313d;background:#edf2f4}
h1,h2,h3,h4,h5,h6{color:var(--accent)}.step-card{background:var(--wash);border-left-color:var(--accent)}.step-title{color:var(--accent)}.subtopic-lead{color:var(--accent);font-size:11pt;font-weight:700;margin:1.15em 0 .45em;line-height:1.5;break-after:avoid}.subtopic-lead strong{color:var(--accent)}.subtopic-bar{color:var(--accent);font-size:10.5pt}
h2{border-bottom-color:var(--line)}
.chapter{border-top-color:var(--accent)}
strong{color:var(--accent)}
a{color:var(--accent)}
.cover .kicker{color:#287c7d}.cover h1{color:#205775;border-left-color:#c38742;background:linear-gradient(90deg,#edf6f8 0%,#ffffff 85%)}
.cover .sub{color:#576d7e}.cover .meta{color:#6e7782}
.toc h2{color:#205775;border-bottom-color:#b8d5e5}
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
th{background:var(--accent);color:white}
tbody tr:nth-child(even) td{background:var(--wash)}
tbody tr:nth-child(odd) td{background:#fffaf3}
.classification-heading{background:var(--accent);color:white}
.classification-card{border-color:var(--line);background:#fff}
.classification-title{color:var(--accent)}
.writing-line{border-bottom-color:#acb8c2}
@media print{body{background:white}a{color:var(--accent)}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const qa={};
 for(const kind of ['理论','练习']){
  const name=`英语认知句法${kind}全书（排版版）`;
  const html=path.join(dir,name+'.html');
  const p=await browser.newPage();await p.goto('file:///'+html.replace(/\\/g,'/'));await p.emulateMedia({media:'print'});await p.evaluate(()=>document.fonts.ready);
  const before=await p.evaluate(()=>({text:document.querySelector('main').innerText.replace(/\s+/g,''),items:document.querySelectorAll('.exercise-item').length,spaces:document.querySelectorAll('.answer-space').length,lines:document.querySelectorAll('.writing-line').length}));
  
  await p.evaluate((palette)=>{
   let chapter=0;
   for(const el of document.querySelector('main').children){
    if(el.matches('.chapter'))chapter=Number(el.id.replace('sec-',''));
    if(chapter){const [label,accent,wash,line]=palette[(chapter-1) % palette.length];el.style.setProperty('--accent',accent);el.style.setProperty('--wash',wash);el.style.setProperty('--line',line);el.dataset.colorChapter=chapter;}
   }
   for(const a of document.querySelectorAll('.toc > a')){const n=Number(a.hash.replace('#sec-',''));if(n){a.style.setProperty('--accent',palette[(n-1) % palette.length][1]);}}

   // 8-tone diversified hierarchy within chapters:
   const mixedColors = [
     { accent: '#1d4e68', wash: '#f0f5f9', line: '#b4d1e3' },
     { accent: '#23594b', wash: '#eef6f2', line: '#b6d7c9' },
     { accent: '#82481e', wash: '#faf4ee', line: '#e6cbb7' },
     { accent: '#533c77', wash: '#f5f1fa', line: '#cfc1e4' },
     { accent: '#1c5e63', wash: '#edf7f6', line: '#b0d9d6' },
     { accent: '#72501a', wash: '#faf6eb', line: '#e3d2ab' },
     { accent: '#783852', wash: '#faf0f4', line: '#deb8c8' },
     { accent: '#2b4c7e', wash: '#f0f4fa', line: '#b8c9e4' }
   ];

   let h2Idx = 0;
   for(const h2 of document.querySelectorAll('main h2')){
     if(h2.closest('.toc')) continue;
     const c = mixedColors[h2Idx % mixedColors.length];
     h2.style.setProperty('--accent', c.accent);
     h2.style.setProperty('--line', c.line);
     h2Idx++;
   }

   let h3Idx = 0;
   for(const h3 of document.querySelectorAll('main h3')){
     const c = mixedColors[(h3Idx + 2) % mixedColors.length];
     h3.style.setProperty('--accent', c.accent);
     h3Idx++;
   }

   let bqIdx = 0;
   for(const bq of document.querySelectorAll('blockquote.theory')){
     const c = mixedColors[(bqIdx + 1) % mixedColors.length];
     bq.style.setProperty('--accent', c.accent);
     bq.style.setProperty('--wash', c.wash);
     bqIdx++;
   }

   let tblIdx = 0;
   for(const tbl of document.querySelectorAll('table')){
     const c = mixedColors[(tblIdx + 3) % mixedColors.length];
     tbl.style.setProperty('--accent', c.accent);
     tbl.style.setProperty('--wash', c.wash);
     tbl.style.setProperty('--line', c.line);
     tblIdx++;
   }

   let stepIdx = 0;
   for(const step of document.querySelectorAll('.step-card')){
     const c = mixedColors[(stepIdx + 2) % mixedColors.length];
     step.style.setProperty('--accent', c.accent);
     step.style.setProperty('--wash', c.wash);
     stepIdx++;
   }

   let subIdx = 0;
   for(const sub of document.querySelectorAll('.subtopic-lead')){
     const c = mixedColors[(subIdx + 4) % mixedColors.length];
     sub.style.setProperty('--accent', c.accent);
     subIdx++;
   }

   const colors=[['#e9f3fa','#709bb7'],['#edf7f0','#7ba98a'],['#fcf5e7','#c1a163'],['#f4eef9','#a28cbb']];
   for(const svg of document.querySelectorAll('.diagram svg')){
    [...svg.querySelectorAll('.node')].forEach((node,i)=>{
     const c=colors[i%colors.length];
     for(const shape of node.querySelectorAll('rect,polygon,path,circle,ellipse')){shape.style.setProperty('fill',c[0],'important');shape.style.setProperty('stroke',c[1],'important');}
     for(const text of node.querySelectorAll('text,.nodeLabel,.label')){text.style.setProperty('color','#24343d','important');if(text.tagName.toLowerCase()==='text')text.style.setProperty('fill','#24343d','important');}
    });
    for(const edge of svg.querySelectorAll('.flowchart-link'))edge.style.setProperty('stroke','#687c8a','important');
   }
  },palette);

  await p.addStyleTag({content:css});
  await p.addStyleTag({content:`
   h2{border-bottom-color:var(--line)}
   .cover h1{background:linear-gradient(110deg,#e4f2f8 0%,#f0e9f8 45%,#fff2dc 85%,#fff 100%);border-left-color:#b16b25}
   .cover .kicker{color:#7b5294}.cover .sub{color:#357465}
   .toc a:nth-of-type(3n+1){color:#246c7e}.toc a:nth-of-type(3n+2){color:#80529a}.toc a:nth-of-type(3n){color:#a05b2a}
   blockquote.theory{background:linear-gradient(100deg,var(--wash),#fff);border-left-color:var(--accent)}
   blockquote.practice{background:#fff1dc;border-left-color:#a96b20}
   blockquote.practice .callout-label,blockquote.practice strong{color:#8b5617}
   blockquote.answer{background:#e8f5ee;border-left-color:#35785a}
   blockquote.answer .callout-label,blockquote.answer strong{color:#28674c}
   code{background:#e8f3f4;color:#245d66}
   p:nth-of-type(2n) code,li:nth-child(2n) code{background:#fff0e4;color:#884b24}
   pre code{background:none!important;color:#25313d!important}
   th{background:var(--accent);color:white}th strong,th code{color:white;background:none}
   tbody tr:nth-child(even) td{background:var(--wash)}
   tbody tr:nth-child(odd) td{background:#fffaf3}
   .classification-heading{background:var(--accent);color:white}
   .classification-card:nth-child(8n+1){background:#e3f1fb;border-color:#84b3d2;--card-ink:#285d81}
   .classification-card:nth-child(8n+2){background:#e5f4ed;border-color:#91c3a5;--card-ink:#326849}
   .classification-card:nth-child(8n+3){background:#fff0d9;border-color:#d4b171;--card-ink:#865b1b}
   .classification-card:nth-child(8n+4){background:#f0e7f8;border-color:#b49bcd;--card-ink:#6e4c8e}
   .classification-card:nth-child(8n+5){background:#fbe7e2;border-color:#d49d8f;--card-ink:#974b3b}
   .classification-card:nth-child(8n+6){background:#e1f3f2;border-color:#8ebfbc;--card-ink:#2b6b69}
   .classification-card:nth-child(8n+7){background:#f7e5ef;border-color:#cf99b9;--card-ink:#87446c}
   .classification-card:nth-child(8n+8){background:#e7ecfa;border-color:#9eaed5;--card-ink:#435c90}
   .classification-title,.classification-card strong{color:var(--card-ink,var(--accent))}
   .exercise-item>ol>li::marker{color:var(--secondary,var(--accent))}
   .answer-label{color:var(--tertiary,#65737e)}
   .toc-dots{border-bottom-color:#b3a3c6}
  `});

  const after=await p.evaluate(()=>({text:document.querySelector('main').innerText.replace(/\s+/g,''),items:document.querySelectorAll('.exercise-item').length,spaces:document.querySelectorAll('.answer-space').length,lines:document.querySelectorAll('.writing-line').length,overflow:[...document.querySelectorAll('table,pre,blockquote')].filter(e=>e.scrollWidth>e.clientWidth+3).length}));
  if(before.text!==after.text||before.items!==after.items||before.spaces!==after.spaces||before.lines!==after.lines||after.overflow)throw Error('Content or layout mismatch '+kind);
  fs.writeFileSync(html,await p.content());
  await p.pdf({path:path.join(dir,name+'.pdf'),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:`<div style="width:100%;padding:0 17mm;font-size:8px;color:#667788;display:flex;justify-content:space-between"><span>英语认知句法${kind}全书</span><span class="pageNumber"></span></div>`,preferCSSPageSize:true,timeout:120000,outline:true});
  qa[kind]={contentUnchanged:true,items:after.items,spaces:after.spaces,lines:after.lines,overflow:after.overflow};await p.close();
 }
 fs.writeFileSync(path.join(dir,'配色检查.json'),JSON.stringify({palette,qa},null,2));
 await browser.close();console.log(JSON.stringify(qa));
})().catch(e=>{console.error(e);process.exit(1)});
