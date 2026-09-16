import path from 'node:path'
import { defineConfigWithTheme } from 'vitepress'
import baseConfig from '@vue/theme/config'
import type { Config as ThemeConfig } from '@vue/theme'

/**
 * 本站使用 Vue 官方文档同款主题 @vue/theme（cn.vuejs.org 本体主题）。
 *
 * 两处必须的适配，原因记录在此以免日后误删：
 * 1. attrs 插件关闭：手册中 `{周期1},{周期2}` 这类技术指标参数文本会被
 *    markdown-it-attrs 当成 HTML 属性吞掉，必须关闭花括号语法。
 * 2. VPNavBarSearch 别名替换：@vue/theme 的搜索框只支持 Algolia（需凭证），
 *    这里换成 VitePress 自带的本地搜索组件，保留离线可用的全文搜索。
 */

// 编号沿用原手册（原手册没有第 6 节，编号存在跳号，照抄不改）
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

const vpTheme = path.resolve('node_modules/vitepress/dist/client/theme-default')

const themeConfig: ThemeConfig = {
  nav: [
    { text: '快速开始', link: '/guide/token', activeMatch: '^/guide/token' },
    { text: '接口参考', link: '/guide/basic-data', activeMatch: '^/guide/(?!token)' },
    { text: '错误码', link: '/reference/errors', activeMatch: '^/reference/' },
  ],

  sidebar: {
    '/guide/': [
      {
        text: '一、TOKEN获取与使用',
        items: [{ text: '鉴权与取数流程', link: '/guide/token' }],
      },
      {
        text: '二、各函数URL及formData生成逻辑',
        items: FN_PAGES.map(([slug, text]) => ({ text, link: `/guide/${slug}` })),
      },
    ],
    '/reference/': [
      {
        text: '附录',
        items: [
          { text: '三、错误说明', link: '/reference/errors' },
          { text: '四、适用范围', link: '/reference/scope' },
          { text: '五、版本管理', link: '/reference/versioning' },
        ],
      },
    ],
  },

  footer: {
    copyright:
      'iFinD HTTP API 用户手册 · 由官方 PDF 手册结构化转换生成 · 版本 2.1 · 2025-08-25',
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
  title: 'iFinD HTTP API 用户手册',
  description:
    '同花顺 iFinD HTTP API 官方手册（v2.1）：TOKEN 鉴权、各函数 URL 与 formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。',

  // baseConfig 预置的 /logo.svg 本站没有对应资源，换成主题色声明
  head: [['meta', { name: 'theme-color', content: '#42b883' }]],

  // 不设 cleanUrls：@vue/theme 生成的链接带 .html（与 cn.vuejs.org 一致），
  // 开启后配置与主题的链接约定不一致。

  markdown: {
    ...baseConfig.markdown,
    // 与 cn.vuejs.org 一致：代码块使用深色单主题
    theme: 'github-dark',
    lineNumbers: false,
    // 花括号在本手册中是数据，不是 HTML 属性语法
    attrs: { disable: true },
    // 手册层级较深（正文含 h4），比 Vue 文档多保留一层目录
    headers: { level: [2, 4] },
  },

  vite: {
    ...baseConfig.vite,
    // @vue/theme 仍依赖 @vueuse/core v10，而 VitePress 1.6 依赖 v12。
    // npm 只能提升一份，把 v10 误留给 v12 使用会报 pxValue 缺失；
    // 这里显式声明不外部化，（baseConfig 漏了 @vueuse/shared）。
    ssr: {
      ...baseConfig.vite?.ssr,
      noExternal: ['@vue/theme', '@vueuse/core', '@vueuse/shared', '@vueuse/metadata'],
    },
    optimizeDeps: {
      ...baseConfig.vite?.optimizeDeps,
      exclude: ['@vue/theme'],
    },
    resolve: {
      alias: [
        // 用 VitePress 自带本地搜索替换 @vue/theme 的 Algolia 搜索框
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
