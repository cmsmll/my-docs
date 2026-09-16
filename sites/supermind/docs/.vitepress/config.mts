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
})
