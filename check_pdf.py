# -*- coding: utf-8 -*-
from pathlib import Path
from pypdf import PdfReader
import re, json

root = Path(__file__).resolve().parent
out = root / '排版成品'
result = {}

for kind in ['理论', '练习']:
    p = out / f'英语认知句法{kind}全书（排版版）.pdf'
    if not p.exists():
        continue
    r = PdfReader(p)
    texts = [page.extract_text() or '' for page in r.pages]
    mapping = {}
    blanks = []
    for i, t in enumerate(texts):
        if i > 1:
            m = re.match(r'\s*第\s*(\d+)\s*篇\s*[：:]', t)
            if m:
                mapping[m.group(1)] = i + 1
        if len(t.strip()) < 30:
            blanks.append(i + 1)

    # Also locate every H2 heading (## X.Y ...) for the expanded 2-level TOC
    src = (root / f'【合集】英语认知句法{kind}全书.md').read_text(encoding='utf-8')
    h2_re = re.compile(r'^## (\d+\.\d+) (.+)$', re.M)
    last_page = 0
    for m in h2_re.finditer(src):
        number = m.group(1)
        title_snippet = m.group(2).strip()[:8]
        part = number.split('.')[0]
        if part not in mapping:
            continue
        chap_start = int(mapping[part]) - 1
        lower = max(chap_start, last_page)
        upper = int(mapping[str(int(part) + 1)]) - 1 if str(int(part) + 1) in mapping else len(texts)
        found = None
        p1 = re.compile(r'(?m)^\s*' + re.escape(number) + r'(?!\.\d)\s')
        for idx in range(lower, upper):
            if p1.search(texts[idx]):
                found = idx
                break
        if found is None:
            p2 = re.compile(r'(?<![\d\.第见（\(])\b' + re.escape(number) + r'(?!\.\d|\s*节)\s')
            for idx in range(lower, upper):
                if p2.search(texts[idx]):
                    found = idx
                    break
        if found is None and title_snippet:
            for idx in range(chap_start, upper):
                if title_snippet in texts[idx]:
                    found = idx
                    break
        if found is not None:
            last_page = found
            mapping['s-' + number.replace('.', '-')] = found + 1

    result[kind] = mapping
    chap_only = {k: v for k, v in mapping.items() if k.isdigit()}
    sub_count = sum(1 for k in mapping if k.startswith('s-'))
    print(kind, 'pages', len(r.pages), 'chapters', chap_only, 'h2_pages', sub_count, 'short_pages', blanks)

(out / 'page-map.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
