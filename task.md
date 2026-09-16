# 文档工作区重构：提取 iFinD 站点共享层，SuperMind 复用同一架构与主题

## 一、背景（已勘察事实）

- 工作目录 `E:\CMS\code\document`，原不是 git 仓库，也没有根级 `package.json`。根目录现存 5 项：`task.md`、`SuperMind.py`、`SuperMind/`（空目录）、`iFinD_API/`、`iFinD HTTP API 用户手册2.html`（123,578 字节，iFinD 手册的原始 HTML 源）。
- `iFinD_API/` 已完成：VitePress `1.6.4` + `@vue/theme@2.4.0`（cn.vuejs.org 本体主题）。自带 `package.json`、`package-lock.json`、`node_modules`、`.gitignore`。
  - `docs/`：`index.md`（`page: true` + 自定义 `Home.vue`）、`guide/*.md` 18 篇、`reference/*.md` 3 篇（共 22 页）。
  - `docs/.vitepress/config.mts`（167 行）：`defineConfigWithTheme` + `@vue/theme/config` 的 `baseConfig`；nav / sidebar / footer / i18n / 本地搜索中文文案 / `markdown.theme: 'github-dark'` / `markdown.headers.level: [2,4]` / `attrs.disable` / `vite.ssr.noExternal` / `optimizeDeps.exclude` / `VPNavBarSearch.vue` 别名替换。
  - `docs/.vitepress/theme/`：`index.ts`（VPTheme + `navbar-title` 插槽 + icons.css）、`custom.css`（187 行）、`components/Home.vue`。
- `SuperMind/`：空目录，全盘未找到 SuperMind 文档源文件；官方帮助站 `quant.10jqka.com.cn/view/help/{3,4,8,10,12,14,16}` 七个板块可抓取（合计约 8.8 MB HTML），作为内容源。
- 本机 `node v24.11.0` / `npm 11.6.1`。

## 二、目标

1. 把 `iFinD_API/` 中可复用的架构代码（主题入口、样式补丁、首页组件、站点配置里的固定部分）提取到外层，形成两个文档站点共用的共享层。
2. 让 SuperMind 使用完全相同的架构与主题：同一个 `@vue/theme`、同样的代码块高亮（`github-dark` 深底）、同样的配色与 `--vp-*` 变量补齐、同样的离线本地搜索、同样的导航栏品牌区替换方式、同样的表格与打印样式。两站点只差「站点身份数据」（标题、描述、nav、sidebar、footer、首页文案）。
3. `iFinD_API/` 站点零回归：已有页面正文、URL 路径、主题外观逐项不变。

## 三、已确认的决策

| 决策点 | 结论 |
| --- | --- |
| 外层形态 | npm workspaces 单仓多包：根 `package.json` 声明 workspaces，`packages/theme` 放共享主题与配置工厂，`sites/ifind`、`sites/supermind` 各自是一个站点包，根目录一次 `npm install`。 |
| 站点关系 | 两个独立 VitePress 站点，各自 dev / build / preview，各自产出 dist。 |
| iFinD 目录 | `iFinD_API/` → `sites/ifind/`；站点内 URL 路径 `/guide/*`、`/reference/*` 逐字节不变。 |
| SuperMind 内容源 | 抓取同花顺官方帮助站七个板块 HTML，转换为结构化 Markdown。 |
| 参数化 | 共享包导出 `createSiteConfig({...})` 与 `createTheme({...})`；站点 config 只写本站数据。 |
| 首页 | 共享 `Home.vue` 布局与样式，`highlights` / `versions` / 统计 / 简介等数据由各站 `index.md` 以 props 传入。 |
| 版本控制与素材 | 根目录 `git init` + 基线提交；原始 HTML 移到 `sites/ifind/source/`，`SuperMind.py` 移到 `sites/supermind/source/`，`task.md` 留根目录，删除空 `SuperMind/`。 |

## 四、范围

**会动**
- 新增根工作区文件：`package.json`、`.gitignore`、`README.md`。
- 新增共享层 `packages/theme/`（主题入口 / 配置工厂 / 首页组件 / 样式补丁）。
- 迁移 `iFinD_API/` → `sites/ifind/`；页面内容文件字节不变，仅 `config.mts` 与 `theme/index.ts` 改为「调用共享层 + 只填本站数据」。
- 新增 `sites/supermind/` 站点目录、其 `.vitepress/` 配置、以及由官方帮助站转换来的 Markdown 内容。
- 素材归位（iFinD 原始 HTML、`SuperMind.py`）与迁移残留清理（空目录、重复的 `node_modules`、失效的 `package-lock.json`）。

