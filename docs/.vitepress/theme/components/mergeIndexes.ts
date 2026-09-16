/**
 * 索引合并：把多份 MiniSearch 序列化索引合成一份，以获得跨文档集的统一排序。
 *
 * 为什么不能「分别查询再拼接结果」：MiniSearch 的 `search()` 返回的 score 是基于
 * **该索引自身**的统计量（文档数、平均字段长度、逆文档频率）算出来的，两份索引的分数
 * 不在同一量纲上，拼接后排序不可信。必须先把倒排索合并成一份，再查询。
 *
 * 为什么不能直接把两份 JSON `{...a, ...b}` 展开：`loadJSON` 要求传入的 documentCount、
 * nextId、documentIds、index 等互相自洽，而两份索引的内部文档编号都从 0 开始，会互相
 * 覆盖。因此这里给后一份的文档编号整体加偏移（`off`）再合并。
 *
 * 注意：序列化索引里**不含原文**（只有倒排表 + storedFields），所以合并只能在这些
 * 字段上做，无法重建原文——这正是必须偏移重编号、而不是重新 add() 的原因。
 */
import MiniSearch from 'minisearch'

type SerializedIndex = {
  documentCount: number
  nextId: number
  documentIds: Record<number, string>
  fieldIds: Record<string, number>
  fieldLength: Record<number, number[]>
  averageFieldLength: number[]
  storedFields: Record<number, unknown>
  dirtCount: number
  index: [string, Record<string, Record<number, number>>][]
  serializationVersion: number
}

/** 把多份序列化索引合并为一份（内部文档编号按偏移重编号，避免相互覆盖）。 */
export function mergeIndexes(sources: SerializedIndex[]): SerializedIndex {
  const out: SerializedIndex = {
    documentCount: 0,
    nextId: 0,
    documentIds: {},
    fieldIds: {},
    fieldLength: {},
    averageFieldLength: [],
    storedFields: {},
    dirtCount: 0,
    index: [],
    serializationVersion: 2,
  }

  // 词项键是**动态且不受信任**的（来自正文分词），用 Map 而非普通对象：
  // 普通对象遇到 `__proto__` / `constructor` 这类词项会有原型污染与漏读风险。
  const terms = new Map<string, Record<string, Record<number, number>>>()
  let offset = 0

  for (const src of sources) {
    if (!src) continue
    for (const [num, ext] of Object.entries(src.documentIds ?? {})) {
      out.documentIds[Number(num) + offset] = ext
    }
    for (const [num, fl] of Object.entries(src.fieldLength ?? {})) {
      out.fieldLength[Number(num) + offset] = fl
    }
    for (const [num, sf] of Object.entries(src.storedFields ?? {})) {
      out.storedFields[Number(num) + offset] = sf
    }
    for (const [term, postings] of src.index ?? []) {
      let merged = terms.get(term)
      if (!merged) {
        merged = {}
        terms.set(term, merged)
      }
      for (const [fieldId, docs] of Object.entries(postings)) {
        const bucket = (merged[fieldId] ??= {})
        for (const [docId, score] of Object.entries(docs)) {
          bucket[Number(docId) + offset] = score
        }
      }
    }
    offset += src.documentCount
    out.documentCount += src.documentCount
    Object.assign(out.fieldIds, src.fieldIds)
  }

  out.nextId = offset
  out.index = [...terms.entries()]

  // 平均字段长度按各份的文档数加权，保证 BM25 长度归一化仍合理
  const fieldCount = Object.keys(out.fieldIds).length
  const avg = new Array(fieldCount).fill(0)
  for (const src of sources) {
    if (!src) continue
    for (let i = 0; i < fieldCount; i++) {
      avg[i] += ((src.averageFieldLength?.[i] ?? 0) * src.documentCount) / Math.max(1, out.documentCount)
    }
  }
  out.averageFieldLength = avg

  return out
}
