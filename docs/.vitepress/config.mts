import path from 'node:path'
import { createRequire } from 'node:module'
import { defineConfigWithTheme } from 'vitepress'
import baseConfig from '@vue/theme/config'
import type { Config as ThemeConfig } from '@vue/theme'
import { collections, siteTitle } from './docs-registry'
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
 * 注意 supermind 的 sidebar-supermind.json 本身就是「路径键 → 分组数组」的映射
 * （键形如 `/supermind/guide/other/`），必须**展开到顶层**；把它整张嵌进
 * `/supermind/` 会让该键下的值是对象而非数组，运行时报 `sidebar is not iterable`。
 */
const sidebar: ThemeConfig['sidebar'] = {
  '/ifind/': [
    {
      text: '一、TOKEN获取与使用',
      items: [{ text: '鉴权与取数流程', link: '/ifind/guide/token' }],
    },
    {
      text: '二、各函数URL及formData生成逻辑',
      items: FN_PAGES.map(([slug, text]) => ({ text, link: `/ifind/guide/${slug}` })),
    },
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
  nav,
  sidebar,

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

  // baseConfig 预置的 /logo.svg 本站没有对应资源，换成主题色声明
  head: [['meta', { name: 'theme-color', content: '#42b883' }]],

  // 不设 cleanUrls：@vue/theme 生成的链接带 .html（与 cn.vuejs.org 一致），
  // 开启后配置与主题的链接约定不一致。

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
    ssr: {
      ...baseConfig.vite?.ssr,
      // @vue/theme 仍依赖 @vueuse/core v10，而 VitePress 1.6 依赖 v12。
      // npm 只能提升一份，把 v10 误留给 v12 使用会报 pxValue 缺失；
      // 这里显式声明不外部化（baseConfig 漏了 @vueuse/shared）。
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
