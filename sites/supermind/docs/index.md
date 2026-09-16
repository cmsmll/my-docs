---
page: true
title: SuperMind 帮助文档
---

<script setup>
import Home from '@theme/components/Home.vue'

// 首页文案与数据。布局与样式在共享的 @doc/theme 里，此处只放本站内容。
const home = {
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
    { version: 'AI Lab', date: 'AI 赋能', note: '研报复现、量化实验室与表达式写法' },
    { version: '智能交易', date: '客户端', note: '智能交易系统功能说明书' },
  ],
}
</script>

<Home v-bind="home" />
