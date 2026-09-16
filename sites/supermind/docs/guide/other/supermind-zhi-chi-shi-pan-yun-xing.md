---
title: "Supermind支持实盘运行"
---

# Supermind支持实盘运行
当前研究环境 承载了我们实盘的能力。（我们也即将上线可视化更方便的实盘管理功能）

## 【重要！！】写在最前面

1、全局变量需要为可pickle保存的对象，如list，dict等。如果没法确认最好先试运行几天。

2、查持仓、资金、委托的接口，券商可能会限制频率，所有代码里最好降低使用频率。

3、晚上22:05-22:15是后台固定清算时间，不接受新单，无法处理交易指令。

## 【重磅更新】回测代码直接实盘交易 只需一分钟！

### 1、背景与目的

之前我们有了策略回测代码，到实盘要经过熟悉实盘API、写代码、调试代码的环节，大概还需要1-2周的时间才能实盘，有非常多的用户到这一步 会束手无策，甚至放弃！

现在，有了回测代码直接实盘的功能，可以省去这个步骤，让刚入门的朋友也可以直接拿回测代码进行实盘了。很棒！为我们的工程师点赞！

此外还新增了一些接口，方便实盘交易。

不断降低实盘的门槛是我们的目标，如果您有任何好的想法意见请随时留言

***本功能需要重启研究环境才能生效！***

### 2、策略实盘交易（回测代码1分钟实盘）

* 示例：
  
  ```python
  from tick_trade_api import TradeAPI
  #初始化TradeAPI时需要指定下单策略，MarketPolicy为最新价下单；LimitPolicy为限价下单
  trade_api=TradeAPI('69271711',order_policy=LimitPolicy)
  
  source_code="""
  # 股票策略模版
  def init(context):
      pass
  
  # 盘前执行
  def before_trading(context):
      pass
  
  # 开盘时运行函数
  def handle_bar(context, bar_dict):
      order_id = order('000001.SZ', 100)
      print(get_orders())
      try:
          cancel_order(order_id)
      except:
          print('撤单失败')
      print(get_open_orders())
      print(get_tradelogs())
      print(context.portfolio.stock_account)
      print(context.portfolio.positions)
  """
  rtrade = research_trade(
      '研究环境策略',
       source_code,
       frequency='MINUTE', 
       trade_api=trade_api,
       signal_mode=False,
       recover_dt='today'
  )
  ```

