"""
SuperMind 帮助站点内容转换（一次性工具，产物已提交；保留用于溯源与二次转换）。

来源：https://quant.10jqka.com.cn/view/help/8
官网把每篇文档的**原始 Markdown** 内嵌在 `<script id="__NUXT_DATA__">` 的 Nuxt
payload 中：七个帮助页（/view/help/{3,4,8,10,12,14,16}）返回同一份文档集，共 10 篇。
因此本脚本不做 HTML→Markdown 转换（那会引入转换笔误），只做结构化抽取、分页、
站内链接重写，并同步产出 nav.json / sidebar.json。

分页规则
- 文档 H1 之后的文首内容（封面 / 目录）单独成页，标题用文档名。
- 正文每个 h2 一节，一节一页；节内标题层级不变（页面标题占 h1）。
- 单节正文超过 SPLIT_MAX 时下探到 h3 拆成多页（仍超过则到 h4），避免单页过大。

围栏代码块内的 `#` 行是代码不是标题（官网正文里就有 Python 模板字符串以 `# 注释`
开头、甚至含 `## 开盘时运行函数`），因此所有标题相关的扫描都跳过围栏区间。

标题层级：页面标题写入 frontmatter 并在正文首行以 `#` 呈现（与 iFinD 站点一致），
页内其余标题整体上移一级，保证层级连续。

锚点：与 VitePress（@mdit-vue/shared）的 slugify 逐字符等价，并按页内重复标题
追加 -1/-2 后缀；`#锚点` 与 `/view/help/N#锚点` 链接统一改写为站点内路径。

用法：python convert_supermind.py
"""

import json
import re
import unicodedata
from collections import OrderedDict
from pathlib import Path
from urllib.parse import unquote
from urllib.request import urlopen

SOURCE_URL = 'https://quant.10jqka.com.cn/view/help/8'
SPLIT_MAX = 25000      # 单页正文上限，超过则下探一级标题

# 文档 → 输出目录；目录决定 URL 前缀与分区。
# 「模拟仿真」「研究环境/实盘」「本地SDK」「因子数据产品」四篇合并为一类「其他」，
# 共用同一输出目录（侧边栏仍按原来的四个子分组呈现，见 _write_nav、SIDEBAR_GROUPS）。
MERGED_DIR = 'guide/other'
MERGED_GROUP_TEXT = '其他'

DOC_LAYOUT = {
    '本地SDK': 'guide/other',
    'API 文档': 'reference/api',
    '因子研究': 'guide/factor-research',
    '回测引擎': 'guide/backtest-engine',
    '模拟仿真': 'guide/other',
    '研究环境/实盘': 'guide/other',
    '常见问题': 'guide/faq',
    '智能交易在线文档': 'guide/smart-trading',
    'AI Lab': 'guide/ai-lab',
    '因子数据产品': 'guide/other',
}

# 合并目录下的侧边栏子分组：(文档名, 组标题)。列表顺序即展示顺序。
SIDEBAR_GROUPS = [
    ('模拟仿真', '模拟仿真'),
    ('研究环境/实盘', '研究环境/实盘'),
    ('本地SDK', '本地SDK'),
    ('因子数据产品', '因子数据产品'),
]

# 导航项显示名（与侧边栏分组名不同的少数几处）
NAV_TEXT = {'智能交易在线文档': '智能交易'}

# 官网帮助页编号 → 文档（用于改写正文里的 /view/help/N 链接）
HELP_PAGE_DOC = {
    3: '本地SDK', 4: 'API 文档', 8: '因子研究', 10: '模拟仿真', 12: '回测引擎',
    14: '研究环境/实盘', 16: '常见问题', 24: 'AI Lab',
}


# --------------------------------------------------------------------------- #
# 标题扫描（跳过围栏代码块）
# --------------------------------------------------------------------------- #
def fence_free(md: str) -> str:
    """把围栏代码块与 HTML 注释（`<!-- -->`）替换为等长空白，字符偏移完全不变。

    必须等长替换：分页按偏移切片（md[last:m.start()]），长度一变正文就与标题错位。
    注释也要屏蔽：官网原文有 5 处大段 `<!-- -->`，VitePress 视其为 html_block
    不产出标题，其中的 `####` 不能算作真实标题。
    """
    lines = md.split('\n')
    out, in_fence, in_comment = [], False, False
    for line in lines:
        stripped = line.lstrip()
        if in_comment:
            out.append(' ' * len(line))
            if '-->' in line:
                in_comment = False
            continue
        if stripped.startswith('<!--'):
            out.append(' ' * len(line))
            if '-->' not in line:
                in_comment = True
            continue
        if stripped.startswith('```'):
            in_fence = not in_fence
            out.append(' ' * len(line))
            continue
        out.append(' ' * len(line) if in_fence else line)
    return '\n'.join(out)


