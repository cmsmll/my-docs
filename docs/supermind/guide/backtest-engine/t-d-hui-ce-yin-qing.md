---
title: "T+D回测引擎"
---

# T+D回测引擎
## 前言

---

欢迎使用SuperMind量化交易平台，本文档详细介绍了SuperMind平台的API使用方法，内容较多，您可通过**Ctrl+F**进行关键字搜索。

如果您在使用过程中遇到帮助中无法解答的问题，您可以：

* 将问题发布到社区
* 给我们发送邮件： supermind@myhexin.com

## 回测环境

---

1.回测引擎运行在Python3.5之上, 请您的策略也兼容Python3.5

2.我们支持所有的Python标准库和部分常用第三方库, 具体请看: Python库

3.同时，我们也支持自定义Python库，只需将您的.py文件存放于“我的研究”根目录, 即可在回测中直接调用, 具体说明请参见常见问题中“如何调用自定义Python库”

## 回测过程

---

1.您的策略必须在init()和handle\_bar()函数框架下实现:

　A.init为初始化函数，用于初始一些全局变量，在整个回测过程最开始执行一次。

　B.handle_bar为时间驱动函数，用于设置买卖条件等，每个回测时间频率（每日/分钟）调用一次。

```
#初始化账户   
def init(context):   
    #设置要交易的合约(AuT+D合约)   
    g.contract = 'AUTD'   
    subscribe('AUTD')

#设置买卖条件，每个交易频率（日/分钟/tick）调用一次   
def handle_bar(context, bar_dict):   
    #获取合约过去20日的收盘价数据   
    close = history_td(g.contract, fields=['close'], bar_count=20, fre_step='1d', is_panel=0)   
    #计算五日均线价格   
    MA5 = close[g.contract].values[-5:].mean()   
    #计算二十日均线价格   
    MA20 = close[g.contract].values.mean()   
    #如果五日均线大于二十日均线   
    if MA5 > MA20:   
        #计算所有可用资金可开仓手数(1000为合约乘数, 8.4%为保证金比例)   
        num=int(context.portfolio.accounts['METAL'].available_cash /(close[g.contract].values[-1]*1000*0.084))   
        if num > 0:   
            #使用所有可用资金开多进场   
            order_td(g.contract, num, 'buy', 'open')   
            #记录这次开仓   
            log.info("买入 {0}手 {1}".format(num, g.contract))   
    #如果五日均线小于二十日均线，并且目前有头寸   
    if (MA5 < MA20) and (context.portfolio.accounts['METAL'].positions[g.contract].buy_quantity > 0):
        #获取可平持仓   
        num = context.portfolio.accounts['METAL'].positions[g.contract].buy_quantity   
        #平多离场   
        order_td(g.contract, num, 'sell', 'close', close_today=True)   
        #记录这次平仓   
        log.info("卖出 {0}手 {1}".format(num, g.contract))
```

2.完成策略编写后，选定回测开始日期和结束日期，选择初始资金、调仓频率(每日或每分钟)等参数，点击"进行回测"，即开始回测；