**不动（硬约束）**
- `docs/guide/*.md`、`docs/reference/*.md`、`docs/index.md` 的正文内容一字不改。
- iFinD 站点的 URL 路径约定：仍是 `/guide/...`、`/reference/...`，带 `.html` 后缀（即继续不启用 `cleanUrls`）。
- 依赖版本组合：`vitepress@1.6.4` + `@vue/theme@2.4.0`（不升级 VitePress 2.x）。
- 第五节列出的 4 处必须保留的主题适配，一条都不许删。
- 不修改 `task.md`、`SuperMind.py`、`iFinD HTTP API 用户手册2.html` 的内容（位置按第三节决策移动）。
- 不动 `E:\CMS` 下本目录以外的任何内容。

## 五、目标结构

```
document/
├─ package.json                  # 工作区根：workspaces + 聚合脚本
├─ .gitignore
├─ README.md                     # 工作区说明：两站点、共享层、如何运行与构建
├─ task.md
├─ packages/
│  └─ theme/                     # @doc/theme —— 共享层
│     ├─ package.json            # "exports": { ".": "./index.ts", "./config": "./config.ts" }
│     ├─ index.ts                # createTheme({ title, titleClass })
│     ├─ config.ts               # createSiteConfig({ title, description, nav, sidebar, footer })
│     ├─ custom.css              # 原 iFinD custom.css 迁入（共享补丁样式）
│     └─ components/Home.vue      # 参数化首页（props 化文案与统计）
└─ sites/
   ├─ ifind/
   │  ├─ package.json
   │  ├─ source/                 # iFinD HTTP API 用户手册2.html（原始素材）
   │  └─ docs/
   │     ├─ index.md
   │     ├─ guide/*.md           # 18 篇，内容不变
   │     ├─ reference/*.md       # 3 篇，内容不变
   │     └─ .vitepress/
   │        ├─ config.mts        # 只保留本站 nav/sidebar/footer/title/description，其余调用工厂
   │        └─ theme/index.ts    # export default createTheme({ title: 'iFinD HTTP API 用户手册' })
   └─ supermind/
      ├─ package.json
      ├─ source/                 # SuperMind.py 与抓取到的官方帮助站原始 HTML
      └─ docs/
         ├─ index.md
         ├─ guide/*.md           # 由官方帮助站七个板块转换而来
         └─ .vitepress/{config.mts, theme/index.ts}
```

## 六、共享层必须原样保留的技术点（可改位置，不许改语义）

1. **关闭 `markdown-it-attrs`**：`markdown: { attrs: { disable: true } }`。手册里的 `{周期1}`、`{周期2}` 会被该插件当成 HTML 属性吞掉，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：Vite `resolve.alias` 把 `VPNavBarSearch.vue` 指向 VitePress 自带的本地搜索组件（`@vue/theme` 的搜索只支持需凭证的 Algolia）。alias 正则 `/^.*\/VPNavBarSearch\.vue$/`。
3. **补齐 `--vp-*` 设计变量**：`custom.css` 把 `--vp-c-*` / `--vp-local-search-*` 映射到主题的 `--vt-c-*`，并引入 `vitepress/dist/client/theme-default/styles/icons.css`。漏掉会导致搜索弹窗全透明、无边框、图标缺失。
4. **`@vueuse` 依赖处理**：`vite.ssr.noExternal: ['@vue/theme', '@vueuse/core', '@vueuse/shared', '@vueuse/metadata']` + `vite.optimizeDeps.exclude: ['@vue/theme']`。

**另外必须保留**：`markdown.theme: 'github-dark'`、`markdown.lineNumbers: false`、`markdown.headers.level: [2, 4]`、不启用 `cleanUrls`、`theme/index.ts` 用 `navbar-title` 插槽替换主题内置 Vue logo 与「Vue.js」文字、`head` 里的 `theme-color` `#42b883`、本地搜索的中文 `translations`、i18n 中文文案。

**搬迁时必须修的两个坑**

- `config.mts` 里 `path.resolve('node_modules/vitepress/dist/client/theme-default')` 是相对 cwd 的。依赖被提升到工作区根后，从 `sites/*` 目录运行会解析失败。改为 cwd 无关的写法（如 `createRequire(import.meta.url).resolve('vitepress/package.json')` 再取同级 `dist/client/theme-default`）。
- 共享主题包被 npm 以符号链接方式装进站点，Vite SSR 默认把它当 external，构建可能报错。把共享包名加进 `vite.ssr.noExternal`；若 config 加载阶段 esbuild 解析链接包的 `.ts` 入口失败，退化为 `exports` 指向编译后的入口。

