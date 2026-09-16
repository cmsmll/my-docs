import path from 'node:path'
import { createRequire } from 'node:module'
import { defineConfigWithTheme } from 'vitepress'
import baseConfig from '@vue/theme/config'
import type { Config as ThemeConfig } from '@vue/theme'
import { collections, siteTitle } from './docs-registry.ts'
import { mergedRootSearchIndex } from './theme/mergedRootSearchIndex.ts'
import sidebarSupermind from './sidebar-supermind.json' with { type: 'json' }

/**
 * 文档中心站点配置（单站点）。
 *
 * 路由分两级：
 *   /            文档列表（docs/index.md，由 docs-registry.ts 驱动）
 *   /<collection>/  各文档集（内容在 docs/<collection>/）
 *
 * 与站点身份无关的固定配置（markdown / vite / head / i18n / 搜索文案，以及 4 处必须保留的
 * 主题适配）都在本文件里集中维护，改一处即全站生效——本工作区现在只有一个站点，不再需要
 * 拆出共享配置包。
 *
 * 注意：本站正文含 LaTeX 公式（SuperMind 部分），故开启 `math`；否则公式里的 `{{ }}` 会被
 * Vue 当成插值表达式导致构建失败。iFinD 部分正文不含 `$`，开启对它是无害的空操作。
 *
 * 本站跑在 VitePress 2（当前为 alpha）上，与 Vue 官方文档站同款组合
 * （`@vue/theme@2.4.0` + `vitepress@^2.0.0-alpha`）——官方 `@vue/theme` 的
 * peerDependencies 仍写着 `^1.2.2`，装的时候会有 peer 警告，属已知情况。
 * V2 使用 Vite 8（rolldown），config 由原生 loader 加载：**相对导入必须带扩展名**
 * （见下面的 `./docs-registry.ts`），否则构建会告警。
 */

const require = createRequire(import.meta.url)
// 用 require 解析 vitepress 安装位置，而不是 path.resolve('node_modules/...')：
// 后者相对 cwd，cwd 一变就解析失败。
const vpTheme = path.join(
  path.dirname(require.resolve('vitepress/package.json')),
  'dist/client/theme-default'
)

// iFinD 编号沿用原手册（原手册没有第 6 节，编号存在跳号，照抄不改）
const FN_PAGES: [string, string][] = [
  ['basic-data', '1、基础数据'],
  ['date-sequence', '2、日期序列'],
  ['history-quotation', '3、历史行情'],
  ['high-frequency', '4、高频序列'],
  ['realtime-quotation', '5、实时行情'],
  ['edb', '7、经济数据库(EDB)'],
  ['data-pool', '8、专题报表函数'],
  ['portfolio', '9、组合管理'],
  ['smart-stock-picking', '10、智能选股'],
  ['fund-valuation-minute', '11、基金实时估值(分钟)'],
  ['fund-valuation-daily', '12、基金实时估值(日)'],
  ['trade-dates', '13、日期查询函数'],
  ['trade-date-offset', '14、日期偏移函数'],
  ['data-volume', '15、数据量查询'],
  ['error-message', '16、错误信息查询'],
  ['thscode', '17、证券代码证券简称转同花顺代码'],
  ['report-query', '18、公告查询'],
]

/** 导航：第一项是文档列表，其余由注册表生成（下拉，指向各文档集首页） */
const nav: ThemeConfig['nav'] = [
  { text: '文档列表', link: '/' },
  ...collections.map((c) => ({ text: c.title, link: c.link })),
]

/**
 * 侧边栏：按 URL 前缀挂各文档集自己的目录（VitePress 内部按路径前缀取用）。
 *
 * 两点必须注意：
 *
 * 1. **键要比文档集首页更深**。`getSidebar` 是前缀匹配，若用 `/ifind/` 作键，文档集首页
 *    `/ifind/`（即 `ifind/index.md`）也会被匹配到，于是落地页被套上侧边栏、挤成「带侧边栏
 *    的文档页」——结构就错了。所有键都写到 `guide/`、`reference/` 这一层。
 * 2. **值必须是分组数组**。`sidebar-supermind.json` 本身是「路径键 → 分组数组」的映射，
 *    必须**展开到顶层**；整张嵌进某个前缀下会让该键的值是对象而非数组，运行时报
 *    `sidebar is not iterable`。
 */
const sidebar: ThemeConfig['sidebar'] = {
  '/ifind/guide/': [
    {
      text: '一、TOKEN获取与使用',
      items: [{ text: '鉴权与取数流程', link: '/ifind/guide/token' }],
    },
    {
      text: '二、各函数URL及formData生成逻辑',
      items: FN_PAGES.map(([slug, text]) => ({ text, link: `/ifind/guide/${slug}` })),
    },
  ],
  '/ifind/reference/': [
    {
      text: '附录',
      items: [
        { text: '三、错误说明', link: '/ifind/reference/errors' },
        { text: '四、适用范围', link: '/ifind/reference/scope' },
        { text: '五、版本管理', link: '/ifind/reference/versioning' },
      ],
    },
  ],
  ...sidebarSupermind,
}

const themeConfig: ThemeConfig = {
  // 说明：`nav` / `sidebar` 已移到下面的 `locales` 里逐文档集声明——locale 的 themeConfig
  // 是整体替换而非深合并，所以每个 locale 都要自带这两项。此处只保留全站共用的配置。

  footer: {
    copyright: '文档中心 · 内容由各产品官方文档结构化转换生成',
  },

  i18n: {
    search: '搜索文档',
    menu: '目录',
    toc: '本页内容',
    returnToTop: '回到顶部',
    appearance: '主题',
    previous: '上一篇',
    next: '下一篇',
    pageNotFound: '页面不存在',
    ariaAnnouncer: { before: '页面', after: ' 已加载' },
    ariaDarkMode: '切换深色模式',
    ariaSkipToContent: '跳至内容',
    ariaToC: '当前页面目录',
    ariaMainNav: '主导航',
    ariaMobileNav: '移动端导航',
    ariaSidebarNav: '侧边栏导航',
  },
}

