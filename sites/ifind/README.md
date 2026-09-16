# iFinD HTTP API 用户手册（站点）

同花顺 iFinD HTTP API 官方手册（v2.1）的网页版。使用 VitePress + **`@vue/theme`**
（[cn.vuejs.org](https://cn.vuejs.org/guide/introduction.html) 本体所用的 Vue 官方文档主题）构建。

本仓库是同花顺文档工作区（workspace）的一个站点。**主题、补丁样式、首页组件与站点配置
工厂都在共享层 `packages/theme`**，本站只声明自己的身份数据（标题、导航、侧边栏、页脚、
首页文案）。共享层的 4 处必要适配与改动禁忌见仓库根 `README.md`。

## 开始使用

```bash
npm install            # 在仓库根执行一次，装齐所有站点依赖
npm run docs:dev:ifind     # 本地预览（热更新）
npm run docs:build:ifind   # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview:ifind # 预览构建产物
```

也可以在本目录内直接执行 `npm run docs:dev` / `docs:build` / `docs:preview`。

## 目录结构

```
sites/ifind/
├─ package.json              站点包（依赖 @doc/theme 工作区包）
├─ README.md                 本文件
├─ source/
│  └─ iFinD HTTP API 用户手册2.html   原始手册 HTML（内容转换与校验的对照物）
└─ docs/
   ├─ index.md               首页（page: true + 共享 Home 组件，数据在本文件内）
   ├─ guide/
   │  ├─ token.md            一、TOKEN获取与使用
   │  ├─ basic-data.md       1、基础数据
   │  ├─ date-sequence.md    2、日期序列
   │  ├─ history-quotation.md 3、历史行情
   │  ├─ high-frequency.md   4、高频序列
   │  ├─ realtime-quotation.md 5、实时行情
   │  ├─ edb.md              7、经济数据库(EDB)
   │  ├─ data-pool.md        8、专题报表函数
   │  ├─ portfolio.md        9、组合管理
   │  ├─ smart-stock-picking.md 10、智能选股
   │  ├─ fund-valuation-minute.md 11、基金实时估值(分钟)
   │  ├─ fund-valuation-daily.md  12、基金实时估值(日)
   │  ├─ trade-dates.md      13、日期查询函数
   │  ├─ trade-date-offset.md 14、日期偏移函数
   │  ├─ data-volume.md      15、数据量查询
   │  ├─ error-message.md    16、错误信息查询
   │  ├─ thscode.md          17、证券代码证券简称转同花顺代码
   │  └─ report-query.md     18、公告查询
   ├─ reference/
   │  ├─ errors.md           三、错误说明（73 条错误码）
   │  ├─ scope.md            四、适用范围
   │  └─ versioning.md       五、版本管理
   └─ .vitepress/
      ├─ config.mts          站点配置（只写本站身份数据，其余调用 createSiteConfig）
      └─ theme/index.ts      主题入口（一行：createTheme({ title })）
```

## 导航与 URL

站点内 URL 仍是 `/guide/*`、`/reference/*`，**带 `.html` 后缀**（与 cn.vuejs.org 一致，
即不启用 `cleanUrls`）。这是既有约定，迁移到 workspace 结构时未改动。

## 与原手册的对应关系

内容与 `source/iFinD HTTP API 用户手册2.html` 逐项对齐，覆盖 **64 张表格、2320 个单元格、
29 段代码、27 个接口地址**，转换与构建后均有自动化校验（表格单元格、段落、标题、代码
字面量逐条比对）。

结构性调整：

- 原单文件按章节拆分为 22 个页面；原手册重复写在标题里的编号（如 `一一、TOKEN获取与使用`）
  只保留一份，编号继续由侧边栏和页标题承载。
- 原手册没有第 6 节（编号从 5 直接跳到 7），此处照抄不改。
- `p.label` 小标签（URL / formData / 示例 / 输出 等）改为 `##` 级标题，以获得右侧大纲导航。
- 首页保留原文的简介、`5 个章节 / 64 张表格 / …` 统计与版本记录表。

## 代码片段

原手册 29 段代码中的 26 段 `para = {...}` 参数块，原为 JSON 风格（含 `&quot;` 转义、
多余尾逗号、未闭合引号）。现已统一为**可直接运行的 Python 字典**，并修正明显的转换笔误：

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

另外 3 段本就是 Python 脚本（requests 取 token、取实时行情、组合文件导入），仅修复被
PDF 转换破坏的换行与标点。29 段全部通过 `ast.parse` 语法校验。

## 打印

打印样式（在共享层 `custom.css` 内）已适配深色模式：深色模式下打印会强制回落为白底
深字与浅色代码主题，表头每页重复、行与代码块不跨页。