## 七、执行步骤（有序，每步可独立验证）

**S1 固化基线**
在 `iFinD_API/` 下执行 `npm run docs:build`，确认通过；记录构建产物页面数与 `docs/guide/*.md`、`docs/reference/*.md` 的校验和（`sha256sum`），后续所有「内容未变」的断言拿这份基线比对。

**S2 搭工作区骨架**
创建根 `package.json`（`private: true`、`workspaces`、聚合脚本 `docs:dev:ifind` / `docs:build:ifind` / `docs:dev:supermind` / `docs:build:supermind`）、根 `.gitignore`、`README.md`。

**S3 抽取共享层**
从 `iFinD_API/docs/.vitepress/` 搬 `theme/custom.css`（原样）、`theme/components/Home.vue`（参数化）、`theme/index.ts`（改为 `createTheme` 工厂）、`config.mts` 中与站点身份无关的固定部分（markdown / vite / head / i18n / 搜索 translations → `createSiteConfig` 工厂）。

**S4 迁移 iFinD 站点**
`iFinD_API/` → `sites/ifind/`。只改两个文件：`config.mts` 改为 `createSiteConfig({...})`，`theme/index.ts` 改为 `createTheme({...})`。`docs/` 下所有 `.md` 逐字节不变。

**S5 建 SuperMind 站点**
抓取官方帮助站七个板块（本地SDK / API文档 / 因子研究 / 模拟仿真 / 回测引擎 / 研究环境 / 常见问题），转换为结构化 Markdown，同结构创建 `sites/supermind/`，套用同一工厂与 `createTheme`。原文层级与编号照抄不改，不做主观增删。

**S6 安装与构建验证**
根目录 `npm install`（一次装齐，workspaces 提升）；两站点分别执行 `dev`（能起、能打开首页）与 `build`（产出 dist、无报错）。

**S7 清理与文档**
删除迁移残留（空目录、旧 `node_modules`、失效 lock 文件）；`README.md` 写明两站点与共享层关系、共享层 4 处适配的改动禁忌。

**S8 回归校验**
重新 `sha256sum` 比对 S1 基线，确认 iFinD 的 `.md` 内容零变化；比对构建产物页面数与 URL（带 `.html`）。

## 八、约束

- **主题一致性是硬指标**：两站点逐项一致——外层背景 `#292d3e`、`pre` 为 `#24292e` / `#e1e4e8`、代码字色 `#a6accd`、复制按钮 40px、代码块外边距 `28px 0`、`headers.level [2,4]` 的出纲、`github-dark` 代码高亮。
- **两个站点各自独立运行**：任一站点可单独 `dev` / `build`，不依赖另一站点先构建。
- **不复制粘贴主题代码**：共享层是唯一真源；站点目录里不得再出现第二份 `custom.css` / `Home.vue` / 主题入口。
- **不做无关重构**：不升级依赖、不改 iFinD 页面内容、不重命名 iFinD 的内部文件名、不引入 `cleanUrls`、不新增未被要求的站点。
- 中文注释与文案风格沿用现有 iFinD 项目（注释解释「为什么」，尤其 4 处适配的原因）。

## 九、验收标准（可观察、可执行）

1. 根目录 `npm install` 成功，无未解析的 peer 冲突。
2. iFinD 站点构建成功，产出 `dist`，页面数 ≥ 22。
3. SuperMind 站点同命令成功，产出 `dist`，首页可打开。
4. `docs:preview` 打开两站点首页：导航栏左侧显示各自站点标题（不是 Vue 三角 logo /「Vue.js」）。
5. 两站点搜索框都能打开弹窗且有正常背景与边框（验证 `--vp-*` 补齐生效），输入关键词能出结果，图标可见。
6. 两站点表格窄屏下横向滚动、`th` 不折行；代码块为深底 `#24292e` / 字色 `#e1e4e8`；`{周期1}` 一类花括号文本在页面上完整可见（验证 `attrs.disable` 生效）。
7. iFinD 站点访问 `/guide/token.html`、`/reference/errors.html` 正常（URL 带 `.html`，路径未变）。
8. 打印预览在两站点均为白底深字、代码块浅色。
9. `sha256sum` 比对：iFinD 的 `guide/*.md`、`reference/*.md` 与 S1 基线逐文件一致。
10. 共享层只有一份：`sites/*/docs/.vitepress/` 下不再存在 `custom.css` 与 `Home.vue` 的独立副本。

## 十、交付物

- 重构后的目录树（根工作区 + 共享层 + 两个站点）。
- 更新后的根 `README.md`。
- 上述 10 条验收标准的实测结果（命令 + 输出摘要）。
