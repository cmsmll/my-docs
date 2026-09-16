<script setup lang="ts">
/**
 * 文档集首页（hero + 卡片 + 简介 / 表格）。Vue 官方文档的主题（@vue/theme）不使用
 * VitePress 的 `layout: home`，而是在 `page: true` 的页面里挂载自定义组件，故此处沿用。
 *
 * 布局与样式共用，文案与数据由各文档集通过 props 传入（各文档集自己的 index.md），
 * 因此新增文档集时本组件无需改动。
 */
interface HomeAction {
  text: string
  link: string
  /** primary 为主按钮（品牌色实底，带箭头图标），secondary 为次按钮（浅底） */
  kind?: 'primary' | 'secondary'
}

interface HomeRow {
  /** 首列：版本号 / 分区名 */
  version: string
  /** 次列：时间 / 类别 */
  date: string
  /** 末列：更新说明 */
  note: string
}

defineProps<{
  /** 标题首行，渲染为渐变强调色 */
  accent: string
  /** 标题次行 */
  tagline: string
  description: string
  actions: HomeAction[]
  highlights: { title: string; text: string }[]
  introTitle: string
  intro: string
  /** 表格小标题 */
  versionsTitle: string
  /** 表格列头，默认「版本 / 时间 / 更新说明」 */
  tableHead?: [string, string, string]
  versions: HomeRow[]
}>()
</script>

<template>
  <section id="hero">
    <h1 class="tagline">
      <span class="accent">{{ accent }}</span>
      <br />{{ tagline }}
    </h1>
    <p class="description">
      {{ description }}
    </p>
    <p class="actions">
      <a
        v-for="action in actions"
        :key="action.link"
        :class="action.kind === 'secondary' ? 'setup' : 'get-started'"
        :href="action.link"
      >
        {{ action.text }}
        <svg
          v-if="action.kind !== 'secondary'"
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
      <h2>{{ introTitle }}</h2>
      <p>
        {{ intro }}
      </p>

      <h2>{{ versionsTitle }}</h2>
      <table>
        <thead>
          <tr>
            <th>{{ tableHead?.[0] ?? '版本' }}</th>
            <th>{{ tableHead?.[1] ?? '时间' }}</th>
            <th>{{ tableHead?.[2] ?? '更新说明' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in versions" :key="row.version">
            <td>{{ row.version }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.note }}</td>
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
  max-width: var(--doc-layout-width);
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
  max-width: var(--doc-layout-width);
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
  max-width: var(--doc-layout-width);
  margin: 0 auto;
}

/* 简介 / 版本记录：与上方 hero 文字、卡片区共用同一个内容宽度，
   文字保持左对齐。 */
.home-doc-wrap {
  max-width: var(--doc-layout-width);
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
