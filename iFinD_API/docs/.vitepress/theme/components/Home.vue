<script setup lang="ts">
/**
 * 首页。Vue 官方文档的主题（@vue/theme）不使用 VitePress 的 `layout: home`，
 * 而是在 `page: true` 的页面里挂载自定义组件，故此处沿用同一做法。
 * 文案与表格数据均取自原手册，未增删事实。
 */
const highlights = [
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
]

const versions = [
  ['1.0', '2021-12-29', '初版发布'],
  ['2.0', '2024-03-29', '迭代版本'],
  ['2.1', '2025-08-25', '说明修正'],
]
</script>

<template>
  <section id="hero">
    <h1 class="tagline">
      <span class="accent">iFinD HTTP API</span>
      <br />用户手册
    </h1>
    <p class="description">
      同花顺 iFinD HTTP API 官方手册（v2.1）网页版：TOKEN 鉴权、各函数 URL 与
      formData 生成逻辑、指标参数字典、组合管理、错误码与适用范围。内容由 PDF
      手册逐页结构化转换，未增删事实。
    </p>
    <p class="actions">
      <a class="get-started" href="/guide/token">
        快速开始
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
          />
        </svg>
      </a>
      <a class="setup" href="/guide/basic-data">接口参考</a>
      <a class="setup" href="/reference/errors">错误码</a>
    </p>
  </section>

  <section id="highlights" class="vt-box-container">
    <div v-for="item in highlights" :key="item.title" class="vt-box">
      <h2>{{ item.title }}</h2>
      <p>{{ item.text }}</p>
    </div>
  </section>

  <div class="home-doc-wrap">
    <div class="vt-doc">
      <h2>简介</h2>
      <p>
        iFinD HTTP API
        是对过去各语言SDK形式的一个补充，用户可以以API形式直接向同花顺服务器发送HTTP请求，运行环境不再需要下载SDK
        ，从而使用户摆脱设备、语言、环境的限制。
      </p>

      <h2>版本记录</h2>
      <table>
        <thead>
          <tr>
            <th>版本</th>
            <th>时间</th>
            <th>更新说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in versions" :key="row[0]">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 96px 32px;
  text-align: center;
}

.tagline {
  font-size: 56px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0 auto;
}

html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 20px;
  margin: 24px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .get-started,
.actions .setup {
  margin-right: 18px;
}

.actions .get-started {
  font-weight: 600;
  background-color: var(--vt-c-green);
  color: #fff;
}

.dark .actions .get-started {
  color: var(--vt-c-indigo);
}

.actions .get-started:hover {
  background-color: var(--vt-c-green-dark);
}

.dark .actions .get-started:hover {
  background-color: var(--vt-c-green-light);
}

.actions .setup,
.actions .get-started {
  color: var(--vt-c-text-code);
}

.actions .get-started {
  color: #fff;
}

.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
}

.dark .actions .setup:hover {
  background-color: var(--vt-c-gray-dark-3);
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

#highlights {
  max-width: 1152px;
  margin: 0 auto;
}

/* 简介 / 版本记录：收进与上方卡片相同的 1152px 居中容器，
   文字保持左对齐（原先铺满 1440px，与 hero、卡片都不对齐）。 */
.home-doc-wrap {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 32px;
}

.home-doc-wrap .vt-doc {
  max-width: none;
}

@media (max-width: 768px) {
  #hero {
    padding: 64px 24px;
  }

  .tagline {
    font-size: 36px;
  }
}
</style>
