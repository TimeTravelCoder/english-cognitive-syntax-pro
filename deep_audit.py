import os, sys, re, json
from pathlib import Path
from pypdf import PdfReader

root = Path('.').resolve()
report = {}

def flat_outline(nodes):
    for x in nodes:
        if isinstance(x, list):
            yield from flat_outline(x)
        else:
            yield x

print("=== 1. 检查源 Markdown 文件 ===")
md_report = {}
for kind in ['理论', '练习']:
    fpath = root / f'【合集】英语认知句法{kind}全书.md'
    raw = fpath.read_bytes()
    text = raw.decode('utf-8')
    crlf_ok = (raw.count(b'\n') == raw.count(b'\r\n')) and (raw.count(b'\r') == raw.count(b'\r\n'))
    
    # 查找未闭合或裸露的 markdown 标记
    raw_asterisks = len(re.findall(r'(?<!\*)\*\*(?!\*)', text))
    # 查找章节数
    chaps = len(re.findall(r'<h1 id="sec-\d+">', text))
    
    # 练习全书特定校验
    q_starts = re.findall(r'class="question-start" data-question="([^"]+)"', text)
    ans_spaces = text.count('class="answer-space"')
    write_lines = text.count('class="writing-line"')
    
    # 检查表格数量
    tables = len(re.findall(r'\|[^\n]+\|\s*\n[ \t\r\n]*\|[\s\-:|]+\|', text))

    md_report[kind] = {
        'bytes': len(raw),
        'crlf_clean': crlf_ok,
        'chapters': chaps,
        'raw_asterisk_pairs': raw_asterisks % 2 == 0,
        'markdown_tables': tables,
        'question_count': len(q_starts),
        'unique_questions': len(set(q_starts)),
        'answer_spaces': ans_spaces,
        'writing_lines': write_lines
    }
report['markdown'] = md_report

print("=== 2. 检查生成的 HTML 文件 ===")
html_report = {}
for folder in ['排版成品', '定稿打印版/多元配色修订版', '定稿打印版/配色方案1_莫兰迪学术多色', '定稿打印版/配色方案2_东方四时矿物多色', '定稿打印版/配色方案3_科技极简双色对位']:
    f_rep = {}
    for kind in ['理论', '练习']:
        fpath = root / folder / f'英语认知句法{kind}全书（排版版）.html'
        if not fpath.exists():
            f_rep[kind] = 'MISSING'
            continue
        text = fpath.read_text(encoding='utf-8')
        tables = len(re.findall(r'<table[^>]*>', text))
        unparsed_pipe = len(re.findall(r'<p>\|[ \t]*-[ \t\-:|]*\|</p>', text))
        raw_double_star = len(re.findall(r'\*\*[^*<>]+\*\*', text))
        mathjax = 'MATHPLACEHOLDER' in text
        f_rep[kind] = {
            'html_tables': tables,
            'unparsed_table_separators': unparsed_pipe,
            'raw_double_stars': raw_double_star,
            'has_unparsed_mathjax_placeholders': mathjax
        }
    html_report[folder] = f_rep
report['html'] = html_report

print("=== 3. 检查 PDF 完整性、页数、书签、孤行、超链接 ===")
pdf_report = {}
for folder in ['排版成品', '定稿打印版/多元配色修订版', '定稿打印版/配色方案1_莫兰迪学术多色', '定稿打印版/配色方案2_东方四时矿物多色', '定稿打印版/配色方案3_科技极简双色对位']:
    p_rep = {}
    for kind in ['理论', '练习']:
        fpath = root / folder / f'英语认知句法{kind}全书（排版版）.pdf'
        if not fpath.exists():
            p_rep[kind] = 'MISSING'
            continue
        reader = PdfReader(fpath)
        pages_count = len(reader.pages)
        outline_nodes = list(flat_outline(reader.outline))
        invalid_bms = []
        for n in outline_nodes:
            pg = reader.get_destination_page_number(n)
            if pg is None or not (0 <= pg < pages_count):
                invalid_bms.append(getattr(n, 'title', str(n)))
        
        # 页面文字深度检查：空白页、异常字符
        blank_pages = []
        raw_star_pages = []
        for idx, page in enumerate(reader.pages):
            txt = page.extract_text() or ''
            if len(txt.strip()) < 15:
                blank_pages.append(idx + 1)
            if '**' in txt:
                raw_star_pages.append(idx + 1)
                
        p_rep[kind] = {
            'pages': pages_count,
            'bookmarks': len(outline_nodes),
            'invalid_bookmarks': invalid_bms,
            'blank_pages': blank_pages,
            'pages_with_raw_stars': raw_star_pages
        }
    pdf_report[folder] = p_rep
report['pdf'] = pdf_report

print("=== 4. 检查目录 (TOC) 页码与各篇章实际页码对位 ===")
with open(root / '排版成品/page-map.json', 'r', encoding='utf-8') as f:
    page_map = json.load(f)

toc_check = {}
for kind in ['理论', '练习']:
    reader = PdfReader(root / '排版成品' / f'英语认知句法{kind}全书（排版版）.pdf')
    actual_starts = {}
    for i, p in enumerate(reader.pages):
        if i < 2:
            continue  # 跳过封面与目录页，避免目录页文字干扰定位
        t = p.extract_text() or ''
        m = re.search(r'第\s*(\d+)\s*篇\s*[：:]', t)
        if m and m.group(1) not in actual_starts:
            actual_starts[m.group(1)] = i + 1
    toc_check[kind] = {
        'page_map_recorded': page_map.get(kind, {}),
        'pdf_actual_starts': actual_starts,
        'exact_match': page_map.get(kind, {}) == {k: int(v) for k, v in actual_starts.items()}
    }
report['toc_alignment'] = toc_check



with open('集中排查总报告.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("ALL INSPECTIONS COMPLETE.")
