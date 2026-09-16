---
page: true
title: iFinD HTTP API 用户手册
---

<script setup>
import Home from '@theme/components/Home.vue'

// 首页文案与数据。布局与样式见 docs/.vitepress/theme/components/Home.vue，此处只放本文档集的内容。
const home = {
  accent: 'iFinD HTTP API',
  tagline: '用户手册',
  description:
    '同花顺 iFinD HTTP API 官方手册（v2.1）网页版：TOKEN 鉴权、各函数 URL 与 formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。内容由 PDF 手册逐页结构化转换，未增删事实。',
  actions: [
    { text: '快速开始', link: '/ifind/guide/token', kind: 'primary' },
    { text: '接口参考', link: '/ifind/guide/basic-data', kind: 'secondary' },
    { text: '错误码', link: '/ifind/reference/errors', kind: 'secondary' },
  ],
  highlights: [
    {
      title: 'TOKEN 鉴权',
      text: '长期 refresh_token 与短期 access_token 的获取、刷新与失效规则。',
    },
    {
      title: '各函数接口',
      text: '基础数据、日期序列、历史行情、高频序列、实时行情、EDB、专题报表与组合管理等。',
    },
    {
      title: '错误码字典',
      text: '涵盖鉴权、参数、限额与服务端等 70 余项错误码及中文提示。',
    },
  ],
  introTitle: '简介',
  intro:
    'iFinD HTTP API 是对过去各语言SDK形式的一个补充，用户可以以API形式直接向同花顺服务器发送HTTP请求，运行环境不再需要下载SDK，从而使用户摆脱设备、语言、环境的限制。',
  versionsTitle: '版本记录',
  versions: [
    { version: '1.0', date: '2021-12-29', note: '初版发布' },
    { version: '2.0', date: '2024-03-29', note: '迭代版本' },
    { version: '2.1', date: '2025-08-25', note: '说明修正' },
  ],
}
</script>

<Home v-bind="home" />
