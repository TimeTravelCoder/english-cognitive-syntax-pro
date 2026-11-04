const fs=require('fs'),path=require('path');
const deps='C:/Users/Ming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked}=require(deps+'/marked');const {chromium}=require(deps+'/playwright');
const css=`
@page{size:A4;margin:19mm 17mm 20mm}@page:left{margin:19mm 20mm 20mm 15mm}@page:right{margin:19mm 15mm 20mm 20mm}*{box-sizing:border-box}body{margin:0;color:#202b36;font:11pt/1.75 "Times New Roman","Microsoft YaHei",serif;background:#eef1f5;hyphens:auto;-webkit-hyphens:auto}main{max-width:900px;margin:30px auto;background:white;padding:60px;box-shadow:0 6px 30px #21344b15}h1,h2,h3,h4,h5,h6{font-family:"Microsoft YaHei",sans-serif;line-height:1.45;break-after:avoid;overflow-wrap:anywhere}h1{font-size:25pt;color:#153955}h2{font-size:17pt;margin:1.8em 0 .7em;color:#153955;border-bottom:1px solid #c6d5df;padding-bottom:.35em}h3{font-size:13.5pt;color:#205771;margin:1.6em 0 .6em}h4,h5,h6{font-size:11.5pt;margin:1.3em 0 .5em}.step-card{margin:0.85em 0;padding:12px 16px;background:#f4f8fb;border-left:4px solid #205775;border-radius:4px;break-inside:avoid;box-shadow:0 1px 3px rgba(0,0,0,0.02)}.step-title{font:700 11pt/1.5 "Microsoft YaHei";color:#153955;margin-bottom:6px}.step-body{font-size:11pt;line-height:1.75}.subtopic-lead{font-size:11pt;font-weight:700;color:#153955;margin:1.15em 0 .45em;line-height:1.5;break-after:avoid;page-break-after:avoid;display:flex;align-items:center;gap:6px}.subtopic-bar{color:#205775;font-size:10.5pt;line-height:1}p{margin:.6em 0;orphans:3;widows:3}li{margin:.3em 0;orphans:3;widows:3}ul,ol{padding-left:1.8em}strong{color:#153955}a{color:#225c78;text-decoration:none}blockquote{margin:1.1em 0;padding:12px 18px;border:1px solid #cbdde9;border-left:5px solid #205775;background:#f4f8fb;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.02);orphans:3;widows:3}blockquote p{margin:.45em 0;line-height:1.68}blockquote p:first-of-type{margin-top:0}blockquote p:last-of-type{margin-bottom:0}blockquote.theory{border-left-color:#205775;border-color:#c8dce8;background:#f4f8fb}blockquote.example{border-left-color:#236965;border-color:#c4e2df;background:#f1f8f7}blockquote.practice{border-left-color:#96621f;border-color:#ebdcb8;background:#faf5eb}blockquote.warning{border-left-color:#b84e20;border-color:#f2d2c2;background:#fff5ef}blockquote.answer{border-left-color:#386f4a;border-color:#c6e4d0;background:#f1f8f3;break-inside:avoid}.callout-label{font:700 10.5pt "Microsoft YaHei";color:#1b4a63;margin-bottom:8px;padding-bottom:5px;border-bottom:1px dashed #cfdfe9;letter-spacing:0.02em}blockquote.theory .callout-label{color:#1b4a63;border-bottom-color:#cfdfe9}blockquote.example .callout-label{color:#1b5450;border-bottom-color:#c4dedb}blockquote.practice .callout-label{color:#794e18;border-bottom-color:#e4d3ab}blockquote.warning .callout-label{color:#9c3e16;border-bottom-color:#edd0c0}blockquote.answer .callout-label{color:#29593a;border-bottom-color:#c3dfcd}code{font-family:Consolas,"Microsoft YaHei",monospace;font-size:.92em;white-space:normal;overflow-wrap:anywhere;background:#f1f3f5;padding:.1em .25em}pre{white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #d9e2e8;background:#f6f8fa;padding:12px;line-height:1.55}pre code{padding:0;background:none}table{border-collapse:collapse;width:100%;font-size:9.5pt;margin:1em 0}th,td{border:1px solid #cbd5dd;padding:7px 9px;vertical-align:top;overflow-wrap:anywhere}th{background:#eaf0f5;color:#163c55}thead{display:table-header-group}tr{break-inside:avoid}hr{border:0;border-top:1px solid #d9e2e8;margin:1.5em 0}img{max-width:100%}.cover{min-height:680px;display:flex;flex-direction:column;justify-content:center;break-after:page}.cover .kicker{font:11pt "Microsoft YaHei";color:#54758c;letter-spacing:.25em}.cover h1{font-size:32pt;line-height:1.5;margin:25px 0;border-left:6px solid #234f6b;padding-left:24px}.sub{color:#657786;font-size:12pt}.meta{margin-top:65px;color:#657786;font-size:10pt}.toc{break-after:page}.toc a{display:flex;gap:10px;align-items:baseline;margin:14px 0;font-size:10.5pt;line-height:1.6}.toc-name{flex:0 1 auto}.toc-dots{flex:1;min-width:20px;border-bottom:1px dotted #9eb0bd}.toc-pg{flex:none;min-width:20px;text-align:right}.chapter{break-before:page;font-size:22pt;border-top:4px solid #234f6b;padding-top:20px;margin-top:0}.chapter+hr{display:none}.note{color:#6b7a86;font-size:9pt}@media print{body{background:white}main{max-width:none;padding:0;margin:0;box-shadow:none}.cover{min-height:235mm}a{color:inherit}blockquote,th{print-color-adjust:exact}}
`;
(async()=>{fs.mkdirSync('排版成品',{recursive:true});let browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const kind of ['理论','练习']){const title=`英语认知句法${kind}全书`;const src=fs.readFileSync(`【合集】${title}.md`,'utf8');const names=[...src.matchAll(/<h1 id="sec-(\d+)">([^<]+)<\/h1>/g)];
let body=src.slice(src.indexOf('<h1 id="sec-1">')).replace(/<h1 id="sec-(\d+)">/g,'<h1 class="chapter" id="sec-$1">');
body=body.replace(/(\|[^|\r\n]+(?:\|[^|\r\n]+)*\|)[ \t]*(?:\r?\n[ \t]*)+(?=\|)/g,'$1\n');
body=body.replace(/(\n>[^\n\r]*\r?\n)(?:[ \t]*\r?\n)+(?=>[ \t]*\[!)/g,'$1\n<!-- callout-sep -->\n\n');
while(/(\n>[^\n\r]*)\r?\n(?:[ \t]*\r?\n)+(?=>)/.test(body)){body=body.replace(/(\n>[^\n\r]*)\r?\n(?:[ \t]*\r?\n)+(?=>)/g,'$1\n');}
const maths=[];body=body.replace(/\$\$[\s\S]*?\$\$|(?<!\$)\$[^\n$]+\$(?!\$)/g,m=>{maths.push(m);return 'MATHPLACEHOLDER'+(maths.length-1)+'END'});let rendered=marked.parse(body,{gfm:true});rendered=rendered.replace(/MATHPLACEHOLDER(\d+)END/g,(_,i)=>maths[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));rendered=rendered.replace(/<blockquote>\s*<p>\[!([^\]]+)\](?:<br>|\n)?/g,(_,t)=>{const type=/example/.test(t)?'example':/practice/.test(t)?'practice':/warning|danger/.test(t)?'warning':/answer/.test(t)?'answer':'theory';const icon=type==='example'?'🔍 经典例句与场景':type==='practice'?'📝 专项练习与记录':type==='warning'?'⚠️ 易错陷阱与预警':type==='answer'?'💡 参考答案与解析':'📌 核心要点与体系提示';return `<blockquote class="${type}"><div class="callout-label">${icon}</div><p>`});
const pages=fs.existsSync('排版成品/page-map.json')?JSON.parse(fs.readFileSync('排版成品/page-map.json','utf8'))[kind]:{};
const toc=names.map(m=>`<a href="#sec-${m[1]}"><span class="toc-name">${m[2]}</span><span class="toc-dots"></span><span class="toc-pg">${pages?.[m[1]]||''}</span></a>`).join('');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body><main><section class="cover"><div class="kicker">ENGLISH · COGNITIVE SYNTAX</div><h1>${title}</h1><div class="sub">${kind==='理论'?'思维模型 · 句法结构 · 阅读与表达':'专项训练 · 综合强化 · 参考答案'}</div><div class="meta">共 ${names.length} 篇<br>统一编号 · 系统编排 · A4 阅读打印版</div></section><nav class="toc"><h2>目录</h2>${toc}<p class="note">点击篇名可跳转；页码对应配套 PDF。</p></nav>${rendered}</main></body></html>`;
const file=path.resolve('排版成品',`${title}（排版版）.html`);fs.writeFileSync(file,html);const page=await browser.newPage();await page.goto('file:///'+file.replace(/\\/g,'/'));await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>{window.MathJax={tex:{inlineMath:[['$','$'],['\\(','\\)']],displayMath:[['$$','$$']],packages:{'[+]':['noerrors']}},svg:{fontCache:'none'},startup:{typeset:false}}});
await page.addScriptTag({path:path.resolve('tmp/pdfs/mathjax.js')});await page.evaluate(async()=>{await MathJax.startup.promise;await MathJax.typesetPromise()});
await page.addScriptTag({path:path.resolve('tmp/pdfs/mermaid.js')});
const diagrams=await page.evaluate(async()=>{
mermaid.initialize({startOnLoad:false,securityLevel:'loose',theme:'neutral',flowchart:{useMaxWidth:true,htmlLabels:true,nodeSpacing:35,rankSpacing:45,padding:18},themeVariables:{fontFamily:'Microsoft YaHei',fontSize:'16px'}});
let ok=0,cards=0,vertical=0,errors=[];
function wrap(code){return code.replace(/(flowchart|graph)\s+LR/,'$1 TD').replace(/"([^"\n]+)"/g,(all,label)=>'"'+label.split(/<br\s*\/?\s*>/i).map(part=>{if(part.length<=48)return part;const words=part.split(/\s+/);if(words.length<2)return part;const lines=[];let line='';for(const word of words){if(line&&line.length+word.length+1>46){lines.push(line);line=word}else line+=(line?' ':'')+word}if(line)lines.push(line);return lines.join('<br/>')}).join('<br/>')+'"');}
for(const [i,e] of [...document.querySelectorAll('code.language-mermaid')].entries()){
try{let code=e.textContent;const clean=code.replace(/(\w+)\s*[\[(]+\s*"[^"]+"[\])]+/g,'$1');const edges=[...clean.matchAll(/(\w+)\s*-->(?:\|[^|]*\|)?\s*(\w+)/g)];const roots=new Set(edges.map(x=>x[1]));const div=document.createElement('div');div.className='diagram';
if(edges.length>=3&&roots.size===1&&!/\.->|---|<--/.test(code)){
 const nodes=new Map([...code.matchAll(/(\w+)\s*[\[(]+\s*"([^"]+)"/g)].map(m=>[m[1],m[2]]));const root=[...roots][0];if(!nodes.has(root)||edges.some(x=>!nodes.has(x[2])))throw Error('Node parse '+i);
 const group=document.createElement('section');group.className='classification';const h=document.createElement('div');h.className='classification-heading';h.textContent=nodes.get(root).replace(/<br\s*\/?\s*>/gi,' · ');group.append(h);const grid=document.createElement('div');grid.className='classification-grid';
 for(const edge of edges){const label=nodes.get(edge[2]);let parts=label.split(/<br\s*\/?\s*>/i);if(parts.length===1&&label.includes('：'))parts=[label.slice(0,label.indexOf('：')),label.slice(label.indexOf('：')+1)];const card=document.createElement('div');card.className='classification-card';const title=document.createElement('div');title.className='classification-title';title.textContent=parts.shift();card.append(title);if(parts.length){const text=document.createElement('div');text.className='classification-detail';text.textContent=parts.join(' · ');card.append(text)}grid.append(card)}group.append(grid);div.append(group);cards++;
}else{
 let result=await mermaid.render('diagram'+i,code);div.innerHTML=result.svg;document.body.append(div);const box=div.querySelector('svg').viewBox.baseVal;
 if(/(?:flowchart|graph)\s+LR/.test(code)&&(box.width>780||box.width/box.height>3.5)){code=wrap(code);result=await mermaid.render('readable'+i,code);div.innerHTML=result.svg;vertical++;}div.remove();
}
// Namespace diagram IDs and references to avoid collisions across SVGs.
const idMap=new Map();
for(const node of div.querySelectorAll('[id]')){const old=node.id;const id='book-diagram-'+i+'-'+old;idMap.set(old,id);node.id=id;}
for(const node of div.querySelectorAll('*'))for(const attr of [...node.attributes]){
 let value=attr.value;
 if(attr.name==='id')continue;
 value=value.replace(/url\(\s*(["']?)#([^\s)'" ]+)\1\s*\)/g,(all,q,id)=>idMap.has(id)?'url('+q+'#'+idMap.get(id)+q+')':all);
 if(['href','xlink:href'].includes(attr.name)&&value.startsWith('#')&&idMap.has(value.slice(1)))value='#'+idMap.get(value.slice(1));
 if(['aria-labelledby','aria-describedby'].includes(attr.name))value=value.split(/\s+/).map(id=>idMap.get(id)||id).join(' ');
 if(value!==attr.value)node.setAttribute(attr.name,value);
}
for(const style of div.querySelectorAll('style'))style.textContent=style.textContent.replace(/#([A-Za-z_][\w-]*)/g,(all,id)=>idMap.has(id)?'#'+idMap.get(id):all);
e.parentElement.replaceWith(div);ok++;
}catch(err){errors.push(String(err))}}
for(const h of document.querySelectorAll('main h2,main h3,main h4,main h5,main h6,.subtopic-lead')){const m=/^(\d+(?:\.\d+)+)\s/.exec(h.textContent);if(m)h.id='s-'+m[1].replace(/\./g,'-');}
// Native chapter links remain available in the offline HTML; the PDF keeps clickable links.
for(const a of document.querySelectorAll('.toc a')){const start=document.getElementById(a.getAttribute('href').slice(1));const nodes=[];let node=start.nextElementSibling;while(node&&!node.matches('.chapter')){if(node.tagName==='H2')nodes.push(node);node=node.nextElementSibling;}if(nodes.length){const details=document.createElement('details');details.className='chapter-index';const summary=document.createElement('summary');summary.textContent='展开本篇章节';details.append(summary);for(const h of nodes){const link=document.createElement('a');link.href='#'+h.id;link.textContent=h.textContent;details.append(link);}a.after(details);}}
return {ok,cards,vertical,errors};});console.log(JSON.stringify({kind,diagrams}));
if(diagrams.errors.length)throw Error('Diagram rendering failed');
await page.addStyleTag({content:'mjx-container svg{max-width:100%;height:auto} .diagram{margin:1em 0;break-inside:avoid;text-align:center}.diagram svg{max-width:100%;max-height:220mm;height:auto}mjx-container[display="true"]{overflow-wrap:normal;max-width:100%;font-size:90%;break-inside:avoid}'});
await page.addStyleTag({content:'.classification{text-align:left;margin:1em 0}.classification-heading{font:700 12pt/1.6 "Microsoft YaHei";color:#153955;padding:12px 16px;background:#eaf0f5;border-left:4px solid #53788b;break-after:avoid}.classification-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.classification-card{border:1px solid #cbd5dd;background:#fafcfd;padding:14px 16px;break-inside:avoid;min-width:0}.classification-title{font:700 11pt/1.6 "Microsoft YaHei";color:#205771;margin-bottom:7px}.classification-detail{font:11.5pt/1.8 "Times New Roman","Microsoft YaHei",serif;overflow-wrap:anywhere}.diagram:has(.classification){break-inside:auto}blockquote{break-inside:avoid}h2,h3,h4{scroll-margin-top:20px}.chapter-index{padding:0 0 8px 18px;color:#4e6a7c;font-size:10pt}.chapter-index a{display:block;margin:6px 0;padding-left:8px}.chapter-index summary{cursor:pointer}.sublead{break-after:avoid}@media screen and (max-width:650px){main{padding:25px 20px;margin:0}.classification-grid{grid-template-columns:1fr}}@media print{.classification-card,.classification-heading{print-color-adjust:exact}.classification-grid{gap:9px}.classification-detail{font-size:11pt}.chapter-index{display:none}}'});

if(kind==='练习'){
const worksheet=await page.evaluate(()=>{for(const start of [...document.querySelectorAll('.question-start')]){const item=document.createElement('section');item.className='exercise-item';item.dataset.question=start.dataset.question;start.before(item);let node=start.nextElementSibling;while(node){const next=node.nextElementSibling;if(node.matches('.question-start,h1,h2,h3,h4,hr'))throw Error('Missing space '+item.dataset.question);item.append(node);if(node.classList.contains('answer-space'))break;node=next;}start.remove();}return {items:document.querySelectorAll('.exercise-item').length,spaces:document.querySelectorAll('.answer-space').length};});console.log('Worksheet',JSON.stringify(worksheet));if(worksheet.items!==worksheet.spaces)throw Error('Worksheet mismatch');
await page.addStyleTag({content:'.exercise-item{break-inside:avoid;margin:1.1em 0 1.4em}.exercise-item>ol{margin:0;padding-left:1.8em}.answer-space{margin:8px 0 0 0;break-inside:avoid}.answer-label{font:9pt/1.4 "Microsoft YaHei";color:#65737e}.writing-line{height:8mm;border-bottom:1px solid #acb8c2}.exercise-item>blockquote{margin:.5em 0}.exercise-item p{margin:.4em 0}@media print{.writing-line{print-color-adjust:exact}}'});
}

// Keep the two offline volumes connected and make theory references actionable.
const navigation=await page.evaluate((kind)=>{
 const files={理论:'英语认知句法理论全书（排版版）.html',练习:'英语认知句法练习全书（排版版）.html'};
 const other=kind==='理论'?'练习':'理论';
 const target=(book,id)=>(book===kind?'':files[book])+'#'+id;
 const bar=document.createElement('p');bar.className='volume-navigation';
 const link=document.createElement('a');link.href=files[other]+'#sec-1';link.textContent='打开配套'+other+'全书';bar.append(link);
 document.querySelector('.toc').append(bar);
 let count=0;
 const walker=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const parent=node.parentElement;
  if(!parent||parent.closest('a,code,pre,svg,mjx-container,script,style,h1,h2,h3,h4,h5,h6,.toc,.cover,.subtopic-lead'))continue;
  const refs=/对应理论/.test(parent.closest('blockquote,p')?.textContent||'');
  const re=/(理论|练习)(?:全书)?第\s*([1-9])\s*篇|(理论|练习)全书\s*(\d+(?:\.\d+)+)\s*节?/g;
  let matches=[...node.textContent.matchAll(re)].map(m=>({index:m.index,text:m[0],book:m[1]||m[3],id:m[2]?'sec-'+m[2]:'s-'+m[4].replace(/\./g,'-')}));
  if(refs&&kind==='练习'){
   const extra=[...node.textContent.matchAll(/\b\d+(?:\.\d+)+\b/g)];
   for(const m of extra)if(!matches.some(x=>m.index>=x.index&&m.index<x.index+x.text.length))matches.push({index:m.index,text:m[0],book:'理论',id:'s-'+m[0].replace(/\./g,'-')});
  }
  if(!matches.length)continue;matches.sort((a,b)=>a.index-b.index);
  const frag=document.createDocumentFragment();let cursor=0;
  for(const m of matches){frag.append(node.textContent.slice(cursor,m.index));const a=document.createElement('a');a.href=target(m.book,m.id);a.textContent=m.text;frag.append(a);cursor=m.index+m.text.length;count++;}
  frag.append(node.textContent.slice(cursor));node.replaceWith(frag);
 }
 // The practice opening index identifies its first column explicitly as theory.
 if(kind==='练习')for(const table of document.querySelectorAll('table')){
  if(!/理论全书/.test(table.querySelector('thead')?.textContent||''))continue;
  for(const cell of table.querySelectorAll('tbody tr td:first-child')){
   if(cell.querySelector('a'))continue;const m=/第\s*([1-9])\s*篇/.exec(cell.textContent);if(!m)continue;
   const a=document.createElement('a');a.href=files.理论+'#sec-'+m[1];a.textContent=cell.textContent;cell.replaceChildren(a);count++;
  }
 }
 return {links:count};
},kind);console.log('Navigation',JSON.stringify(navigation));
// Tables stay readable, while prose can flow across pages without large empty blocks.
await page.addStyleTag({content:'.structure-map{text-align:left}.structure-map table{font-size:10pt;line-height:1.65;table-layout:fixed}.structure-map th:first-child{width:22%}.structure-map th:nth-child(2){width:43%}.structure-map p{font-size:10pt}.volume-navigation{font-size:10pt}blockquote{break-inside:auto;orphans:3;widows:3}.diagram-caption{break-after:avoid}.diagram-caption+div{margin-top:.5em}'});
await page.evaluate(()=>{
 for(const element of document.querySelectorAll('p')){
  if(element.nextElementSibling?.matches('.diagram,.structure-map')&&element.textContent.length<160)element.classList.add('diagram-caption');
 }
});

// Keep short labels, exercise introductions and training plans together when printed.
await page.addStyleTag({content:'.callout-label{break-after:avoid}.exercise-lead{break-inside:avoid}.training-plan-list{columns:2;column-gap:8mm;break-inside:avoid}.training-plan-list li{break-inside:avoid}blockquote.practice,blockquote.example{break-inside:avoid}li:has(blockquote){break-inside:avoid}@media screen and (max-width:650px){.training-plan-list{columns:1}}'});
await page.evaluate((kind)=>{
 for(const p of document.querySelectorAll('blockquote p'))if(!p.innerHTML.trim())p.remove();
 for(const svg of document.querySelectorAll('.diagram svg')){
  if(/The aberrant phosphorylation/.test(svg.textContent)&&svg.getBoundingClientRect().height>800)svg.style.maxHeight='185mm';
 }
 if(kind!=='练习')return;
 for(const heading of document.querySelectorAll('h2,h3')){
  if(!/训练安排|建议练习安排|建议练习安排|练习自检清单/.test(heading.textContent))continue;
  let node=heading.nextElementSibling;
  while(node&&!node.matches('h1,h2,h3,hr')){if(node.matches('ul'))node.classList.add('training-plan-list');node=node.nextElementSibling;}
 }
 let grouped=0;
 for(const item of [...document.querySelectorAll('.exercise-item')]){
  const nodes=[];let node=item.previousElementSibling;
  while(node&&!node.matches('.exercise-item,.exercise-lead,h1,hr')){
   nodes.unshift(node);
   if(node.matches('h2,h3,h4,h5,h6'))break;
   node=node.previousElementSibling;
  }
  if(!nodes.length||!nodes[0].matches('h2,h3,h4,h5,h6'))continue;
  while(nodes[0].previousElementSibling?.matches('h2,h3,h4,h5,h6'))nodes.unshift(nodes[0].previousElementSibling);
  const height=item.getBoundingClientRect().bottom-nodes[0].getBoundingClientRect().top;
  if(height>920)continue;
  const group=document.createElement('div');group.className='exercise-lead';nodes[0].before(group);
  for(const element of [...nodes,item])group.append(element);grouped++;
 }
 return {exerciseIntroductions:grouped};
},kind);

await page.evaluate(()=>document.querySelectorAll('script').forEach(e=>e.remove()));fs.writeFileSync(file,await page.content());
const overflow=await page.evaluate(()=>[...document.querySelectorAll('table,pre,blockquote')].filter(e=>e.scrollWidth>e.clientWidth+3).length);
await page.pdf({path:path.resolve('排版成品',`${title}（排版版）.pdf`),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:`<div style="width:100%;padding:0 17mm;font-size:8px;color:#667788;display:flex;justify-content:space-between"><span>${title}</span><span class="pageNumber"></span></div>`,preferCSSPageSize:true,timeout:120000,outline:true});console.log(JSON.stringify({kind,chapters:names.length,overflow}));await page.close();await browser.close();if(kind==='理论')browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});}await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
