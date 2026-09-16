---
title: "TICK级别回测"
---

# TICK级别回测
当前tick级别的回测仅能在研究环境中进行，[http://quant.10jqka.com.cn/view/study-research.html](http://quant.10jqka.com.cn/view/study-research.html)

示例代码：

```python
source_code="""
# 股票策略模版
def init(context):
    subscribe('000001.SZ')
  
## 开盘时运行函数
def handle_tick(context, tick):
    print(tick.b1, tick.b1_v)
"""

research_strategy(source_code, start_date='20210601', end_date='20210815', capital_base=float(10000000), frequency='TICK', stock_market='STOCK', benchmark=None)

```
