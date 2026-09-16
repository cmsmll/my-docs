import { h } from 'vue'
import { VPTheme } from '@vue/theme'
// VitePress 自带组件（本地搜索等）会用到这套图标工具类；@vue/theme 未引入它。
import 'vitepress/dist/client/theme-default/styles/icons.css'
import './custom.css'

export default {
  ...VPTheme,
  Layout: () =>
    h(VPTheme.Layout, null, {
      // 覆盖主题内置的品牌区（Vue 三角 logo + “Vue.js”），改为本站标题。
      'navbar-title': () => h('span', { class: 'ifind-site-title' }, 'iFinD HTTP API 用户手册'),
    }),
}
