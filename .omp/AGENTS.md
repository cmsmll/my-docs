# AGENTS.md —— 文档开发工作区（document）

面向在本仓库工作的 AI 助手 / 开发者的项目指南。**先读本文，再动手改代码。**

本文是仓库唯一的规范来源（结构 + 开发规范 + AI 规范）。内容与 `README.md` 有重叠：
`README.md` 是给人看的仓库说明，本文是给 AI 与会话用的执行规范；两者冲突时以本文为准。

---

## 一、项目概览

**文档开发工作区**：用 VitePress + `@vue/theme`（cn.vuejs.org 本体主题）发布多个产品文档
站点，各站共用同一套主题与构建配置。

| 站点 | 目录 | 包名 | 内容来源 |
| --- | --- | --- | --- |
| iFinD HTTP API 用户手册 | `sites/ifind` | `ifind-http-api-manual` | 官方手册 HTML → 结构化 Markdown（已完成） |
| SuperMind 帮助文档 | `sites/supermind` | `supermind-help` | 官网帮助中心内嵌的原始 Markdown（已完成） |

- 形态：npm workspaces 单仓多包，**非** git 远程托管项目（无 origin，推送由用户手动管理）。
- 运行时：Node `v24.11.0` / npm `11.6.1`；`vitepress@1.6.4` + `@vue/theme@2.4.0`。
- 产出：每个站点各自 `docs/.vitepress/dist`，可独立部署。

**工作区不绑定厂商**：上述两个站点恰好属于同一厂商，但这不是前提。工作区层（本文、根
`README.md`、`package.json`、共享层）的描述保持中性，只讲「文档站点」；产品信息与所属
厂商由**站点自身**声明（站点 `README.md`、`config.mts` 的 `title`/`description`/`footer`、
`docs/index.md` 的文案）。新增站点时不要往工作区层写厂商名。

**当前规模**（改动后若数字变化，顺手更新本表）：

| 站点 | Markdown 页面 | 构建产物 HTML |
| --- | --- | --- |
| ifind | 22（guide 18 + reference 3 + index 1） | 23（含 404） |
| supermind | 118（guide 100 + reference 17 + index 1） | 119（含 404） |

---

## 二、项目结构

```
document/
├─ package.json              工作区根：workspaces + 聚合脚本（docs:*:ifind / docs:*:supermind）
├─ package-lock.json         统一锁文件（根目录只有这一份）
├─ .gitignore                忽略 node_modules / dist / cache / __pycache__
├─ README.md                 给人看的仓库说明
├─ .omp/AGENTS.md            本文件（omp 原生约定，每次会话自动加载）
├─ task.md                   任务书（当前任务的提示词沉淀，不删）
│
├─ packages/
│  └─ theme/                 共享层 @doc/theme —— 两站唯一的主题与配置真源
│     ├─ package.json        exports: "." / "./config" / "./components/Home.vue" / "./custom.css"
│     ├─ index.ts            createTheme({ title, titleClass })
│     ├─ config.ts           createSiteConfig({ title, description, nav, sidebar, footer, math })
│     ├─ custom.css          补丁样式（--vp-* 变量补齐、表格、打印）
│     └─ components/Home.vue 首页组件（布局样式共享，文案由 props 传入）
│
└─ sites/
   ├─ ifind/
   │  ├─ package.json        依赖 @doc/theme（workspace）+ vitepress + @vue/theme
   │  ├─ README.md           本站说明（内容来源、转换规则、代码片段修正清单）
   │  ├─ source/             原始手册 HTML（内容校验的对照物，勿删）
   │  └─ docs/
   │     ├─ index.md         首页（page: true + 共享 Home 组件，数据写在本文件内）
   │     ├─ guide/*.md       18 页：token、basic-data、date-sequence、…、report-query
   │     ├─ reference/*.md   3 页：errors、scope、versioning
   │     └─ .vitepress/
   │        ├─ config.mts    只写本站身份数据，其余调用 createSiteConfig
   │        └─ theme/index.ts 一行：createTheme({ title })
   └─ supermind/
      ├─ package.json        依赖 @doc/theme + vitepress + @vue/theme + markdown-it-mathjax3
      ├─ README.md           本站说明（内容转换流程、板块合并、校验指标）
      ├─ source/             内容转换与校验的脚本与原始素材
      │  ├─ convert_supermind.py  抓取→抽取→分页→链接改写→写 md 与 nav/sidebar json
      │  ├─ verify_supermind.py   锚点自检 + 内容守恒校验
      │  ├─ help-8.html           官网帮助页原始 HTML（抓取缓存，勿删）
      │  └─ SuperMind.py          因子检测策略模板（原始素材，勿删）
      └─ docs/
         ├─ index.md        首页
         ├─ guide/          因子研究 7 / 回测引擎 29 / 常见问题 9 / 智能交易 32 / AI Lab 10 / other 13
         ├─ reference/api/  API 文档 17 页
         └─ .vitepress/
            ├─ config.mts     只写本站身份数据 + math: true
            ├─ theme/index.ts 一行：createTheme({ title })
            ├─ nav.json       导航（脚本生成，不要手改）
            └─ sidebar.json   侧边栏（脚本生成，不要手改）
```

