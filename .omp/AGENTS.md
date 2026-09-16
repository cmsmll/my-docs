# AGENTS.md —— 文档中心（document）

面向在本仓库工作的 AI 助手 / 开发者的项目指南。**先读本文，再动手改代码。**

本文是仓库唯一的规范来源（结构 + 开发规范 + AI 规范）。内容与 `README.md` 有重叠：
`README.md` 是给人看的仓库说明，本文是给 AI 与会话用的执行规范；两者冲突时以本文为准。

---

## 一、项目概览

**文档中心**：用 VitePress + `@vue/theme`（cn.vuejs.org 本体主题）发布的**单站点**，用于汇总
各产品的官方文档。路由分两级：根路径是文档列表，各文档集挂在各自的一级路径下。

| 文档集 | 路径 | 内容目录 | 内容来源 |
| --- | --- | --- | --- |
| iFinD HTTP API 用户手册 | `/ifind/` | `docs/ifind/` | 官方手册 HTML → 结构化 Markdown（已完成） |
| SuperMind 帮助文档 | `/supermind/` | `docs/supermind/` | 官网帮助中心内嵌的原始 Markdown（已完成） |

- 形态：**单站点**（不是多站点、不是 workspaces）。一个 `package.json`、一个 dev server、
  一次构建、一份 dist。主题就是 `docs/.vitepress/theme/`，没有共享包。
- 运行时：Node `v24.11.0` / npm `11.6.1`；**`vitepress@2.0.0-alpha.20`** + `@vue/theme@2.4.0`
  （与 Vue 官方文档站同款组合；`@vue/theme` 的 peer 仍写 `^1.2.2`，装依赖会有 peer 警告，属已知）。
  V2 用 Vite 8（rolldown），config 走原生 loader：**相对 import 必须带扩展名**。
- **远程与分支**：`origin` 指向用户的 GitHub 仓库（`cmsmll/my-docs`），但推送由用户手动管理
  ——**未获明确指示绝不 push**。`master` 是稳定线，日常工作在 `dev` 分支
  （`origin/main` 落后于两者，是历史遗留的默认分支名，不必纠正）。

**工作区不绑定厂商**：现有两个文档集恰好属于同一厂商，但这不是前提。根层（本文、根
`README.md`、`package.json`）的描述保持中性，只讲「文档集 / 文档中心」；产品信息与所属厂商
由**各文档集自身**声明（其 `index.md` 文案与 config 的页脚）。

**当前规模**（改动后若数字变化，顺手更新本表）：

| 文档集 | Markdown 页面 | 构建产物 HTML |
| --- | --- | --- |
| ifind | 22（guide 18 + reference 3 + index 1） | 22 |
| supermind | 118（guide 100 + reference 17 + index 1） | 118 |
| 根 | 1（文档列表） | 1（+404） |

---

## 二、项目结构

```
document/
├─ package.json              单站点工程（vitepress + @vue/theme + markdown-it-mathjax3）
├─ package-lock.json         唯一的锁文件
├─ .gitattributes            换行符规范（默认 LF，Windows 脚本 CRLF）
├─ .gitignore                忽略 node_modules / dist / cache / __pycache__ / task.md
├─ README.md                 给人看的仓库说明
├─ .omp/AGENTS.md            本文件（omp 原生约定，每次会话自动加载）
├─ task.md                   本地任务文件（临时，不入 git）
│
├─ source/                   原始素材与内容流水线脚本（非发布内容，只增不删）
│  ├─ ifind-manual.html          iFinD 官方手册 HTML（内容校验对照物）
│  ├─ supermind-help-8.html      官网帮助页原始 HTML（抓取缓存）
│  ├─ SuperMind.py               因子检测策略模板（原始素材）
│  ├─ convert_supermind.py       SuperMind 内容转换脚本
│  └─ verify_supermind.py        内容与锚点校验脚本
│
└─ docs/                     站点根
   ├─ index.md              根首页 = 文档列表（数据来自 docs-registry.ts）
   ├─ ifind/                文档集一
   │  ├─ index.md           文档集首页（page: true + Home 组件）
   │  ├─ guide/*.md         18 篇
   │  └─ reference/*.md     3 篇
   ├─ supermind/            文档集二
   │  ├─ index.md           文档集首页
   │  ├─ guide/             100 页
   │  └─ reference/api/     17 页
   └─ .vitepress/
      ├─ config.mts                     站点配置（含 4 处必须保留的适配）
      ├─ docs-registry.ts               文档集注册表（全站唯一真源）
      ├─ sidebar-supermind.json         生成物（勿手改）
      └─ theme/
         ├─ index.ts        主题入口（navbar-title 换站点标题；按路由挂 .doc-home）
         ├─ custom.css      补丁样式（内容宽度、--vp-* 补齐、首页 header 三栏、表格、打印）
         ├─ mergedRootSearchIndex.ts  首页「搜全部」的索引合并插件
         └─ components/
            ├─ DocList.vue  根页文档列表卡片（读 docs-registry.ts）
            ├─ Home.vue     文档集首页（hero/卡片/表格，数据由各集合传入）
            └─ mergeIndexes.ts  两份本地搜索索引的合并（编号偏移重编号）
```

