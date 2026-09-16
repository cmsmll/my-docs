import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfigWithTheme } from 'vitepress'
import baseConfig from '@vue/theme/config'
import type { Config as ThemeConfig } from '@vue/theme'

/**
 * 站点共享配置工厂。两个文档站点（iFinD、SuperMind）的差异只有「站点身份数据」
 * （标题、描述、导航、侧边栏、页脚），其余全部由此处产出，避免同一套适配逻辑
 * 在多处复制后漂移。
 */

const require = createRequire(import.meta.url)

// 用 require 解析 vitepress 的安装位置，而不是 path.resolve('node_modules/...')：
// 后者相对 cwd，依赖被 npm workspaces 提升到仓库根后，从 sites/* 目录运行会解析失败。
const vpTheme = path.join(
  path.dirname(require.resolve('vitepress/package.json')),
  'dist/client/theme-default'
)

// 共享包自身位置。config.ts 与 index.ts / components 同级，用文件 URL 定位，
// 避免依赖 cwd 或 npm 的依赖提升布局。
const themeRoot = path.dirname(fileURLToPath(import.meta.url))

export interface SiteData {
  title: string
  description: string
  nav: ThemeConfig['nav']
  sidebar: ThemeConfig['sidebar']
  footer: ThemeConfig['footer']
  /** 导航栏品牌区的站点标题；缺省用 title */
  navTitle?: string
  /** 品牌区标题的 CSS 类名，默认共享样式里的 .doc-site-title */
  navTitleClass?: string
  /** 正文是否包含 LaTeX 公式。开启需安装 markdown-it-mathjax3 */
  math?: boolean
}

/** 与站点身份无关的固定配置：两站必须逐项一致，因此集中在这里，不在站点内重复。 */
export function createSiteConfig(site: SiteData) {
  const themeConfig: ThemeConfig = {
    nav: site.nav,
    sidebar: site.sidebar,
    footer: site.footer,

    i18n: {
      search: '搜索文档',
      menu: '目录',
      toc: '本页内容',
      returnToTop: '回到顶部',
      appearance: '主题',
      previous: '上一篇',
      next: '下一篇',
      pageNotFound: '页面不存在',
      ariaAnnouncer: { before: '页面', after: ' 已加载' },
      ariaDarkMode: '切换深色模式',
      ariaSkipToContent: '跳至内容',
      ariaToC: '当前页面目录',
      ariaMainNav: '主导航',
      ariaMobileNav: '移动端导航',
      ariaSidebarNav: '侧边栏导航',
    },
  }

  return defineConfigWithTheme<ThemeConfig>({
    ...baseConfig,
    lang: 'zh-CN',
    title: site.title,
    description: site.description,

    // baseConfig 预置的 /logo.svg 各站都没有对应资源，换成主题色声明
    head: [['meta', { name: 'theme-color', content: '#42b883' }]],

    // 不设 cleanUrls：@vue/theme 生成的链接带 .html（与 cn.vuejs.org 一致），
    // 开启后配置与主题的链接约定不一致。

    markdown: {
      ...baseConfig.markdown,
      // 与 cn.vuejs.org 一致：代码块使用深色单主题
      theme: 'github-dark',
      lineNumbers: false,
      // 正文里 `{周期1}` 这类花括号是数据，不是 markdown-it-attrs 的 HTML 属性语法；
      // 不关闭会被静默吞掉，导致内容丢失甚至构建失败。
      attrs: { disable: true },
      // 手册层级较深（正文含 h4），比 Vue 文档多保留一层目录
      headers: { level: [2, 4] },
      // 正文含 LaTeX 的站点（SuperMind）开启数学渲染；否则公式里的 {{ }} 会被
      // Vue 当成插值表达式。
      ...(site.math ? { math: true } : {}),
    },

    vite: {
      ...baseConfig.vite,
      ssr: {
        ...baseConfig.vite?.ssr,
        // @vue/theme 仍依赖 @vueuse/core v10，而 VitePress 1.6 依赖 v12。
        // npm 只能提升一份，把 v10 误留给 v12 使用会报 pxValue 缺失；
        // 这里显式声明不外部化（baseConfig 漏了 @vueuse/shared 与共享主题包本身，
        // 后者以符号链接装进站点，被当成 external 会导致构建失败）。
        noExternal: [
          '@vue/theme',
          '@vueuse/core',
          '@vueuse/shared',
          '@vueuse/metadata',
          '@doc/theme',
        ],
      },
      optimizeDeps: {
        ...baseConfig.vite?.optimizeDeps,
        exclude: ['@vue/theme'],
      },
      resolve: {
        alias: [
          // 用 VitePress 自带本地搜索替换 @vue/theme 的 Algolia 搜索框（后者需凭证）
          {
            find: /^.*\/VPNavBarSearch\.vue$/,
            replacement: path.join(vpTheme, 'components/VPNavBarSearch.vue'),
          },
          // 站点页面以 @theme/components/Home.vue 引用共享首页组件。
          // VitePress 默认把 @theme 指向 <docs>/.vitepress/theme，站点内已无该组件。
          {
            find: /^@theme\/components\/Home\.vue$/,
            replacement: path.join(themeRoot, 'components/Home.vue'),
          },
        ],
      },
    },

    themeConfig: {
      ...themeConfig,
      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
            modal: {
              noResultsText: '无法找到相关结果',
              resetButtonTitle: '清除查询条件',
              displayDetails: '显示详情',
              backButtonTitle: '返回',
              footer: {
                selectText: '选择',
                selectKeyAriaLabel: '回车',
                navigateText: '切换',
                navigateUpKeyAriaLabel: '上箭头',
                navigateDownKeyAriaLabel: '下箭头',
                closeText: '关闭',
                closeKeyAriaLabel: 'Esc',
              },
            },
          },
        },
      },
    },
  })
}
