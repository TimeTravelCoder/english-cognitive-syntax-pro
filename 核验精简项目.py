from pathlib import Path
from hashlib import sha256
import json, re
from pypdf import PdfReader

root = Path(__file__).resolve().parent
def flat(nodes):
    for node in nodes:
        if isinstance(node, list):
            yield from flat(node)
        else:
            yield node

result = {}
for kind in ('理论', '练习'):
    raw = (root / f'【合集】英语认知句法{kind}全书.md').read_bytes()
    text = raw.decode('utf-8')
    ids = re.findall(r'class="question-start" data-question="([^"]+)"', text)
    assert raw.count(b'\n') == raw.count(b'\r\n'), f'{kind}: 裸LF'
    assert raw.count(b'\r') == raw.count(b'\r\n'), f'{kind}: 裸CR'
    chapters = len(re.findall(r'<h1 id="sec-\d+">', text))
    assert chapters in (8, 9)
    if kind == '练习':
        assert len(ids) == len(set(ids)) == text.count('class="answer-space"')
    data = {'源稿SHA256': sha256(raw).hexdigest(), '篇数': chapters,
            '题目': len(ids), '作答区': text.count('class="answer-space"'),
            '书写线': text.count('class="writing-line"')}
    for folder in ('排版成品', '定稿打印版/多元配色修订版'):
        pdf = root / folder / f'英语认知句法{kind}全书（排版版）.pdf'
        reader = PdfReader(pdf)
        nodes = list(flat(reader.outline))
        assert all(0 <= reader.get_destination_page_number(n) < len(reader.pages) for n in nodes)
        data[folder] = {'页数': len(reader.pages), '书签': len(nodes)}
    result[kind] = data
print(json.dumps(result, ensure_ascii=False, indent=2))
