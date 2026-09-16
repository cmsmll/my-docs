---
page: true
title: 文档中心
---

<script setup>
import DocList from '@theme/components/DocList.vue'
</script>

<section id="hero">
  <h1 class="tagline">文档中心</h1>
  <p class="description">
    汇总各产品的官方文档站点。选择下方文档集进入阅读。
  </p>
</section>

<div class="home-doc-wrap">
  <div class="vt-doc">
    <h2>文档列表</h2>
    <DocList />
  </div>
</div>

<style scoped>
#hero {
  padding: 84px 32px 28px;
  text-align: center;
}

.tagline {
  font-size: 44px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1px;
  max-width: var(--doc-layout-width);
  margin: 0 auto;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: var(--doc-layout-width);
  line-height: 1.6;
  color: var(--vt-c-text-2);
  font-size: 18px;
  margin: 18px auto 0;
}

/* 与文档集首页共用同一个内容宽度，文字左对齐 */
.home-doc-wrap {
  max-width: var(--doc-layout-width);
  margin: 0 auto;
  padding: 0 32px 64px;
}

.home-doc-wrap .vt-doc {
  max-width: none;
}

@media (max-width: 768px) {
  #hero {
    padding: 56px 24px 20px;
  }

  .tagline {
    font-size: 32px;
  }
}
</style>