def heading_matches(md: str, level: int):
    """返回正文（跳过围栏）中指定层级的标题匹配列表。"""
    pattern = re.compile(r'^#{' + str(level) + r'} (.+?)\s*$', re.M)
    return list(pattern.finditer(fence_free(md)))


# --------------------------------------------------------------------------- #
# 与 VitePress slugify 等价（dist/node/chunk-*.js 中的实现）
# --------------------------------------------------------------------------- #
R_CONTROL = re.compile(r'[\u0000-\u001f]')
R_COMBINING = re.compile(r'[\u0300-\u036F]')
R_SPECIAL = re.compile(r"""[\s~`!@#$%^&*()\-_+=\[\]{}|\\;:"'\u201c\u201d\u2018\u2019<>,.?/]+""")


def slugify(text: str) -> str:
    s = unicodedata.normalize('NFKD', text)
    s = R_COMBINING.sub('', s)
    s = R_CONTROL.sub('', s)
    s = R_SPECIAL.sub('-', s)
    s = re.sub(r'-{2,}', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    s = re.sub(r'^(\d)', r'_\1', s)
    return s.lower()


R_MD_LINK = re.compile(r'\[([^\]]*)\]\([^)]*\)')
R_MD_IMAGE = re.compile(r'!\[[^\]]*\]\([^)]*\)')
R_HTML_TAG = re.compile(r'<[^>]+>')
# 成对强调标记（**、__）与行内代码反引号：渲染后不可见
R_STRONG = re.compile(r'\*\*|__')
R_CODE_TICK = re.compile(r'`')
# 单个 * 或 _ 只在词边界处才是强调标记；`handle_bar` 这类词内下划线按 CommonMark
# 规则不构成强调，必须保留（否则 slug 与 VitePress 生成的不一致）。
R_EMPH_BOUNDARY = re.compile(r'(?:(?<=[\s(\[{/])|^)[*_](?=\S)|(?<=\S)[*_](?=$|[\s)\]}.,;:!?/])')


def heading_text(raw: str) -> str:
    """标题的可见文本（等价于渲染后的纯文本），用于计算锚点。"""
    s = R_MD_IMAGE.sub('', raw)
    s = R_MD_LINK.sub(r'\1', s)
    s = R_HTML_TAG.sub('', s)
    s = R_STRONG.sub('', s)
    s = R_CODE_TICK.sub('', s)
    s = R_EMPH_BOUNDARY.sub('', s)
    return s.strip()


def heading_slugs(body: str):
    """按 VitePress 规则列出页内标题锚点（重复标题加 -1/-2 后缀）。"""
    out, seen = [], {}
    pattern = re.compile(r'^(#{1,6}) (.+?)\s*$', re.M)
    for m in pattern.finditer(fence_free(body)):
        base = slugify(heading_text(m.group(2)))
        key = base + (f'-{seen[base]}' if base in seen else '')
        seen[base] = seen.get(base, 0) + 1
        out.append(key)
    return out


# --------------------------------------------------------------------------- #
# 抽取
# --------------------------------------------------------------------------- #
def fetch(source_dir: Path) -> str:
    source_dir.mkdir(parents=True, exist_ok=True)
    cached = source_dir / 'help-8.html'
    if cached.exists():
        return cached.read_text(encoding='utf-8')
    text = urlopen(SOURCE_URL, timeout=120).read().decode('utf-8')
    cached.write_text(text, encoding='utf-8')
    return text


def load_docs(html: str):
    m = re.search(
        r'<script type="application/json" id="__NUXT_DATA__"[^>]*>(.*?)</script>',
        html, re.S)
    if not m:
        raise SystemExit('未找到 __NUXT_DATA__ payload；官网结构可能已变化')
    payload = json.loads(m.group(1))
    docs = {}
    for _, ref in payload[2].items():
        entries = payload[ref]
        if not isinstance(entries, list) or not entries:
            continue
        for idx in entries:
            node = payload[idx]
            if not isinstance(node, dict) or 'content' not in node:
                continue
            docs[payload[node['title']]] = {
                'order': payload[node['order']],
                'content': payload[node['content']],
            }
    return OrderedDict(sorted(docs.items(), key=lambda kv: kv[1]['order']))


# --------------------------------------------------------------------------- #
# 分页
# --------------------------------------------------------------------------- #
def split_by(md: str, level: int):
    """按指定层级标题切分（跳过围栏与注释），返回 [(标题, 正文)]。

    标题之前的文首内容以 (None, 前言) 返回；**必须保留**，否则像
    「回测引擎专用API」这种 h2 前言（七种 API 类型清单）会在下探到 h3 时丢失。
    """
    out, last, last_title = [], 0, None
    for m in heading_matches(md, level):
        # 首个匹配若不在文首，说明前面有前言，先落一条
        if last_title is not None or m.start() > 0:
            out.append((last_title, md[last:m.start()]))
        last, last_title = m.start(), m.group(1)
    out.append((last_title, md[last:]))
    return out


def strip_heading(md: str, level: int) -> str:
    """去掉正文开头的标题行（该标题已成为页面标题）。"""
    m = heading_matches(md, level)
    if m and m[0].start() == 0:
        return md[m[0].end():].strip('\n')
    return md.strip('\n')


def plan_pages(content: str):
    """返回 [(页面标题, 正文, 源标题层级)]；正文已去掉首个标题行。"""
    h2s = split_by(content, 2)
    preamble = h2s[0][1] if h2s[0][0] is None else ''
    pages = []

    def add(title, body, level):
        body = body.strip('\n')
        if body.strip():          # 只剩标题行、无正文的块不单独成页
            pages.append((title, body, level))

    if preamble.strip():
        # 文档 H1 之后的文首内容（封面 + 目录），标题用文档名，单独成页。
        # 这是唯一不受 SPLIT_MAX 约束的页：它是整篇文档的目录，条目本身就是
        # 到各页的链接，拆开会让目录失去意义（智能交易一篇的目录约 3.4 万字符）。
        add(None, strip_heading(preamble, 1), 1)

    for h2, body in [(h, b) for h, b in h2s if h]:
        if len(body) <= SPLIT_MAX:
            add(h2, strip_heading(body, 2), 2)
            continue
        h3s = split_by(body, 3)
        # h2 前言（本节开头、首个 h3 之前的内容，如「回测引擎专用API」下的
        # 七种 API 类型清单）单独成页，标题用 h2 名：并入首个子页会让页面标题
        # 与页内 `##` 标题重复，单独成页则保住层级语义。
        head = strip_heading(h3s[0][1], 2) if h3s[0][0] is None else ''
        if head.strip():
            add(h2, head, 2)
        for h3, sub in [(h, b) for h, b in h3s if h]:
            if len(sub) <= SPLIT_MAX:
                add(h3, strip_heading(sub, 3), 3)
                continue
            h4s = split_by(sub, 4)
            pre = strip_heading(h4s[0][1], 3) if h4s[0][0] is None else ''
            if pre.strip():
                add(h3, pre, 3)
            for h4, s4 in [(h, b) for h, b in h4s if h]:
                add(h4, strip_heading(s4, 4), 4)
    return pages


def shift_headings(body: str, levels: int) -> str:
    """页内标题整体上移 levels 级（页面标题已占用 h1）；围栏与注释内不动。"""
    lines, in_fence, in_comment = [], False, False
    for line in body.split('\n'):
        stripped = line.lstrip()
        if in_comment:
            lines.append(line)
            in_comment = '-->' not in line
            continue
        if stripped.startswith('<!--'):
            lines.append(line)
            in_comment = '-->' not in line
            continue
        if stripped.startswith('```'):
            in_fence = not in_fence
            lines.append(line)
            continue
        if in_fence:
            lines.append(line)
            continue
        m = re.match(r'^(#{1,6}) (.+?)\s*$', line)
        lines.append('#' * max(2, len(m.group(1)) - levels) + ' ' + m.group(2) if m else line)
    return '\n'.join(lines)


def file_slug(title: str) -> str:
    """中文标题转拼音，保证 URL 为 ASCII（VitePress 生成的链接可直接复制）。"""
    from pypinyin import lazy_pinyin
    raw = '-'.join(lazy_pinyin(heading_text(title)))
    slug = re.sub(r'[^a-z0-9]+', '-', raw.lower()).strip('-')
    return slug or 'page'


# --------------------------------------------------------------------------- #
# 链接重写
# --------------------------------------------------------------------------- #
R_BARE_ANCHOR = re.compile(r'\]\(#(?P<frag>[^)\s]*)(?P<post>[^)]*\))')
R_HELP_LINK = re.compile(
    r'(?P<pre>\]\()(?:(?:https?://quant\.10jqka\.com\.cn)?/view/help/(?P<num>\d+))#'
    r'(?P<frag>[^)\s]*)(?P<post>(?:\s+"[^"]*")?\))')
R_HELP_PAGE = re.compile(
    r'(?P<pre>\]\()https?://quant\.10jqka\.com\.cn/view/help/(?P<num>\d+)/?(?P<post>)')

# 官网原文存在空目标的链接与图片（`[`future_account`]()`、`![]()`），
# 渲染后分别变成 href="" 与 src=""，VitePress 会判成指向 ./index 的死链。
# 处理：链接保留可见文本、去掉空链接；空图片本就无内容可显示，直接删除。
R_EMPTY_IMAGE = re.compile(r'!\[[^\]]*\]\(\)')
R_EMPTY_LINK = re.compile(r'\[([^\]]*)\]\(\)')

# 官网原文有一处 ```tips 围栏，VitePress 不认识该语言（每次构建都告警后回落 txt）。
# 这里显式改为 text：渲染结果与回落完全一致，同时消除构建告警。
R_TIPS_FENCE = re.compile(r'^```tips\s*$', re.M)


def rewrite_links(md: str, anchor_map, doc_first_page: dict, current_path: str):
    """站内锚点 / 官网帮助页链接 → 站点内路径。返回 (新正文, 未解析锚点列表)。

    围栏代码块内容不参与改写（官网正文里有代码示例包含 markdown 链接语法）。
    """
    unresolved = []
    lines, in_fence, out = md.split('\n'), False, []

    for line in lines:
        if line.lstrip().startswith('```'):
            in_fence = not in_fence
            out.append(R_TIPS_FENCE.sub('```text', line))
            continue
        out.append(line if in_fence else _rewrite_line(line, anchor_map, doc_first_page,
                                                       current_path, unresolved))
    return '\n'.join(out), unresolved


def _rewrite_line(line: str, anchor_map, doc_first_page: dict, current_path: str, unresolved):
    def sub_help_anchor(m):
        frag = slugify(unquote(m.group('frag')))
        target = anchor_map.get(frag) or doc_first_page.get(int(m.group('num')))
        if not target:
            unresolved.append(m.group('frag'))
            return m.group(0)
        return f"{m.group('pre')}{target}#{frag}{m.group('post')}"

    def sub_help_page(m):
        target = doc_first_page.get(int(m.group('num')))
        return m.group('pre') + target + m.group('post') if target else m.group(0)

    def sub_bare(m):
        frag = slugify(unquote(m.group('frag')))
        target = anchor_map.get(frag)
        if not target:
            unresolved.append(m.group('frag'))
            return m.group(0)
        local = '#' + frag if target == current_path else f'{target}#{frag}'
        return f']({local}{m.group("post")}'

    line = R_HELP_LINK.sub(sub_help_anchor, line)
    line = R_HELP_PAGE.sub(sub_help_page, line)
    line = R_BARE_ANCHOR.sub(sub_bare, line)
    line = R_EMPTY_IMAGE.sub('', line)
    return R_EMPTY_LINK.sub(r'\1', line)


# --------------------------------------------------------------------------- #
# 输出
# --------------------------------------------------------------------------- #
def build_plan(docs):
    """定页、定路径。返回 [(文档名, 输出目录, [页面])]。

    文件名去重按**输出目录**做（不是按文档）：合并到同一目录的多篇文档共用
    命名空间，否则会出现两个同名文件互相覆盖。
    """
    planned, doc_first_page = [], {}
    used_by_dir = {}
    for doc_title, doc in docs.items():
        out_dir = DOC_LAYOUT[doc_title]
        used = used_by_dir.setdefault(out_dir, set())
        pages = []
        for title, body, level in plan_pages(doc['content']):
            name = doc_title if title is None else title
            base = 'index' if title is None else file_slug(name)
            slug, n = base, 2
            while slug in used:
                slug, n = f'{base}-{n}', n + 1
            used.add(slug)
            pages.append({'dir': out_dir, 'file': slug, 'title': name,
                          # 上移 (level-1) 级，使每个页面的页内标题都从 ## 起，
                          # 页面标题占 #。VitePress 大纲只收 level 2..4，若某页
                          # 从 ### 起（由 h3/h4 拆出的页），大纲会是空的。
                          'body': shift_headings(body, max(0, level - 1)),
                          'doc': doc_title, 'path': f'/{out_dir}/{slug}'})
        doc_first_page[doc_title] = pages[0]['path']
        planned.append((doc_title, out_dir, pages))
    return planned, doc_first_page


def build_anchor_map(planned):
    anchor_map = {}
    for _, _, pages in planned:
        for p in pages:
            for slug in heading_slugs(p['body']):
                anchor_map.setdefault(slug, p['path'])
            anchor_map.setdefault(slugify(p['title']), p['path'])
    return anchor_map


def main():
    root = Path(__file__).resolve().parents[1]          # sites/supermind
    source_dir, docs_dir = root / 'source', root / 'docs'

    docs = load_docs(fetch(source_dir))
    print(f'抽取到 {len(docs)} 篇文档，共 {sum(len(d["content"]) for d in docs.values())} 字符')

    planned, doc_first_page = build_plan(docs)
    anchor_map = build_anchor_map(planned)
    num_first = {n: doc_first_page[t] for n, t in HELP_PAGE_DOC.items() if t in doc_first_page}

    unresolved_all, written = [], []
    for doc_title, out_dir, pages in planned:
        target = docs_dir / out_dir
        target.mkdir(parents=True, exist_ok=True)
        for p in pages:
            body, unresolved = rewrite_links(p['body'], anchor_map, num_first, p['path'])
            unresolved_all += [(p['path'], u) for u in unresolved]
            text = (f'---\ntitle: {json.dumps(p["title"], ensure_ascii=False)}\n---\n\n'
                    f'# {p["title"]}\n{body.strip()}\n')
            (target / f'{p["file"]}.md').write_text(text, encoding='utf-8')
            written.append((p, body))

    print(f'写出 {len(written)} 页，未解析锚点 {len(unresolved_all)} 处')
    for path, frag in unresolved_all[:25]:
        print('  未解析:', path, '#', frag)

    _write_nav(planned, docs_dir, written)

    sizes = sorted(len(b) for _, b in written)
    print(f'单页正文 最小 {sizes[0]} / 中位 {sizes[len(sizes) // 2]} / 最大 {sizes[-1]} 字符')


def _write_nav(planned, docs_dir, written):
    """生成 nav.json 与 sidebar.json。

    导航顺序沿用官网帮助菜单；合并的四篇（模拟仿真 / 研究环境·实盘 / 本地SDK /
    因子数据产品）在导航里归为一项「其他」。

    侧边栏：@vue/theme 的侧边栏只有**两级**（分组标题 + 平铺链接，VPSidebarGroup
    只渲染 items 里的 link，不支持再嵌套），所以四个子分组以「同一目录键下的四个
    分组」呈现——进入 /guide/other/ 任一面都能看到这四组，组标题即子分组名。
    """
    children = {}
    for p, body in written:
        children[p['path']] = [
            {'text': m.group(1).strip(),
             'link': f"{p['path']}#{slug}"
             if (slug := slugify(heading_text(m.group(1)))) else p['path']}
            for m in heading_matches(body, 2)
        ]

    def items_of(pages):
        out = []
        for p in pages:
            item = {'text': p['title'], 'link': p['path']}
            if children[p['path']]:
                item['items'] = children[p['path']]
                item['collapsed'] = True
            out.append(item)
        return out

    by_doc = {doc: pages for doc, _, pages in planned}
    merged = [d for d, _ in SIDEBAR_GROUPS]

    # 合并目录：四个子分组同挂在一个目录键下
    sidebar = {
        f'/{MERGED_DIR}/': [{'text': t, 'items': items_of(by_doc[d])}
                            for d, t in SIDEBAR_GROUPS]
    }
    for doc_title, out_dir, pages in planned:
        if doc_title in merged:
            continue
        sidebar[f'/{out_dir}/'] = [{'text': doc_title, 'items': items_of(pages)}]

    # 导航：合并四篇取首个子分组首页作为入口，位置在「回测引擎」之后（沿用官网菜单顺序）
    nav = []
    for doc_title, out_dir, pages in planned:
        if doc_title in merged:
            continue
        nav.append({'text': NAV_TEXT.get(doc_title, doc_title),
                    'link': pages[0]['path'], 'activeMatch': '^/' + out_dir + '/'})
        if doc_title == '回测引擎':
            nav.append({'text': MERGED_GROUP_TEXT,
                        'link': by_doc[SIDEBAR_GROUPS[0][0]][0]['path'],
                        'activeMatch': '^/' + MERGED_DIR + '/'})

    cfg_dir = docs_dir / '.vitepress'
    cfg_dir.mkdir(parents=True, exist_ok=True)
    (cfg_dir / 'nav.json').write_text(json.dumps(nav, ensure_ascii=False, indent=2) + '\n',
                                      encoding='utf-8')
    (cfg_dir / 'sidebar.json').write_text(json.dumps(sidebar, ensure_ascii=False, indent=2) + '\n',
                                          encoding='utf-8')
    print(f'导航 {len(nav)} 项（含合并项「{MERGED_GROUP_TEXT}」），'
          f'侧边栏 {len(sidebar)} 个目录键 / {len(written)} 页')


if __name__ == '__main__':
    main()
