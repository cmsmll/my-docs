---
title: "期货回测引擎"
---

# 期货回测引擎
## 编写期货交易策略

* 导航栏中，依次点击"我的策略"—"策略创作"—"策略研究"
* 新建"股票期货"策略,点击进入"策略编辑"页面，如下图
* 左侧编译环境内使用python 3.5 实现策略逻辑

  ```
  交易股票：螺纹钢
  多头开仓：5日线上穿20日线
  多头平仓：价格跌破20日均线
  空头开仓：5日均线下穿20日均线
  空头平仓：价格突破20日均线
  ```
* 右侧选择回测时间区间，并进行回测![](https://s2.loli.net/2023/08/16/VJuMxrv3NODhZsk.png)
* 策略源码：

```python
'''
螺纹钢均线策略
'''
def init(context):
    #设立商品期货账户
    set_subportfolios([{"cash": 0, "type": 'stock'},{"cash": 200000, "type": "future"}])
    #设置需要交易的标的，螺纹钢
    context.ins = 'RB9999'
    #订阅需要交易的期货品种
    subscribe('RB9999')
def handle_bar(context, bar_dict):
    #获取螺纹钢的合约代码
    g.con = get_futures_dominate('RB')
    #获取合约行情数据
    date = get_datetime().strftime('%Y%m%d %H%M')
    if date[-1] == '0' or date[-1] == '5':
        hist1 = get_price_future(g.con,None,date,'1d',['close'],bar_count = 20)
        #计算5日，20日均线
        ma20 = hist1.mean().values
        ma5 = hist1.iloc[-5:].mean().values
        p = hist1.iloc[-1].values
        #获取当前账户的多空单数量
        short_amount = context.portfolio.future_account.positions[context.ins].short_amount
        long_amount = context.portfolio.future_account.positions[context.ins].long_amount

        #判断条件，如果价格突破20日线，且账户存在空单，则平空
        if p > ma20 and short_amount > 0:
           order_future(context.ins, short_amount, 'close', 'short', None)
        #判断条件，如果5日均线突破20日线，且账户没有多单，则开多
        elif ma5 > ma20 and long_amount == 0:
           order_future(context.ins, 15, 'open', 'long', None)
        #判断条件，如果价格突破跌破20日线，且账户存在多单，则平多
        elif p <= ma20 and long_amount > 0:
           order_future(context.ins, long_amount, 'close', 'long', None)
        #判断条件，如果5日均线跌破20日线，且账户没有空单，则开空
        elif ma5 <= ma20 and short_amount == 0:
           order_future(context.ins, 15, 'open', 'short', None)
def after_trading(context):
    #收盘查看账户基本合约持仓情况
    log.info('收盘查看账户基本合约持仓情况')
    log.info(context)
```

## 期货账户

* 期货回测引擎和股票回测引擎都通过创建“股票期货”的策略类型实现
* 如果你想要交易期货品种，你必须要在init初始化函数中，创建期货账户，并设置期货账户初始资金，详见[set\_subportfolios](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/0 "set_subportfolios")函数

  ```
  def init(context):
    #设置子账户,股票账户0万，期货账户50万.
    set_subportfolios([{'cash':0,'type':'stock'},{'cash':500000,'type':'future'}])
  ```
* 如果你想要同时交易股票和期货品种，你同样必须要在init初始化函数中，创建股票和期货账户，并设置账户初始资金，详见[set\_subportfolios](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/0 "set_subportfolios")函数

  ```
  def init(context):
    #设置子账户,股票账户50万，期货账户50万.
    set_subportfolios([{'cash':500000,'type':'stock'},{'cash':500000,'type':'future'}])
  ```

  **注意事项**
* **股票和期货账户的资金无法公用**，当股票账户资金为0时，无法使用期货账户的资金买入股票，当期货账户的资金为0或者保证金不足时，无法使用股票账户的资金来充当。
* **股票和期货账户分别储存持仓信息**，您需要针对账户进行查看。
* 不设置期货账户，则无法进行期货品种交易。

## 订阅期货品种

* 商品期货和股指期货策略中您必须订阅相应的期货品种，才能确保回测中获取品种的行情数据，详见[subscribe](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/0 "subscribe")订阅函数

  **举例**：如果我要写一个螺纹品种交易策略，除了创建期货账户外，还需要订阅螺纹品种

  ```
  def init(context):
    #设立商品期货账户
    set_subportfolios([{"cash": 0, "type": 'stock'},{"cash": 200000, "type": "future"}])
    #订阅需要交易的期货品种
    context.ins = 'RB9999'
    subscribe(context.ins)
  ```
* 订阅函数可以写在init初始函数或handle\_bar函数里.

## 数据

SuperMind提供海量优质的金融数据，以便您能实现策略逻辑

* 股票数据、指数数据、基金数据、行情数据、财务数据、因子数据、行业数据、概念数据、商品期货数据、股指期货数据、外汇数据等等
* 数据提取——[API文档](/reference/api/index "API文档")
* 数据详情查看——[数据平台](http://quant.10jqka.com.cn/view/dataplatform "数据平台")

## 运行频率

* 在"开始回测"左侧选择运行频率参数，参数分"每日"和"分钟"两种。
* 选择"每日"，则系统按"日回测"进行回测，即每个交易日开盘时运行一次
* 选择"分钟"，则系统按"分钟回测"进行回测，即每个交易日内每分钟都会运行一次
  ps:商品期货和股指期货的开盘时间并非一致，且各个期货品种的运行时间也不一致，具体详见运行时间

## 运行时间

### 大连、上海、郑州交易所

* 集合竞价申报时间：08：55—08：59
* 集合竞价撮合时间：08：59—09：00
* 正常开盘交易时间：09：00－11：30 ,13：30－15：00
* 小节休息：10：15－10：30
  **提示：客户下单时间为集合竞价时间和正常交易时间。在8：59—9：00竞价结束时间和交易所小节休息时间（上午10:15-10:30）下单，交易系统将不接受指令，并视之为废单。**

### 上期所夜盘

* 集合竞价申报时间：20：55—20：59
* 集合竞价撮合时间：20：59—21：00
* 正常开盘交易时间：21：00－02：30 （黄金、白银）
  　　　　　　　　　21：00－01：00 （铜、铝、铅、锌、镍、锡）
  　　　　　　　　　21：00－23：00 （螺纹钢、热轧卷板、石油沥青、天然橡胶）
  **提示：法定节假日的前一日没有夜盘交易**

### 大商所夜盘

* 集合竞价申报时间：20：55—20：59
* 集合竞价撮合时间：20：59—21：00
* 正常开盘交易时间：21：00—23：30 （豆一、豆二、豆油、豆粕、焦煤、焦炭、棕榈油、铁矿石）
  **提示：法定节假日的前一日没有夜盘交易**

### 郑商所夜盘

* 集合竞价申报时间：20：55—20：59
* 集合竞价撮合时间：20：59—21：00
* 正常开盘交易时间：21：00－23：30 （白糖、棉花、菜粕、甲醇、PTA、菜籽油、玻璃、动力煤）
  **提示：法定节假日的前一日没有夜盘交易**

### 中金所

* 股指期货集合竞价时间：9：25—9：30
* 正常开盘交易时间：9：30-11：30；13：00-15：00

### 注意事项

* **由于各个品种的交易时间不统一，对于多个品种同时回测，取各个品种的交易时间并集进行回测处理**
* **对于行情数据而言，有夜盘的商品期货的夜盘开始时间为下一日行情数据的起始时间， 其中，非交易时间下单无效**
* **部分期货品种没有夜盘**

## 手续费

* 不同品种手续费、计算方式都不同
* 手续费还需要分平仓和平今仓，需分别考虑。
* 对于中金所而言，股指期货当日有开仓，那么当日的平仓则为先平今仓后平历史仓
* 对于商品期货而言，由于只有上期所有平今选项，其他三个商品交易所都遵从先开先平的原则。
* 手续费类型分：按成交量和按成交额两种，同一交易所不同品种的手续费类型也可能不同
* 佣金类型为按成交量，则手续费按元/手收取，如果佣金类型为成交额，则手续费按成交额的百分比收取。回测环境下，你可以通过[set\_commission](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/596 "set_commission")函数来设置手续费。
* 具体手续费见下表


| 品种(简称)     | 交易所               | 佣金类型 | 回测手续费 | 回测平今仓手续费 |
| -------------- | -------------------- | -------- | ---------- | ---------------- |
| 铝AL           | 上期所               | 按成交量 | 3          | 0                |
| 锡SN           | 上期所               | 按成交量 | 3          | 0                |
| 橡胶RU         | 上期所               | 按成交额 | 0.00045    | 0.00045          |
| 线材WR         | 上期所               | 按成交额 | 0.00004    | 0.00004          |
| 螺纹钢RB       | 上期所               | 按成交额 | 0.000045   | 0                |
| 燃油FU         | 上期所               | 按成交额 | 0.00002    | 0.00002          |
| 金AU           | 上期所               | 按成交量 | 10         | 0                |
| 铜CU           | 上期所               | 按成交额 | 0.000025   | 0                |
| 银AG           | 上期所               | 按成交额 | 0.00005    | 0                |
| 铅PB           | 上期所               | 按成交额 | 0.00004    | 0                |
| 镍NI           | 上期所               | 按成交量 | 6          | 0                |
| 热轧卷板HC     | 上期所               | 按成交额 | 0.00004    | 0                |
| 锌ZN           | 上期所               | 按成交量 | 3          | 0                |
| 沥青BU         | 上期所               | 按成交额 | 0.00005    | 0                |
| 原油SC         | 上海国际能源交易中心 | 按成交量 | 20         | 0                |
| 棕榈油P        | 大商所               | 按成交量 | 2.5        | 0                |
| 细木工板BB     | 大商所               | 按成交额 | 0.0001     | 0.00005          |
| 鸡蛋JD         | 大商所               | 按成交额 | 0.00015    | 0.00015          |
| 焦炭J          | 大商所               | 按成交额 | 0.00006    | 0.00003          |
| 聚乙烯L        | 大商所               | 按成交量 | 2          | 0                |
| 聚丙烯PP       | 大商所               | 按成交额 | 0.00005    | 0.00025          |
| 铁矿石I        | 大商所               | 按成交额 | 0.00006    | 0.00003          |
| 豆粕M          | 大商所               | 按成交量 | 1.5        | 0                |
| 玉米C          | 大商所               | 按成交量 | 1.2        | 0                |
| 焦煤JM         | 大商所               | 按成交额 | 0.00006    | 0.00003          |
| 中密度纤维板FB | 大商所               | 按成交额 | 0.0001     | 0.00005          |
| 玉米淀粉CS     | 大商所               | 按成交量 | 1.5        | 0                |
| 豆一A          | 大商所               | 按成交量 | 2          | 0                |
| 豆二B          | 大商所               | 按成交量 | 2          | 2                |
| 聚氯乙烯V      | 大商所               | 按成交量 | 2          | 0                |
| 豆油Y          | 大商所               | 按成交量 | 2.5        | 0                |
| 锰硅SM         | 郑商所               | 按成交量 | 3          | 0                |
| 白糖SR         | 郑商所               | 按成交量 | 3          | 0                |
| 菜籽粕RM       | 郑商所               | 按成交量 | 1.5        | 0                |
| 油菜籽RS       | 郑商所               | 按成交量 | 2          | 0                |
| 早籼稻RI(ER)   | 郑商所               | 按成交量 | 2.5        | 2.5              |
| TA             | 郑商所               | 按成交量 | 3          | 3                |
| 动力煤ZC(TC)   | 郑商所               | 按成交量 | 4          | 0                |
| 晚籼稻LR       | 郑商所               | 按成交量 | 3          | 0                |
| 甲醇MA(ME)     | 郑商所               | 按成交量 | 1.4        | 0                |
| 粳稻谷JR       | 郑商所               | 按成交量 | 3          | 3                |
| 硅铁SF         | 郑商所               | 按成交量 | 3          | 0                |
| 菜籽油OI(RO)   | 郑商所               | 按成交量 | 2.5        | 0                |
| 棉花CF         | 郑商所               | 按成交量 | 4.3        | 0                |
| 玻璃FG         | 郑商所               | 按成交量 | 3          | 0                |
| 普麦PM         | 郑商所               | 按成交量 | 5          | 5                |
| 强麦WH(WS)     | 郑商所               | 按成交量 | 2.5        | 0                |
| 面纱CY         | 郑商所               | 按成交量 | 4          | 0                |
| 苹果AP         | 郑商所               | 按成交量 | 1.5        | 0                |
| 沪深300IF      | 中金所               | 按成交额 | 0.000023   | 0.0023           |
| 中证500IC      | 中金所               | 按成交额 | 0.000023   | 0.0023           |
| 上证50IH       | 中金所               | 按成交额 | 0.000023   | 0.0023           |

## 保证金

* 不同品种保证金比例不同，且保证金比例会不断进行变动，您可以通过[get\_future\_info](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/0 "get_future_info")函数，来查询期货品种的保证金比例
* 保证金分交易所保证金和期货公司保证金，一般而言交易所保证金小于等于期货公司保证金
* 回测环境使用交易所保证金，你可以通过[set\_margin\_rate](http://quant.10jqka.com.cn/platform/html/help-api.html?t=-3#587/596 "set_margin_rate")函数来设置手续费。
* 具体交易所保证金见下表(2018-12)


| 交易所 | 品种 | 名称             | 标准% |
| ------ | ---- | ---------------- | ----- |
| CFFEX  | IC   | 中证500指数      | 15.00 |
| CFFEX  | IF   | 沪深300指数      | 10.00 |
| CFFEX  | IH   | 上证50指数       | 10.00 |
| CZCE   | AP   | 鲜苹果           | 11.00 |
| CZCE   | CF   | 一号棉花         | 7.00  |
| CZCE   | CY   | 棉纱             | 5.00  |
| CZCE   | FG   | 玻璃             | 7.00  |
| CZCE   | JR   | 粳稻谷           | 5.00  |
| CZCE   | LR   | 晚籼稻           | 5.00  |
| CZCE   | MA   | 甲醇             | 7.00  |
| CZCE   | OI   | 菜籽油           | 7.00  |
| CZCE   | PM   | 普通小麦         | 5.00  |
| CZCE   | RI   | 早籼稻           | 5.00  |
| CZCE   | RM   | 菜籽粕           | 6.00  |
| CZCE   | RS   | 油菜籽           | 20.00 |
| CZCE   | SF   | 硅铁             | 7.00  |
| CZCE   | SM   | 锰硅             | 7.00  |
| CZCE   | SR   | 白砂糖           | 5.00  |
| CZCE   | TA   | 精对苯二甲酸     | 6.00  |
| CZCE   | WH   | 优质强筋小麦     | 20.00 |
| CZCE   | ZC   | 动力煤           | 8.00  |
| DCE    | a    | 黄大豆1号        | 7.00  |
| DCE    | b    | 豆二             | 7.00  |
| DCE    | b    | 黄大豆2号        | 7.00  |
| DCE    | bb   | 细木工板         | 20.00 |
| DCE    | c    | 黄玉米           | 5.00  |
| DCE    | cs   | 玉米淀粉         | 5.00  |
| DCE    | fb   | 中密度纤维板     | 20.00 |
| DCE    | i    | 铁矿石           | 8.00  |
| DCE    | j    | 冶金焦炭         | 9.00  |
| DCE    | jd   | 鲜鸡蛋           | 8.00  |
| DCE    | jm   | 焦煤             | 9.00  |
| DCE    | l    | 线型低密度聚乙烯 | 7.00  |
| DCE    | m    | 豆粕             | 7.00  |
| DCE    | p    | 棕榈油           | 6.00  |
| DCE    | pp   | 聚丙烯           | 7.00  |
| DCE    | v    | 聚氯乙烯         | 7.00  |
| DCE    | y    | 豆油             | 6.00  |
| INE    | sc   | 原油             | 10.00 |
| SHFE   | ag   | 白银             | 6.00  |
| SHFE   | al   | 铝               | 7.00  |
| SHFE   | au   | 黄金             | 5.00  |
| SHFE   | bu   | 石油沥青         | 8.00  |
| SHFE   | cu   | 铜               | 7.00  |
| SHFE   | fu   | 燃料油           | 10.00 |
| SHFE   | hc   | 热轧卷板         | 8.00  |
| SHFE   | ni   | 镍               | 8.00  |
| SHFE   | pb   | 铅               | 8.00  |
| SHFE   | rb   | 螺纹钢           | 9.00  |
| SHFE   | ru   | 天然橡胶         | 9.00  |
| SHFE   | sn   | 锡               | 7.00  |
| SHFE   | sp   | 漂针浆           | 7.00  |
| SHFE   | wr   | 线材             | 8.00  |
| SHFE   | zn   | 锌               | 8.00  |

## 滑点

**在实战交易中，往往最终成交价和预期价格有一定偏差，因此我们提供两种滑点模式来帮助您更好地模拟真实市场的表现：**

* 设置固定滑点，即最终成交价和委托价之差为固定值。
* 设置可变滑点，即最终成交价和预期价格之比为固定百分比。默认为可变滑点0.2%，即买入成交价为委托价上浮0.1%，卖出成交价为委托价下调0.1%。
* 默认无滑点，不过您可通过set_slippage函数来设置回测具体的滑点参数。

## 订单委托

* 期货委托跟股票一致，支持限价单和市价单下单
* 系统会根据订单冻结可用资金
* 计算公式：冻结资金=委托数量x委托价格x交易单x保证金比例.
* 与股票一致，期货交易实施涨跌停板制度，涨停无法买入，跌停无法卖出。 ps:市价单按涨停价计算

## 订单处理

对于您在某个单位时间下的单，我们会做如下处理：

- **按天回测**

　A.**交易价格：**
　>市价单：开盘价+滑点。
　>限价单：委托价。
　B.**最大成交量:**
　>默认为下单当日总成交量的25%，该比例可通过市场参与度函数set_volume_limit进行调整。
　>若下单量低于最大成交量，则按下单量成交；若下单量大于最大成交量，则按最大成交量成交。
　**C.撮合方式：**
　>市价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。
　>限价单：开盘下单，一次性撮合，不成交或未成交部分不再撮合。

- **分钟回测**

　A.**交易价格：**
　>市价单：当前分钟起始价+滑点
　>限价单：委托价
　B.**最大成交量：**
　>默认为下单当前分钟总成交量的25%，该比例可通过市场参与度函数set_volume_limit进行调整。
　>若下单量低于最大成交量，则按下单量成交；若下单量大于最大成交量，则按最大成交量成交。
　C.**撮合方式：**
　>市价单：分钟起始点下单，一次性撮合，不成交或未成交部分即刻取消委托。
　>限价单：分钟起始点下单，之后每分钟均按分钟价量撮合一次，未成交部分顺延至下一分钟进行撮合，直到完全成交或者当天收盘为止。

## 期货结算

* 期货交易实行每日无负债制度，因此每个交易日结束后需进行清算，以结算价将账户持仓盈亏结算为保证金账户可用资金，同时更新占用保证金.
  **ps:日内（盘中）可用资金和占用保证金保持不变。**

## 期货强平

* 当期货合约持仓需要的维持保证金超过当前保证金账户的总资金时，会进行合约强平
* 强平操作先从亏损最多的开始平仓，直至满足维持保证金要求
* 强平单会以第二天的开盘价成交，并产生对应的交易记录

## 期货交割

* 期货持仓到交割日，没有手动交割，系统会以当天结算价进行强平

## 调试功能

* 程序能一次写完并正常运行的概率很小，基本不超过1%。总会有各种各样的bug需要修正。有的bug很简单，看看错误信息就知道，有的bug很复杂，我们需要知道出错时，哪些变量的值是正确的，哪些变量的值是错误的，因此，需要一整套调试程序的手段来修复bug。

  > 1.简单直接粗暴有效的方式是用print把可能有问题的变量打印出来看看，逐个检查，用print最大的坏处是将来还得删掉它，想想程序里到处都是print，运行结果也会包含很多垃圾信息。
  >
  > 2.在策略编辑页面，SuperMind提供代码调试功能，你可以采用这套完整的调试程序来修复程序bug
  >
* 如何启动调试程序？

　　在策略编辑器左侧,点击"行号",设置断点后,点击"编译运行"启动调试程序。
![](http://u.thsi.cn/imgsrc/sns/c00818b57a921ccb808a715f66ad8eaa_1258_611.png)

![](https://s2.loli.net/2023/08/16/pM8x4fwO1dQSBYe.png)

* 调试程序简介
  > 1.启动调试程序后，代码会自动运行到第一个断点处，如上图，第一个断点是行7，代码当前已运行完行7（行8还未运行）
  > 2.调试程序右上角显示的时间是回测系统的运行时间
  > 3.调试程序上方菜单栏，从左到右共6个按钮，分别为：恢复执行代码(跳至下一个断点),执行下一步(不运行函数),执行下一步(运行函数),跳出此函数,清空console,结束调试继续编译
  > 4.调试程序左侧即为console面板,右侧为监控属性面板
  > 5.1分钟内不使用调试程序，则自动关闭调试程序
  > 6.调试时，程序无视注释内容
  >
* 菜单栏按钮介绍
  > 1.恢复执行代码(跳至下一个断点)：直接运行至下一个断点处
  > 2.执行下一步(不运行函数)：运行下一行代码，如果下一行代码调用函数，则直接运行完该函数，接着准备下一行代码
  > 3.执行下一步(运行函数)：运行下一行代码，如果下一行代码调用函数，则会进入函数内，执行函数内第一行代码
  > 4.跳出此函数:如果当前行处于函数中，则直接运行完该函数
  > 5.清空console:清空左侧console面板的所有内容
  > 6.结束调试继续编译:关闭调试程序，策略继续编译
  >
* 如何使用console面板？
  > 输入变量，“Enter”输出变量值(无法修改参数)
  > 变量之间运算，“Enter”输出结果
  > 判断变量是否满足条件，“Enter”输出结果![](https://s2.loli.net/2023/08/16/ugoMEdH1qSXL257.png)
  >
* 如何监控变量？
  > 调试程序右侧监控属性，点击"+添加"，输入变量名，点击“完成”，即可进行监控![](https://s2.loli.net/2023/08/16/afcrnO8NPkxHoLM.png)
  >
* 监控面板显示当前监控的变量及变量值，继续运行代码 ![7bc63bf0806ee45e4b407f21dc4bd28c_1259_667_1_.png](https://s2.loli.net/2023/08/16/jbUOWkQ5XgGoesw.png)
  运行代码的过程中，监控面板实时显示监控变量及变量值，便于您进行观察，不需要print打印函数来逐一输出。![f91b1e93a781dde6e94235ef647803db_1259_667_1_.png](https://s2.loli.net/2023/08/16/iEHzGP4KvDBRdnA.png)

## 【案例】螺纹均线策略

```python
def init(context):
    #设立商品期货账户
    set_subportfolios([{"cash": 0, "type": 'stock'},{"cash": 200000, "type": "future"}])
    #设置需要交易的标的，螺纹钢
    context.ins = 'RB9999'
    #订阅需要交易的期货品种
    subscribe('RB9999')
def handle_bar(context, bar_dict):
    #获取螺纹钢的合约代码
    g.con = get_futures_dominate('RB')
    #获取合约行情数据
    date = get_datetime().strftime('%Y%m%d %H%M')
    if date[-1] == '0' or date[-1] == '5':
        hist1 = get_price_future(g.con,None,date,'1d',['close'],bar_count = 20)
        #计算5日，20日均线
        ma20 = hist1.mean().values
        ma5 = hist1.iloc[-5:].mean().values
        p = hist1.iloc[-1].values
        #获取当前账户的多空单数量
        short_amount = context.portfolio.future_account.positions[context.ins].short_amount
        long_amount = context.portfolio.future_account.positions[context.ins].long_amount

        #判断条件，如果价格突破20日线，且账户存在空单，则平空
        if p > ma20 and short_amount > 0:
           order_future(context.ins, short_amount, 'close', 'short', None)
        #判断条件，如果5日均线突破20日线，且账户没有多单，则开多
        elif ma5 > ma20 and long_amount == 0:
           order_future(context.ins, 15, 'open', 'long', None)
        #判断条件，如果价格突破跌破20日线，且账户存在多单，则平多
        elif p <= ma20 and long_amount > 0:
           order_future(context.ins, long_amount, 'close', 'long', None)
        #判断条件，如果5日均线跌破20日线，且账户没有空单，则开空
        elif ma5 <= ma20 and short_amount == 0:
           order_future(context.ins, 15, 'open', 'short', None)
def after_trading(context):
    #收盘查看账户基本合约持仓情况
    log.info('收盘查看账户基本合约持仓情况')
    log.info(context)
```

## 【案例】股票期货混合策略

```python
def init(context):
    #设立商品期货子账户,其中stock为30000，future为700000
    set_subportfolios([{"cash": 300000, "type": 'stock'},{"cash": 700000, "type": "future"}])
    set_volume_limit(0.25,0.5)
    set_slippage(PriceSlippage(0.1),'stock')
    set_slippage(FixedSlippage(0),'future')

    #设置需要交易的标的，螺纹钢
    context.ins='RB9999'
    set_margin_rate('RB',0.09,0.09) 


def handle_bar(context, bar_dict):
    stock(context, bar_dict)
    future(context, bar_dict)
def after_trading(context):
    #收盘查看账户基本合约持仓情况
    log.info(context)
    pass

def stock(context, bar_dict):
    price = history(['000001.SZ'], ['close'] , 20, '1d', False, 'pre', is_panel=1)['close']
    ma20 = price.mean().values
    ma5 = price.iloc[-5:].mean().values
    if ma20<ma5 and '000001.SZ' not in context.portfolio.stock_account.positions:
       log.info('买入平安银行')
       order_target_percent('000001.SZ',1)
    elif ma20>ma5 and context.portfolio.stock_account.positions['000001.SZ'].available_amount>0:
       log.info('卖出平安银行')
       order_target('000001.SZ',0)

def future(context, bar_dict):
    #获取螺纹钢的合约代码
    g.con = get_futures_dominate('RB')
    #获取合约行情数据
    hist1 = history_future(g.con,['close'], 250,'1m',False,'pre', is_panel=1)['close']
    #计算250日，20日均线
    ma250 = hist1.mean().values
    ma20 = hist1.iloc[-20:].mean().values
    p = hist1.iloc[-1].values
    #获取当前账户的多空单数量
    short_amount = context.portfolio.future_account.positions[context.ins].short_amount
    long_amount = context.portfolio.future_account.positions[context.ins].long_amount
    #判断条件，如果价格突破250日线，且账户存在空单，则平空
    if p > ma250 and short_amount > 0:
       order_future(context.ins, 15, 'close', 'short', None)
    #判断条件，如果20日均线突破250日线，且账户没有多单，则开多
    elif ma20 > ma250 and long_amount == 0:
       order_future(context.ins, 15, 'open', 'long', None)
    #判断条件，如果价格突破跌破250日线，且账户存在多单，则平多
    elif p <= ma250 and long_amount > 0:
       order_future(context.ins, 15, 'open', 'short', None)
    #判断条件，如果20日均线跌破250日线，且账户没有空单，则开空15手，即平多头的15手
    elif ma20 <= ma250 and short_amount == 0:
       order_future(context.ins, 15, 'close', 'long', None)
```

## 【案例】Alpha对冲策略

```python
import pandas as pd
import numpy as np
import datetime
def init(context):
    #设立期货账户
    set_subportfolios([{"cash": 7000000, "type": 'stock'},{"cash": 3000000, "type": "future"}])
    # 设置最大持股数
    context.max_stocks = 10 
    #记录天数，隔20个交易日调仓
    g.day = 0
def handle_bar(context, bar_dict):
    #期货对冲市值小于股票多头市值，且期货账户有可用资金，则开空单对冲
    if abs(context.portfolio.future_account.market_value) <= context.portfolio.stock_account.total_value and context.portfolio.future_account.available_cash > 0:
        code = get_futures_dominate('IF')
        subscribe(code)
        num = int(context.portfolio.stock_account.total_value/1000000)
        order_future(code,num,"open","short",limit_price=None)
    #股票调仓
    if g.day%20 !=0:
        return None
    g.day =  g.day +1
    # 每个调仓日先清仓持有的股票
    for security in list(context.portfolio.positions.keys()):
        order_target(security, 0)
    # 首先获得当前日期
    time = get_datetime()
    date = time.strftime('%Y%m%d')
    # 获得股票池列表
    sample = get_index_stocks('000300.SH',date)
    # 创建字典用于存储因子值
    df = {'security':[], 1:[], 2:[], 3:[], 'score':[]}
    # 因子选择
    for security in sample:
        q=query(
            profit.roic,# 投资回报率
            valuation.pb,# 市净率
            valuation.ps_ttm,# 市销率
        ).filter(
            profit.symbol==security
        )

        # 缺失值填充为0
        fdmt = get_fundamentals(q, date=date).fillna(0)

        # 判断是否有数据
        if (not (fdmt['profit_roic'].empty or
                fdmt['valuation_pb'].empty or
                fdmt['valuation_ps_ttm'].empty)):
            # 计算并填充因子值
            df['security'].append(security)
            df[1].append(fdmt['profit_roic'][0])# 因子1：投资回报率
            df[2].append(fdmt['valuation_pb'][0])# 因子2：市净率
            df[3].append(fdmt['valuation_ps_ttm'][0])#因子3：市销率

    for i in range(1, 4):
        # 因子极值处理，中位数去极值法
        m = np.mean(df[i])
        s = np.std(df[i])
        for j in range(len(df[i])):
            if df[i][j] <= m-3*s:
                df[i][j] = m-3*s
            if df[i][j] >= m+3*s:
                df[i][j] = m+3*s
        m = np.mean(df[i])
        s = np.std(df[i])

        # 因子无量纲处理，标准化法
        for j in range(len(df[i])):
            df[i][j] = (df[i][j]-m)/s

    # 计算综合因子得分
    for i in range(len(df['security'])):
        # 等权重计算(注意因子方向)
        s = (df[1][i]-df[2][i]-df[3][i])
        df['score'].append(s)

    # 按综合因子得分由大到小排序
    df = pd.DataFrame(df).sort_values(by ='score', ascending=False)

    # 等权重分配资金
    cash = context.portfolio.available_cash/context.max_stocks

    # 买入新调仓股票
    for security in df[:context.max_stocks]['security']:
        order_target_value(security, cash)
```
