# -*- coding: utf-8 -*-
"""Generate 12 fixed-canvas cover HTML files for the 3 cover sets.
Sets: 1 ink-paper, 2 swiss-grid, 3 archive-specimen.
Each set: theory+practice x (3-side spread + A4 front cover).
HTML protocol: inline styles only, fixed canvas, bottom safe area."""
import io, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'html')
os.makedirs(OUT, exist_ok=True)

# shared background shortlinks (tool-returned originals)
BG = {
    's1_theory': 'https://aka.doubaocdn.com/s/CgGpU3hHzJ',
    's1_practice': 'https://aka.doubaocdn.com/s/L3NhgVqOsj',
    's2_theory': 'https://aka.doubaocdn.com/s/CJ8ORaQt6H',
    's2_practice': 'https://aka.doubaocdn.com/s/ej1LkVV2U0',
    's3_theory': 'https://aka.doubaocdn.com/s/DUl8yU6F0R',
    's3_practice': 'https://aka.doubaocdn.com/s/V6l6x4dRUU',
}

SERIF = "'Noto Serif SC','STSong','SimSun',serif"
SANS = "'Noto Sans SC','Helvetica Neue','Arial',sans-serif"
EN_SERIF = "Georgia,'Times New Roman',serif"
EN_SANS = "'Helvetica Neue','Arial',sans-serif"

def doc(w, h, title, body, main_bg):
    return ('<!DOCTYPE html>\n<html lang="zh-CN" data-canvas-width="%d" data-canvas-height="%d" '
            'style="width:%dpx;height:%dpx;margin:0;padding:0;box-sizing:border-box;">\n'
            '<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '<title>%s</title>\n</head>\n<body style="width:%dpx;height:%dpx;margin:0;padding:0;box-sizing:border-box;">\n'
            '<main style="position:relative;width:%dpx;height:%dpx;box-sizing:border-box;overflow:hidden;%s">\n%s\n'
            '<div data-canvas-bottom-safe-area="66" style="position:relative;margin-top:%dpx;width:%dpx;height:66px;"></div>\n'
            '</main>\n</body>\n</html>\n') % (w, h, w, h, title, w, h, w, h, main_bg, body, h - 66, w)

def bg_css(url, paper):
    return "background-image:url('%s');background-size:cover;background-position:center top;background-color:%s;" % (url, paper)