![](http://u.thsi.cn/fileupload/data/Sns/2018/079bec67c7b836938c3367b6dc438053.png)

3.回测引擎根据您选择的调仓频率调用handle\_data函数，也就是执行该函数下的代码。回测引擎会实时显示策略当前时间的数据，如收益、风险指标、持仓等信息；

![](http://u.thsi.cn/fileupload/data/Sns/2018/691fca4ca985e4f9f1daa8e1b0f2f9ee.png)

4.回测引擎会根据您所使用的下单方式进行下单，并根据后续实际成交情况进行订单处理；

![](http://u.thsi.cn/fileupload/data/Sns/2018/492bd79eaa9ee9db01e495fc69731b8d.png)

5.您可以在任何时候调用log.info函数来打印需要输出的日志；通过record函数输出自定义图形。

　　添加log.info函数与record函数后的代码如下：

```
#初始化账户   
def init(context):   
    #设置要交易的合约(AuT+D合约)   
    g.contract = 'AUTD'   
    subscribe('AUTD')

#设置买卖条件，每个交易频率（日/分钟/tick）调用一次   
def handle_bar(context, bar_dict):   
    #获取合约过去20日的收盘价数据   
    close = history_td(g.contract, fields=['close'], bar_count=20, fre_step='1d', is_panel=0)   
    #计算五日均线价格   
    MA5 = close[g.contract].values[-5:].mean()   
    #计算二十日均线价格   
    MA20 = close[g.contract].values.mean()   
    #如果五日均线大于二十日均线   
    if MA5 > MA20:   
        #计算所有可用资金可开仓手数(1000为合约乘数, 9.8%为保证金比例)   
        num=int(context.portfolio.accounts['METAL'].available_cash /(close[g.contract].values[-1]*1000*0.098))   
        if num > 0:   
            #使用所有可用资金开多进场   
            order_td(g.contract, num, 'buy', 'open')   
            #记录这次开仓   
            log.info("买入 {0}手 {1}".format(num, g.contract))   
    #如果五日均线小于二十日均线，并且目前有头寸   
    if (MA5 < MA20) and (context.portfolio.accounts['METAL'].positions[g.contract].buy_quantity > 0):
        #获取可平持仓   
        num = context.portfolio.accounts['METAL'].positions[g.contract].buy_quantity   
        #平多离场   
        order_td(g.contract, num, 'sell', 'close', close_today=True)   
        #记录这次平仓   
        log.info("卖出 {0}手 {1}".format(num, g.contract))


    margin=context.portfolio.accounts['METAL'].margin
    log.info(margin)
    record(margin=margin)
```

![](http://u.thsi.cn/fileupload/data/Sns/2018/e15ab3f07c70ee3b71609605711a5504.png)

## 运行时间

---

1.开盘前(前一天19:00)运行：

　　before\_trading函数

2.盘中运行：

　　handle\_bar函数
　　　>若前一天为非国定节假日，日回测(前一天20:00)运行一次；若前一天为国定节假日，日回测(当天09:00)运行一次；
　　　>若前一天为非国定节假日，分钟回测(前一天20:00-02:29, 当天09:00-11:29, 当天13:30-15:29)，每分钟运行一次；若前一天为国定节假日，分钟回测(当天09:00-11:29, 当天13:30-15:29)，每分钟运行一次；

3.收盘后(当天16:00)运行：

　　after\_trading函数

## 订单处理

---

对于您在某个单位时间下的单，我们会做如下处理：

1.**按天回测**

　A.**交易价格：**
　>市价单：开盘价+滑点。
　>限价单：委托价。
　B.**最大成交量:**
　>默认为下单当日总成交量的25%，该比例可通过市场参与度函数set_volume_limit_td进行调整。
　>若下单量低于最大成交量，则按下单量成交；若下单量大于最大成交量，则按最大成交量成交。
　**C.撮合方式：**
　>市价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。
　>限价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。

2.**分钟回测**

　A.**交易价格：**
　>市价单：当前分钟起始价+滑点
　>限价单：委托价
　B.**最大成交量：**
　>默认为下单当前分钟总成交量的25%，该比例可通过市场参与度函数set_volume_limit_td进行调整。
　>若下单量低于最大成交量，则按下单量成交；若下单量大于最大成交量，则按最大成交量成交。
　C.**撮合方式：**
　>市价单：分钟起始点下单，一次性撮合，不成交或未成交部分即刻取消委托。
　>限价单：分钟起始点下单，之后每分钟均按分钟价量撮合一次，未成交部分顺延至下一分钟进行撮合，直到完全成交或者当天收盘为止。

**3.注意：**

```
1.一天结束后, 所有未完成的订单会被取消。
　　2.每次订单完成(完全成交)或者取消后,我们会根据成交量计算交易费(参见set_commission_td), 减少您的现金。
```

## 滑点

---

　　**在实战交易中，往往最终成交价和预期价格有一定偏差，因此我们提供两种滑点模式来帮助您更好地模拟真实市场的表现：**

　　1.设置固定滑点，即最终成交价和委托价之差为固定值。

　　2.设置可变滑点，即最终成交价和预期价格之比为固定百分比。默认为可变滑点0.2%，即买入成交价为委托价上浮0.1%，卖出成交价为委托价下调0.1%。

　　默认无滑点，不过您可通过set_slippage_td函数来设置回测具体的滑点参数。

## 交易费

---

　　1.交易费默认为交易金额的万分之二，即0.02%，双边收费；您可以通过set_commission_td来设置具体的手续费参数。

　　2.默认保证金为：AUTD合约保证金比例=9.8%，MAUTD合约保证金比例=9.8%，AGTD合约保证金比例=12.6%；您可以通过set_margin_rate_td函数进行修改。

## 外汇回测引擎

---

欢迎使用SuperMind量化交易平台，本文档详细介绍了SuperMind平台的外汇回测引擎，内容较多，您可通过**Ctrl+F**进行关键字搜索。

如果您在使用过程中遇到帮助中无法解答的问题，您可以:

* 将问题发布到[社区](http://quant.10jqka.com.cn/platform/html/community.html "社区")；
* 给我们发送邮件： supermind@myhexin.com;

## 运行时间

---

1.盘中运行：

　　handle\_bar函数
　　　>日回测: 北京时间每周一早上07:00 和 每周二/三/四/五/六凌晨00:00 各运行一次；
　　　>分钟回测: 北京时间每周一早上07:00 至 周六早上05:59 每分钟运行一次；

## 订单处理

---

对于您在某个单位时间下的单，我们会做如下处理：

1.**按天回测**

　A.**交易价格：**

$>市单价：买入价 = 开盘价\times\left(1 + 价差比例/2\right),卖出价 = 开盘价\times \left(1-价差比例/2\right), \\默认价差比例=0.4%$
　>限价单：委托价
　B.**最大成交量:**
　>因为外汇交易为银行做市机制，因此默认不存在最大成交量限制。
　C.**撮合方式：**
　>市价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。
　>限价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。

2.**分钟回测**

　A.**交易价格：**
　$>市价单：买入价 = 当前分钟起始价 \times (1 + 价差比例/2), 卖出价 = 当前分钟起始价 \times (1 - 价差比例/2), \\默认价差比例=0.4%$
　>限价单：委托价
　B.**最大成交量：**
　>因为外汇交易为银行做市机制，因此默认不存在最大成交量限制。
　C.**撮合方式：**
　>市价单：分钟起始点下单，一次性撮合，不成交或未成交部分即刻取消委托。
　>限价单：分钟起始点下单，之后每分钟均按分钟价量撮合一次，未成交部分顺延至下一分钟进行撮合，直到完全成交或者当天收盘为止。

**3.注意：**

```
1.一天结束后, 所有未完成的订单会被取消。
　　2.持仓过夜将产生隔夜息差费用。
```

## 滑点

---

**默认无滑点**

## 交易费

---

　　1. 外汇交易并没有交易费用，其交易成本主要体现在汇买价与汇卖价的价差。
