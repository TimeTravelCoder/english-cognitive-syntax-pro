# -*- coding: utf-8 -*-
from pathlib import Path
import re, json
from io import BytesIO
from pypdf import PdfReader, PdfWriter

root = Path(r"c:\Users\Ming\Desktop\英语理论深化演进\英语理论深化演进").resolve()
out = root / '排版成品'
maps = json.loads((out / 'page-map.json').read_text(encoding='utf-8'))

for kind in ['理论', '练习']:
    pdf = out / f'英语认知句法{kind}全书（排版版）.pdf'
    r = PdfReader(BytesIO(pdf.read_bytes()))
    texts = [p.extract_text() or '' for p in r.pages]
    w = PdfWriter()
    w.clone_document_from_reader(r)
    if '/Outlines' in w._root_object:
        del w._root_object['/Outlines']
    src = (root / f'【合集】英语认知句法{kind}全书.md').read_text(encoding='utf-8')
    parts = {}
    parents = {}
    total = 0
    missing = []
    last_page = 0

    def locate(number, title_snippet, texts, maps, kind, min_page):
        part = number.split('.')[0]
        lower = max(int(maps[kind][part]) - 1, min_page)
        upper = int(maps[kind][str(int(part) + 1)]) - 1 if str(int(part) + 1) in maps[kind] else len(texts)
        
        p1 = re.compile(r'(?m)^\s*▍?\s*' + re.escape(number) + r'(?!\.\d)\s')
        for i in range(lower, upper):
            if p1.search(texts[i]):
                return i
        p2 = re.compile(r'(?<![\d\.第见（\(])\b' + re.escape(number) + r'(?!\.\d|\s*节)\s')
        for i in range(lower, upper):
            if p2.search(texts[i]):
                return i
        # Match child heading (e.g. 7.8.9.1) or title snippet on same page
        p3 = re.compile(r'(?<![\d\.])\b' + re.escape(number) + r'\.1\b')
        for i in range(lower, upper):
            if p3.search(texts[i]) or (title_snippet and len(title_snippet) >= 4 and title_snippet in texts[i]):
                return i
        chap_lower = int(maps[kind][part]) - 1
        for i in range(chap_lower, upper):
            if p2.search(texts[i]) or p3.search(texts[i]):
                return i
        return None

    head_re = re.compile(r'<h1 id="sec-(\d+)">([^<]+)</h1>|^(#{2,3}) (\d+(?:\.\d+)+) (.+)$|<div class="subtopic-lead" id="s-[\d-]+"[^>]*>.*?<strong>(.*?)</strong>', re.M)
    for m in head_re.finditer(src):
        if m.group(1):
            key = m.group(1)
            dest = int(maps[kind][key]) - 1
            parts[key] = w.add_outline_item(m.group(2), dest)
            parents[key] = parts[key]
            last_page = dest
            total += 1
        elif m.group(3):
            number = m.group(4)
            title = number + ' ' + m.group(5)
            page = locate(number, m.group(5)[:8], texts, maps, kind, last_page)
            if page is None:
                missing.append(number)
                continue
            last_page = page
            parent_key = number.rsplit('.', 1)[0]
            parent = parents.get(parent_key, parts[number.split('.')[0]])
            parents[number] = w.add_outline_item(title, page, parent=parent)
            total += 1
        else:
            clean = re.sub(r'<[^>]+>', '', m.group(6)).strip()
            nm = re.match(r'(\d+(?:\.\d+)+)\s*(.*)$', clean)
            if not nm:
                continue
            number = nm.group(1)
            title = clean
            page = locate(number, nm.group(2)[:8], texts, maps, kind, last_page)
            if page is None:
                missing.append(number)
                continue
            last_page = page
            parent_key = number.rsplit('.', 1)[0]
            parent = parents.get(parent_key, parts[number.split('.')[0]])
            parents[number] = w.add_outline_item(title, page, parent=parent)
            total += 1
    if missing:
        raise RuntimeError(f'{kind} missing bookmark headings {missing}')
    w.page_mode = '/UseOutlines'
    tmp = root / 'tmp' / 'pdfs' / (pdf.stem + '.bookmarks.tmp.pdf')
    tmp.parent.mkdir(parents=True, exist_ok=True)
    w.write(tmp)
    final = PdfReader(BytesIO(tmp.read_bytes()))
    def flatten(nodes):
        return sum(flatten(x) if isinstance(x, list) else 1 for x in nodes)
    assert flatten(final.outline) == total
    assert len(final.pages) == len(r.pages)
    for n in final.outline:
        if not isinstance(n, list):
            assert final.get_destination_page_number(n) is not None
    pdf.write_bytes(tmp.read_bytes())
    print(kind, 'bookmarks:', total, 'pages:', len(r.pages))
