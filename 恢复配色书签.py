from pathlib import Path
from io import BytesIO
import re
from pypdf import PdfReader, PdfWriter

root = Path(__file__).resolve().parent
for kind in ('理论', '练习'):
    name = f'英语认知句法{kind}全书（排版版）.pdf'
    source = PdfReader(root / '排版成品' / name)
    destination = root / '定稿打印版/多元配色修订版' / name
    colored = PdfReader(BytesIO(destination.read_bytes()))
    assert len(source.pages) == len(colored.pages), f'{kind}: 配色改变页数'
    for n, (a, b) in enumerate(zip(source.pages, colored.pages), 1):
        assert re.sub(r'\s+', '', a.extract_text() or '') == re.sub(r'\s+', '', b.extract_text() or ''), f'{kind}: 第{n}页文字不一致'
    writer = PdfWriter()
    writer.clone_document_from_reader(colored)
    if '/Outlines' in writer.root_object:
        del writer.root_object['/Outlines']
    def copy(nodes, parent=None):
        last = parent
        for node in nodes:
            if isinstance(node, list):
                copy(node, last)
            else:
                last = writer.add_outline_item(node.title, source.get_destination_page_number(node), parent=parent)
    copy(source.outline)
    writer.page_mode = '/UseOutlines'
    buffer = BytesIO()
    writer.write(buffer)
    destination.write_bytes(buffer.getvalue())
    print(kind, '逐页文字一致，完整书签已恢复')
