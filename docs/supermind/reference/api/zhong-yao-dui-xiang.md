---
title: "重要对象"
---

# 重要对象
## 上下文对象

### context

- 🔧作用：

  - 全局对象，存储策略信息(context.run_info),账户持仓数据(context.portfolio)，也可用于储存自定义全局变量。仅在策略框架内可用
- ⛺数据结构


  | 字段名      | 含义                                                                                                             |
  | ----------- | ---------------------------------------------------------------------------------------------------------------- |
  | `run_info`  | 策略运行的配置信息（起止时间、初始资金、频率等），见[run_info](/supermind/reference/api/zhong-yao-dui-xiang#run-info) |
  | `portfolio` | 当前投资组合总览，包含股票和期货账户及持仓汇总，见[portfolio](/supermind/reference/api/zhong-yao-dui-xiang#portfolio) |
- ❗注意事项：

  - 自定义的全局变量尽可能存在 `g`中而不是 `context`,避免系统变量被覆盖
- 📝示例：

```python
def init(context):
    context.fired=True
    log.info(context.run_info)
    log.info(context.portfolio)
    log.info(context.fired)
  
def handle_bar(context,bar_dict):
    if context.fired:
        odr_id = order('000001.SZ',100)
        context.fired = False
        log.info(context.run_info)
        log.info(context.portfolio)
        log.info(context.fired)
  
        log.info(context.portfolio.positions) #输出看起来像个列表,实际类似于字典
        log.info(context.portfolio.stock_account.positions)
  
        log.info(context.portfolio.positions['000001.SZ'])
        log.info(context.portfolio.stock_account.positions['000001.SZ'])
```

### run_info


| 字段名                 | 类型            | 含义                                   |
| ---------------------- | --------------- | -------------------------------------- |
| `start_date`           | `datetime.date` | 策略运行起始日期                       |
| `end_date`             | `datetime.date` | 策略运行结束日期                       |
| `frequency`            | `str`           | 行情频率（如`'1d'` 表示日频）          |
| `stock_starting_cash`  | `float`         | 股票账户初始资金（期货回测中可能为 0） |
| `future_starting_cash` | `float`         | 期货账户初始资金（股票回测中可能为 0） |
| `benchmark`            | `str`或`None`   | 基准指数代码，未设置时为`None`         |

### portfolio


| 字段名            | 类型                | 含义                                                                                                                                                                                                       |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `available_cash`  | `float`             | 可用现金                                                                                                                                                                                                   |
| `frozen_cash`     | `float`             | 冻结资金                                                                                                                                                                                                   |
| `returns`         | `float`             | 收益率                                                                                                                                                                                                     |
| `market_value`    | `float`             | 持仓总市值                                                                                                                                                                                                 |
| `portfolio_value` | `float`             | 总资产                                                                                                                                                                                                     |
| `starting_value`  | `float`             | 初始总资产                                                                                                                                                                                                 |
| `pnl`             | `float`             | 累计盈亏（元）                                                                                                                                                                                             |
| `start_date`      | `datetime.date`     | 组合起始日期                                                                                                                                                                                               |
| `positions`       | 类似`dict`          | 持仓情况，key为标的代码，value为[StockPosition](/supermind/reference/api/zhong-yao-dui-xiang#stockposition类)对象或[FuturePosition](/supermind/reference/api/zhong-yao-dui-xiang#futureposition类)对象 |
| `datetime`        | `datetime.datetime` | 当前行情时间戳                                                                                                                                                                                             |
| `stock_account`   | `StockAccount`      | 股票子账户详情，**期货回测中为`None`**，见[`stock_account`](/supermind/reference/api/zhong-yao-dui-xiang#stock-account)                                                                                         |
| `future_account`  | `FutureAccount`     | 期货子账户详情，**股票回测中为`None`**，见`future_account`                                                                                                                                             |

### StockPosition类


| 字段名             | 类型                | 含义         |
| ------------------ | ------------------- | ------------ |
| `symbol`           | `str`               | 股票代码     |
| `amount`           | `int`               | 持仓总数量   |
| `available_amount` | `int`               | 可用数量     |
| `pnl`              | `float`             | 盈亏         |
| `market_value`     | `float`             | 持仓市值     |
| `cost_basis`       | `float`             | 持仓成本     |
| `last_price`       | `float`             | 最新市场价格 |
| `pre_price`        | `float`             | 前一收盘价   |
| `datetime`         | `datetime.datetime` | 当前时间     |
| `position_days`    | `int`               | 持仓天数     |
| `profit_rate`      | `float`             | 收益率       |
| `draw_down`        | `float`             | 回撤比例     |
| `markup`           | `float`             | 当日收益率   |

### stock_account


| 字段名           | 类型       | 含义                                                                                                                |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `available_cash` | `float`    | 股票账户可用资金                                                                                                    |
| `frozen_cash`    | `float`    | 股票账户冻结资金                                                                                                    |
| `market_value`   | `float`    | 股票持仓总市值                                                                                                      |
| `total_value`    | `float`    | 股票账户总资产                                                                                                      |
| `positions`      | 类似`dict` | 持仓情况，key为标的代码，value为[StockPosition](/supermind/reference/api/zhong-yao-dui-xiang#stockposition类)对象 |
| `pnl`            | `float`    | 股票账户累计盈亏                                                                                                    |

### FuturePosition类


| 字段名               | 类型                | 含义             |
| -------------------- | ------------------- | ---------------- |
| `symbol`             | `str`               | 期货合约代码     |
| `pnl`                | `float`             | 盈亏             |
| `daily_pnl`          | `float`             | 当日盈亏         |
| `margin`             | `float`             | 当前总占用保证金 |
| `market_value`       | `float`             | 持仓合约价值     |
| `long_amount`        | `int`               | 多头总手数       |
| `long_today_amount`  | `int`               | 多头今仓手数     |
| `long_cost_basis`    | `float`             | 多头开仓均价     |
| `long_margin`        | `float`             | 多头占用保证金   |
| `short_amount`       | `int`               | 空头总手数       |
| `short_today_amount` | `int`               | 空头今仓手数     |
| `short_cost_basis`   | `float`             | 空头开仓均价     |
| `short_margin`       | `float`             | 空头占用保证金   |
| `last_price`         | `float`             | 最新市场价格     |
| `datetime`           | `datetime.datetime` | 当前时间         |
| `position_days`      | `int`               | 持仓天数         |
| `profit_rate`        | `float`             | 收益率           |
| `draw_down`          | `float`             | 回撤比例         |
| `markup`             | `float`             | 当日收益率       |

### future_account


| 字段名             | 类型       | 含义                                                                                                                    |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `available_cash`   | `float`    | 可用资金                                                                                                                |
| `frozen_cash`      | `float`    | 冻结资金                                                                                                                |
| `market_value`     | `float`    | 持仓合约价值                                                                                                            |
| `total_value`      | `float`    | 账户总资产                                                                                                              |
| `transaction_cost` | `float`    | 账户累计交易费用（所有合约手续费之和）                                                                                  |
| `positions`        | 类似`dict` | 持仓情况，key为标的代码，value为[`FuturePosition`](/supermind/reference/api/zhong-yao-dui-xiang#futureposition类)对象 |
| `margin`           | `float`    | 总占用保证金                                                                                                            |
| `long_margin`      | `float`    | 多头方向保证金占用                                                                                                      |
| `short_margin`     | `float`    | 空头方向总保证金占用                                                                                                    |
| `pnl`              | `float`    | 盈亏                                                                                                                    |
| `daily_pnl`        | `float`    | 当日盈亏                                                                                                                |
| `profit_rate`      | `float`    | 收益率                                                                                                                  |
| `draw_down`        | `float`    | 回撤比例                                                                                                                |

## 订阅行情对象

### bar_dict

- 🔧作用：

  - 全局对象，用于储存当前时间的bar行情数据。仅在策略框架内可用
- ⛺数据结构:

  - 类似`dict`，key为标的代码，value为[`Bar`](/supermind/reference/api/zhong-yao-dui-xiang#bar类)对象
- ❗注意事项：

  - 使用股票API时，无需订阅
  - 使用期货API时，需要使用 `subscribe`函数订阅
- 📝示例：

```python
def init(context):
    subscribe('IF9999')

def handle_bar(context, bar_dict):
    print(bar_dict['IF9999'].open)
```

### Bar类


| 字段名        | 类型                | 含义                               |
| ------------- | ------------------- | ---------------------------------- |
| `symbol`      | `str`               | 标的代码                           |
| `datetime`    | `datetime.datetime` | 数据对应时间                       |
| `open`        | `float`             | 开盘价                             |
| `high`        | `float`             | 最高价                             |
| `low`         | `float`             | 最低价                             |
| `close`       | `float`             | 收盘价                             |
| `volume`      | `float`             | 成交量（单位：期货为手，股票为股） |
| `turnover`    | `float`             | 成交额（单位：元）                 |
| `high_limit`  | `float`             | 涨停价                             |
| `low_limit`   | `float`             | 跌停价                             |
| `prev_close`  | `float`             | 前收盘价                           |
| `avg_price`   | `float`             | 成交均价                           |
| `settle`      | `float`             | **仅期货日频**：当日结算价         |
| `prev_settle` | `float`             | **仅期货日频**：前一交易日结算价   |
| `is_st`       | `bool`              | **仅股票**：是否为ST               |
| `is_paused`   | `bool`              | **仅股票**：是否处于停牌状态       |

## 订单对象：Order类

- 🔧作用：
  - on_order函数推送,或使用get_order/get_orders/get_open_orders函数查询。仅在策略框架内可用
- ⛺数据结构:


| 字段名             | 类型                | 含义                                                                                                                      |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `order_id`         | `str`               | 订单唯一标识                                                                                                              |
| `symbol`           | `str`               | 标的代码                                                                                                                  |
| `created`          | `datetime.datetime` | 订单创建时间                                                                                                              |
| `datetime`         | `datetime.datetime` | 同`created`                                                                                                               |
| `order_type`       | `str`               | 交易方向：`'LONG'` - 买入、`'SHORT'` - 卖出                                                                               |
| `type`             | `ORDER_TYPE`        | 委托类型，见[`ORDER_TYPE`](/supermind/reference/api/mei-ju-chang-liang#order-type-委托类型)     |
| `limit_price`      | `float`             | 委托价格，市价单为`0`                                                                                                     |
| `amount`           | `int`               | 委托数量                                                                                                                  |
| `filled_amount`    | `int`               | 已成交数量                                                                                                                |
| `avg_price`        | `float`             | 成交均价，未成交时为`0`                                                                                                   |
| `transaction_cost` | `float`             | 手续费，未成交时为`0`                                                                                                     |
| `status`           | `ORDER_STATUS`      | 订单状态，见[`ORDER_STATUS`](/supermind/reference/api/mei-ju-chang-liang#order-status-委托状态) |
| `offset_flag`      | `str`或`None`       | 开平仓标志，**仅期货有效**，股票订单此字段为 `None`。`'OPEN'` - 开仓，`'CLOSE_TODAY'` - 平今仓，`'CLOSE'` - 平仓          |

- ❗注意事项：

  - 可结合委托数量、成交数量、委托状态来判断区分未成交、部分成交、全撤、部成部撤的状态
- 📝示例：

```python
def init(context):
    g.fired = True

def handle_bar(context,bar_dict):
    if g.fired:
        odr_id = order('000001.SZ',100)
        print(get_order(odr_id))
        g.fired=False

def on_order(context,odr):
    print(odr)
```

## 成交对象：Trade类

- 🔧作用：
  - on_trade函数推送,或使用get_tradelogs函数查询。仅在策略框架内可用
- ⛺数据结构:


| 字段名               | 类型                        | 含义                                                                                                                                                        |
| -------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `order_book_id`      | `str`                       | 标的代码                                                                                                                                                    |
| `trading_datetime`   | `datetime.datetime`         | 成交时间                                                                                                                                                    |
| `datetime`           | `datetime.datetime`         | 同`trading_datetime`                                                                                                                                        |
| `order_id`           | `str`                       | 关联的订单 ID，用于追踪来源订单                                                                                                                             |
| `exec_id`            | `str`                       | 成交唯一标识                                                                                                                                                |
| `last_price`         | `float`                     | 成交价格，包含交易成本                                                                                                                                      |
| `last_quantity`      | `int`                       | 成交数量                                                                                                                                                    |
| `side`               | `SIDE`                      | 交易方向，见[`SIDE`](/supermind/reference/api/mei-ju-chang-liang#side-交易方向)                                                    |
| `commission`         | `float`                     | 手续费                                                                                                                                                      |
| `tax`                | `float`                     | 税费                                                                                                                                                        |
| `transaction_cost`   | `float`                     | 总交易成本 =`commission + tax`                                                                                                                              |
| `position_effect`    | `POSITION_EFFECT` 或 `None` | 仓位类型，**期货有效**，股票为`None`，见[`POSITION_EFFECT`](/supermind/reference/api/mei-ju-chang-liang#position-effect-仓位类型) |
| `close_today_amount` | `int`                       | 平今仓数量                                                                                                                                                  |
| `pnl`                | `float`或`None`             | 本次成交实现的盈亏，**仅平仓有效**，开仓为`None`                                                                                                            |

- ❗注意事项：

  - 有成交时就会推送，不代表订单完全成交
- 📝示例：

```python
def init(context):
    g.fired = True

def handle_bar(context,bar_dict):
    if g.fired:
        odr_id = order('000001.SZ',100)
        print(get_tradelogs())
        g.fired=False

def on_trade(context,trade):
    print(trade)
```

## 全局变量对象：g

- 🔧作用：

  - 全局对象，用于储存全局变量。仅在策略框架内可用
- ❗注意事项：

  - 自定义的全局变量尽可能存在 `g`中而不是 `context`,避免系统变量被覆盖
- 📝示例：

  ```python
  def init(context):   
      #设置要交易的股票 
      g.contract = '300033.SZ'

  def handle_bar(context, bar_dict):
      order(g.contract, 1000)
  ```
