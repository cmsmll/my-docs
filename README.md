# 文档开发工作区

多产品文档站点的单仓工作区：目前有 **iFinD HTTP API 用户手册** 与 **SuperMind 帮助文档**
两个站点。各站共用同一套主题与构建配置（共享层 `packages/theme`），只有站点身份数据
（标题、导航、侧边栏、页脚、首页文案）不同。

本工作区不绑定特定厂商：新增站点时，其产品与所属厂商由站点自身声明，工作区层不预设。

## 站点

| 站点 | 包名 | 内容 |
| --- | --- | --- |
| `sites/ifind` | `ifind-http-api-manual` | iFinD HTTP API 官方手册（v2.1），由官方 PDF/HTML 手册结构化转换 |
| `sites/supermind` | `supermind-help` | SuperMind 量化平台官方帮助中心，由官网内嵌的原始 Markdown 抽取 |

## 开始使用

```bash
npm install              # 在仓库根执行一次，装齐所有站点依赖（npm workspaces）

# iFinD
npm run docs:dev:ifind       # 本地预览（热更新）
npm run docs:build:ifind     # 构建到 sites/ifind/docs/.vitepress/dist
npm run docs:preview:ifind   # 预览构建产物

# SuperMind
npm run docs:dev:supermind
npm run docs:build:supermind
npm run docs:preview:supermind
```

也可以进入任一站点目录执行 `npm run docs:dev` / `docs:build` / `docs:preview`。

## 目录结构

```
document/
├─ package.json              工作区根（workspaces: packages/*, sites/*）
├─ .gitignore                忽略依赖、构建产物、缓存、__pycache__、task.md
├─ .omp/AGENTS.md            AI 与会话规范（自动加载）
├─ task.md                   本地任务文件（临时，不入 git）
├─ packages/
│  └─ theme/                 共享层 @doc/theme
│     ├─ package.json        exports: "." / "./config" / "./components/Home.vue" / "./custom.css"
│     ├─ index.ts            createTheme({ title, titleClass }) —— 主题入口
│     ├─ config.ts           createSiteConfig({ title, description, nav, sidebar, footer, math })
│     ├─ custom.css          补丁样式（--vp-* 变量补齐、表格、打印等）
│     └─ components/Home.vue 首页组件（布局与样式共享，文案由 props 传入）
└─ sites/
   ├─ ifind/
   │  ├─ package.json
   │  ├─ README.md           本站说明
   │  ├─ source/             原始手册 HTML（内容校验对照物）
   │  └─ docs/               页面 + .vitepress/{config.mts, theme/index.ts}
   └─ supermind/
      ├─ package.json
      ├─ README.md           本站说明（含内容转换与校验流程）
      ├─ source/             官网原始 HTML、转换脚本、校验脚本、策略模板素材
      └─ docs/               页面 + .vitepress/{config.mts, theme/index.ts, nav.json, sidebar.json}
```

## 共享层

`packages/theme` 通过 npm workspaces 以符号链接装入两个站点（`node_modules/@doc/theme`）。
站点里**不得**再出现第二份 `custom.css` / `Home.vue` / 主题入口，否则又回到「两份适配逻辑
各自漂移」的老问题。

### 4 处必须保留的适配（删了就会坏）

原因同时写在 `config.ts` / `custom.css` / `index.ts` 的注释里，以免日后被误删：

1. **关闭 `markdown-it-attrs`**（`markdown.attrs.disable`）：手册中的 `{周期1}`、`{周期2}`
   这类技术指标参数会被该插件当成 HTML 属性，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证）。用 Vite alias 把
   `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索组件，保留离线可用的全文搜索。
3. **补齐 `--vp-*` 设计变量**：VitePress 自带组件（本地搜索等）引用 `--vp-c-*` /
   `--vp-local-search-*`，而 `@vue/theme` 只定义 `--vt-c-*`。不补会让搜索弹窗完全透明、
   无边框（看起来像「打不开」）。`custom.css` 把这些变量映射到 `--vt-c-*`，颜色自动跟随
   明暗模式；同时引入 `vitepress/dist/client/theme-default/styles/icons.css`，否则搜索
   图标不显示。
4. **`@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10，而 VitePress 1.6 依赖
   v12；npm 只能提升一份，须在 `vite.ssr.noExternal` 中显式声明（`@vue/theme/config`
   漏了 `@vueuse/shared`），否则构建报 `pxValue` 缺失。共享包 `@doc/theme` 自身也必须列在
   其中——它以符号链接装入站点，被当成 external 会导致构建失败。

### 另外必须保留

- `markdown.theme: 'github-dark'` 与 `markdown.lineNumbers: false`：与 cn.vuejs.org 相同，
  浅色页面下代码块也是深底（`pre` 为 `#24292e` / 字色 `#e1e4e8`），这是 Vue 文档的标志性外观。
- `markdown.headers.level: [2, 4]`：两站正文都含 h4，比 Vue 文档多保留一层大纲。
- **不启用 `cleanUrls`**：`@vue/theme` 生成的链接带 `.html` 后缀（与 cn.vuejs.org 一致），
  开启会与之冲突。
- `head` 里的 `theme-color`：`baseConfig` 预置的 `/logo.svg` 两站都没有对应资源。
- 本地搜索的中文 `translations` 与 i18n 中文文案。
- 主题入口用 `navbar-title` 插槽替换主题内置的 Vue 三角 logo 与「Vue.js」文字。

### 搬迁时修掉的两个坑

- 原 `config.mts` 里 `path.resolve('node_modules/vitepress/dist/client/theme-default')`
  是**相对 cwd** 的。依赖被提升到工作区根后，从 `sites/*` 运行会解析失败。共享层改用
  `createRequire(import.meta.url).resolve('vitepress/package.json')` 定位。
- 首页组件路径同样不再靠 cwd：共享层用 `fileURLToPath(import.meta.url)` 定位自身，
  config 里把 `@theme/components/Home.vue` 别名指向共享包内的组件。

## 新增一个站点

1. `sites/<name>/package.json`：`dependencies` 加 `"@doc/theme": "*"`，`devDependencies`
   加 `vitepress`（`@vue/theme` 由共享层带出，但显式声明版本更清晰）。
2. `sites/<name>/docs/.vitepress/theme/index.ts`：`export default createTheme({ title: '站点标题' })`。
3. `sites/<name>/docs/.vitepress/config.mts`：`export default createSiteConfig({ title, description, nav, sidebar, footer, home })`。
4. `sites/<name>/docs/index.md`：`page: true` + `import Home from '@theme/components/Home.vue'`，
   站点数据写在 `<script setup>` 里，模板为 `<Home v-bind="home" />`。
5. 根 `package.json` 补 `docs:dev:<name>` / `docs:build:<name>` / `docs:preview:<name>` 脚本。
6. 根目录 `npm install`，然后 `npm run docs:build:<name>`。

正文含 LaTeX 公式的站点需在 `createSiteConfig` 传 `math: true`，并在本站
`devDependencies` 里加 `markdown-it-mathjax3`。