---

## 三、核心架构约束（不可违反）

### 3.1 文档集注册表是唯一真源

- 根页的文档列表、导航栏入口、**各文档集的 header 导航**、搜索范围，**都只从
  `docs/.vitepress/docs-registry.ts` 读**。
- 新增文档集：建 `docs/<path>/` 内容目录 → 在注册表加一条记录（含 `nav`）→ 在
  `config.mts` 的 `sidebar` 里为该路径前缀加一组。**不要**把文档集信息写死在 `index.md`
  的模板里或 `config.mts` 的 nav 数组中。
- 站点标题同样来自注册表的 `siteTitle`（主题入口引用它），不要在 `index.ts` 里重复写死。

### 3.2 路由与链接约定

- 两级路由：`/` 是列表，`/<collection>/` 是文档集。文档集内部沿用各自的 `guide/`、
  `reference/` 结构。
- 正文里的站内链接**必须带文档集前缀**（`/ifind/guide/token`、`/supermind/guide/...`）。
  漏前缀会跳到别的文档集或 404。
- 侧边栏键同样带前缀（`/ifind/`、`/supermind/guide/other/`），VitePress 按**路径前缀**取用。

### 3.3 必须保留的 4 处主题适配

删任何一处都会坏，原因已写在 `config.mts` 注释里：

1. **关闭 `markdown-it-attrs`**（`markdown.attrs.disable`）：手册里的 `{周期1}`、`{周期2}`
   会被当成 HTML 属性吞掉，导致内容静默丢失甚至构建失败。
2. **替换搜索框**：`@vue/theme` 的搜索只支持 Algolia（需凭证），用 Vite alias 把
   `VPNavBarSearch.vue` 换成 VitePress 自带本地搜索。**别名丢了搜索框整个不渲染**（已踩过）。
3. **补齐 `--vp-*` 设计变量**：`@vue/theme` 只定义 `--vt-c-*`，而 VitePress 自带组件引用
   `--vp-c-*` / `--vp-local-search-*`。不补会让搜索弹窗全透明无边框（像「打不开」）。
4. **`@vueuse` 依赖处理**：`@vue/theme` 依赖 `@vueuse/core` v10，VitePress 2 依赖 v14，
   两份并存，须在 `vite.ssr.noExternal` 显式声明（含 baseConfig 漏掉的 `@vueuse/shared`）。
   不声明会在渲染阶段报 `@vueuse/shared does not provide an export named 'createRef'`。

同时必须保留：`markdown.theme: 'github-dark'`、`lineNumbers: false`、`headers.level: [2, 4]`、
`theme-color` meta、本地搜索中文 `translations` 与 i18n 文案、`navbar-title` 插槽替换主题
内置 Vue logo。

**不设 `cleanUrls`**：VitePress 2 起即使该值为 false，页面内生成的链接也是无扩展名形式
（`/ifind/guide/token`），客户端路由自行解析到磁盘上的 `.html` 文件——这是 V2 的行为变化，
与 V1（链接带 `.html`）不同。不要因为看到「链接没有 .html」就去开 `cleanUrls`。

**`markdown.math` 必须为 `true`**：SuperMind 正文含 LaTeX，关闭后公式里的 `{{ }}` 会被 Vue
当成插值表达式导致构建失败。iFinD 正文不含 `$`，开启对它是无害的空操作。

