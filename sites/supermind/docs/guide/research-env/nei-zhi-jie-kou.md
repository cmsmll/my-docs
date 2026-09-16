---
title: "内置接口"
---

# 内置接口
## 数据接口

- 研究环境中提供了丰富的数据接口，具体可以参考：
  - [API文档-通用数据接口](/reference/api/index#通用数据接口)
  - [SuperMind数据平台](http://quant.10jqka.com.cn/view/dataplatform)

---

## 仿真交易接口 - `TradeAPI`

### 准备工作

- 先打开SuperMind客户端，并确保需要使用交易接口的账户处于已登录状态

![ccd34e61195d4c679c6cd1d27c089a0d.png](http://u.thsi.cn/imgsrc/pefile/ccd34e61195d4c679c6cd1d27c089a0d.png)

- 进入量化交易标签下的研究环境，并创建一个python笔记本文件(ipynb文件)

![1d4e234afcca4ef0e17e8ef6ee031e47.png](http://u.thsi.cn/imgsrc/pefile/1d4e234afcca4ef0e17e8ef6ee031e47.png)

### 账户信息查询

- 导入包、初始化账户

```python
from tick_trade_api.api import TradeAPI
trade_api = TradeAPI(account_id='84728199') #填入已登录的资金账号
```

- 查询账户资金

```python
portfolio = trade_api.portfolio
print(portfolio)
```

输出：

```
{'available_cash': 10350203.22, 'market_value': 1168, 'total_value': 10351371.22, 'frozen_cash': 0}
```

字段说明：

| 变量           | 释意     |
| -------------- | -------- |
| available_cash | 可用资金 |
| market_value   | 证券市值 |
| frozen_cash    | 冻结资金 |
| total_value    | 总资产   |

* 查询资金转入/转出流水

```python
transfer = trade_api.get_transfers(start_date=None, end_date=None)
```

输出：

```python
{'transfer_id': '20241213003359', 'transfer_type': '转入', 'transfer_status': '', 'cash': 100000.0, 'bank_name': '存管招商人民币', 'currency': '人民币', 'total_cash': 0.0, 'datetime': Timestamp('2024-12-13 09:51:09')}
```

字段说明：

| 变量            | 释意     |
| --------------- | -------- |
| transfer_id     | 流水编号 |
| transfer_type   | 流水类型 |
| transfer_status | 流水状态 |
| cash            | 资金     |
| bank_name       | 银行名称 |
| currency        | 币种     |
| datetime        | 成交时间 |

* 查询持仓信息

```python
positions= trade_api.positions
print(positions)
```

输出：返回一个字典对象，键值为证券代码；对应的数据为一个Namedict对象, 包含证券的各种信息。对应变量的意义可查询下面的表格。需要注意的是Namedict对象仅可以根据键值获取数值，并不具备字典可迭代等其他的特性

```
{'000001.SZ': {'symbol': '000001.SZ', 'name': '平安银行', 'amount': 100, 'frozen_amount': 100, 'available_amount': 0, 'market_value': 1164, 'cost_basis': 11.644, 'last_price': 11.64, 'pnl': -0.37, 'profit_rate': -0.0003}}
```

字段说明：

| 变量             | 释意         |
| ---------------- | ------------ |
| name             | 股票名       |
| available_amount | 可用证券数量 |
| cost_basis       | 成本         |
| last_price       | 最新价       |
| amount           | 证券数量     |
| profit_rate      | 收益率       |
| frozen_amount    | 冻结数量     |
| market_value     | 证券市值     |
| symbol           | 证券代码     |
| pnl              | 盈亏金额     |

将持仓信息转换为dataframe,可供进一步分析使用

```python
import pandas as pd
vb_list = ['symbol', 'name', 'amount', 'available_amount', 'frozen_amount', 'cost_basis', 'last_price', 'market_value', 'pnl', 'profit_rate']

positions_df = pd.DataFrame()
for symbol, info in positions.items():
    temp = pd.DataFrame([[info[vb] for vb in vb_list]], columns=vb_list, index=[0])
    positions_df = pd.concat([positions_df, temp], ignore_index=True)
print(positions_df)
```

### 柜台断线重连

- 因各家券商均有在盘前做账号初始化的机制，导致策略运行的资金账号断线，最终导致报错策略中止。故新增账号重连尝试入参，允许客户自定义重连参数，实现策略的连续运行。

```python
trade_api = TradeAPI(account_id='84728199', retry_query_exception=6, delay_query_exception=10)#设置每隔10秒尝试重连，尝试6次
```

- 参数解释：
  
  - int retry_query_exception ：重连尝试次数，大于等于0，默认0次。
  - int delay_query_exception ：重连尝试间隔，大于等于0，默认0秒。

### 下单与撤单

#### 最新价下单

当amount为负数时为卖出指令，下单成功后返回委托ID（'order_id'），委托ID可用于撤单函数进行撤单。

```python
trade_api.order(symbol='300033.SZ', amount=100)
```

#### 限价单

当amount为负数时为卖出指令，下单成功后返回委托ID（'order_id'），委托ID可用于撤单函数进行撤单。

```python
trade_api.order(symbol='000001.SZ', amount=100, price=13.4)
```

#### 智能下单

可以通过指定pricetype实现更多样化的下单需求

| pricetype | 意义   | pricetype | 意义   |
| --------- | ------ | --------- | ------ |
| 0         | 指定价 | 1         | 涨停价 |
| 2         | 跌停价 | 3         | 最新价 |
| 4         | 卖一价 | 5         | 卖二价 |
| 6         | 卖三价 | 7         | 卖四价 |
| 8         | 卖五价 | 9         | 买一价 |
| 10        | 买二价 | 11        | 买三价 |
| 12        | 买四价 | 13        | 买五价 |
| 17        | 市价   | 21        | 跟限价 |

当pricetype为0时，以price的价格下单；

当pricetype为1－13时，price表示pricetype指定价格的浮动价，最终下单委托价格pricetype指定价格+price，若最终价格大于涨停价，最终价格取涨停价 ， 若小于跌停价，最终价格取跌停价

当pricetype为17时，price表示市价类型，对于沪深有不同的含义。上证：1-五档即成剩撤，2-五档即成剩转限，3-本方最优，4-对手方最优；深证：1-对手方最优，2-本方最优，3-即成剩撤，4-五档即成剩撤，5-全额成交或撤

当pricetype为21时，买入下单时会紧贴价格笼子上沿，卖出下单时会紧贴价格笼子下沿

```
#以卖五价上浮0.3元挂100股002109的买单
trade_api.order(symbol='002109.SZ', amount=100, price=0.3, pricetype=8)
```

#### 撤单

- 传入委托ID即可撤销指定未成交委托
  
  ```python
  trade_api.cancel_order('11591')
  ```
- 如果该委托已成交或者已撤单则会报错，可以通过try、except等函数捕获该错误，操作如下
  
  ```python
  try:
      trade_api.cancel_order('11591')
  except:
      print('撤单失败: 不允许的指令:已完成或取消中的条件单不允许取消')
  ```
- 全部撤单
  
  ```python
  trade_api.cancel_order_all()
  ```

### 查询成交委托

#### 查询SuperMind后台委托记录

- 委托的结果可以通过 `trade_api.get_orders`函数查询， 同时也能在智能交易终端查看到
  - 调用方法：`trade_api.get_orders(order_id=None, start_time=None, end_time=None, symbol=None)`
  - 参数解释：
    - order_id：订单编号
    - start_time：历史查询的开始时间
    - end_time：历史查询的截止时间
    - symbol：指定股票代码
  - 注意事项：默认查询当日所有订单

<!--

##### 查询柜台委托记录

- 可以通过 `trade_api.secondary_orders`函数到直接到柜台查询委托记录
  - 调用方法：`trade_api.secondary_orders(start_date=None, end_date=None, symbol=None)`
  - 参数解释：
    - start_date：历史查询的开始日期
    - end_date：历史查询的截止日期
    - symbol：指定股票代码
  - 注意事项：默认查询当日所有订单
  - 返回字段：

| 字段     | 含义     | _ | 字段               | 含义         |
| -------- | -------- | - | ------------------ | ------------ |
| order_id | 委托编号 | _ | price              | 委托价格     |
| datetime | 时间     | _ | status             | 委托状态     |
| symbol   | 证券代码 | _ | price_type         | 委托价格类型 |
| name     | 证券名称 | _ | trade_price        | 成交价格     |
| side     | 买卖方向 | _ | trade_amount       | 成交数量     |
| amount   | 委托数量 | _ | secondary_order_id | 柜台委托编号 |

##### 查询成交记录

- 成交的结果可以通过 `trade_api.get_tradelogs`函数查询， 同时也能在智能交易终端查看到
  - 调用方法：`trade_api.get_tradelogs(start_date=None, end_date=None, symbol=None)`
  - 参数解释
  
    - start_date：历史查询的开始日期
    - end_date：历史查询的截止日期
    - symbol：指定股票代码
  - 注意事项：默认查询当日所有成交
  - 返回字段：
  
    | 字段               | 含义         | _ | 字段        | 含义     |
| ------------------ | ------------ | - | ----------- | -------- |
| datetime           | 时间         | _ | trade_price | 成交价格 |
| secondary_order_id | 柜台委托编号 | _ | amount      | 成交数量 |
| symbol             | 证券代码     | _ | side        | 买卖方向 |
| name               | 证券名称     | _ | commission  | 费用     |
  
-->

#### 委托成交推送回调

- 设定下列回调函数后，再下达委托函数，即可主动推送成交情况
  ```python
  def order_push(order):
      print("接收到订单推送: ", order)
  trade_api.register_push(orderpush=order_push)
  ```

### 算法交易

#### 自动撤追单

- 调用方法 `trade_api.NEW_RECHASE(reprice=None, spread=0, entrustcnt=3, revoke=True, timeout=60, **kwargs)`
- 参数解释：
  
  * reprice：设置为None时追单算法不生效，设置为非None时，会根据reprice和repricetype来决定追单的价格：
    * 当未传入repricetype时
      * reprice=0，repricetype会设置为3，以最新价追单，执行entrustcnt次
      * reprice为指定价格，repricetype会设置为0，以指定价格追单1次
    * 当传入repricetype时
      * 在追单时生效，repricetype含义等同于pricetype，reprice等同于price，详见[智能下单](#智能下单)，为0时只追单1次，其余追单entrustcnt次
  * spread：价差比。|(追单价格－第一次下单价格)/第一次下单价格|≤spread时，以追单价格下单，否则以第一次下单价格*(1±spread)下单，且后续不再追单。
  * entrustcnt：交易次数，默认3次。
  * revoke: 是否撤单，默认撤单。
  * timeout: 撤单间隔，默认60s。
  * repricetype: 可不传，在追单时生效，repricetype含义等同于pricetype，reprice等同于price，详见[智能下单](#智能下单)
- 示例

```python
# 创建一个自动追单下单对象 设置追单价格为82元，价差比为0.15，交易次数为3次，自动撤单，撤单时间为30秒
# 设置好追单参数以后， 自动下单追单对象的使用方法和普通下单api一样
rechase_api = trade_api.NEW_RECHASE(reprice=82, spread=0.15, entrustcnt=3, revoke=True, timeout=5)
rechase_api.order('601012.SH',amount=100, price=79)
```

```python
# 此接口另有一隐藏参数repricetype，repricetype含义等同pricetype，指定repricetype时，reprice等同price，参考智能下单
rechase_api = trade_api.NEW_RECHASE(reprice=0.01, spread=0.15, entrustcnt=3, revoke=True, timeout=5, repricetype=10)
rechase_api.order('601012.SH', amount=200, price=79)
```

#### 篮子交易

```python
basket_api = trade_api.NEW_BASKET()
rechase_api = trade_api.NEW_RECHASE(reprice=None, spread=0, entrustcnt=3, revoke=True, timeout=60)
basket_api.add(symbol='000001.SZ', amount=100, algo_api=rechase_api)  # 添加订单到篮子，可多次添加
basket_api.add(symbol='000001.SZ', amount=100, algo_api=rechase_api)  # 添加订单到篮子，可多次添加
basket_api.add(symbol='000001.SZ', amount=100, algo_api=rechase_api)  # 添加订单到篮子，可多次添加
basket_api.order(balance=1000)  # 指定篮子使用的资金，默认0为全部
```

#### TWAP算法

- 调用方法 `twap_api = trade_api.NEW_TWAP(start_time='09:30', end_time='15:00', order_interval=60, rechase_interval=30, min_order_number=100, max_order_number=10000)`
- 参数解释：
  
  * start_time: 启动时间，不能大于收盘时间和结束时间，默认09:30。
  * end_time: 结束时间，不能大于收盘时间，默认15:00。
  * order_interval: 下单间隔，最好大于10，给前一笔订单充分成交和撤单时间，默认60s。
  * rechase_interval: 补单间隔，大于等于0，小于order_interval，如果为0则下单间隔内不撤单，默认30s。
  * min_order_number: 最小下单的股票数量，默认100股。
  * max_order_number: 最大下单的股票数量，默认10000股。
  * randprice: 浮动价格，非必填，委托时在price+-randprice范围内波动。
- 说明
  
  - 算法根据起止时间、下单间隔、最大最小下单数量，来确定订单拆分笔数和每笔订单委托数量；<br>
  - 订单拆分完成后，每2笔订单下单时间间隔order_interval秒，每笔订单下单之后如未完成则间隔rechase_interval秒后进行撤补操作，撤补不影响下1笔订单，举例而言，一笔300股的订单，order_interval为60秒，rechase_interval为30秒，下单起止时间t1、t2间隔3分钟，则t1下单100股，t1+30s撤补，t1+60s下单100股，以此类推
- 示例

```python
# 创建一个TWAP下单对象，委托价格为最新价上浮0.01元，浮动范围为1元，下单间隔为60秒，撤补间隔为30秒
twap_api = trade_api.NEW_TWAP(start_time='09:30', end_time='15:00', order_interval=60, rechase_interval=30, min_order_number=100, 
                              max_order_number=10000,randprice=1)
twap_api.order(symbol='000001.SZ', amount=100, price=0.01,pricetype=3) # 限价单，amount为负数代表卖出
```

#### VWAP算法

- 调用方法 `vwap_api = trade_api.NEW_VWAP(start_time='09:30', end_time='15:00', order_interval=60, rechase_interval=30, min_order_number=100, max_order_number=10000, ordercycle=1, sampledays=30)`
- 参数解释：
  
  * str start_time: 启动时间，不能大于收盘时间和结束时间，默认09:30。

* str end_time: 结束时间，不能大于收盘时间，默认15:00。
* int order_interval: 下单间隔，最好大于10，给前一笔订单充分成交和撤单时间，默认60s。
* int rechase_interval: 补单间隔，大于等于0，小于order_interval，如果为0则下单间隔内不撤单，默认30s。
* int min_order_number: 最小下单的股票数量，默认100股。
* int max_order_number: 最大下单的股票数量，默认10000股。
* int ordercycle: 分段周期，1、5、15、30、60分钟k线，默认1分。
* int sampledays: 样本天数，默认30天。
* float randprice: 浮动价格，非必填，委托时在price+-randprice范围内波动。

- 示例

```python
vwap_api = trade_api.NEW_VWAP(start_time='09:30', end_time='15:00', order_interval=60, rechase_interval=30, min_order_number=100, max_order_number=10000, ordercycle=1, sampledays=30)
vwap_api.order(symbol='000001.SZ', amount=100) # 最新价下单，amount为负数代表卖出
```

#### 冰山算法

- 调用方法 `iceberg_api = trade_api.NEW_ICEBERG(start_time='09:30', end_time='15:00', order_percent=0.05, rechase_interval=30)`
- 参数解释：

* str start_time: 启动时间，不能大于收盘时间和结束时间，默认09:30。
* str end_time: 结束时间，不能大于收盘时间，默认15:00。
* int order_percent: 每单占比，默认0.05。
* int rechase_interval: 补单间隔，大于等于0，小于order_interval，如果为0则下单间隔内不撤单，默认30s。
* float randprice: 浮动价格，非必填，委托时在price+-randprice范围内波动。
* int entrusttype: 委托方式，非必填，0-全成即补(默认)、1-部成即补。
* float entrusttraderatio: 成交比例，非必填，当entrusttype=1时的成交比例，默认为0，只要部成就补单。
* int entrusttimeout: 成交超时时间，非必填，当entrusttype=1时的成交超时时间，默认为0，只要部成就补单。

- 说明
  
  - 一个母单拆成多个小单，每笔子单的数量是一定的，子单数量 = 委托数量 * 每单占比 , 取下整(手)
  - 一笔子单不成交，达到撤单间隔时会撤单，撤单成功后再委托下一笔子单。
  - 5种委托方式：
    - 全成即补：前一个子单全部成交完成，后一个子单才会发单。
    - 部成即补：前一个子单部分成交，后一个子单即委托出去，但是必须等到第一个子单全部成交，第二个子单部分成交，才可以委托第三个子单。
    - 成交占比：比如总委托量是10000，暴露量是1000。当比例是50%，第一次暴露量是1000，然后部分成交了400（1000*40%），是不会到第二次补单的；一直到成交了大于等于500（1000*50%）才会第二次委托。同时，必须等到第一个子单全部成交，第二个子单到50%，才可以委托第三个子单。
    - 成交超时：指超过一定时间，虽未成交，但也自动再补一笔。成交超时的规则：比如900s，指的是如果第一笔委托后900s，仍旧出现未成交or部分成交，就直接开始第二次委托。同时，必须等到第一个子单全部成交，第二个子单到委托后900s，才可以委托第三个子单。
    - 占比和超时同时设置：则只需要并且必须其中任何一个满足条件，才进行委托
- 示例

```python
iceberg_api = trade_api.NEW_ICEBERG(start_time='09:30', end_time='15:00', order_percent=0.05, rechase_interval=30)
iceberg_api.order(symbol='000001.SZ', amount=100) # 最新价下单，amount为负数代表卖出
```

### 融资融券交易

#### 导入包，建立连接

```python
from tick_trade_api.api import TradeCredit as TradeAPI, SIDE
trade_api = TradeAPI(account_id='18771019820')
```

#### 账号各类资产及委托查询函数

```python
print("账号信息:", trade_api.portfolio)
print("持仓信息:", trade_api.positions)
print("成交信息:", trade_api.get_tradelogs())
print("委托信息:", trade_api.get_orders()) # 可传入order_id查询指定委托信息
print("柜台委托信息:", trade_api.secondary_orders())
print("可融资标的券:", trade_api.get_stocks()
```

账户信息字段说明：

| 字段              | 含义         |
| ----------------- | ------------ |
| available_cash    | 可用资金     |
| market_value      | 市值         |
| total_value       | 总资产       |
| frozen_cash       | 冻结资金     |
| finance_debt      | 融资负债     |
| stock_debt        | 融券负债     |
| total_debt        | 总负债       |
| net_assets        | 净资产       |
| finance_available | 融资可用额度 |
| available_margin  | 可用保证金   |

其他API返回结果的字段含义与普通账户的API一致

#### 最新价下单

```python
trade_api.order(symbol='000001.SZ', amount=100, side=SIDE.BUY) # 最新价下单，担保品买入
trade_api.order(symbol='000001.SZ', amount=100, side=SIDE.FINANCE_BUY) # 最新价下单，融资买入
trade_api.order(symbol='000001.SZ', amount=100, side=SIDE.SALE) # 最新价下单，担保品卖出
trade_api.order(symbol='000001.SZ', amount=100, side=SIDE.STOCK_SALE) # 最新价下单，融券卖出
```

side字段说明：

| 字段                 | 含义       |
| -------------------- | ---------- |
| BUY                  | 担保品买入 |
| SALE                 | 担保品卖出 |
| PURCHASE             | 申购       |
| REDEEM               | 赎回       |
| FINANCE_BUY          | 融资买入   |
| STOCK_SALE           | 融券卖出   |
| SALE_REPAY           | 卖券还款   |
| BUY_REPAY            | 买券还款   |
| STOCK_REPAY_TRANSFER | 还券划转   |
| STOCK_LEFT_TRANSFER  | 余券划转   |

#### 限价下单

```python
trade_api.order(symbol='000001.SZ', amount=100, price=10, side=SIDE.BUY) # 限价单
```

#### 撤单

```python
trade_api.cancel_order('107828')
```

#### 还款还券

```python
trade_api.repay_finance_debt(contract_id='xxx', amount=100) # 直接还款，100元
trade_api.repay_stock_debt(contract_id='xxx', amount=100) # 直接还券，100股
```

字段说明：

| 字段        | 含义   |
| ----------- | ------ |
| contract_id | 合约编号/流水号 |
| amount      | 金额/数量   |

```python
trade_api.get_finance_debt_detail() # 查询融资负债信息，获取合约编号
trade_api.get_stock_debt_detail() # 查询融券负债信息，获取流水号
```

## 因子检验

- 可通过自定义代码实现因子检测，代码调整方法可参考SuperMind的因子检测模块
  ```python
  # coding: utf-8
  # ==========================================因子检测==============================================================
  import alphalens
  import pandas as pd
  import numpy as np
  import time
  import statsmodels.api as sm
  import scipy as sp
  
  class FactorAnalyse(object):
  
  #==========================================因子检测参数设置==============================================================
      start_date = '2021-05-22'      #回测开始时间
      end_date = '2021-06-21'        #回测结束时间
      benchindex = '000300.SH'       #基准指数设置
      stockpool = '000905.SH'            #股票池设置
      quantiles=3                    #因子分组数量
      periods=1                      #调仓周期
      frequency='daily'              #调仓频率'daily','weekly','monthly'一周按5个交易日计算，一月按21个交易日计算
  
  #==========================================添加因子==============================================================
      #添加因子名称，保持list形式，系统因子对应字段参照 http://quant.10jqka.com.cn/platform/html/help-api.html?t=data#222/436
      factor_input=['weighted_roe']
  
  
  #==========================================因子合成参数设置==============================================================
      # 因子合成参数
      #direct表示因子方向，weight表示因子权重
      #因子方向：一共有两种1和-1。1表示正序，从小到大排列，因子值越大的股票会分组至前几组；-1表示倒序，效果反之
      factor_set={"weighted_roe":{"direct":1,"weight":1}}
  
  #==========================================因子数据处理参数设置==============================================================
      #对应的因子数据处理选项
      #缺失值处理 fillna：0—不处理，1—均值法，2—回归填充法
      #极值处理 winsorize：0—不处理，1—中位数法，2—三倍标准差，3—四分位
      #正交化处理 neutralize：0—不处理，1—申万一级正交化，2—市值正交化，3—申万行业市值正交化
      #标准化处理 standardize：0—不处理，1—标准化法，2—rank值标准化，3—极差正规化
      factor_dp={"weighted_roe":{"fillna":0,"winsorize":0,"neutralize":0,"standardize":0}}
  
  #==========================================合成因子数据处理参数设置==============================================================
      #合成因子数据处理选项
      dataprcess={"fillna":0,"winsorize":0,"neutralize":0,"standardize":0}
  
  #==========================================用户自定义因子算法========================================================
      #用户可在此函数下编译因子计算方式，返回的结果需为DataFrame，列名（columns）为时间，行名（index）为股票代码  
      def factor_gen(self, start_date, end_date,stocks=None):
          stocks=stocks or self.get_stocks()   #此行代码用于更新因子时获取股票代码，请勿更改
          factor_df = get_sfactor_data(start_date, end_date, stocks, ['trix'])  #样例数据,可获取行情数据及财务数据构建新的因子
          return factor_df['trix']
  
  
  
  #==========================================因子检测前进行数据准备及数据处理========================================================
      def calc(self):
          log.info("回测区间： %s / %s" % (self.start_date, self.end_date))
          log.info("开始时间： %s " % time.strftime("%H:%M:%S"))
          if self.frequency=='daily':
              period=self.periods
          elif self.frequency=='weekly':
              period=self.periods*5
          elif self.frequency=='monthly':
              period=self.periods*21
  
          # 获取股票池
          self.get_stocks()
          # 价格数据price_df
          log.info("正在获取行情数据......： %s " % time.strftime("%H:%M:%S"))
          price_df = get_price(self.stocks, self.start_date, self.end_date, str(period) + 'd', ['close'], bar_count=0, skip_paused=False, fq='pre', is_panel=1)['close']
          days = get_trade_days(self.start_date, self.end_date)
          day_index=pd.Index((days[min(i+period-1, len(days)-1)] for i in range(0, len(days), period)))
          price_df=price_df.loc[day_index,:]
          log.info("行情数据提取完成： %s " % time.strftime("%H:%M:%S"))
  
  #==========================================获取行业分类==============================================================  
          # 获取行业分类哑变量,行业分类数据groupby
          log.info("正在获取行业分类数据......： %s " % time.strftime("%H:%M:%S"))
          industry_data, ind_dict = get_sfactor_industry(self.start_date, self.end_date, self.stocks, industry='s_industryid1')
          log.info("行业分类数据提取完毕： %s " % time.strftime("%H:%M:%S"))
  
  
  # ==========================================根据参数选择生成因子==========================================================
          # 获取因子数据
          log.info("正在获取因子数据......： %s " % time.strftime("%H:%M:%S"))
          factor_df = get_sfactor_data(self.start_date, self.end_date, self.stocks, self.factor_input)
          log.info("获取因子数据完毕： %s 因子名称： %s" % (time.strftime("%H:%M:%S"), self.factor_input))
  
  
  #==========================================因子合成=========================================================   
          factors = factor_df[self.factor_input[0]].copy()
          factors.iloc[:, :] = 0
          for ia in self.factor_input:
              factors = factors + self.factor_set[ia]['direct'] * self.factor_set[ia]['weight'] * factor_df[ia]
          log.info("因子数据合成完成： %s " % time.strftime("%H:%M:%S"))
  
  
  #==========================================根据用户自定义因子算法生成因子=========================================================   
  
  #         factors = self.factor_gen(self.start_date, self.end_date,self.stocks)
  #          log.info("自定义因子数据计算完成： %s " % time.strftime("%H:%M:%S"))
  
  
  #==========================================使用alphalens进行因子数据预处理=========================================================
          log.info("正在使用alphalens进行数据处理......： %s " % time.strftime("%H:%M:%S"))
          factor_data=get_clean_factor_data(factors, price_df, self.quantiles, ind_dict,[self.periods])
          factor_data.rename(columns={'1D':str(period) + 'D'},inplace=True)
  
          log.info("因子数据处理完成： %s " % time.strftime("%H:%M:%S"))
          return factor_data
  
  
  #==========================================获取股票池中股票代码========================================================
      def get_stocks(self):
          if self.stockpool=='stock':
              self.stocks=list(get_all_securities('stock',self.start_date).index)
          else:
              self.stocks = get_index_stocks(self.stockpool, self.start_date)
  
  #==========================================使用alphalens进行因子检测=========================================================
  try:
      __IPYTHON__
      alphalens.tears.create_full_tear_sheet(FactorAnalyse().calc(),
                                             long_short=True,
                                             group_neutral=True,
                                             by_group=True)
      log.info("因子检测完成： %s " % time.strftime("%H:%M:%S"))
  except NameError:
      pass
  ```

## 策略回测 - research_strategy

- 调用方法

```python
research_strategy(
    source_code, 
    start_date=None, 
    end_date=None, 
    capital_base=100000, 
    frequency='DAILY', 
    stock_market='STOCK', 
    benchmark=None
)
```

- 参数解释：
  
  - source_code：策略代码，可从策略研究模块中直接复制，代码置于"""..."""中
  - start_date：回测开始时间，如'20210601'
  - end_date：回测结束时间，如'20210601'
  - capital_base: float，初始资金量
  - frequency: 回测频率，'DAILY'或'MINUTE'
  - stock_market: 策略类型，默认'STOCK'
  - benchmark: 基准指数
- 示例

```python
source_code=r"""
# 股票策略模版
def init(context):
    pass
  
## 开盘时运行函数
def handle_bar(context, bar_dict):
    order('000001.SZ', 100)
"""

btest = research_strategy(source_code, start_date='20210601', end_date='20210815', capital_base=float(10000000), frequency='DAILY', stock_market='STOCK', benchmark=None)

btest['analyser']['portfolio']#查询历史持仓
btest['analyser']['trades']#查询交易明细
```

## 模拟仿真 - research_trade

- 调用方法

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
    dry_run=False
)
```

- 参数解释：
  
  * name：str，策略名称，会在./persist/下生成一个同名目录，用于存放持久化的策略信息
  * source\_code：str，策略代码，可从策略研究模块中直接复制，代码置于"""..."""中
  * capital\_base： float，初始资金量
    * 如果接入了 `TradeAPI对象`，且 `signal_mode=False`，那么此参数无意义
  * frequency: str，策略频率，`'DAILY'`或 `'MINUTE'`
  * stock\_market: str，策略类型，默认 `'STOCK'`
  * benchmark: str，基准指数
  * trade\_api: TradeAPI对象，绑定需要仿真交易的资金账号
  * signal\_mode: bool，（***新增***）默认为 `True`
    * `signal_mode=True`，此时策略实际上运行的时初始资金为 `capital_base`的**模拟交易，委托撮合由策略框架处理**，`context`、`get_orders`等方法返回的结果均为模拟交易中计算的数据，**与资金账号的数据无关**；策略在**模拟交易撮合成交**后，才会通过 `trade_api`下单至柜台（所以当前模式下无法进行撤单）
    * `signal_mode=False`，此时为仿真交易模式，**此时策略中 `context`、`get_orders`等方法返回的结果均为从柜台查询，策略下单也会直接下至柜台**
  * dry\_run: bool，试运行，立即返回，默认为 `False`
  * recover\_dt: bool或 str，（***新增***）是否断点运行，默认为 `False`
    * `recover_dt=False`，从当前时点开始执行，不从断定运行
    * `recover_dt=True`，从上次策略结束时点开始运行
    * `recover_dt='today'`，从当日开始运行，此模式下只会补执行 `before_trading`与 `open_auction`，`handle_bar`依旧从当前时间开始执行
    * `recover_dt='yyyyMMdd HH:mm'`，从指定时间开始运行
- 注意事项：
  
  - 使用方法如上，`trade_api`可支持传入 `rechase_api`
  - 策略数据持久化会在策略运行过程中同步进行，以防止策略中断，数据丢失。存储数据包含账户数据、全局变量等，路径位于研究平台persist目录下，以策略名称为存储，**当此目录下存在策略名相同的路径时，则不再执行 `init`**，**故启动新策略前，请确认没有persist下没有同名文件夹**
  - 策略请在9:00前开启运行，中间中断则会跳过运行时间，如需要补充执行，可通过设置 `recover_dt`参数
  - 初始化 `TradeAPI`时需要指定下单策略 `order_policy`，`MarketPolicy`为最新价下单；`LimitPolicy`为限价下单。如未指定，由于策略下单时使用均价，可能存在多位小数，最终实盘账户下单的时候可能产生废单。
  - 若想在策略代码 `source_code` 中使用智能下单策略，不支持直接调用 `trade_api.order`，可以使用 `style` 入参实现：`order('002109.SZ', 100, style=CustomOrder(price=0, pricetype=21))`。
  - `signal_mode=True`时，如想在context中获得仿真账号的持仓、资金等数据，可以使用同步函数 `sync_trade_api()`
- 示例：

```python
from tick_trade_api import TradeAPI
#初始化TradeAPI时需要指定下单策略，MarketPolicy为最新价下单；LimitPolicy为限价下单
trade_api=TradeAPI('69271711', order_policy=LimitPolicy)

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