`research_trade`接口文档[详见](/guide/other/nei-zhi-jie-kou#模拟仿真-research-trade)

***`trade_api=TradeAPI('69271711',order_policy=LimitPolicy)` 中的账号是模拟资金账号或者是实盘资金账号。***

![df54bf7a47071c5e416a1209b16febaa.png](http://u.thsi.cn/imgsrc/pefile/df54bf7a47071c5e416a1209b16febaa.png)

### 3、其他更新

#### 这次还增加了几个功能

策略框架中增加 ：

* `cancel_order_all()` 全撤
* `get_tradelogs()`获取当日全部成交订单
* `get_orders()` 获取委托，和`get_order()`一致，主要时和`TradeAPI`中函数名对齐

`TradeAPI`增加：

* `get_open_orders()` 获取当日未成订单
* `cancel_order_all()` 全撤

## SuperMind 1分钟快速实盘 入门教程

### 1、确保先下载好终端 并升级到最新版本

未付费的可以下载体验版本 进行仿真实盘：

[https://download.10jqka.com.cn/index/download/id/709](http://download.10jqka.com.cn/index/download/id/709)

想要用真实资金账号实盘的联系论坛首页右上角的群。

### 2、用同花顺账号进行登录软件

### 3、点击下方“研究一下”按钮：

此操作会打开网页端的研究环境 并把下方的研究文件直接拷贝到研究环境根目录

![917b01fa655b1a3cf770e33493d69820.png](http://u.thsi.cn/imgsrc/pefile/917b01fa655b1a3cf770e33493d69820.png)

遇到需要选择环境 建议选择 python3.8

### 4、打开客户端的研究环境 直接就可以看到这个文件 进行按照提示进行运行了

![c7b85ecbc8d3a3a7e91c18bf7ef758c8.png](http://u.thsi.cn/imgsrc/pefile/c7b85ecbc8d3a3a7e91c18bf7ef758c8.png)

实盘操作

#### 4.1、进入客户端首页获取资金账号：

![0cff56969e4070f0bd2c3c537f552808.png](http://u.thsi.cn/imgsrc/pefile/0cff56969e4070f0bd2c3c537f552808.png)

#### 4.2、把策略对应的资金账号填写到 TradeAPI的第一个参数中把策略对应的资金账号填写到 TradeAPI的第一个参数中

![fde7d07e4956ea491b06bd0ddb8629e9.png](http://u.thsi.cn/imgsrc/pefile/fde7d07e4956ea491b06bd0ddb8629e9.png)

#### 4.3、选中下方的代码单元格之后，点击上方三角形 ▶ 按钮启动策略：

![a1936f7ce3cb82c021a160391fcd9618.png](http://u.thsi.cn/imgsrc/pefile/a1936f7ce3cb82c021a160391fcd9618.png)

模板策略 请到 这个帖子底部进行复制（点击 研究一下，就会复制到您的研究环境根目录）：[https://quant.10jqka.com.cn/view/article/2358](https://quant.10jqka.com.cn/view/article/2358)

## 仿真/实盘与回测的差异以及解决方案

汇总一下目前实盘遇到比较多的问题、产生的原因以及如何解决问题。首先得从回测环境和实盘环境的一些区别开始说起

### 回测(模拟)与仿真柜台的区别?️

回测(模拟)环境和柜台环境(仿真、实盘)会有部分差异，如果在策略中不考虑这些差异并做对应处置，可能会导致策略在回测中正常运行，导致策略在仿真、实盘中出现bug。

梳理了一下目前主要有以下不同点(如有遗漏请补充)：

| 回测                                                   | 仿真                     |
| ------------------------------------------------------ | ------------------------ |
| 一般没有初始持股                                       | 可能有初始持股           |
| 委托通常会立刻成交                                     | 委托不会立刻成交         |
| 持仓数据中有持仓天数position\_days                     | position\_days一直等于0  |
| 不存在策略外交易                                       | 策略外交易会影响策略内   |
| 很少有撤单的场景                                       | 最好需要考虑撤单         |
| 回报没有延迟                                           | 回报有延迟               |
| 当日停牌行情数据可以补上(get_price的skip_paused=False) | 当日停牌行情数据无法补上 |

### 可能导致的问题与解决方案?️

#### 问题一：资金账号内有初始持仓

策略在回测/模拟中，在不设置的情况下是不会有初始持仓的，而在实际交易中，资金账号通常会有初始持仓。

* 可能导致的问题：
  * 部分策略内部存在内部记录持仓信息的逻辑，在资金账号有初始持仓时，使用research\_trade运行策略时，如果有加入同步函数sync\_trade\_api()或者策略的 signal\_mode=False，策略内部无初始持仓的信息，可能导致冲突报错
* 案例：策略库中的问财分钟模板

![f565fca2a94777490155078155d6e4fd.png](http://u.thsi.cn/imgsrc/pefile/f565fca2a94777490155078155d6e4fd.png)

在以上策略中，策略会将买入股票的信息记录在字典 `context.information`中。当资金账户有初始持仓时，卖出这部分股票的时候，策略会将 `context.information`中的持仓信息删除，但由于 `context.information`字典没有这部分股票代码的key(因为不在策略内买入，没有记录)，使用del方法删除持仓信息时导致报错：

* 解决方案(用户侧，具体方案需视策略实际情况而定)：
  * 初始化时在 `context.information`中记录初始持仓信息
  * 策略运行时不要在策略外部进行交易
  * 使用dict.pop()删除字典中的key，而不是del方法
* 长期解决方案(SuperMind功能优化)：
  * 以策略为单位构建资产单元(类似分仓功能)，将策略内外部资金、持仓、委托、成交数据隔离（预计7月-8月）

#### 问题二：实盘中委托通常不会立即成交

* 可能导致的问题：
  * 策略内部存在内部记录持仓信息的逻辑，在委托后立即记录买入，实际上委托后不会立刻成交（等待时间视委托价格和当前行情走势而定）。此时就有可能导致信息被漏记/多记
* 案例：示例代码

```python
import time

def init(context):
    g.information = {}
    g.symbols = ['000001.SZ','600519.SH']

def handle_bar(context):
    for symbol in g.symbols:
        order(symbol,100)
    for symbol in list(context.portfolio.positions):
        g.information[symbol] = 1
    time.sleep(3)
    for symbol in list(context.portfolio.positions):
        print(g.infomation[symbol])
```

以上代码在回测中通常不会出现问题，因为撮合是在策略内部串行且市价单通常可以成交。但是在实盘中，股票下单后汇报和撮合不会像回测中那样进行，订单的撮合和策略时同步进行的，此时，按示例代码的方式，就可能会由于订单未成交，导致信息未被记录进 `g.information`，而在三秒之后订单成交，再使用持仓代码去读 `g.information`的数据时，导致策略出错。

* 解决方案(用户侧，具体方案需视策略实际情况而定)：
  * 优化记录持仓信息的代码，比如在收盘后根据持仓、成交等信息统一进行计算，减少漏记、多记的发生
  * 考虑使用dict.get()函数获取字典内的数据
* 长期解决方案(SuperMind功能优化)：
  * 增加成交回报事件、委托状态更新事件推送(计划6月底前)

#### 问题三：券商/仿真柜台返回的持仓数据中没有position\_days数据

* 可能导致的问题：
  * 策略内使用此数据来进行控制最大持仓天数部分代码可能失效
* 案例：示例代码

```python
from datetime import timedelta as td

def init(context):
    g.symbols = ['000001.SZ','600519.SH']
    g.status = True

def handle_bar(context):
    if g.status:
        for symbol in g.symbols:
            order(symbol,100)
        g.status = False
    else:
        for k,v in context.portfolio.positions:
            trade_days = get_datetime() - td(v.positions_days)
            tdays = len(get_trade_days(
                trade_days.strftime('%Y%m%d'),
                get_datetime().strftime('%Y%m%d')
            ))
            if tdays>5:
                order_target(k,0)
```

此示例代码希望实现的是买入股票池后持有5天后卖出，在回测中没有问题，但是在仿真/实盘中，由于柜台没有positions\_days的数据，因此v.positions\_days一直会等于0，导致此部分代码无法实现预期效果。

* 解决方案(用户侧，具体方案需视策略实际情况而定)：
  * 增加记录持股天数的数据，但需要注意避免问题一和问题二
* 长期解决方案(SuperMind功能优化)：
  * 以策略为单位构建资产单元(类似分仓功能)，将策略内外部资金、持仓、委托、成交数据隔离（预计7-8月），并根据此计算出position\_days数据

#### 问题四：策略外交易会影响策略内

* 可能导致的问题：
  * 手动买入的持仓被策略卖出，手动卖出的持仓被策略买回
  * 策略代码报错
* 解决方案(用户侧，具体方案需视策略实际情况而定)：
  * 处理起来比较麻烦，改动比较多，代码能弱的同学暂时尽可能不要在策略外做手动交易
* 长期解决方案(SuperMind功能优化)：
  * 以策略为单位构建资产单元(类似分仓功能)，将策略内外部资金、持仓、委托、成交数据隔离（预计7-8月）

#### 问题五/问题六：实盘中需要考虑更复杂的场景

* 策略回测及模拟交易时，策略可以说实在相对静态的环境下运行的，并且时不考虑延迟的。而在实际的交易中，市场瞬息万变，无论是数据获取、计算耗时这种，还是下单与回报的延迟(不可控)，都会导致实盘中产生更复杂的情景
* 可能导致的问题：
  * 考虑订单长期未成交情况下的处理方式，回测中对手价/市价单通常可以立刻成交，而实际交易中则相对来说有较大概率不会立刻成交
    * 例如：价格变动剧烈时，下单后未成交，又未及时撤单、追单，降低资金效率。可能会影响策略调仓，造成策略表现变差
  * 在策略逻辑上充分考虑到订单生成、下单到券商柜台、券商柜台回报所产生的延迟，避免策略出现异常
    * 例如：在下单后立刻撤销订单，此订单刚生成，未完成初始化，处于不可撤销的状态，从而导致报错
  * 尽可能减少在handle\_bar中获取任何数据，提高计算效率，避免策略本身产生较高的延时
    * 例如：handle\_bar在9.31分被触发，从触发到下单中间计算耗时五分钟，在回测中，订单仍然会以9.31分的行情数据进行撮合。而在实盘中，订单会在9.36分被发出，从而产生延时成本。
* 解决方案(用户侧，具体方案需视策略实际情况而定)：
  * 考虑复杂场景，并增加相对于的策略代码
* 解决方案（SuperMind功能优化）：
  * 增加成交回报事件、委托状态更新事件推送(计划6月底前)

#### 问题七：实现秒级别频率的策略交易

* 可能导致的问题：
  * “量化实盘”环境虽然能丝滑便捷的实现“策略回测”一键上实盘，但同时也存在一些限制，如[signal_mode的参数设置](/guide/other/nei-zhi-jie-kou#模拟仿真-research-trade)，以及只支持日频/分钟频的策略。
* 解决方案：
  * 在“研究环境”环境提供更高的自由度，但对代码的能力要求也更高。用户可以自行搭建策略框架实现秒级别策略交易。
  * 也可以通过调用[handle_tick函数](/reference/api/ji-ben-han-shu#tick行情数据变化时调用-handle-tick)实现，注意：使用该函数必需先通过[subscribe](/reference/api/shu-ju-han-shu#订阅标的-subscribe)订阅标的行情，且在订阅标的有tick行情更新时触发策略执行。
  * 还可以通过调用[run_daily函数](/reference/api/zi-ding-yi-yun-xing-han-shu#每日定时运行函数-run-daily)实现，每秒、或固定时点触发策略执行。

![e98af7b9bdf07cc9c192db6acd86ee67.png](http://u.thsi.cn/imgsrc/pefile/e98af7b9bdf07cc9c192db6acd86ee67.png)

* 案例一：示例代码

```python
from tick_trade_api import TradeAPI
#初始化TradeAPI时需要指定下单策略，MarketPolicy为最新价下单；LimitPolicy为限价下单
trade_api=TradeAPI('69271711',order_policy=LimitPolicy)

source_code="""
# tick股票策略模版
def init(context):
    #设定标的代码
    context.symbol = ['300033.SZ']
    subscribe(context.symbol)

# 开盘时运行函数
def handle_tick(context, tick):
    log.info('定时运行')

"""
rtrade = research_trade(
    '研究环境策略handletick',
     source_code,
     frequency='TICK', 
     trade_api=trade_api,
     signal_mode=False,
     recover_dt='today'
)
```

* 案例二：示例代码

```python
from tick_trade_api import TradeAPI
#初始化TradeAPI时需要指定下单策略，MarketPolicy为最新价下单；LimitPolicy为限价下单
trade_api=TradeAPI('69271711',order_policy=LimitPolicy)

source_code="""
# tick股票策略模版
def init(context):
# 每个交易日开盘每秒执行一次
    run_daily(func=test_day, time_rule='every_bar', reference_security='300033.SZ')

def test_day(context, bar_dict):
    log.info('定时运行')

"""
rtrade = research_trade(
    '研究环境策略rundaily',
     source_code,
     frequency='TICK', 
     trade_api=trade_api,
     signal_mode=False,
     recover_dt='today'
)
```

### 总结

目前遇到的主要就是这些问题，如果在交易过程中有其他问题，也可以在本贴留言，最好可以提供测试代码复现问题便于我们查找原因。

想快速实盘可以看下面文章：

* [回测正常，模拟ok，如何快速实盘？（保姆式教学 含截图）](https://quant.10jqka.com.cn/view/article/2120)
* [SuperMind 1分钟快速实盘教程0718](https://quant.10jqka.com.cn/view/article/2358)
* [策略仿真/实盘与策略回测中的差异问题以及解决方案](https://quant.10jqka.com.cn/view/article/2185)

## 每个账号实盘可以开几个策略？

supermind不限制策略个数，但是会被内存约束，一般用户2G内存，可以运行3-4个策略，一般一个策略是500M内存占用。如果要升级内存可以看下这里：[内存不够怎么办？](/guide/other/yan-jiu-huan-jing-de-shi-yong#云端2g内存-不够怎么办)

但要注意 如果在一个资金账号下运行多个策略，需要处理策略之间的持仓冲突问题。

## 实盘注意必须开着客户端 并确保研究环境正常运行

* [研究环境关闭规则 点击这里](/guide/other/yan-jiu-huan-jing-de-shi-yong#研究环境关闭规则)
