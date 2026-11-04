from pathlib import Path
from io import BytesIO
from pypdf import PdfReader
import json, re

out = Path('排版成品')
results = {}

for kind in ['理论', '练习']:
    r = PdfReader(BytesIO((out / f'英语认知句法{kind}全书（排版版）.pdf').read_bytes()))
    def flat(nodes):
        for x in nodes:
            if isinstance(x, list):
                yield from flat(x)
            else:
                yield x
    nodes = list(flat(r.outline))
    bad = [
        x.title for x in nodes
        if r.get_destination_page_number(x) is None
        or not (0 <= r.get_destination_page_number(x) < len(r.pages))
    ]
    # Check visible text in rendered HTML for any unrendered '**'
    html_text = (out / f'英语认知句法{kind}全书（排版版）.html').read_text(encoding='utf-8')
    body_match = re.search(r'<main\b[^>]*>([\s\S]*?)</main>', html_text)
    body_html = body_match.group(1) if body_match else html_text
    visible_text = re.sub(r'<[^>]+>', '', body_html)
    raw_double_asterisks = [m.start() for m in re.finditer(r'\*\*', visible_text)]
    results[kind] = {
        'pages': len(r.pages),
        'bookmarks': len(nodes),
        'invalid_bookmarks': bad,
        'raw_double_asterisks': raw_double_asterisks,
    }

(out / '本轮PDF验证.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(results, ensure_ascii=False, indent=2))