### 3.4 分文档集 header 与搜索范围（locales）

header 与搜索范围靠 VitePress 原生 `locales` 实现，**没有自写导航组件**：

- `resolveSiteDataByRoute` 按当前路由的 locale 层叠 `themeConfig`，各文档集因此有各自的 `nav`。
- 本地搜索索引本就**按 locale 分别建**（`getLocaleForPath` -> `indexByLocales`），
  所以各文档集天然只搜自身。

两个必须遵守的约束（都踩过，会静默出错）：

- **locale 的 key 不能带斜杠**。内部把 key 拼成 `^/${key}/` 去匹配，而待匹配路径已被补上前导
  斜杠；写成 `'/ifind/'` 会得到 `^//ifind//`，永不命中——表现为 **nav 静默变空、索引不再分组**。
  正确写法是目录名本身（`ifind`、`supermind`）。
- **locale 里的 `themeConfig` 是整体替换，不是深合并**。每个 locale 都要把 `nav` 与 `sidebar`
  一同写全，否则该 locale 下缺的那项会消失（例如只写 `nav` 会让侧边栏整个不见）。

**主页「搜全部」** 由 `theme/mergedRootSearchIndex.ts` 实现：root locale 的索引只含主页自身，
因此把 root 的 loader 换成「各文档集索引的合并结果」（`theme/components/mergeIndexes.ts` 负责
按文档编号偏移重编号后合并——两份索引的内部编号都从 0 开始，直接展开会互相覆盖；且序列化索引
不含原文，无法重新 `add()`）。各文档集 loader 原样透传，隔离不受影响。

写这个插件时**必须用 `transform` 改写、不能用 `resolveId`/`load` 替换**：索引映射模块的 load
handler 里带着 `await scanForBuild()`，**索引就是在那一步扫出来的**；替换掉模块会跳过它，
各 locale 的索引会变成空的 `{}`（32 字节），搜索彻底失效。另外 root 的 loader 只能遍历
「各文档集」loader，不能遍历最终导出的映射对象自身，否则无限递归。

### 3.5 内容宽度（单一真源）

全站可见内容的宽度由 CSS 变量 `--doc-layout-width`（`custom.css` 的 `:root`，当前 `1080px`）
统一控制。三处页面（根页 / ifind / supermind）的标题、描述、卡片区、简介区左右边缘必须对齐。

**约定：`max-width` 一律加在带 `padding` 的外框上，不要加在内部文字元素上。**

这条不是风格偏好，是踩过的 bug：两处加在不同层级会导致同一变量算出不同结果。
`#hero` 曾把 `max-width` 加在标题/描述上（算出 1080），而卡片区/简介区加在带
`padding: 0 32px` 的外框上（内容区只剩 1016），于是 hero 比下面宽出 64px。

- 外框用 `max-width: var(--doc-layout-width)` + `margin: 0 auto` + 左右 `32px` padding。
- 内部文字元素不再单独设 `max-width`（宽度由外框统一决定）。
- 变量定义在 `:root`，组件 `scoped` 样式里的 `var()` 同样能取到。
- Vue SFC 里的 `#hero` 是组件内 scoped 选择器，修改时注意它只作用于该组件。

因此「外框 1080 / 可见内容 1016」是**正常且自洽**的：差额就是左右各 32px 留白。
若想让可见内容本身达到 1080，把变量改成 1144px 即可（单点修改，padding 会自然内缩）。

### 3.6 首页 header 的三栏布局（与文档集页面隔离）

首页 header 是三栏：左品牌（「文档中心」原宽度）+ 中间居中搜索框 + 右侧仅主题按钮，**无导航
菜单**。两个文档集页面与内容页的 header 必须保持主题原样，隔离是硬要求。

- 判据用 `.VPApp.doc-home`，由 `theme/index.ts` 按路由挂（仅 `/`，兼容 `/index.html`）。
  **不要**改用主题的 `.VPContentPage`：它同时命中根页与两个文档集首页，无法区分；VitePress 2
  也不消费 `frontmatter.pageClass`。用类而非 CSS `:has()`，是为了让 header 样式不依赖内容区组件结构。
