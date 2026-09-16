<script setup lang="ts">
/**
 * 文档列表卡片。数据来自 docs-registry.ts（全站唯一真源），
 * 新增文档集只改注册表，这里与列表页都无需改动。
 */
import { collections } from '../../docs-registry.ts'
</script>

<template>
  <div class="doc-list">
    <a v-for="c in collections" :key="c.path" class="doc-card" :href="c.link">
      <div class="doc-card__head">
        <h3 class="doc-card__title">{{ c.title }}</h3>
        <span class="doc-card__arrow" aria-hidden="true">→</span>
      </div>
      <p class="doc-card__desc">{{ c.description }}</p>
      <p class="doc-card__tagline">{{ c.tagline }}</p>
      <div class="doc-card__tags">
        <span v-for="t in c.tags" :key="t" class="doc-card__tag">{{ t }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.doc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin: 28px 0 8px;
}

.doc-card {
  display: block;
  padding: 22px 24px;
  border: 1px solid var(--vt-c-divider-light);
  border-radius: 10px;
  background-color: var(--vt-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}

.doc-card:hover {
  border-color: var(--vt-c-brand);
  background-color: var(--vt-c-bg-mute);
}

.doc-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.doc-card__title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vt-c-text-1);
  border: none;
  padding: 0;
}

.doc-card:hover .doc-card__title {
  color: var(--vt-c-brand);
}

.doc-card__arrow {
  flex: none;
  color: var(--vt-c-text-3);
  transition: transform 0.2s, color 0.2s;
}

.doc-card:hover .doc-card__arrow {
  color: var(--vt-c-brand);
  transform: translateX(3px);
}

.doc-card__desc {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vt-c-text-3);
}

.doc-card__tagline {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vt-c-text-2);
}

.doc-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.doc-card__tag {
  font-size: 12px;
  line-height: 1;
  padding: 5px 9px;
  border-radius: 5px;
  background-color: var(--vt-c-bg-mute);
  color: var(--vt-c-text-2);
}
</style>