**supermind 的 `guide/other/`** 是四个板块合并后的产物（模拟仿真 / 研究环境·实盘 / 本地SDK /
因子数据产品），共用同一 URL 前缀 `/guide/other/*`，侧边栏里保留四个子分组。合并规则在
`convert_supermind.py` 的 `DOC_LAYOUT`、`SIDEBAR_GROUPS`、`MERGED_DIR` 里。

---

## 三、核心架构约束（不可违反）

### 3.1 共享层唯一真源

- 主题入口、补丁样式、首页组件、站点配置中的固定部分，**只能存在于 `packages/theme`**。
- 站点目录里**不得**出现第二份 `custom.css` / `Home.vue` / 主题入口实现——一旦出现，两站的
  适配逻辑就会各自漂移，正是本仓库重构要消除的问题。
- 站点差异只允许是「站点身份数据」：`title`、`description`、`nav`、`sidebar`、`footer`、
  `math`，以及首页文案（写在站点自己的 `docs/index.md` 里）。
- 首页数据**只写在 `docs/index.md`**。config 的 `createSiteConfig` 不接受 `home` 字段
  （曾有过，是死配置，已删）——写在那里不会被读取。

### 3.2 必须保留的 4 处主题适配

删任何一处都会坏，原因已写在 `config.ts` / `custom.css` / `index.ts` 的注释里：

1. **关闭 `markdown-it-attrs`**（`markdown.attrs.disable`）：手册里的 `{周期1}`、`{周期2}` 会被
   当成 HTML 属性吞掉，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证），用 Vite alias 把
   `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索。
3. **补齐 `--vp-*` 设计变量**：`@vue/theme` 只定义 `--vt-c-*`，VitePress 自带组件引用
   `--vp-c-*` / `--vp-local-search-*`。不补会让搜索弹窗全透明无边框（像「打不开」）。
4. **`@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10、VitePress 1.6 依赖 v12，
   npm 只能提升一份，须在 `vite.ssr.noExternal` 显式声明（含 `@vueuse/shared`）。

同时必须保留：`markdown.theme: 'github-dark'`、`lineNumbers: false`、
`headers.level: [2, 4]`、**不启用 `cleanUrls`**、`theme-color` meta、
本地搜索中文 `translations` 与 i18n 文案、`navbar-title` 插槽替换主题内置 Vue logo。

### 3.3 路径不得依赖 cwd

依赖被 workspaces 提升到根后，从 `sites/*` 运行是常态。**不要**用
`path.resolve('node_modules/...')` 这类相对 cwd 的写法；用 `createRequire(import.meta.url)`
或 `fileURLToPath(import.meta.url)` 定位。共享层已按此实现，改动时勿退回。

### 3.4 主题能力边界

- **侧边栏只有两级**：`@vue/theme` 的 `VPSidebarGroup` 只渲染「分组标题 + 平铺链接」，不支持
  再嵌套。写三层会渲染成**无 `href` 的假链接、页面全部丢失**。需要多个子分组时，把它们作为
  **同一目录键下的多个 group**（参考 `guide/other/`）。