- **所有首页 header 规则都必须带 `.VPApp.doc-home` 前缀**，这是隔离的唯一保证。
- **居中靠 grid 等宽轨道**：`.container` 用 `grid-template-columns: minmax(0,1fr) auto minmax(0,1fr)`，
  左右两轨由布局保证等宽，中间搜索框自然居中。用主题的 `flex + space-between` 时搜索框位置取决于
  右侧按钮宽度，**必然偏移**。为把搜索框单独放进中间格，`.content` 设为 `display: contents`。
- **导航栏左右内边距必须对称**：主题是按「左对齐品牌 + 右对齐按钮」设计的，左右不等（`24/12`，
  `≥768px` 为 `32/12`），会让容器中心偏离视口中心 `(左-右)/2`。首页用左右同值。
- 两处易漏：品牌区需 `justify-self: start`，否则作为 grid 格子会拉伸到整条 `1fr` 轨道，
  **左侧 1/3 全变成回首页链接**；主题在 `<1280px` 隐藏主题按钮（改在「更多」浮层里），
  首页要无视该断点始终显示，否则窄屏无法切换主题。

验证方式：`getBoundingClientRect()` 量 `.VPNavBar .container` 中心与 `.VPNavBarSearch` 中心是否
相等（1440/1280/1024/768/375 五个宽度），并确认文档集页面 `.container` 仍是 `flex`、菜单仍在。

### 3.7 主题能力边界

- **侧边栏只有两级**：`@vue/theme` 的 `VPSidebarGroup` 只渲染「分组标题 + 平铺链接」，不支持
  再嵌套。写三层会渲染成**无 `href` 的假链接、页面全部丢失**。需要多个子分组时，把它们作为
  **同一路径前缀下的多个 group**（参考 `/supermind/guide/other/`）。
- **侧边栏键必须比文档集首页更深**：`getSidebar` 按前缀匹配，用 `/ifind/` 作键会把文档集
  首页 `/ifind/`（`ifind/index.md`）也匹配进去，落地页被套上侧边栏、挤成「带侧边栏的文档页」。
  键一律写到 `guide/`、`reference/` 这一层（如 `/ifind/guide/`、`/supermind/guide/other/`）。
- **侧边栏配置值必须是数组**：`sidebar` 是「路径前缀 → 分组数组」的映射。把一张映射整体
  嵌到某个前缀下会让该键的值是对象而非数组，运行时报 `sidebar is not iterable`；从 JSON
  引入时要**展开到顶层**（`...sidebarSupermind`）。
- **大纲只收 level 2..4**：页内标题必须从 `##` 起，否则右侧「本页内容」是空的。

### 3.8 路径不得依赖 cwd

不要用 `path.resolve('node_modules/...')` 这类相对 cwd 的写法；用
`createRequire(import.meta.url)` 或 `fileURLToPath(import.meta.url)` 定位。config 里已按此实现。

---

## 四、开发规范

### 4.1 常用命令（一律在仓库根执行）

| 命令 | 用途 |
| --- | --- |
| `npm install` | 装依赖 |
| `npm run docs:dev` | 本地预览（热更新） |
| `npm run docs:build` | 构建到 `docs/.vitepress/dist` |
| `npm run docs:preview` | 预览构建产物 |

包管理一律用 **npm**。

**注意**：`vitepress preview` 对 `/ifind/`、`/supermind/` 这类目录 URL 会回退到 404 页
（它的 SPA fallback 行为）。产物本身是好的，要验证目录 URL 请用静态服务器
（如 `python -m http.server --directory docs/.vitepress/dist`）。

### 4.2 内容与代码的边界

- **iFinD 的 22 篇正文是既有成果，原则上不动**。`source/ifind-manual.html` 是校验对照物，
  **不得删改**。
- **supermind 的 `docs/supermind/**/*.md` 是生成物**：由 `source/convert_supermind.py` 产出。
  要改内容结构（分页、目录、分组、URL），**改脚本再重跑**，不要手改生成出来的 md。
- **`docs/.vitepress/sidebar-supermind.json` 是生成物**，手改会被重跑覆盖。要调整就改脚本里的
  `DOC_LAYOUT` / `SIDEBAR_GROUPS` / `MERGED_DIR` / `_write_sidebar`。
