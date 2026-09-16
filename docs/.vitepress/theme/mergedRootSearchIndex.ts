/**
 * 「主页搜全部」的实现：改写本地搜索的索引映射模块。
 *
 * 背景：启用 `locales` 后，VitePress 按 locale 分别建索引
 * （`getLocaleForPath` -> `indexByLocales`），各文档集因此只搜到自身；但主页
 * （root locale）也就只剩主页那点内容，无法「搜全部」。
 *
 * 做法：不改 VitePress 内部 800+ 行的搜索 UI（改它升级必坏），而是**改写它生成的
 * 索引映射虚拟模块**。VitePress 让搜索组件 `import localSearchIndex from '@localSearchIndex'`，
 * 该模块默认导出「locale -> loader」映射：
 *
 *     export default {"root": () => import('@localSearchIndexroot'), "ifind": () => import(...)}
 *
 * 我们在这段代码后面追加一层包装：把 `root` 的 loader 换成「把其余各 locale 的索引
 * 合并后返回」，其余 locale 原样透传。于是：
 *   - 主页：拿到含全部文档的索引 -> 搜全部
 *   - 各文档集：不受影响 -> 只搜自身
 *
 * ⚠️ 必须是 `transform`（改写）而不是 `resolveId`/`load`（替换）。原因：该虚拟模块的
 * load handler 里带着 `await scanForBuild()`——**索引就是在那一步扫出来的**。直接替换掉
 * 模块会跳过它，导致各 locale 的索引文件全部变成空 JSON（实测：32 字节的 `{}`），
 * 搜索彻底失效。
 *
 * 各 locale 索引模块的 `default` 是索引的 JSON 字符串（VitePress 生成时做了两层
 * stringify），故这里 `JSON.parse` 后合并，再 `JSON.stringify` 回去，与搜索组件内部
 * `MiniSearch.loadJSON(json)` 的用法一致。
 */
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const INDEX_ID = '@localSearchIndex'
const RE_MAPPING = /export\s+default\s+\{/

const mergeIndexesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'components/mergeIndexes.ts'
)

/**
 * @param localePaths 各文档集的 locale 键（= 文档集目录名），来自 docs-registry.ts
 */
export function mergedRootSearchIndex(localePaths: string[]): Plugin {
  return {
    name: 'docs:merged-root-search-index',
    enforce: 'post',

    transform(code, id, options) {
      // 只处理「索引映射」模块本身（id 恰为 @localSearchIndex 或 /@localSearchIndex），
      // 不碰 @localSearchIndexifind 这类各 locale 的真实索引模块；SSR 期不需要。
      if (options?.ssr) return null
      const base = id.replace(/\?.*$/, '').replace(/^\//, '')
      if (base !== INDEX_ID) return null
      if (!RE_MAPPING.test(code)) return null

      const imports = localePaths
        .map((l) => `  ${JSON.stringify(l)}: () => import(${JSON.stringify(INDEX_ID + l)})`)
        .join(',\n')

      // 把原 `export default {...}` 去掉，改用下面的 __byLocale（不能有两个 default export）
      const stripped = code.replace(/export\s+default\s+\{[^}]*\}/, '')

      // ⚠️ root 的 loader 必须只遍历「各文档集」的 loader，不能遍历最终导出的映射对象本身
      // ——否则会把 root 自己也算进去，形成无限递归。
      return `${stripped}
// ---- 主页「搜全部」：root 的索引换成各文档集索引的合并结果 ----
import { mergeIndexes as __mergeIndexes } from ${JSON.stringify(mergeIndexesPath)}
const __collections = {
${imports}
}
export default {
  ...__collections,
  root: async () => {
    const mods = await Promise.all(Object.values(__collections).map((load) => load()))
    const indexes = mods.map((m) => JSON.parse(m.default))
    return { default: JSON.stringify(__mergeIndexes(indexes)) }
  },
}
`
    },
  }
}
