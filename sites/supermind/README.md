# SuperMind 帮助文档（站点）

同花顺 [SuperMind](https://quant.10jqka.com.cn) 量化投资交易平台官方帮助中心的网页版。
使用 VitePress + **`@vue/theme`**（cn.vuejs.org 本体所用的 Vue 官方文档主题）构建，
与同仓库的 `sites/ifind` 站点共用同一套主题与构建配置。

## 开始使用

```bash
npm install               # 在仓库根执行一次，装齐所有站点依赖
npm run docs:dev:supermind     # 本地预览（热更新）
npm run docs:build:supermind   # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview:supermind # 预览构建产物
```

也可以在本目录内直接执行 `npm run docs:dev` / `docs:build` / `docs:preview`。

## 内容来源与转换

内容取自同花顺官方帮助中心 `https://quant.10jqka.com.cn/view/help/8`。

该页面把每篇文档的**原始 Markdown** 内嵌在 `<script id="__NUXT_DATA__">` 的 Nuxt
payload 里，七个帮助页（`/view/help/{3,4,8,10,12,14,16}`）返回同一份文档集，共 10 篇、
约 46 万字符。因此转换**不做 HTML→Markdown 反解析**（那会引入转换笔误），只做结构化
抽取、分页、站内链接重写；正文文字、代码块、表格、图片全部原样保留。

两个脚本（`source/` 目录，一次性工具，保留用于溯源与内容更新）：

| 脚本 | 作用 |
| --- | --- |
| `convert_supermind.py` | 抓取（带本地缓存）→ 抽取 → 分页 → 链接改写 → 写出 `docs/**/*.md` 与 `.vitepress/{nav,sidebar}.json` |
| `verify_supermind.py` | 校验：锚点自检（脚本推算的锚点 vs 构建产物里真实的 `id`）+ 内容守恒（生成页与官网原文逐行比对） |

内容更新时重跑：

```bash
python source/convert_supermind.py
npm run docs:build
python source/verify_supermind.py docs/.vitepress/dist
```

`verify_supermind.py` 会打印三项指标，**正常结果**是：

```
[锚点] 页内标题 1189 个，缺页 0，渲染 id 不匹配 0
[内容] 源行 8012 / 生成行 8152；源中出现、生成中未出现的长行 0
```

「未解析锚点 0 处」同样是正常输出（转换时会打印）。

### 分页规则

- 文档 H1 之后的文首内容（封面 + 目录）单独成页，标题用文档名。这是唯一不受单页上限
  约束的页——它本身是整篇文档的目录，条目就是到各页的链接，拆开会让目录失去意义。
- 正文每个 `##` 一节，一节一页；节内标题层级不变（页面标题占 `#`）。
- 单节正文超过 25000 字符时下探到 `###` 拆成多页（仍超过则到 `####`）。
- 页内非标题行不动，标题整体上移一级，保证层级连续。

### 转换时处理的官网原文问题

官网原文有几处会导致构建失败或渲染异常，转换脚本按最小改动处理，均在代码注释中说明：

1. **越权标题**：正文里有 Python 模板字符串以注释形式包含 `# 股票策略模版`、`## 开盘时运行函数`
   等行，以及 5 处大段 `<!-- -->` 注释块。这些行不是真标题，标题扫描一律跳过围栏代码块
   与 HTML 注释（用等长空白屏蔽，保持字符偏移不变，分页切片才不会错位）。
2. **空目标链接**：`[`future_account`]()`、`![]()` 渲染后是 `href=""` / `src=""`，
   VitePress 判为指向 `./index` 的死链。处理：链接保留可见文本、去掉空链接；空图片删除。
3. **未知语言围栏**：一处 ```` ```tips ````，VitePress 不认识该语言并每次构建告警后回落
   `txt`。显式改为 `text`，渲染结果一致且消除告警。
4. **站内链接**：`#锚点` 与 `/view/help/N#锚点` 统一改写为站点内路径。锚点算法与
   VitePress（`@mdit-vue/shared`）逐字符等价——注意 `handle_bar` 这类词内下划线按
   CommonMark 规则保留，不能当强调标记删掉。
5. **数学公式**：正文含 LaTeX（`$$...$$`、行内 `$...$`）。本站 config 开启 `math: true`
   （需 `markdown-it-mathjax3`）。若关闭，公式里的 `{{ W^p }}` 会被 Vue 当成插值表达式
   导致构建报错。

## 目录结构

```
sites/supermind/
├─ package.json              站点包（依赖 @doc/theme 工作区包 + markdown-it-mathjax3）
├─ source/
│  ├─ convert_supermind.py   内容转换脚本
│  ├─ verify_supermind.py    锚点与内容校验脚本
│  ├─ help-8.html            官网帮助页原始 HTML（抓取缓存，转换与校验的对照物）
│  └─ SuperMind.py           同花顺 SuperMind「因子检测」策略模板脚本（原始素材）
└─ docs/
   ├─ index.md               首页（page: true + 共享 Home 组件，数据在本文件内）
   ├─ guide/                 因子研究、回测引擎、常见问题、智能交易、AI Lab、other
   ├─ guide/other/           本地SDK、模拟仿真、研究环境/实盘、因子数据产品（合并为一类「其他」）
   ├─ reference/             API 文档
   └─ .vitepress/
      ├─ config.mts          站点配置（只写本站身份数据，其余调用 createSiteConfig）
      ├─ theme/index.ts      主题入口（一行：createTheme({ title })）
      ├─ nav.json            导航（由转换脚本按官网帮助菜单顺序生成）
      └─ sidebar.json        侧边栏（分组由转换脚本生成）
```

导航与侧边栏由 `convert_supermind.py` 生成，**不要手改** `nav.json` / `sidebar.json`：
重跑脚本会覆盖。要调整结构，改脚本里的 `DOC_LAYOUT`、`SIDEBAR_GROUPS`、`MERGED_DIR`。

### 板块合并

「模拟仿真」「研究环境/实盘」「本地SDK」「因子数据产品」原来各占一个板块，现合并为一类
**「其他」**：四篇文档共用输出目录 `guide/other/`（URL 为 `/guide/other/*`），导航里只有
一个「其他」入口，侧边栏里保留四个子分组（`SIDEBAR_GROUPS` 决定分组与顺序）。

注意 `@vue/theme` 的侧边栏**只有两级**（分组标题 + 平铺链接，`VPSidebarGroup` 不支持再
嵌套），所以四个子分组是「同一目录键下的四个分组」，而不是「其他 ▸ 子分组 ▸ 页面」的
三层树——写三层会渲染成无 `href` 的假链接，页面全部丢失。

## 与 iFinD 站点的关系

两站共用共享层 `packages/theme`：同一个 `@vue/theme`、同样的代码块高亮、同样的配色与
`--vp-*` 变量补齐、同样的离线本地搜索、同样的表格与打印样式。差异只有站点身份数据
（标题、描述、导航、侧边栏、页脚、首页文案）与一处 `math: true`。

共享层的 4 处必要适配与改动禁忌见仓库根 `README.md`。