export default defineConfigWithTheme<ThemeConfig>({
  ...baseConfig,
  lang: 'zh-CN',
  title: siteTitle,
  description:
    '文档中心：汇总各产品的官方文档站点。当前收录 iFinD HTTP API 用户手册与 SuperMind 帮助文档。',

  /**
   * 按文档集分 header 与搜索范围。
   *
   * 两件事都靠 VitePress 原生的 locales 机制实现，没有自写导航组件：
   *   - `resolveSiteDataByRoute` 会按当前路由的 locale 层叠 `themeConfig`，于是各文档集
   *     能有各自的 `nav`（即「主页一份、ifind 一份、supermind 一份」）。
   *   - 本地搜索的索引本来就没有全局一份，而是**按 locale 分别建索引**
   *     （`getLocaleForPath` -> `indexByLocales`），所以各文档集天然只搜到自己。
   *
   * 两个必须遵守的约束（都踩过）：
   *   1. locale 的 key **不能带斜杠**。内部把 key 拼成 `^/${key}/` 去匹配，而待匹配路径
   *      已被补上前导斜杠，写成 `'/ifind/'` 会得到 `^//ifind//`，永不命中（表现为 nav 静默变空）。
   *   2. locale 里的 `themeConfig` 是**整体替换**根 `themeConfig`，不是深合并。
   *      所以每个 locale 都要把 `nav` 与 `sidebar` 一同写全。
   *
   * 主页（root）承载「搜全部」：`root` locale 的索引只含主页自身，因此用一个 Vite 插件
   * 把 root 的搜索索引换成各 locale 索引的合并结果
   * （见 theme/mergedRootSearchIndex.ts + theme/components/mergeIndexes.ts）。
   * 各文档集的 loader 原样透传，所以它们的搜索范围不受影响。
   */
  locales: {
    root: {
      label: siteTitle,
      themeConfig: {
        // 主页导航：列出全部文档集
        nav: [
          { text: '文档列表', link: '/' },
          ...collections.map((c) => ({ text: c.title, link: c.link })),
        ],
        sidebar,
      },
    },
    // 各文档集：key 取目录名（不带斜杠），nav 取注册表里的详细条目
    ...Object.fromEntries(
      collections.map((c) => [
        c.path,
        {
          label: c.title,
          themeConfig: {
            // 文档集内保留一个回主页的入口，其余为本文档集的详细条目
            nav: [{ text: '文档列表', link: '/' }, ...c.nav],
            sidebar,
          },
        },
      ])
    ),
  },

  // baseConfig 预置的 /logo.svg 本站没有对应资源，换成主题色声明
  head: [['meta', { name: 'theme-color', content: '#42b883' }]],

  // 不设 cleanUrls。VitePress 2 起、即使 cleanUrls 为 false，页面内生成的链接也已是
  // 无扩展名的形式（`/ifind/guide/token`），客户端路由会自行解析到对应的 .html 文件；
  // 磁盘产物仍是 `<page>.html`。这是 V2 的行为变化，与 V1（链接带 .html）不同。

  markdown: {
    ...baseConfig.markdown,
    // 与 cn.vuejs.org 一致：代码块使用深色单主题
    theme: 'github-dark',
    lineNumbers: false,
    // 正文里 `{周期1}` 这类花括号是数据，不是 markdown-it-attrs 的 HTML 属性语法；
    // 不关闭会被静默吞掉，导致内容丢失甚至构建失败。
    attrs: { disable: true },
    // 文档正文层级较深（含 h4），比 Vue 文档多保留一层目录
    headers: { level: [2, 4] },
    // 正文含 LaTeX（SuperMind 部分）需开启；否则公式里的 {{ }} 会被 Vue 当成插值。
    math: true,
  },

  vite: {
    ...baseConfig.vite,
    // 主页「搜全部」：把 root locale 的搜索索引换成各文档集索引的合并结果。
    // 各文档集本身不受影响，仍是各自独立的索引（只搜自身）。
    plugins: [mergedRootSearchIndex(collections.map((c) => c.path))],
    ssr: {
      ...baseConfig.vite?.ssr,
      // @vue/theme 依赖 @vueuse/core v10，而 VitePress 2 依赖 v14；两份并存时
      // 不显式声明 noExternal，SSR 阶段会报
      // `@vueuse/shared does not provide an export named 'createRef'`
      //（VitePress 1.6 下的同源报错是 pxValue 缺失）。baseConfig 漏了 @vueuse/shared。
      noExternal: ['@vue/theme', '@vueuse/core', '@vueuse/shared', '@vueuse/metadata'],
    },
    optimizeDeps: {
      ...baseConfig.vite?.optimizeDeps,
      exclude: ['@vue/theme'],
    },
    resolve: {
      alias: [
        // 用 VitePress 自带本地搜索替换 @vue/theme 的 Algolia 搜索框（后者需凭证）。
        // 别名丢了会让导航栏的搜索框整个不渲染——这是必须保留的适配之一。
        {
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: path.join(vpTheme, 'components/VPNavBarSearch.vue'),
        },
      ],
    },
  },

  themeConfig: {
    ...themeConfig,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            displayDetails: '显示详情',
            backButtonTitle: '返回',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc',
            },
          },
        },
      },
    },
  },
})
