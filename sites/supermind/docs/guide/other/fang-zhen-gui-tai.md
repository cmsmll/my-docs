---
title: "仿真柜台"
---

# 仿真柜台
## 仿真柜台介绍

模拟交易在撮合机制上和回测没有很大的区别，和真正的实盘相比，存在以下问题：

- 回测时不考虑代码本身的计算耗时，而实际上在实盘中，代码的运行耗时会带来延时成本
- 由于网络延迟和订单撮合时间，实盘中委托不会立即成交；而在回测中，可以成交的委托时立即成交的。
- 回测的资金账号永远不存在初始持仓已经手动操作的干扰，而实际上实盘中这种外部的干扰会对策略运行造成影响

而仿真柜台就是完全仿照实盘柜台的环境，可以测试出以上这些问题给策略带来的影响。因此，相比于模拟交易，仿真柜台交易是一种和实盘更接近的方式

## 使用流程

- 首先需要下载安装SuperMind客户端：[SuperMind终端](http://quant.10jqka.com.cn/platform/supermindexpert2c/index.html)

* 打开SuperMind客户端，并确保需要使用交易接口的账户处于已登录状态

![ccd34e61195d4c679c6cd1d27c089a0d.png](http://u.thsi.cn/imgsrc/pefile/ccd34e61195d4c679c6cd1d27c089a0d.png)

* 进入量化交易标签下的研究环境，并创建一个python笔记本文件(ipynb文件)

![1d4e234afcca4ef0e17e8ef6ee031e47.png](http://u.thsi.cn/imgsrc/pefile/1d4e234afcca4ef0e17e8ef6ee031e47.png)

- 初始化交易接口

```python
from tick_trade_api.api import TradeAPI
trade_api = TradeAPI(account_id='84728199') #填入已登录的资金账号
```

- 将策略代码以字符串的形式传入`research_trade`函数，并执行，具体可以参考[研究环境-模拟仿真](/guide/other/index#模拟仿真)

## 回测代码直接 仿真/实盘交易 只需一分钟！

### 背景与目的

之前我们有了策略回测代码，到实盘要经过熟悉实盘API、写代码、调试代码的环节，大概还需要1-2周的时间才能实盘，有非常多的用户到这一步 会束手无策，甚至放弃！

现在，有了回测代码直接实盘的功能，可以省去这个步骤，让刚入门的朋友也可以直接拿回测代码进行实盘了。很棒！为我们的工程师点赞！

此外还新增了一些接口，方便实盘交易。

不断降低实盘的门槛是我们的目标，如果您有任何好的想法意见请随时留言！

### ***本功能需要重启研究环境才能生效！***

### 策略实盘交易（回测代码1分钟实盘）

* ?调用方法：
  ```python
  research_trade(
      name,
      source_code,
      capital_base=100000,
      frequency='DAILY',
      stock_market='STOCK',
      benchmark=None,
      trade_api=None,
      signal_mode=True,
      dry_run=False,
      recover_dt=False,
  )


  ```
* ?参数说明：
  * name：str，策略名称，会在./persist/下生成一个同名目录，用于存放持久化的策略信息
  * source\_code：str，策略代码，可从策略研究模块中直接复制，代码置于"""..."""中
  * capital\_base： float，初始资金量
    * 如果接入了TradeAPI对象，且 `signal_mode=False`，那么此参数无意义
  * frequency: str，策略频率，'DAILY'或'MINUTE'
  * stock\_market: str，策略类型，默认'STOCK'
  * benchmark: str，基准指数
  * trade\_api: TradeAPI对象，绑定需要仿真交易的资金账号
    * 如果不传入TradeAPI对象，即 `trade_api=None`，此时为[模拟交易](http://quant.10jqka.com.cn/view/article/2105)
    * 如果传入TradeAPI对象，此时为[仿真交易](http://quant.10jqka.com.cn/view/article/2105)
  * signal\_mode: bool，（***新增***）默认为 `True`
    * `signal_mode=True`，此时策略实际上运行的时初始资金为capital\_base的模拟交易，context、get\_orders等方法返回的结果均为模拟交易中计算的数据，与资金账号的数据无关；策略下单在模拟交易撮合成交后，才会通过trade\_api下单至柜台
    * `signal_mode=False`，此时策略中context、get\_orders等方法返回的结果均为从 柜台查询，策略下单也会直接下至柜台
  * dry\_run: bool，试运行，立即返回，默认为 `False`
  * recover\_dt: bool或 str，（***新增***）是否断点运行，默认为 `False`
    * `recover_dt=False`，从当前时点开始执行，不从断定运行
    * `recover_dt=True`，从上次策略结束时点开始运行
    * `recover_dt='today'`，从当日开始运行，此模式下只会补执行 `before_trading`与 `open_auction`，`handle_bar`依旧从当前时间开始执行
    * `recover_dt='yyyyMMdd HH:mm'`，从指定时间开始运行
* ?️ 返回值：
  * [RealtimeService](http://quant.10jqka.com.cn/view/article/2105)类
* ?作用：
  * 模拟交易：撮合机制与回测相同
  * 仿真交易：通过仿真柜台撮合，更贴近真实交易环境
* ❗注意事项：
  * 策略需在9:00前开启运行，否则在未设置recover\_dt的情况下，会跳过before\_trading等步骤
  * 初始化TradeAPI时需要指定下单策略order\_policy，MarketPolicy为市价下单；LimitPolicy为限价下单。如未指定，由于策略下单时使用均价，可能存在多位小数，最终实盘账户下单的时候可能产生废单
  * `signal_mode=True`时，如想在context中获得仿真账号的持仓、资金等数据，可以使用同步函数 `sync_trade_api()`
* ?示例：
  ```python
  from tick_trade_api import TradeAPI
  #初始化TradeAPI时需要指定下单策略，MarketPolicy为市价下单；LimitPolicy为限价下单
  trade_api=TradeAPI('69271711',order_policy=MarketPolicy)

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

### trade\_api=TradeAPI('69271711',order\_policy=MarketPolicy) 中的账号是模拟资金账号或者是实盘资金账号。

![df54bf7a47071c5e416a1209b16febaa.png](http://u.thsi.cn/imgsrc/pefile/df54bf7a47071c5e416a1209b16febaa.png)

### 其他更新

### 这次还增加了几个功能

策略框架中增加 ：

* cancel\_order\_all() 全撤
* get\_tradelogs()获取当日全部成交订单
* get\_orders() 获取委托，和get\_order()一致，主要时和tradeapi中函数名对齐

tradeapi增加：

* get\_open\_orders() 获取当日未成订单
* cancel\_order\_all() 全撤

## 策略仿真/实盘与策略回测中的差异问题以及解决方案

汇总一下目前实盘遇到比较多的问题、产生的原因以及如何解决问题。首先得从回测环境和实盘环境的一些区别开始说起

### 回测(模拟)与仿真柜台的区别?️

回测(模拟)环境和柜台环境(仿真、实盘)会有部分差异，如果在策略中不考虑这些差异并做对应处置，可能会导致策略在回测中正常运行，导致策略在仿真、实盘中出现bug。

梳理了一下目前主要有6个不同点(如有遗漏请补充)：


|       | 回测                               | 仿真                    |
| ----- | ---------------------------------- | ----------------------- |
| 1️⃣ | 一般没有初始持股                   | 可能有初始持股          |
| 2️⃣ | 委托通常会立刻成交                 | 委托不会立刻成交        |
| 3️⃣ | 持仓数据中有持仓天数position\_days | position\_days一直等于0 |
| 4️⃣ | 不存在策略外交易                   | 策略外交易会影响策略内  |
| 5️⃣ | 很少有撤单的场景                   | 最好需要考虑撤单        |
| 6️⃣ | 回报没有延迟                       | 回报有延迟              |

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

以上代码在回测中通常不会出现问题，因为撮合是在策略内部串行且市价单通常可以成交。但是在实盘中，股票下单后汇报和撮合不会像回测中那样进行，订单的撮合和策略时同步进行的，此时，按示例代码的方式，就可能会由于订单未成交，导致信息未被记录进`g.information`，而在三秒之后订单成交，再使用持仓代码去读`g.information`的数据时，导致策略出错。

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

### 总结

目前遇到的主要就是这些问题，如果在交易过程中有其他问题，也可以在本贴留言，最好可以提供测试代码复现问题便于我们查找原因。