# ---------- Set 1: 东方文心 · 纸墨 ----------
def set1_spread(book, w, spine, bg, ink, sub, brief, seal):
    # spine: px width; front starts at 2*794+spine? no: back=794, spine, front=794
    back_w = 794
    front_x = back_w + spine
    cx = front_x + 397  # front center
    title_cn = '英语认知句法'
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    vol_en = 'THEORY VOLUME' if book == 'theory' else 'PRACTICE VOLUME'
    en = 'COGNITIVE&nbsp;ENGLISH&nbsp;SYNTAX'
    body = []
    # --- back cover (0..794) ---
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;">')
    body.append('<div style="position:absolute;left:150px;top:240px;width:470px;height:330px;box-sizing:border-box;border:1.5px solid rgba(46,66,77,0.28);"></div>')
    # horizontal brief text, two lines
    body.append("<div style=\"position:absolute;left:178px;top:296px;width:414px;font-family:%s;font-weight:400;font-size:20px;color:%s;line-height:2.0;text-align:left;\">%s</div>" % (SERIF, sub, brief))
    # horizontal english small under the brief
    body.append("<div style=\"position:absolute;left:178px;top:552px;width:414px;font-family:%s;font-weight:400;font-size:12px;color:%s;letter-spacing:3px;\">COGNITIVE&nbsp;ENGLISH&nbsp;SYNTAX</div>" % (EN_SERIF, sub))
    # seal bottom right of back
    body.append('<div style="position:absolute;left:668px;top:980px;width:52px;height:52px;box-sizing:border-box;background:#8C2F24;">'
                '<div style="position:absolute;left:0;top:11px;width:52px;text-align:center;font-family:%s;font-weight:600;font-size:16px;color:#F6F1E7;letter-spacing:2px;">%s</div></div>' % (SERIF, seal))
    body.append('</div>')
    # --- spine ---
    body.append('<div style="position:absolute;left:%dpx;top:0;width:%dpx;height:1123px;box-sizing:border-box;background:%s;">' % (back_w, spine, ink))
    body.append("<div style=\"position:absolute;left:0;top:220px;width:%dpx;height:360px;writing-mode:vertical-rl;text-align:center;font-family:%s;font-weight:600;font-size:22px;color:#F6F1E7;letter-spacing:8px;\">%s</div>" % (spine, SERIF, title_cn))
    body.append("<div style=\"position:absolute;left:0;top:600px;width:%dpx;height:150px;writing-mode:vertical-rl;text-align:center;font-family:%s;font-weight:400;font-size:14px;color:#D8D2C4;letter-spacing:5px;\">%s</div>" % (spine, SANS, vol_cn))
    body.append('</div>')
    # --- front cover ---
    body.append('<div style="position:absolute;left:%dpx;top:0;width:794px;height:1123px;box-sizing:border-box;background:rgba(246,241,231,0.72);">' % front_x)
    body.append('<div style="position:absolute;left:199px;top:96px;width:396px;height:1px;box-sizing:border-box;background:rgba(46,66,77,0.35);"></div>')
    # horizontal main title
    body.append("<div style=\"position:absolute;left:0;top:318px;width:794px;text-align:center;font-family:%s;font-weight:700;font-size:72px;color:%s;letter-spacing:12px;\">%s</div>" % (SERIF, ink, title_cn))
    # volume subtitle
    body.append("<div style=\"position:absolute;left:0;top:452px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:30px;color:%s;letter-spacing:16px;\">%s</div>" % (SERIF, sub, vol_cn))
    # divider
    body.append('<div style="position:absolute;left:357px;top:524px;width:80px;height:2px;box-sizing:border-box;background:rgba(46,66,77,0.45);"></div>')
    # english small bottom
    body.append("<div style=\"position:absolute;left:0;top:962px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:11px;color:%s;letter-spacing:5px;\">%s</div>" % (EN_SERIF, sub, en))
    # seal bottom right
    body.append('<div style="position:absolute;left:646px;top:884px;width:96px;height:96px;box-sizing:border-box;background:#8C2F24;">'
                '<div style="position:absolute;left:0;top:24px;width:96px;text-align:center;font-family:%s;font-weight:600;font-size:26px;color:#F6F1E7;letter-spacing:4px;">%s</div></div>' % (SERIF, seal))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 封面（三面展开）· 东方文心' % vol_cn, '\n'.join(body), bg_css(bg, '#F6F1E7'))

def set1_front(book, w, bg, ink, sub, seal):
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    en = 'COGNITIVE&nbsp;ENGLISH&nbsp;SYNTAX'
    body = []
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;background:rgba(246,241,231,0.72);">')
    body.append('<div style="position:absolute;left:0;top:96px;width:794px;height:1px;box-sizing:border-box;background:rgba(46,66,77,0.35);"></div>')
    body.append("<div style=\"position:absolute;left:0;top:318px;width:794px;text-align:center;font-family:%s;font-weight:700;font-size:72px;color:%s;letter-spacing:12px;\">英语认知句法</div>" % (SERIF, ink))
    body.append("<div style=\"position:absolute;left:0;top:452px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:30px;color:%s;letter-spacing:16px;\">%s</div>" % (SERIF, sub, vol_cn))
    body.append('<div style="position:absolute;left:357px;top:524px;width:80px;height:2px;box-sizing:border-box;background:rgba(46,66,77,0.45);"></div>')
    body.append("<div style=\"position:absolute;left:0;top:962px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:11px;color:%s;letter-spacing:5px;\">%s</div>" % (EN_SERIF, sub, en))
    body.append('<div style="position:absolute;left:646px;top:884px;width:96px;height:96px;box-sizing:border-box;background:#8C2F24;">'
                '<div style="position:absolute;left:0;top:24px;width:96px;text-align:center;font-family:%s;font-weight:600;font-size:26px;color:#F6F1E7;letter-spacing:4px;">%s</div></div>' % (SERIF, seal))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 前封面（A4 单页）· 东方文心' % vol_cn, '\n'.join(body), bg_css(bg, '#F6F1E7'))

