/**
 * 文档集注册表 —— 全站唯一真源。
 *
 * 新增一个文档集时，**只在这里加一条记录**并放入对应内容目录，文档列表页与导航会自动出现。
 * 不要把文档集信息写死在 `index.md` 或 `config.mts` 里。
 *
 * 约定：`path` 同时是 URL 前缀与内容目录（`docs/<path>/`）。
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
}

export const collections: DocCollection[] = [
  {
    path: 'ifind',
    title: 'iFinD HTTP API 用户手册',
    description: '同花顺 iFinD HTTP API 官方手册（v2.1）',
    tagline: 'TOKEN 鉴权、各函数 URL 与 formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。',
    link: '/ifind/',
    tags: ['HTTP API', 'v2.1'],
  },
  {
    path: 'supermind',
    title: 'SuperMind 帮助文档',
    description: '同花顺 SuperMind 量化投资交易平台官方帮助文档',
    tagline: '策略 API、回测引擎、因子研究、模拟仿真、研究环境、智能交易与常见问题。',
    link: '/supermind/',
    tags: ['量化平台', '策略开发'],
  },
]

/** 站点标题：导航栏品牌区显示 */
export const siteTitle = '文档中心'
