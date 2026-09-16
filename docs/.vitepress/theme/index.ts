import { computed, defineComponent, h } from 'vue'
import { useRoute } from 'vitepress'
import { VPTheme } from '@vue/theme'
// VitePress 自带组件（本地搜索等）会用到这套图标工具类；@vue/theme 未引入它。
import 'vitepress/dist/client/theme-default/styles/icons.css'
import './custom.css'
import { siteTitle } from '../docs-registry.ts'

/**
 * 站点主题。@vue/theme 内置的品牌区是 Vue 三角 logo +「Vue.js」，这里用 navbar-title 插槽
 * 换成站点标题（取自 docs-registry.ts，与文档列表页共用一个真源）。
 *
 * 首页（/）的 header 需要一套与文档集页面不同的布局（左品牌 / 中搜索 / 右主题，左右等宽），
 * 而主题没有按页面类型加类的钩子（VitePress 2 不消费 frontmatter.pageClass，主题的
 * .VPContentPage 又同时命中三个文档集首页，不能当判据），因此在这里按路由给最外层
 * .VPApp 挂一个 doc-home 类，布局全部交给 custom.css 覆写。
 * 用类而不是 CSS `:has()` 判断首页内容，是为了让 header 样式不依赖内容区的组件结构。
 */
const Layout = defineComponent({
  name: 'DocLayout',
  setup() {
    const route = useRoute()
    // 静态托管下首页既可能是 `/` 也可能是 `/index.html`
    const isHome = computed(() => /^\/(index\.html)?$/.test(route.path))
    return () =>
      h(
        VPTheme.Layout,
        { class: isHome.value ? 'doc-home' : '' },
        {
          'navbar-title': () => h('span', { class: 'doc-site-title' }, siteTitle),
        }
      )
  },
})

export default {
  ...VPTheme,
  Layout,
}
