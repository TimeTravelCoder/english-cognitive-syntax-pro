from pathlib import Path
from io import BytesIO
import re
from pypdf import PdfReader, PdfWriter

root = Path(__file__).resolve().parent

schemes = [
    '定稿打印版/多元配色修订版',
    '定稿打印版/配色方案1_莫兰迪学术多色',
    '定稿打印版/配色方案2_东方四时矿物多色',
    '定稿打印版/配色方案3_科技极简双色对位',
]

# Preload source outlines and page counts once
sources = {}
for kind in ('理论', '练习'):
    name = f'英语认知句法{kind}全书（排版版）.pdf'
    reader = PdfReader(BytesIO((root / '排版成品' / name).read_bytes()))
    def serialize_outline(nodes):
        items = []
        for node in nodes:
            if isinstance(node, list):
                items.append(serialize_outline(node))
            else:
                items.append((node.title, reader.get_destination_page_number(node)))
        return items
    sample_pages = sorted({0, len(reader.pages) // 2, len(reader.pages) - 1})
    sample_texts = {
        idx: re.sub(r'\s+', '', reader.pages[idx].extract_text() or '')
        for idx in sample_pages
    }
    sources[kind] = {
        'name': name,
        'pages': len(reader.pages),
        'outline': serialize_outline(reader.outline),
        'sample_texts': sample_texts,
    }

for folder in schemes:
    print(f'=== Restoring bookmarks in: {folder} ===', flush=True)
    for kind in ('理论', '练习'):
        info = sources[kind]
        destination = root / folder / info['name']
        colored = PdfReader(BytesIO(destination.read_bytes()))
        assert len(colored.pages) == info['pages'], (
            f"{folder} {kind}: 页数不一致 ({info['pages']} vs {len(colored.pages)})"
        )
        for idx, expected_text in info['sample_texts'].items():
            actual_text = re.sub(r'\s+', '', colored.pages[idx].extract_text() or '')
            assert actual_text == expected_text, f'{folder} {kind}: 第{idx + 1}页抽检文字不一致'

        writer = PdfWriter()
        writer.clone_document_from_reader(colored)
        if '/Outlines' in writer.root_object:
            del writer.root_object['/Outlines']

        def copy_serialized(nodes, parent=None):
            total = 0
            last = parent
            for node in nodes:
                if isinstance(node, list):
                    total += copy_serialized(node, last)
                else:
                    title, page_idx = node
                    last = writer.add_outline_item(title, page_idx, parent=parent)
                    total += 1
            return total

        count = copy_serialized(info['outline'])
        writer.page_mode = '/UseOutlines'
        buffer = BytesIO()
        writer.write(buffer)
        destination.write_bytes(buffer.getvalue())
        print(f'  {kind}: 页数与文字抽检完全一致，恢复 {count} 条层级大纲书签', flush=True)

print('All color schemes bookmark restoration complete.', flush=True)