- **大纲只收 level 2..4**：页内标题必须从 `##` 起，否则右侧「本页内容」是空的。转换脚本用
  `shift_headings(body, level - 1)` 保证这一点。

---

## 四、开发规范

### 4.1 常用命令（一律在仓库根执行）

| 命令 | 用途 |
| --- | --- |
| `npm install` | 装齐所有工作区依赖（只在根执行，**不要**进站点目录单独 install） |
| `npm run docs:dev:ifind` | iFinD 本地预览（热更新） |
| `npm run docs:build:ifind` | iFinD 构建到 `sites/ifind/docs/.vitepress/dist` |
| `npm run docs:preview:ifind` | 预览 iFinD 构建产物 |
| `npm run docs:dev:supermind` | SuperMind 本地预览 |
| `npm run docs:build:supermind` | SuperMind 构建 |
| `npm run docs:preview:supermind` | 预览 SuperMind 构建产物 |

包管理一律用 **npm**（有 `package-lock.json`，根目录只有一份锁文件）。

### 4.2 内容与代码的边界

- **iFinD 的 22 篇正文是既有成果，原则上不动**。确需修改时，改完必须重新构建并核对；
  `source/iFinD HTTP API 用户手册2.html` 是校验对照物，**不得删改**。
- **supermind 的 `docs/**/*.md` 是生成物**：由 `source/convert_supermind.py` 产出。
  要改内容结构（分页、目录、分组、导航），**改脚本再重跑**，不要手改生成出来的 md。
- **`nav.json` / `sidebar.json` 是生成物**，手改会被下次重跑覆盖。要调整就改脚本里的
  `DOC_LAYOUT` / `SIDEBAR_GROUPS` / `MERGED_DIR` / `_write_nav`。
- `source/` 下的原始素材（手册 HTML、`help-8.html`、`SuperMind.py`）**只增不删**——它们是
  内容校验与二次转换的依据。

### 4.3 supermind 内容更新流程

```bash
python sites/supermind/source/convert_supermind.py     # 转换（带本地缓存，不重新抓取）
npm run docs:build:supermind
python sites/supermind/source/verify_supermind.py sites/supermind/docs/.vitepress/dist
```

`verify_supermind.py` 的三项指标必须分别是：`未解析锚点 0 处`、`渲染 id 不匹配 0`、
`出现中未出现的长行 0`。任一非 0 都说明转换出错，**不要提交**。

转换脚本依赖 `pypinyin`（中文标题转拼音文件名），需已安装。

### 4.4 新增站点

1. `sites/<name>/package.json`：`dependencies` 加 `"@doc/theme": "*"`，`devDependencies` 加
   `vitepress` 与 `@vue/theme`（正文含 LaTeX 再加 `markdown-it-mathjax3`）。
2. `sites/<name>/docs/.vitepress/theme/index.ts`：
   `export default createTheme({ title: '站点标题' })`。
3. `sites/<name>/docs/.vitepress/config.mts`：
   `export default createSiteConfig({ title, description, nav, sidebar, footer })`。
4. `sites/<name>/docs/index.md`：`page: true` + `import Home from '@theme/components/Home.vue'`，
   数据写在 `<script setup>` 里，模板 `<Home v-bind="home" />`。
5. 根 `package.json` 补 `docs:dev|build|preview:<name>` 脚本，然后根目录 `npm install`。

### 4.5 代码风格

- 注释与文案**一律中文**，注释解释「**为什么**」而非「做了什么」——尤其是主题适配、
  路径解析、分页规则这类反直觉的地方，必须留下原因。
- 共享层是 TypeScript（`config.ts` / `index.ts`）+ Vue SFC；本站配置用 `.mts`。
- 不引入未使用的抽象，不为一次性需求加配置项。新增能力前先确认共享层是否已有。
- **厂商与产品信息分层写**：
  - 工作区层（根 `README.md`、`package.json`、`packages/theme` 的 `description`、本文）只写
    「文档站点 / 工作区」，**不写厂商名**——本工作区不限定只放某一家的产品文档。
  - 厂商标识只在**站点内**出现：站点 `README.md`、`config.mts` 的 `title`/`description`/
    `footer`、`docs/index.md` 文案。归属要写就写真实厂商，不要含糊。
  - 例外：站点正文里出现的厂商名属于**原文内容**（如官方文档原文），照抄不改。

