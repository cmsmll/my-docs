# 文档中心

汇总各产品官方文档的**单站点**，使用 VitePress + `@vue/theme`（[cn.vuejs.org](https://cn.vuejs.org/guide/introduction.html) 本体所用的 Vue 官方文档主题）构建。

路由分两级：

| 路径 | 内容 |
| --- | --- |
| `/` | 文档列表（选择要阅读的文档集） |
| `/ifind/` | iFinD HTTP API 用户手册（22 页） |
| `/supermind/` | SuperMind 帮助文档（118 页） |

新增文档集只需加内容目录 + 在 `docs/.vitepress/docs-registry.ts` 里加一条记录，
文档列表、该文档集的 header 与搜索范围都会自动生效（首页 header 的菜单已由 CSS 隐藏，
详见下文「首页 header 的三栏布局」）。

header 与搜索范围按文档集隔离：文档集页面显示自己的 header，搜索也只搜自身；
首页可**搜到所有文档**，但其 header 是三栏（品牌 / 居中搜索框 / 主题按钮），
不显示文档集入口——入口在页面正文的文档列表里。

本工作区不绑定特定厂商：产品信息与所属厂商由各文档集自身声明。

## 开始使用

```bash
git checkout dev     # 日常工作分支（main 为发布线）
npm install          # 首次
npm run docs:dev     # 本地预览（热更新）
npm run docs:build   # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物
```

分支：远程 `origin`（`cmsmll/my-docs`）有 `main` 与 `dev` 两个分支，`dev` 长期保留。
日常改动提交到 `dev`；`main` 与 `dev` 各自成线，把 `dev` 合并到 `main` 时用
`git merge --no-ff dev` 生成合并提交（**不要**用 `--ff-only` 快进，否则两者会变成一条直线、
失去分叉）。推送由仓库维护者手动执行。

## 目录结构

```
document/
├─ package.json              单站点工程（vitepress + @vue/theme + markdown-it-mathjax3）
├─ .gitattributes            换行符规范（默认 LF，Windows 脚本 CRLF）
├─ .gitignore
├─ .omp/AGENTS.md            AI 与会话规范（自动加载）
├─ task.md                   本地任务文件（临时，不入 git）
├─ source/                   原始素材与内容流水线脚本（非发布内容）
│  ├─ ifind-manual.html          iFinD 官方手册 HTML（内容校验对照物）
│  ├─ supermind-help-8.html      官网帮助页原始 HTML（抓取缓存）
│  ├─ SuperMind.py               因子检测策略模板（原始素材）
│  ├─ convert_supermind.py       SuperMind 内容转换脚本
│  └─ verify_supermind.py        内容与锚点校验脚本
└─ docs/
   ├─ index.md              根首页 = 文档列表（由 docs-registry.ts 驱动）
   ├─ ifind/                文档集一（/ifind/）
   │  ├─ index.md           文档集首页（hero + 卡片 + 简介/版本表）
   │  ├─ guide/*.md         18 篇
   │  └─ reference/*.md     3 篇
   ├─ supermind/            文档集二（/supermind/）
   │  ├─ index.md           文档集首页
   │  ├─ guide/             100 页（含合并的 other/）
   │  └─ reference/api/     17 页
   └─ .vitepress/
      ├─ config.mts                     站点配置（含必须保留的 4 处主题适配）
      ├─ docs-registry.ts               文档集注册表（全站唯一真源）
      ├─ sidebar-supermind.json          SuperMind 侧边栏（脚本生成，勿手改）
      └─ theme/
         ├─ index.ts        主题入口（navbar-title 换站点标题、按路由挂 .doc-home）
         ├─ custom.css      补丁样式（内容宽度、--vp-* 补齐、首页 header 三栏、表格、打印）
         ├─ mergedRootSearchIndex.ts  首页「搜全部」的索引合并插件
         └─ components/
            ├─ DocList.vue  根页文档列表卡片
            ├─ Home.vue     文档集首页（数据由各集合 index.md 传入）
            └─ mergeIndexes.ts  两份本地搜索索引的合并（编号偏移重编号）
```

## 主题

使用 Vue 官方文档同款主题 `@vue/theme@2.4.0`，代码块、侧边栏、大纲、配色与 cn.vuejs.org 一致（已实测：`pre` 为 `#24292e` / 字色 `#e1e4e8`、复制按钮 40px、外边距 `28px 0` 等）。

### 必须保留的 4 处适配（删了就会坏）

原因同时写在 `config.mts` 的注释里：

1. **关闭 `markdown-it-attrs`**：手册中的 `{周期1}`、`{周期2}` 会被该插件当成 HTML 属性，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证）。用 Vite alias 把 `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索。**别名丢了会导致搜索框整个不渲染。**
3. **补齐 `--vp-*` 设计变量**：`@vue/theme` 只定义 `--vt-c-*`，VitePress 自带组件引用 `--vp-c-*` / `--vp-local-search-*`。不补会让搜索弹窗完全透明、无边框（看起来像「打不开」）。
4. **`@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10，VitePress 2 依赖 v14，两份并存，须在 `vite.ssr.noExternal` 显式声明（含 baseConfig 漏掉的 `@vueuse/shared`）。不声明会在渲染阶段报 `createRef` 导出缺失。

### 另有两处约定

- **不设 `cleanUrls`**：VitePress 2 起生成的链接已是无扩展名形式（`/ifind/guide/token`），客户端路由解析到磁盘的 `.html` 文件；产物布局仍是 `<page>.html`。
- **代码块用深色单主题**（`markdown.theme: 'github-dark'`）：与 cn.vuejs.org 相同，浅色页面下代码块也是深底。

### 内容宽度

全站可见内容的宽度由 `custom.css` 里的 CSS 变量 `--doc-layout-width`（当前 `1080px`）统一控制。
三处页面（根页、iFinD、SuperMind）的标题、描述、卡片区、简介区左右边缘完全对齐。

有一条约定：**`max-width` 一律加在带 `padding` 的外框上，不加在内部文字元素上。**

这曾经是个 bug——hero 的 `max-width` 加在标题/描述上，而卡片区/简介区加在带
`padding: 0 32px` 的外框上，同一个变量算出两个结果（1080 vs 1016），hero 比下面宽出 64px。
统一到外框后三处页面对齐。

因此「外框 1080 / 可见内容 1016」是正常的，差额就是左右各 32px 留白；想让可见内容本身为
1080，把变量改成 1144px 即可。

### header 与搜索范围

各文档集的 header 与搜索范围用 VitePress 原生 `locales` 实现（见 `config.mts` 的 `locales`）：

- 文档集页面：header 是该文档集的详细条目，搜索**只命中自身**。
- 主页（root locale）：搜索**命中全部文档**（由 `theme/mergedRootSearchIndex.ts`
  把各文档集索引合并后供给 root locale）。其 `nav` 仍定义在 `config.mts`，但首页 header 已由
  CSS 隐藏菜单（见下节），实际不可见；保留配置是为了 root locale 下其他路由仍有一致的导航。
- **首页（`/`）另有一套三栏 header**，与上面两类隔离，见下节。

两个坑已写进 `AGENTS.md` §3.4：locale 键**不能带斜杠**（否则 nav 静默变空）、
locale 里的 `themeConfig` 是**整体替换**（每个 locale 都要写全 `nav` 与 `sidebar`）。
合并索引的插件必须用 `transform` 改写（替换会跳过索引扫描，索引变空）。

### 首页 header 的三栏布局

首页 header 与两个文档集页面**完全隔离**：左品牌区（现状「文档中心」与宽度）+ 中间居中搜索框
+ 右侧仅主题切换按钮，去掉导航菜单。文档集页面 header 保持主题原样。

实现分两处，**都不改主题组件**：

1. `theme/index.ts` 按路由给最外层 `.VPApp` 挂 `.doc-home` 类（仅 `/`）。
   主题没有按页面类型加类的钩子——VitePress 2 不消费 `frontmatter.pageClass`，而主题的
   `.VPContentPage` 同时命中三个文档集首页与根页，不能当判据。
2. `custom.css` 里以 `.VPApp.doc-home` 为前缀覆写布局（**所有规则都带该前缀**，这就是隔离）。

两个关键点：

- **居中靠 grid 的等宽轨道**，不是靠 `text-align`。`.container` 改为
  `grid-template-columns: minmax(0,1fr) auto minmax(0,1fr)`，左右两轨由布局保证等宽，
  中间搜索框自然落在容器正中；主题原本的 `flex + space-between` 会让搜索框位置取决于右侧
  按钮宽度，必然偏移。为了让搜索框能单独进中间格，`.content` 设为 `display: contents`。
- **导航栏左右内边距必须对称**。主题为「左对齐品牌 + 右对齐按钮」设计，左右内边距不等
  （`24/12`、`≥768px` 时 `32/12`），会使容器中心与视口中心差 `(左-右)/2`；首页改成左右同值。

另有两处必要的纠正：品牌区加 `justify-self: start`（否则 `1fr` 轨道的格子会拉伸，左侧
1/3 全变成回首页的链接）；主题在 `<1280px` 隐藏主题按钮，首页无视该断点始终显示（否则
窄屏无法切换主题）。

### 主题能力边界

- **侧边栏只有两级**：`@vue/theme` 的 `VPSidebarGroup` 只渲染「分组标题 + 平铺链接」，不支持再嵌套。写三层会渲染成**无 `href` 的假链接、页面全部丢失**。需要多个子分组时，把它们作为**同一路径前缀下的多个 group**（参考 `/supermind/guide/other/`）。
- **大纲只收 level 2..4**：页内标题必须从 `##` 起，否则右侧「本页内容」为空。转换脚本用 `shift_headings` 保证这一点。

## 文档集内容

### iFinD HTTP API 用户手册

内容与 `source/ifind-manual.html` 逐项对齐，覆盖 64 张表格、2320 个单元格、29 段代码、27 个接口地址。原单文件按章节拆分为 22 个页面；原手册没有第 6 节（编号从 5 直接跳到 7），照抄不改。

原手册 29 段代码中的 26 段 `para = {...}` 参数块原为 JSON 风格（含 `&quot;` 转义、多余尾逗号、未闭合引号），现已统一为可直接运行的 Python 字典并修正明显笔误（如 `refreshtoken`→`refreshToken`、`"curency"`→`"currency"`、`"portid"`→`"portfid"`），29 段全部通过 `ast.parse`。

### SuperMind 帮助文档

内容取自 `https://quant.10jqka.com.cn/view/help/8` —— 该页把每篇文档的**原始 Markdown** 内嵌在 `__NUXT_DATA__` 里，因此不做 HTML→Markdown 反解析，只做抽取、分页、链接重写，避免转换笔误。

更新流程（`source/` 下的脚本）：

```bash
python source/convert_supermind.py                                  # 转换（带本地缓存）
npm run docs:build                                                   # 构建
python source/verify_supermind.py docs/.vitepress/dist               # 校验
```

校验三项指标必须分别是 `未解析锚点 0 处`、`渲染 id 不匹配 0`、`丢失长行 0`。

板块合并：模拟仿真 / 研究环境·实盘 / 本地SDK / 因子数据产品 合并为一类「其他」，共用 `/supermind/guide/other/` 前缀，侧边栏保留四个子分组。

## 打印

打印样式（`docs/.vitepress/theme/custom.css`）已适配深色模式：深色下打印强制回落为白底深字与浅色代码主题，表头每页重复、行与代码块不跨页。
