import { createSiteConfig } from '@doc/theme/config'

/**
 * iFinD HTTP API 用户手册站点配置。
 *
 * 与站点身份无关的部分（markdown / vite / head / i18n / 搜索文案，
 * 以及 4 处必须保留的主题适配）全部在共享层 `@doc/theme/config` 中，
 * 此处只声明本站的标题、导航、侧边栏与页脚。
 *
 * 主题入口见 `theme/index.ts`；补丁样式与首页组件也在共享层。
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

export default createSiteConfig({
  title: 'iFinD HTTP API 用户手册',
  description:
    '同花顺 iFinD HTTP API 官方手册（v2.1）：TOKEN 鉴权、各函数 URL 与 formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。',

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
})
