import { h } from 'vue'
import { VPTheme } from '@vue/theme'
// VitePress 自带组件（本地搜索等）会用到这套图标工具类；@vue/theme 未引入它。
import 'vitepress/dist/client/theme-default/styles/icons.css'
import './custom.css'
import { siteTitle } from '../docs-registry.ts'

/**
 * 站点主题。@vue/theme 内置的品牌区是 Vue 三角 logo +「Vue.js」，这里用 navbar-title 插槽
 * 换成站点标题（取自 docs-registry.ts，与文档列表页共用一个真源）。
 */
export default {
  ...VPTheme,
  Layout: () =>
    h(VPTheme.Layout, null, {
      'navbar-title': () => h('span', { class: 'doc-site-title' }, siteTitle),
    }),
}