# ---------- Set 2: 瑞士编辑 · 网格 ----------
def set2_spread(book, w, spine, bg, main, accent, brief):
    back_w = 794
    front_x = back_w + spine
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    tag = 'THEORY VOLUME · 01' if book == 'theory' else 'PRACTICE VOLUME · 02'
    body = []
    # back cover
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;">')
    body.append('<div style="position:absolute;left:0;top:0;width:24px;height:24px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append("<div style=\"position:absolute;left:120px;top:130px;width:180px;font-family:%s;font-weight:600;font-size:13px;color:%s;letter-spacing:3px;\">%s</div>" % (EN_SANS, main, tag))
    body.append('<div style="position:absolute;left:120px;top:156px;width:150px;height:1px;box-sizing:border-box;background:rgba(29,53,87,0.35);"></div>')
    body.append("<div style=\"position:absolute;left:120px;top:320px;width:400px;font-family:%s;font-weight:400;font-size:19px;color:#3A3A3A;line-height:1.9;\">%s</div>" % (SANS, brief))
    body.append("<div style=\"position:absolute;left:96px;top:868px;width:240px;font-family:%s;font-weight:700;font-size:92px;color:rgba(29,53,87,0.14);letter-spacing:-2px;\">01</div>" % EN_SANS if book == 'theory' else "<div style=\"position:absolute;left:96px;top:868px;width:240px;font-family:%s;font-weight:700;font-size:92px;color:rgba(31,74,61,0.14);letter-spacing:-2px;\">02</div>" % EN_SANS)
    body.append("<div style=\"position:absolute;left:120px;top:1010px;width:60px;height:2px;box-sizing:border-box;background:%s;\"></div>" % main)
    body.append('</div>')
    # spine
    body.append('<div style="position:absolute;left:%dpx;top:0;width:%dpx;height:1123px;box-sizing:border-box;background:%s;">' % (back_w, spine, main))
    body.append('<div style="position:absolute;left:0;top:0;width:%dpx;height:26px;box-sizing:border-box;background:%s;"></div>' % (spine, accent))
    body.append("<div style=\"position:absolute;left:0;top:200px;width:%dpx;height:360px;writing-mode:vertical-rl;text-align:center;font-family:%s;font-weight:600;font-size:18px;color:#F7F5F0;letter-spacing:6px;\">英语认知句法</div>" % (spine, SANS))
    body.append('</div>')
    # front cover
    body.append('<div style="position:absolute;left:%dpx;top:0;width:794px;height:1123px;box-sizing:border-box;">' % front_x)
    body.append('<div style="position:absolute;left:0;top:0;width:24px;height:24px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append("<div style=\"position:absolute;left:120px;top:150px;width:360px;font-family:%s;font-weight:600;font-size:14px;color:%s;letter-spacing:3px;\">%s</div>" % (EN_SANS, main, tag))
    body.append("<div style=\"position:absolute;left:120px;top:306px;width:600px;font-family:%s;font-weight:700;font-size:62px;color:%s;letter-spacing:1px;line-height:1.08;\">COGNITIVE<br>ENGLISH<br>SYNTAX</div>" % (EN_SANS, main))
    body.append("<div style=\"position:absolute;left:120px;top:620px;width:560px;font-family:%s;font-weight:700;font-size:56px;color:#1A1A1A;letter-spacing:6px;\">英语认知句法</div>" % SANS)
    body.append("<div style=\"position:absolute;left:120px;top:708px;width:560px;font-family:%s;font-weight:400;font-size:20px;color:%s;letter-spacing:8px;\">%s</div>" % (SANS, main, vol_cn))
    body.append('<div style="position:absolute;left:120px;top:748px;width:64px;height:3px;box-sizing:border-box;background:%s;"></div>' % accent)
    # accent block bottom right + ticks
    body.append('<div style="position:absolute;left:586px;top:876px;width:88px;height:88px;box-sizing:border-box;background:%s;"></div>' % accent)
    for i, dx in enumerate([0, 26, 52, 78]):
        body.append('<div style="position:absolute;left:%dpx;top:996px;width:1px;height:14px;box-sizing:border-box;background:%s;"></div>' % (586 + dx, main))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 封面（三面展开）· 瑞士编辑' % vol_cn, '\n'.join(body), bg_css(bg, '#F7F5F0'))

def set2_front(book, w, bg, main, accent):
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    tag = 'THEORY VOLUME · 01' if book == 'theory' else 'PRACTICE VOLUME · 02'
    body = []
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;">')
    body.append('<div style="position:absolute;left:0;top:0;width:24px;height:24px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append("<div style=\"position:absolute;left:120px;top:150px;width:360px;font-family:%s;font-weight:600;font-size:14px;color:%s;letter-spacing:3px;\">%s</div>" % (EN_SANS, main, tag))
    body.append("<div style=\"position:absolute;left:120px;top:306px;width:600px;font-family:%s;font-weight:700;font-size:62px;color:%s;letter-spacing:1px;line-height:1.08;\">COGNITIVE<br>ENGLISH<br>SYNTAX</div>" % (EN_SANS, main))
    body.append("<div style=\"position:absolute;left:120px;top:620px;width:560px;font-family:%s;font-weight:700;font-size:56px;color:#1A1A1A;letter-spacing:6px;\">英语认知句法</div>" % SANS)
    body.append("<div style=\"position:absolute;left:120px;top:708px;width:560px;font-family:%s;font-weight:400;font-size:20px;color:%s;letter-spacing:8px;\">%s</div>" % (SANS, main, vol_cn))
    body.append('<div style="position:absolute;left:120px;top:748px;width:64px;height:3px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append('<div style="position:absolute;left:586px;top:876px;width:88px;height:88px;box-sizing:border-box;background:%s;"></div>' % accent)
    for dx in [0, 26, 52, 78]:
        body.append('<div style="position:absolute;left:%dpx;top:996px;width:1px;height:14px;box-sizing:border-box;background:%s;"></div>' % (586 + dx, main))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 前封面（A4 单页）· 瑞士编辑' % vol_cn, '\n'.join(body), bg_css(bg, '#F7F5F0'))

# ---------- Set 3: 档案标本 · 纸本 ----------
def set3_spread(book, w, spine, bg, main, accent, brief, seal, vol_en):
    back_w = 794
    front_x = back_w + spine
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    tag = 'THEORY VOLUME' if book == 'theory' else 'PRACTICE VOLUME'
    file_no = 'FILE NO. 01' if book == 'theory' else 'FILE NO. 02'
    body = []
    # back cover
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;">')
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:70px;box-sizing:border-box;background:%s;"></div>' % main)
    body.append("<div style=\"position:absolute;left:0;top:0;width:794px;height:70px;line-height:70px;text-align:center;font-family:%s;font-weight:600;font-size:18px;color:#EFE6D8;letter-spacing:10px;\">%s</div>" % (EN_SANS, tag))
    body.append("<div style=\"position:absolute;left:150px;top:400px;width:500px;text-align:center;font-family:%s;font-weight:400;font-size:21px;color:#2B2B2B;line-height:2.0;\">%s</div>" % (SERIF, brief))
    body.append("<div style=\"position:absolute;left:0;top:1040px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:13px;color:%s;letter-spacing:4px;\">%s — COGNITIVE ENGLISH SYNTAX · 2026</div>" % (EN_SANS, main, file_no))
    body.append('<div style="position:absolute;left:646px;top:940px;width:88px;height:88px;box-sizing:border-box;border:2.5px solid %s;border-radius:50%%;">'
                '<div style="position:absolute;left:0;top:24px;width:88px;text-align:center;font-family:%s;font-weight:600;font-size:17px;color:%s;letter-spacing:3px;">%s</div></div>' % (accent, SERIF, accent, seal))
    body.append('</div>')
    # spine
    body.append('<div style="position:absolute;left:%dpx;top:0;width:%dpx;height:1123px;box-sizing:border-box;background:%s;">' % (back_w, spine, main))
    body.append("<div style=\"position:absolute;left:0;top:200px;width:%dpx;height:360px;writing-mode:vertical-rl;text-align:center;font-family:%s;font-weight:600;font-size:20px;color:#EFE6D8;letter-spacing:8px;\">英语认知句法</div>" % (spine, SERIF))
    body.append('<div style="position:absolute;left:0;top:0;width:%dpx;height:14px;box-sizing:border-box;background:%s;"></div>' % (spine, accent))
    body.append('</div>')
    # front cover
    body.append('<div style="position:absolute;left:%dpx;top:0;width:794px;height:1123px;box-sizing:border-box;">' % front_x)
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:70px;box-sizing:border-box;background:%s;"></div>' % main)
    body.append("<div style=\"position:absolute;left:0;top:0;width:794px;height:70px;line-height:70px;text-align:center;font-family:%s;font-weight:600;font-size:20px;color:#EFE6D8;letter-spacing:12px;\">%s</div>" % (EN_SANS, tag))
    body.append("<div style=\"position:absolute;left:0;top:316px;width:794px;text-align:center;font-family:%s;font-weight:700;font-size:68px;color:#2B2B2B;letter-spacing:10px;\">英语认知句法</div>" % SERIF)
    body.append('<div style="position:absolute;left:357px;top:452px;width:80px;height:2px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append("<div style=\"position:absolute;left:0;top:498px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:15px;color:%s;letter-spacing:6px;\">COGNITIVE ENGLISH SYNTAX</div>" % (EN_SANS, main))
    body.append("<div style=\"position:absolute;left:0;top:560px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:26px;color:%s;letter-spacing:12px;\">%s</div>" % (SERIF, main, vol_cn))
    body.append("<div style=\"position:absolute;left:0;top:1000px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:13px;color:%s;letter-spacing:4px;\">%s · VOL. %s · 2026</div>" % (EN_SANS, main, file_no, vol_en))
    body.append('<div style="position:absolute;left:628px;top:884px;width:100px;height:100px;box-sizing:border-box;border:2.5px solid %s;border-radius:50%%;">'
                '<div style="position:absolute;left:0;top:28px;width:100px;text-align:center;font-family:%s;font-weight:600;font-size:18px;color:%s;letter-spacing:3px;">%s</div></div>' % (accent, SERIF, accent, seal))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 封面（三面展开）· 档案标本' % vol_cn, '\n'.join(body), bg_css(bg, '#EFE6D8'))

def set3_front(book, w, bg, main, accent, seal, vol_en):
    vol_cn = '理论全书' if book == 'theory' else '练习全书'
    tag = 'THEORY VOLUME' if book == 'theory' else 'PRACTICE VOLUME'
    file_no = 'FILE NO. 01' if book == 'theory' else 'FILE NO. 02'
    body = []
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;">')
    body.append('<div style="position:absolute;left:0;top:0;width:794px;height:70px;box-sizing:border-box;background:%s;"></div>' % main)
    body.append("<div style=\"position:absolute;left:0;top:0;width:794px;height:70px;line-height:70px;text-align:center;font-family:%s;font-weight:600;font-size:20px;color:#EFE6D8;letter-spacing:12px;\">%s</div>" % (EN_SANS, tag))
    body.append("<div style=\"position:absolute;left:0;top:316px;width:794px;text-align:center;font-family:%s;font-weight:700;font-size:68px;color:#2B2B2B;letter-spacing:10px;\">英语认知句法</div>" % SERIF)
    body.append('<div style="position:absolute;left:357px;top:452px;width:80px;height:2px;box-sizing:border-box;background:%s;"></div>' % accent)
    body.append("<div style=\"position:absolute;left:0;top:498px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:15px;color:%s;letter-spacing:6px;\">COGNITIVE ENGLISH SYNTAX</div>" % (EN_SANS, main))
    body.append("<div style=\"position:absolute;left:0;top:560px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:26px;color:%s;letter-spacing:12px;\">%s</div>" % (SERIF, main, vol_cn))
    body.append("<div style=\"position:absolute;left:0;top:1000px;width:794px;text-align:center;font-family:%s;font-weight:400;font-size:13px;color:%s;letter-spacing:4px;\">%s · VOL. %s · 2026</div>" % (EN_SANS, main, file_no, vol_en))
    body.append('<div style="position:absolute;left:628px;top:884px;width:100px;height:100px;box-sizing:border-box;border:2.5px solid %s;border-radius:50%%;">'
                '<div style="position:absolute;left:0;top:28px;width:100px;text-align:center;font-family:%s;font-weight:600;font-size:18px;color:%s;letter-spacing:3px;">%s</div></div>' % (accent, SERIF, accent, seal))
    body.append('</div>')
    return doc(w, 1123, '英语认知句法 %s · 前封面（A4 单页）· 档案标本' % vol_cn, '\n'.join(body), bg_css(bg, '#EFE6D8'))

# ---- content ----
brief1_t = '本书以认知语言学与构式语法为理论框架，系统讲解英语句法体系的形成机制、组合规则与使用情境。'
brief1_p = '本书为《英语认知句法·理论全书》配套练习册，516道分层题目配完整作答区，供课堂精讲与自学自测使用。'
brief2_t = '以认知语法与构式语法为主线，逐层讲解英语句法体系的构成机制、组合规则与使用情境，兼顾理论体系与教学应用。'
brief2_p = '与《英语认知句法·理论全书》配套的分层练习册，覆盖句法核心板块，516道题目与完整作答区用于巩固与自测。'
brief3_t = '以认知语言学与构式语法为框架的英语句法教程，系统讲解句法体系的形成机制、组合规则与使用情境，供课堂精讲与自学使用。'
brief3_p = '《英语认知句法》配套练习册，516道分层题目与完整作答区，覆盖句法核心板块，用于课堂练习与自学自测。'

files = []
# Set1 ink-paper
files.append(('01_东方文心_理论_三面展开.html', set1_spread('theory', 1633, 45, BG['s1_theory'], '#2E424D', '#55707C', brief1_t, '认知')))
files.append(('01_东方文心_练习_三面展开.html', set1_spread('practice', 1637, 49, BG['s1_practice'], '#7A3B2E', '#A5684F', brief1_p, '句法')))
files.append(('01_东方文心_理论_前封A4.html', set1_front('theory', 794, BG['s1_theory'], '#2E424D', '#55707C', '认知')))
files.append(('01_东方文心_练习_前封A4.html', set1_front('practice', 794, BG['s1_practice'], '#7A3B2E', '#A5684F', '句法')))
# Set2 swiss
files.append(('02_瑞士编辑_理论_三面展开.html', set2_spread('theory', 1633, 45, BG['s2_theory'], '#1D3557', '#D62828', brief2_t)))
files.append(('02_瑞士编辑_练习_三面展开.html', set2_spread('practice', 1637, 49, BG['s2_practice'], '#1F4A3D', '#D62828', brief2_p)))
files.append(('02_瑞士编辑_理论_前封A4.html', set2_front('theory', 794, BG['s2_theory'], '#1D3557', '#D62828')))
files.append(('02_瑞士编辑_练习_前封A4.html', set2_front('practice', 794, BG['s2_practice'], '#1F4A3D', '#D62828')))
# Set3 archive
files.append(('03_档案标本_理论_三面展开.html', set3_spread('theory', 1633, 45, BG['s3_theory'], '#3D4466', '#9E2B25', brief3_t, '认知', 'THEORY')))
files.append(('03_档案标本_练习_三面展开.html', set3_spread('practice', 1637, 49, BG['s3_practice'], '#4A5D4A', '#9E2B25', brief3_p, '句法', 'PRACTICE')))
files.append(('03_档案标本_理论_前封A4.html', set3_front('theory', 794, BG['s3_theory'], '#3D4466', '#9E2B25', '认知', 'THEORY')))
files.append(('03_档案标本_练习_前封A4.html', set3_front('practice', 794, BG['s3_practice'], '#4A5D4A', '#9E2B25', '句法', 'PRACTICE')))

for name, html in files:
    io.open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n').write(html)
print('generated %d files -> %s' % (len(files), OUT))
