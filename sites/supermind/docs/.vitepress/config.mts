import { createSiteConfig } from '@doc/theme/config'
import nav from './nav.json' with { type: 'json' }
import sidebar from './sidebar.json' with { type: 'json' }

/**
 * SuperMind 帮助文档站点配置。
 *
 * 与 iFinD 站点共用同一套主题与构建配置（共享层 `@doc/theme`），此处只声明
 * 本站的标题、导航、侧边栏与页脚。nav / sidebar 由
 * `source/convert_supermind.py` 依据官网帮助站内容结构生成。
 *
 * 本站正文含 LaTeX 公式，故开启 `math`（否则公式里的 `{{ }}` 会被 Vue 当成插值）。
 */
export default createSiteConfig({
  title: 'SuperMind 帮助文档',
  description:
    '同花顺 SuperMind 量化投资交易平台官方帮助文档：策略 API、回测引擎、因子研究、模拟仿真、研究环境、智能交易与常见问题。',

  nav,
  sidebar,
  math: true,

  footer: {
    copyright: 'SuperMind 帮助文档 · 内容取自同花顺官方帮助中心',
  },

  home: {
    accent: 'SuperMind',
    tagline: '帮助文档',
    description:
      '同花顺 SuperMind 量化投资交易平台官方帮助文档网页版：策略 API、回测引擎、因子研究、模拟仿真、研究环境、智能交易与常见问题。内容由官方帮助中心结构化转换，未增删事实。',
    actions: [
      { text: '快速开始', link: '/guide/local-sdk/yi-qian-yan', kind: 'primary' },
      { text: 'API 文档', link: '/reference/api/zhong-yao-xie-zai-zui-qian-mian', kind: 'secondary' },
      { text: '常见问题', link: '/guide/faq/guan-yu-supermind', kind: 'secondary' },
    ],
    highlights: [
      {
        title: '策略 API',
        text: '回测引擎专用 API、行情资金、证券信息、表数据、问财与组合优化器等接口。',
      },
      {
        title: '回测引擎',
        text: '股票、期货、场外基金、T+0、外汇、T+D 与指标策略回测引擎的运行机制与撮合规则。',
      },
      {
        title: '因子研究',
        text: '因子检测、因子库、因子策略、风险模型、组合优化器与组合归因。',
      },
    ],
    introTitle: '简介',
    intro:
      'SuperMind 是同花顺旗下的量化投资交易平台，提供高质海量的金融数据、零延迟的回测引擎与最接近真实市场环境的仿真交易平台，支持 Python 策略开发。',
    versionsTitle: '文档分区',
    versions: [
      { version: '本地SDK', date: '本地部署', note: '申请条件、流程与注意事项' },
      { version: 'API 文档', date: '接口参考', note: '策略常用接口与对象' },
      { version: '智能交易', date: '客户端', note: '智能交易系统功能说明书' },
    ],
  },
})
