# 文档中心

汇总各产品官方文档的**单站点**，使用 VitePress + `@vue/theme`（[cn.vuejs.org](https://cn.vuejs.org/guide/introduction.html) 本体所用的 Vue 官方文档主题）构建。

路由分两级：

| 路径 | 内容 |
| --- | --- |
| `/` | 文档列表（选择要阅读的文档集） |
| `/ifind/` | iFinD HTTP API 用户手册（22 页） |
| `/supermind/` | SuperMind 帮助文档（118 页） |

新增文档集只需加内容目录 + 在 `docs/.vitepress/docs-registry.ts` 里加一条记录，文档列表与导航会自动出现。

本工作区不绑定特定厂商：产品信息与所属厂商由各文档集自身声明。

## 开始使用

```bash
npm install          # 首次
npm run docs:dev     # 本地预览（热更新）
npm run docs:build   # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物
```

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
         ├─ index.ts        主题入口（navbar-title 换成站点标题）
         ├─ custom.css      补丁样式（--vp-* 变量补齐、表格、打印）
         └─ components/
            ├─ DocList.vue  根页文档列表卡片
            └─ Home.vue     文档集首页（数据由各集合 index.md 传入）
```

## 主题

使用 Vue 官方文档同款主题 `@vue/theme@2.4.0`，代码块、侧边栏、大纲、配色与 cn.vuejs.org 一致（已实测：`pre` 为 `#24292e` / 字色 `#e1e4e8`、复制按钮 40px、外边距 `28px 0` 等）。

### 必须保留的 4 处适配（删了就会坏）

原因同时写在 `config.mts` 的注释里：

1. **关闭 `markdown-it-attrs`**：手册中的 `{周期1}`、`{周期2}` 会被该插件当成 HTML 属性，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证）。用 Vite alias 把 `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索。**别名丢了会导致搜索框整个不渲染。**
3. **补齐 `--vp-*` 设计变量**：`@vue/theme` 只定义 `--vt-c-*`，VitePress 自带组件引用 `--vp-c-*` / `--vp-local-search-*`。不补会让搜索弹窗完全透明、无边框（看起来像「打不开」）。
4. **`@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10，VitePress 1.6 依赖 v12，npm 只能提升一份，须在 `vite.ssr.noExternal` 显式声明（含 `@vueuse/shared`）。

### 另有两处约定

- **不启用 `cleanUrls`**：`@vue/theme` 生成的链接带 `.html`（与 cn.vuejs.org 一致），开启会冲突。
- **代码块用深色单主题**（`markdown.theme: 'github-dark'`）：与 cn.vuejs.org 相同，浅色页面下代码块也是深底。

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
