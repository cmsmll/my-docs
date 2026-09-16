"""
SuperMind 文档集校验（一次性工具）。

做两件事：
1. 内容守恒：把生成页的正文与官网原始 Markdown 逐行比对（忽略围栏代码块内的
   标题伪装、链接改写、标题层级上移），确保没有截断或丢失内容。
2. 锚点自检：把转换脚本推算的锚点与 VitePress 实际渲染出的 `id` 集合逐页比对，
   两者必须一致——这是「站内链接与侧边栏锚点都能跳对位置」的证据。

用法：python source/verify_supermind.py <dist 目录>
（dist 为整站构建产物目录，如 docs/.vitepress/dist）
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import convert_supermind as C  # noqa: E402


def rendered_ids(dist: Path):
    out = {}
    for f in dist.rglob('*.html'):
        rel = f.relative_to(dist).with_suffix('').as_posix()
        html = f.read_text(encoding='utf-8', errors='replace')
        out['/' + rel] = set(re.findall(r'<h[1-6][^>]*\sid="([^"]*)"', html))
    return out


def main(dist_dir: Path):
    docs = C.load_docs(C.fetch(Path(__file__).resolve().parent))  # 原始素材与脚本同处 source/
    planned, _ = C.build_plan(docs)
    anchor_map = C.build_anchor_map(planned)

    # --- 1. 锚点自检 ------------------------------------------------------ #
    actual = rendered_ids(dist_dir)
    missing_page, missing_anchor, checked = [], [], 0
    for _, _, pages in planned:
        for p in pages:
            if p['path'] not in actual:
                missing_page.append(p['path'])
                continue
            for slug in C.heading_slugs(p['body']) + [C.slugify(p['title'])]:
                checked += 1
                if slug not in actual[p['path']]:
                    missing_anchor.append((p['path'], slug))
    print(f'[锚点] 页内标题 {checked} 个，缺页 {len(missing_page)}，'
          f'渲染 id 不匹配 {len(missing_anchor)}')
    for m in missing_anchor[:15]:
        print('   不匹配:', m)

    # --- 2. 内容守恒 ------------------------------------------------------ #
    src = '\n'.join(d['content'] for d in docs.values())
    # 只比对本文档集自己的内容：整站现含多个文档集（docs/<collection>/），
    # 若从 docs/ 起扫会把 iFinD 的正文也算进「生成物」，产生大量假丢失。
    md_root = Path(__file__).resolve().parents[1] / 'docs' / C.COLLECTION
    gen = '\n'.join(f.read_text(encoding='utf-8')
                    for f in sorted(md_root.rglob('*.md'))
                    if '.vitepress' not in f.parts)
    src_lines = {ln for ln in norm_lines(src)}
    gen_lines = {ln for ln in norm_lines(gen)}
    lost = sorted(l for l in src_lines - gen_lines if len(l) > 20)
    print(f'[内容] 源行 {len(src_lines)} / 生成行 {len(gen_lines)}；'
          f'源中出现、生成中未出现的长行 {len(lost)}')
    for l in lost[:10]:
        print('   丢失:', l[:100])


def norm_lines(text: str):
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.S)
    for line in text.split('\n'):
        line = re.sub(r'^#{1,6} ', '', line)
        line = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', line)
        line = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', line)
        line = re.sub(r'^\s*```.*$', '', line)
        line = re.sub(r'\s+', '', line)
        if line:
            yield line


if __name__ == '__main__':
    main(Path(sys.argv[1]))
