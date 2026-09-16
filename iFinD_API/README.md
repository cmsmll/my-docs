# iFinD HTTP API 用户手册

同花顺 iFinD HTTP API 官方手册（v2.1）的网页版，使用 VitePress + **`@vue/theme`**（[cn.vuejs.org](https://cn.vuejs.org/guide/introduction.html) 本体所用的 Vue 官方文档主题）构建。

## 开始使用

```bash
npm install          # 首次
npm run docs:dev     # 本地预览（热更新）
npm run docs:build   # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物
```

## 目录结构

```
docs/
├─ index.md                 首页（page: true + 自定义 Home 组件，同 Vue 文档做法）
├─ guide/
│  ├─ token.md              一、TOKEN获取与使用
│  ├─ basic-data.md         1、基础数据
│  ├─ date-sequence.md      2、日期序列
│  ├─ history-quotation.md  3、历史行情
│  ├─ high-frequency.md     4、高频序列
│  ├─ realtime-quotation.md 5、实时行情
│  ├─ edb.md                7、经济数据库(EDB)
│  ├─ data-pool.md          8、专题报表函数
│  ├─ portfolio.md          9、组合管理
│  ├─ smart-stock-picking.md 10、智能选股
│  ├─ fund-valuation-minute.md 11、基金实时估值(分钟)
│  ├─ fund-valuation-daily.md  12、基金实时估值(日)
│  ├─ trade-dates.md        13、日期查询函数
│  ├─ trade-date-offset.md  14、日期偏移函数
│  ├─ data-volume.md        15、数据量查询
│  ├─ error-message.md      16、错误信息查询
│  ├─ thscode.md            17、证券代码证券简称转同花顺代码
│  └─ report-query.md       18、公告查询
├─ reference/
│  ├─ errors.md             三、错误说明（73 条错误码）
│  ├─ scope.md              四、适用范围
│  └─ versioning.md         五、版本管理
└─ .vitepress/
   ├─ config.mts            站点配置（主题、导航、侧边栏、本地搜索、中文文案）
   └─ theme/
      ├─ index.ts           主题入口（@vue/theme）
      ├─ custom.css         补充样式（表格、接口地址块、打印）
      └─ components/Home.vue 首页组件
```

## 主题

使用 Vue 官方文档同款主题 `@vue/theme@2.4.0`，代码块、侧边栏、大纲、配色与 cn.vuejs.org 逐属性一致（已实测比对：外层 `#292d3e`、`pre` 为 `#24292e`/`#e1e4e8`、代码字色 `#a6accd`、复制按钮 40px、外边距 `28px 0` 等）。

四处针对本站的适配，原因已写入 `config.mts` / `custom.css` / `theme/index.ts` 注释，以免日后被误删：

1. **关闭 `markdown-it-attrs`**：手册中的 `{周期1},{周期2}` 技术指标参数会被该插件当作 HTML 属性，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证）。这里通过 Vite alias 把 `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索组件，保留离线可用的全文搜索。
3. **补齐 `--vp-*` 设计变量**：VitePress 自带组件（本地搜索等）引用 `--vp-c-*` / `--vp-local-search-*`，而 `@vue/theme` 只定义 `--vt-c-*`。不补会让搜索弹窗完全透明、无边框（看起来像“打不开”）。`custom.css` 把这些变量映射到主题的 `--vt-c-*`，颜色自动跟随明暗模式；同时引入 `vitepress/dist/client/theme-default/styles/icons.css`，否则搜索图标不显示。
4. **补齐 `@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10，VitePress 1.6 依赖 v12；npm 只能提升一份，须在 `vite.ssr.noExternal` 中显式声明（`@vue/theme/config` 漏了 `@vueuse/shared`），否则构建报 `pxValue` 缺失。

另有两处与主题约定相关的取舍：

- **不启用 `cleanUrls`**：`@vue/theme` 生成的链接带 `.html` 后缀（与 cn.vuejs.org 一致），开启会与之冲突。
- **代码块用深色单主题**（`markdown.theme: 'github-dark'`）：与 cn.vuejs.org 相同——浅色页面下代码块也是深底，这是 Vue 文档的标志性外观。

此外，导航栏左侧品牌区通过 `theme/index.ts` 的 `navbar-title` 插槽换成站点标题「iFinD HTTP API 用户手册」，替换主题内置的 Vue 三角 logo 与「Vue.js」文字；首页的「简介 / 版本记录」收进与上方卡片一致的 1152px 居中容器，文字左对齐。

## 与原手册的对应关系

内容与 `iFinD HTTP API 用户手册2.html` 逐项对齐，覆盖 **64 张表格、2320 个单元格、29 段代码、27 个接口地址**，转换与构建后均有自动化校验（表格单元格、段落、标题、代码字面量逐条比对）。

结构性调整：

- 原单文件按章节拆分为 22 个页面；原手册重复写在标题里的编号（如 `一一、TOKEN获取与使用`）只保留一份，编号继续由侧边栏和页标题承载。
- 原手册没有第 6 节（编号从 5 直接跳到 7），此处照抄不改。
- `p.label` 小标签（URL / formData / 示例 / 输出 等）改为 `##` 级标题，以获得右侧大纲导航。
- 首页保留原文的简介、`5 个章节 / 64 张表格 / …` 统计与版本记录表。

## 代码片段

原手册 29 段代码中的 26 段 `para = {...}` 参数块，原为 JSON 风格（含 `&quot;` 转义、多余尾逗号、未闭合引号）。现已统一为**可直接运行的 Python 字典**，并修正明显的转换笔误：

| 位置 | 原内容 | 现内容 |
| --- | --- | --- |
| 获取 access_token | `refreshtoken` | `refreshToken`（保留字大小写） |
| 组合新建 | `"curency"` | `"currency"`；修复被破坏的 `supbm` 子字典 |
| 组合导入/状态查询 | `"portid"` | `"portfid"` |
| 交易流水 | `"keyword": "`（未闭合） | `"keyword": ""` |
| 组合监控 | `real i zedProfit` | `realizedProfit` |
| 持仓分析 | `costPrice ` | `costPrice`（去尾空格） |
| 风险指标 | `["alpha,yield,..."]` | `"alpha,yield,..."`（与 formData 表一致） |
| 基金实时估值(日) | `000001.OF;000003.OF`、缺少 `outputpara` 键 | 逗号分隔、补回 `"outputpara"` 键 |
| 高频序列 | `"SI": ""` 后缺逗号 | 补逗号 |

另外 3 段本就是 Python 脚本（requests 取 token、取实时行情、组合文件导入），仅修复被 PDF 转换破坏的换行与标点。

29 段全部通过 `ast.parse` 语法校验。

## 打印

打印样式已适配深色模式：深色模式下打印会强制回落为白底深字与浅色代码主题，表头每页重复、行与代码块不跨页。
