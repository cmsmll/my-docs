---
title: "基本函数"
---

# 基本函数
| function                                                                                                                                                 | 股票 | 股票日内 | 期货期权 | 股票期货 | 场外基金 | 外汇 | T+D合约 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------- | -------- | -------- | -------- | ---- | ------- |
| [init](/reference/api/ji-ben-han-shu#初始化函数-init)                                                       | ✅   | ✅       | ✅       | ✅       | ✅       | ✅   | ✅      |
| [handle_bar](/reference/api/ji-ben-han-shu#按交易频率调用函数-handle-bar)       | ✅   | ✅       | ✅       | ✅       | ✅       | ✅   | ✅      |
| [handle_tick](/reference/api/ji-ben-han-shu#tick行情数据变化时调用-handle-tick) | ✅   | ✅       | ❌       | ❌       | ❌       | ❌   | ❌      |
| [open_auction](/reference/api/ji-ben-han-shu#集合竞价后-9-26-调用-open-auction)               | ✅   | ❌       | ❌       | ❌       | ❌       | ❌   | ❌      |
| [before_trading](/reference/api/ji-ben-han-shu#开盘前半小时调用-before-trading)        | ✅   | ✅       | ✅       | ✅       | ✅       | ✅   | ✅      |
| [after_trading](/reference/api/ji-ben-han-shu#收盘后半小时调用-after-trading)          | ✅   | ✅       | ✅       | ✅       | ✅       | ✅   | ✅      |
| [on_order](/reference/api/ji-ben-han-shu#委托回调函数-on-order)                                      | ✅   | ❌       | ❌       | ❌       | ❌       | ❌   | ❌      |
| [on_trade](/reference/api/ji-ben-han-shu#成交回调函数-on-trade)                                      | ✅   | ❌       | ❌       | ❌       | ❌       | ❌   | ❌      |

- ❗注意事项：

  - 股票策略目前仅在研究环境的回测接口中支持 `handle_tick`
  - `handle_tick`与 `handle_bar`不能并存

---

## 初始化函数 init

- 👑调用方法
  ```python
  def init(context): ...
  ```
- 🔧作用
  - 初始化函数，进行策略回测与模拟交易时在最开始时执行一次。在研究环境中，使用 `research_trade` 进行仿真交易时，只在第一次运行策略时执行一次 `init`，因此修改 `init` 里代码不会生效。
  - 用于初始化账户信息、回测参数、全局变量等。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用于存放当前账户资金、持仓信息等数据
- ❗注意事项
  - 该函数用于初始化账户，任何一个策略都必须有该函数。
  - 在该函数下，你可以设置很多初始条件，例如：基准、交易费、滑点、合约池等等。
- 📝示例：
  - 调用
    ```python
    from mindgo_api import *

    def init(context):   
        #设置要交易的标的(平安银行) ,命名的时候注意不要覆盖系统变量
        context.stock = '000001.SZ'
    ```

## 按交易频率调用函数 handle_bar

- 👑调用方法
  ```python
  def handle_bar(context, bar_dict): ...
  ```
- 🔧作用
  - 用于定时执行买卖条件，根据策略设定的交易频率（日/分钟）自动调用。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
  - `bar_dict`: [bar_dict对象](/reference/api/zhong-yao-dui-xiang#bar-dict)，用于存放当前订阅所有合约的bar行情数据。
- ❗注意事项
  - **尽可能保证此函数中的代码效率，避免在此函数下查询大量数据**，特别是在模拟、仿真交易中，避免出现执行时间过长，导致产生延时成本。
  - 此函数在非交易时间不会触发(例如1月1日至3日是非交易日，则handle_bar在1日至3日不触发，直到下一个交易日4号触发)。
  - 此函数的调用频率根据策略的交易频率确定。
  - 在该函数中，可以传入其他函数的运行结果，用来判断买卖条件。
- 📝示例：
  - 调用
    ```python
    # 每个交易频率买入100股平安银行
    def handle_bar(context, bar_dict):
        order('000001.SZ', 100)
    ```

## tick行情数据变化时调用 handle_tick

- 👑调用方法
  ```python
  def handle_tick(context, tick): ...
  ```
- 🔧作用
  - 用于在所订阅的股票tick行情数据发生变化时调用。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
  - `tick`: [tick对象](https://quant.10jqka.com.cn/view/dataplatform/detail/16)，用于存放当前推送合约的tick行情数据。
- ❗注意事项
  - **尽可能保证此函数中的代码效率，避免在此函数下查询大量数据**，特别是在模拟、仿真交易中，避免出现执行时间过长，导致产生延时成本。
  - 当同时订阅了多只股票时，遵循“时间优先，顺序优先”的规则，即首先执行时间戳靠前的股票，如果时间戳相同，则按照订阅列表中的顺序执行。
  - tick行情的更新会自动触发该方法的调用。策略具体逻辑可在该方法内实现，包括交易信号的产生、订单的创建等。在实时模拟交易中，该函数有tick行情则被触发一次。
  - **仅在T0策略、股票策略(研究环境)中有效**。
- 📝示例：
  - 调用
    ```python
    # 打印当前推送tick行情的股票代码，并下单买入100股
    def handle_tick(context, tick):
        log.info(tick.order_book_id)
        order(tick.order_book_id, 100)
    ```

## 集合竞价后(9:26)调用 open_auction

- 👑调用方法
  ```python
  def open_auction(context, bar_dict): ...
  ```
- 🔧作用
  - 用于在集合竞价后(9:26)调用一次。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
  - `bar_dict`: [bar_dict对象](/reference/api/zhong-yao-dui-xiang#bar-dict)，用于存放当前订阅所有合约的bar行情数据。
- ❗注意事项
  - **尽可能保证此函数中的代码效率**，特别是在模拟、仿真交易中，避免出现执行时间过长。
  - 在回测、模拟交易中，在此阶段下单会使用集合竞价成交数据对订单进行撮合，可用于回测集合竞价策略；但在仿真交易中，此时下的订单会在9:30进行撮合。
  - **仅在股票策略中有效**。
- 📝示例：
  - 调用
    ```python
    # 下单买入100股平安银行
    def open_auction(context, bar_dict):
        order('000001.SZ', 100)
    ```

## 开盘前半小时调用 before_trading

- 👑调用方法
  ```python
  def before_trading(context): ...
  ```
- 🔧作用
  - 用于在当天开盘前半小时调用一次，常用于使用前日数据计算因子、信号；储存自定义参数、全局变量等。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
- ❗注意事项
  - 该函数在回测中的非交易日不触发。
  - 在该函数中，你可以自由储存自定义函数的运行结果、全局变量数据等,并在 `handle_bar`等函数中使用。
- 📝示例：
  - 调用
    ```python
    # 每个交易日开市前，打印出目前的账户信息
    def before_trading(context):
        log.info(context.portfolio)
    ```

## 收盘后半小时调用 after_trading

- 👑调用方法
  ```python
  def after_trading(context): ...
  ```
- 🔧作用
  - 用于在当天收盘后半小时调用一次，常用于根据前日数据计算；储存自定义参数、全局变量等。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
- ❗注意事项
  - 该函数在回测中的非交易日不触发。
  - 在该函数中，你可以自由储存自定义函数的运行结果、全局变量数据等，用来总结今日的交易，并计划明天的交易。
- 📝示例：
  - 调用
    ```python
    # 交易日结束后，打印组合盈亏
    def after_trading(context):
        log.info(context.portfolio.pnl)
    ```

## 委托回调函数 on_order

- 👑调用方法
  ```python
  def on_order(context, odr): ...
  ```
- 🔧作用
  - 用于在委托状态更新后进行回调。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
  - `odr`: [`Order`对象](/reference/api/zhong-yao-dui-xiang#订单对象-order类)，包含委托详情。
- ❗注意事项
  - 回测时下单后立刻触发，仿真交易时会在handle_bar执行完后触发。
- 📝示例：
  - 调用
    ```python
    # 打印委托对象信息
    def on_order(context, odr):
        log.info(odr)
    ```

## 成交回调函数 on_trade

- 👑调用方法
  ```python
  def on_trade(context, trade): ...
  ```
- 🔧作用
  - 用于在有成交后进行回调。
- 📚参数说明
  - `context`: [context对象](/reference/api/zhong-yao-dui-xiang#context)，用来存放当前账户资金、持仓信息等数据。
  - `trade`: [`Trade`对象](/reference/api/zhong-yao-dui-xiang#成交对象-trade类)，包含成交详情。
- ❗注意事项
  - 回测时下单后立刻触发，仿真交易时会在handle_bar执行完后触发。
- 📝示例：
  - 调用
    ```python
    # 打印成交对象信息
    def on_trade(context, trade):
        log.info(trade)
    ```