- `source/` 下的原始素材**只增不删**——它们是内容校验与二次转换的依据。

### 4.3 supermind 内容更新流程

```bash
python source/convert_supermind.py                          # 转换（带本地缓存，不重新抓取）
npm run docs:build
python source/verify_supermind.py docs/.vitepress/dist      # 校验
```

`verify_supermind.py` 的三项指标必须分别是：`未解析锚点 0 处`、`渲染 id 不匹配 0`、
`源中出现、生成中未出现的长行 0`。任一非 0 都说明转换出错，**不要提交**。

校验脚本只比对 `docs/supermind/`（本文档集）自己的内容——整站含多个文档集，从 `docs/` 起
扫会把 iFinD 正文算成「生成物」，产生大量假丢失。

转换脚本依赖 `pypinyin`（中文标题转拼音文件名），需已安装。

### 4.4 新增文档集

1. 建内容目录 `docs/<path>/`，写 `index.md`（`page: true` + `Home` 组件，数据写在
   `<script setup>` 里）。
2. 在 `docs/.vitepress/docs-registry.ts` 的 `collections` 加一条记录，含 `path`/`title`/
   `description`/`tagline`/`link`/`tags`/**`nav`**（`nav` 即该文档集页面的 header 详细条目）。
   **文档列表、主页导航、该文档集的 header、搜索范围都会自动生效**——`config.mts` 的
   `locales` 由注册表生成，`path` 同时就是 locale 键。
3. 在 `docs/.vitepress/config.mts` 的 `sidebar` 里加 `'/<path>/': [...]` 一组。
4. `npm run docs:build` 验证。

正文含 LaTeX 的文档集无需改配置（`math` 已是全站开启）。

### 4.5 代码风格

- 注释与文案**一律中文**，注释解释「**为什么**」而非「做了什么」——尤其是主题适配、
  路径解析、分页规则这类反直觉的地方，必须留下原因。
- 站点配置用 `.mts`，主题代码用 TypeScript + Vue SFC。
- 不引入未使用的抽象，不为一次性需求加配置项。
- **厂商与产品信息分层写**：
  - 根层（根 `README.md`、`package.json`、本文）只写「文档中心 / 文档集」，**不写厂商名**
    ——本仓库不限定只放某一家的产品文档。
  - 厂商标识只在**文档集内**出现：其 `index.md` 文案、config 的页脚。要写就写真实厂商。
  - 例外：文档集正文里出现的厂商名属于**原文内容**（如官方文档原文），照抄不改。
- **换行符由 `.gitattributes` 统一管理，不要依赖本机 `core.autocrlf`**：
  - 默认 `* text=auto eol=lf`——仓库内与工作区一律 LF。
  - Windows 脚本（`*.bat`/`*.cmd`/`*.ps1`/`*.psm1`/`*.psd1`/`*.vbs`/`*.reg`）强制 CRLF：
    cmd.exe、PowerShell 对 LF 敏感（批处理的 `goto`/标签、续行符 `^` 在 LF 下会出错）。
  - 新增此类脚本时无需改配置，规则已覆盖；新增**其他**需要 CRLF 的文件类型，才在
    `.gitattributes` 里补一行并说明原因。
  - 若改动后 `git status` 出现大量 `M` 但 `git diff` 无输出，是 index 的 stat 缓存问题，
    用 `git add --renormalize .` 处理，不要逐文件重写。

---

## 五、AI 开发规范（强制）

### 5.1 提交

- **每次修改代码都必须提交到本地仓库**，不得遗留未提交的改动。完成任务后 `git status`
  应为干净（或只剩与本次任务无关、用户自己的改动）。
- **只有用户明确说「提交到远程 / push」时才推送**。默认**绝不**执行 `git push`，也不添加
  remote；远程由用户手动管理。
- **一次提交只做一件事**：代码 + 相关文档/脚本同提交，不混入无关改动。
- **改动都提交到 `dev` 分支**（`dev` 是工作分支，`master` 保持稳定、不要直接在上面提交）。
  需要大改时先在 `dev` 上做，是否合并回 `master` 由用户决定——**合并同样要用户明确授权**。
- **提交信息格式：Conventional Commits + 中文说明**。类型用 `feat` / `fix` / `refactor` /
  `docs` / `chore` / `test` / `style` / `perf` / `build` / `ci`，说明用中文：
  - `feat: 新增文档列表页与二级路由`
  - `fix: 恢复被误删的搜索框别名`
  - `refactor: 合并为单站点`
  - `docs: 更新项目结构与开发规范`
  - `chore: 忽略 __pycache__`

### 5.2 测试

- **开发不需要编写任何测试**。不要新增测试文件、测试框架或测试脚本。
- 验证靠**实际运行**：改完跑 `npm run docs:build` 或起 `preview` 看一眼，把真实输出作为依据。
  **不要**用「写个测试」替代「跑一次」。
- `source/verify_supermind.py` 是既有的内容校验工具，属于内容流水线的一部分，该跑就跑；
  这不算「编写测试」，也不要删。

### 5.3 遇到不清楚的地方必须停下来问

- **只要存在影响实现方向的不明确点，就停下来问，不要猜着做。**
- 提问方式：用 `ask` **一次性列出一组问题**（通常 2–5 个），每个问题：
  - 说明**背景与现状**（涉及哪些文件/约束、为什么有歧义）
  - 给出 **2–5 个候选选项**，每项说明差异与后果
  - 标出**推荐项**及理由
- 判定标准：
  - **必须问**：措辞有歧义且不同理解产出不同结果；任务与现状冲突；破坏性操作
    （删除/覆盖文件、改 URL、改目录结构）；会成为后续工作契约的选择（路由、目录、schema）。
  - **不必问**：能在仓库里查到答案的；各选项差别不大、怎么选都合理的细节；用户已明说过的。
    自行决定并在交付说明里写明假设。
- 得到答案后按答案执行；答案与先前的假设冲突时以答案为准，并说明调整点。

### 5.4 改动纪律

- 动手前先读相关文件与本文档，复用既有模式；**不要在既有约定之外另起一套**。
- 改共享主题/配置前，先确认**所有文档集**都会受影响；改完整站都要构建通过。
- 大改动（如改路由结构）**必须**在动手前把技术前提验证清楚（读源码、做最小实验），
  不要凭猜测给用户选项。
- 不移除、不改写用户未要求改动的内容；发现无关的既有问题，报告而不顺手改。
- 不擅自升级依赖（当前 `vitepress@2.0.0-alpha.20` + `@vue/theme@2.4.0`，见第一节的版本说明）；
  升级需先问。注意 VitePress 2 仍是 alpha，升级前必须完整跑一遍构建与本文第六节的验证清单。
- 不新增与本任务无关的依赖、脚本、CI 配置、格式化配置。
- 交付时说明：改了什么、验证方式与结果、遗留问题与假设。

---

## 六、验证清单（改完自查）

- [ ] `npm run docs:build` 通过，无 error、无 dead link 警告
- [ ] 根页 `/` 显示文档列表，卡片指向各文档集首页
- [ ] 各文档集首页能打开，侧边栏链接数与内容页数一致
- [ ] 若动了 supermind 内容：`verify_supermind.py` 三项指标均为 0
- [ ] 若动了主题配置：**导航栏搜索框存在**、弹窗有背景与边框（验证搜索别名与 `--vp-*` 补齐）
- [ ] 各文档集首页 `/ifind/`、`/supermind/` 是**纯落地页**：有 hero，**没有侧边栏**
- [ ] 若动了导航/侧边栏：侧边栏链接可点（无 `href` 的假链接 = 层级超两级或键值是映射）
- [ ] 若动了宽度/布局：三处页面（`/`、`/ifind/`、`/supermind/`）的标题、描述、卡片区、
      简介区左右边缘对齐（外框 1080 / 可见内容 1016，差额是左右各 32px padding）
- [ ] 若动了 header：首页 `/` 三栏成立（搜索框中心 == `.container` 中心，左右两轨等宽，
      **无导航菜单**、主题按钮可见）；`/ifind/`、`/supermind/` 与内容页 header 仍是主题原样
      （`.container` 为 `flex`、菜单条目完整）
- [ ] 代码块仍为深底 `#24292e` / 字色 `#e1e4e8`；iFinD 的 `{周期1}` 文本完整可见
- [ ] 正文站内链接都带文档集前缀
- [ ] `git status` 干净，改动已按 5.1 提交
