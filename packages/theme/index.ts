import { h } from 'vue'
import { VPTheme } from '@vue/theme'
// VitePress 自带组件（本地搜索等）会用到这套图标工具类；@vue/theme 未引入它。
import 'vitepress/dist/client/theme-default/styles/icons.css'
import './custom.css'

export interface ThemeOptions {
  /** 导航栏品牌区显示的站点标题 */
  title: string
  /** 品牌区标题的 CSS 类名，默认共享样式里的 .doc-site-title */
  titleClass?: string
}

/**
 * 站点主题工厂。两站共用同一个 @vue/theme，只在品牌区标题上区分。
 * @vue/theme 内置的品牌区是 Vue 三角 logo +「Vue.js」，这里用 navbar-title 插槽替换。
 */
export function createTheme({ title, titleClass = 'doc-site-title' }: ThemeOptions) {
  return {
    ...VPTheme,
    Layout: () =>
      h(VPTheme.Layout, null, {
        'navbar-title': () => h('span', { class: titleClass }, title),
      }),
  }
}

export default createTheme
