---
title: "编译运行"
---

# 编译运行
1.您的策略必须在init()和handle_bar()函数框架下实现:

* init为初始化函数，用于初始一些全局变量，在整个回测过程最开始执行一次。
* handle_bar为时间驱动函数，用于设置买卖条件等，每个回测时间频率（每日/分钟）调用一次。

2.完成策略编写后，选定回测开始日期和结束日期，选择初始资金、运行频率(每日或每分钟)等参数，点击"编译运行"；

<div align="center">
 <img src="http://u.thsi.cn/imgsrc/pefile/356a5ea7d67a6e49a56a33540b380443.jpg" width="800"  />
 </div>

3.回测引擎根据您选择的运行频率调用handle\\\_bar函数，也就是执行该函数下的代码。回测引擎会实时显示策略当前时间的数据，如收益、风险指标、持仓等信息

![](http://u.thsi.cn/imgsrc/sns/fb412b186069b3b03da3a2c4bf253a82_794_426.png)
4.回测引擎会根据您所使用的下单方式进行下单，并根据后续实际成交情况进行订单处理；

5.您可以在任何时候调用log.info函数来打印需要输出的日志；通过record函数输出自定义图形。

![](http://u.thsi.cn/imgsrc/sns/6ce8785ecdefb718d0cb97a843c218e6_794_864.png)

* 添加log.info函数与record函数后的代码如下：
* 添加log.info函数与record函数后的代码如下：

```python
#初始化账户
def init(context):
    g.index='600519.SH'

def handle_bar(context,bar_dict):
    close = history(g.index, ['close'], 20, '1d', False, fq = 'pre', is_panel=0)
    MA5 = close['close'].values[-5:].mean()
    #计算二十日均线价格
    MA20 = close['close'].values.mean()
    #设置交易信号
    trade_signal=0
    #如果五日均线大于二十日均线
    if MA5 > MA20:
        #使用所有现金买入证券
        order_target_percent(g.index,1)
        #记录本次买入
        log.info("全仓买入{0}".format(g.index))
        #记录买入信号
        trade_signal=1
    #如果五日均线小于二十日均线
    if MA5 < MA20 :
        #卖出所有证券
        order_target_percent(g.index,0)
        #记录本次卖出
        log.info("全仓卖出{0}".format(g.index))
        #记录卖出信号
        trade_signal=-1

    log.info(trade_signal)
    record(trade_signal=trade_signal)
```
