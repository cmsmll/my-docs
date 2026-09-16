/**
 * 文档集注册表 —— 全站唯一真源。
 *
 * 新增一个文档集时，**只在这里加一条记录**并放入对应内容目录，文档列表页、首页导航、
 * 该文档集的 header 导航都会自动出现。不要把文档集信息写死在 `index.md` 或 `config.mts` 里。
 *
 * 约定：`path` 同时是 URL 前缀、内容目录（`docs/<path>/`）与 locale 键（见 config.mts）。
 */
export interface DocCollection {
  /** URL 前缀，同时也是 docs 下的目录名，如 'ifind' -> /ifind/ */
  path: string
  /** 文档集名称（列表页标题、导航显示名） */
  title: string
  /** 列表页副标题 / 卡片描述 */
  description: string
  /** 一句话定位，列表页卡片上给读者判断「这是不是我要找的」 */
  tagline: string
  /** 文档集首页（列表页卡片与导航的入口） */
  link: string
  /** tiny 标签，用于列表页区分归属 */
  tags: string[]
  /**
   * 该文档集页面的 header 导航（原「详细条目」，从双站点时期沿用）。
   * 每项：`text` 显示名，`link` 目标，`activeMatch` 高亮用正则（可选）。
   */
  nav: { text: string; link: string; activeMatch?: string }[]
}

export const collections: DocCollection[] = [
  {
    path: 'ifind',
    title: 'iFinD HTTP API 用户手册',
    description: '同花顺 iFinD HTTP API 官方手册（v2.1）',
    tagline: 'TOKEN 鉴权、各函数 URL 与 formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。',
    link: '/ifind/',
    tags: ['HTTP API', 'v2.1'],
    nav: [
      { text: '快速开始', link: '/ifind/guide/token', activeMatch: '^/ifind/guide/token' },
      { text: '接口参考', link: '/ifind/guide/basic-data', activeMatch: '^/ifind/guide/(?!token)' },
      { text: '错误码', link: '/ifind/reference/errors', activeMatch: '^/ifind/reference/' },
    ],
  },
  {
    path: 'supermind',
    title: 'SuperMind 帮助文档',
    description: '同花顺 SuperMind 量化投资交易平台官方帮助文档',
    tagline: '策略 API、回测引擎、因子研究、模拟仿真、研究环境、智能交易与常见问题。',
    link: '/supermind/',
    tags: ['量化平台', '策略开发'],
    nav: [
      {
        text: '因子研究',
        link: '/supermind/guide/factor-research/duo-yin-zi-yan-jiu-jian-jie',
        activeMatch: '^/supermind/guide/factor-research/',
      },
      {
        text: '回测引擎',
        link: '/supermind/guide/backtest-engine/bian-xie-gu-piao-jiao-yi-ce-lve',
        activeMatch: '^/supermind/guide/backtest-engine/',
      },
      { text: '其他', link: '/supermind/guide/other/mo-ni-jiao-yi', activeMatch: '^/supermind/guide/other/' },
      { text: 'API 文档', link: '/supermind/reference/api/index', activeMatch: '^/supermind/reference/api/' },
      { text: '常见问题', link: '/supermind/guide/faq/guan-yu-supermind', activeMatch: '^/supermind/guide/faq/' },
      { text: '智能交易', link: '/supermind/guide/smart-trading/index', activeMatch: '^/supermind/guide/smart-trading/' },
      { text: 'AI Lab', link: '/supermind/guide/ai-lab/shi-yong-qian-bi-du', activeMatch: '^/supermind/guide/ai-lab/' },
    ],
  },
]

/** 站点标题：导航栏品牌区显示 */
export const siteTitle = '文档中心'
