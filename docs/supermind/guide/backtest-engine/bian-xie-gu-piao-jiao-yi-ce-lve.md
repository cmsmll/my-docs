---
title: "编写股票交易策略"
---

# 编写股票交易策略
1.导航栏中，依次点击"我的策略"—"策略研究"
2.新建股票策略,点击进入策略编辑页面，如下图

<div align="center">
 <img src="http://u.thsi.cn/imgsrc/pefile/68f47d21305ad0280e63a0f16bd07975.png" width="800"  />
 </div>

3.左侧编译环境内使用python语言实现策略逻辑

- 交易股票：600519.SH(贵州茅台)
- 买入条件：5日均线上穿20日均线
- 卖出条件：5日均线下穿20日均线

<div align="center">
 <img src="http://u.thsi.cn/imgsrc/pefile/a63e01ea62ee38ddb7b21a4816e3dac8.png" width="800"  />
 </div>

4.右侧选择回测时间区间，并进行回测

<div align="center">
 <img src="http://u.thsi.cn/imgsrc/pefile/3e87c7483b126deed4e9886fa7d02967.png" width="800"  />
 </div>

+ 策略源码：

```python
#初始化账户
def init(context):
    g.index='600519.SH'

def handle_bar(context,bar_dict):
    close = history(g.index, ['close'], 20, '1d', False, fq = 'pre', is\_panel=0)
    MA5 = close['close'].values[-5:].mean()
    #计算二十日均线价格
    MA20 = close['close'].values.mean()
    #如果五日均线大于二十日均线
    if MA5 > MA20:
        #使用所有现金买入证券
        order_target_percent(g.index,1)
        #记录本次买入
        log.info("全仓买入{0}".format(g.index))
    #如果五日均线小于二十日均线
    if MA5 < MA20 :
        #卖出所有证券
        order_target_percent(g.index,0)
        #记录本次卖出
        log.info("全仓卖出{0}".format(g.index))
```

---