---

## 五、AI 开发规范（强制）

### 5.1 提交

- **每次修改代码都必须提交到本地仓库**，不得遗留未提交的改动。完成任务后 `git status`
  应为干净（或只剩与本次任务无关、用户自己的改动）。
- **只有用户明确说「提交到远程 / push」时才推送**。默认**绝不**执行 `git push`，也不添加
  remote；远程由用户手动管理。
- **一次提交只做一件事**：代码 + 相关文档/脚本同提交，不混入无关改动。
- **提交信息格式：Conventional Commits + 中文说明**。类型用 `feat` / `fix` / `refactor` /
  `docs` / `chore` / `test` / `style` / `perf` / `build` / `ci`，说明用中文：
  - `feat: 新增 SuperMind 帮助文档站点`
  - `fix: 修复搜索弹窗背景透明`
  - `refactor: 抽取共享主题层`
  - `docs: 补充项目结构与开发规范`
  - `chore: 忽略 __pycache__`

### 5.2 测试

- **开发不需要编写任何测试**。不要新增测试文件、测试框架或测试脚本。
- 验证靠**实际运行**：改完跑构建（`npm run docs:build:<site>`）或起 `preview` 看一眼，
  把真实输出作为依据。**不要**用「写个测试」替代「跑一次」。
- `sites/supermind/source/verify_supermind.py` 是既有的内容校验工具，属于内容流水线的一部分，
  该跑就跑；这不算「编写测试」，也不要删。

### 5.3 遇到不清楚的地方必须停下来问

- **只要存在影响实现方向的不明确点，就停下来问，不要猜着做。**
- 提问方式：用 `ask` **一次性列出一组问题**（通常 2–5 个），每个问题：
  - 说明**背景与现状**（涉及哪些文件/约束、为什么有歧义）
  - 给出 **2–5 个候选选项**，每项说明差异与后果
  - 标出**推荐项**及理由
- 判定标准：
  - **必须问**：措辞有歧义且不同理解产出不同结果；任务与现状冲突；破坏性操作
    （删除/覆盖文件、改公共接口）；会成为后续工作契约的选择（目录结构、URL、schema）。
  - **不必问**：能在仓库里查到答案的；各选项差别不大、怎么选都合理的细节；用户已明说过的。
    自行决定并在交付说明里写明假设。
- 得到答案后按答案执行；答案与先前的假设冲突时以答案为准，并说明调整点。

### 5.4 改动纪律

- 动手前先读相关文件与本文档，复用既有模式；**不要在既有约定之外另起一套**。
- 改共享层前，先确认两个站点都会受影响；改完**两站都要构建通过**。
- 不移除、不改写用户未要求改动的内容；发现无关的既有问题，报告而不顺手改。
- 不擅自升级依赖（`vitepress` 停在 1.6.x、`@vue/theme` 停在 2.4.x）；升级需先问。
- 不新增与本任务无关的依赖、脚本、CI 配置、格式化配置。
- 交付时说明：改了什么、验证方式与结果、遗留问题与假设。

---

## 六、验证清单（改完自查）

- [ ] `npm run docs:build:ifind` 通过，且 iFinD 的 `guide/*.md`、`reference/*.md` 未被无意改动
- [ ] `npm run docs:build:supermind` 通过，无 dead link 警告
- [ ] 若动了 supermind 内容：`verify_supermind.py` 三项指标均为 0
- [ ] 若动了共享层：**两站**都构建通过，且代码块仍为深底 `#24292e` / 字色 `#e1e4e8`
- [ ] 若动了导航/侧边栏：侧边栏链接数正确（无 href 的假链接 = 层级超两级的信号）
- [ ] 站点目录内没有出现第二份 `custom.css` / `Home.vue`
- [ ] `git status` 干净，改动已按 5.1 提交
