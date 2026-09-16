---
title: "交易函数"
---

# 交易函数
## 股票

### 下单函数，根据数量下单：order

- 👑调用方法
  ```python
  order(id_or_ins, amount, price=None)
  ```
- 🔧作用
  - 用于下单，根据数量下单
- 📚参数说明
  - `id_or_ins`: `str`，表示合约代码
  - `amount`: `int`，表示下单数量，负数为卖出
  - `price`: `Optional[float]`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在日志中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
  - **下单数量为0时，会在日志中添加警告信息**
- 📝示例：
  - 调用
    ```python
    order('510300.SH', 100, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 下单函数，根据金额下单：order_value

- 👑调用方法
  ```python
  order_value(id_or_ins, cash_amount, price=None)
  ```
- 🔧作用
  - 用于根据指定金额下单，支持买入（正数）或卖出（负数），自动计算可交易数量
- 📚参数说明
  - `id_or_ins`: `str`，表示合约代码
  - `cash_amount`: `float`，表示下单金额，负数表示卖出
  - `price`: `float`或`None`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因**：
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**：
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  - 调用
    ```python
    order_value('510300.SH', 100000, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 下单函数，根据比例下单：order_percent

- 👑调用方法
  ```python
  order_percent(id_or_ins, percent, price=None)
  ```
- 🔧作用
  - 根据当前总资产比例确定下单金额，执行买入或卖出操作
- 📚参数说明
  - `id_or_ins`: `str`，表示合约代码
  - `percent`: `float`，表示下单比例，负数为卖出
  - `price`: `float`或`None`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因：**
    - 标的不存在
    - 可用资金不足（买入时）或可用持仓不足（卖出时）
  - **下单设置和实际下单存在差异，系统会在log中添加警告信息：**
    - 买入股票时，下单数量受当前账户可用资金限制
    - 卖出股票时，下单数量受持仓可卖数量限制
- 📝示例：
  - 调用
    ```python
    order_percent('510300.SH', 0.1, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 下单函数，根据目标持仓下单：order_target

- 👑调用方法
  ```python
  order_target(id_or_ins, amount, price=None)
  ```
- 🔧作用
  - 下单函数，根据目标持仓数量确定下单数量
- 📚参数说明
  - `id_or_ins`: `str`，合约代码
  - `amount`: `int`，目标持仓数量
  - `price`: `float`或`None`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  - 调用
    ```python
    order_target('510300.SH', 1000, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 下单函数，根据目标持有金额下单：order_target_value

- 👑调用方法
  ```python
  order_target_value(id_or_ins, cash_amount, price=None)
  ```
- 🔧作用
  - 下单函数，根据目标持有的金额确定下单数量
- 📚参数说明
  - `id_or_ins`: `str`，合约代码
  - `cash_amount`: `float`，目标持仓金额
  - `price`: `float`或`None`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  - 调用
    ```python
    order_target_value('510300.SH', 100000, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 下单函数，根据目标持仓比例下单：order_target_percent

- 👑调用方法
  ```python
  order_target_percent(id_or_ins, percent, price=None)
  ```
- 🔧作用
  - 下单函数，根据目标持仓比例确定下单数量
- 📚参数说明
  - `id_or_ins`: `str`，合约代码
  - `percent`: `float`，目标持仓比例
  - `price`: `float`或`None`，表示限价单价格上界，`None`表示市价
- 🔢返回值说明
  - `str`或`None`，如果订单有效，则返回订单唯一编号，如`ord8a8d6e4bad7441679eb1f34164c9c6dd`，否则返回`None`
- ❗注意事项
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  - 调用
    ```python
    order_target_percent('510300.SH', 0.1, price=2.8)
    ```
  - 返回值
    ```python
    'ord8a8d6e4bad7441679eb1f34164c9c6dd'
    ```

### 获得委托详情：get_orders

- 👑调用方法
  ```python
  get_orders(order_id=None, order_book_id=None)
  ```
- 🔧作用
  - 查询函数，用于获得委托详情，支持指定订单编号或标的代码，仅返回当日委托
- 📚参数说明
  - `order_id`: `Optional[str]`，指定订单编号，由下单函数返回
  - `order_book_id`: `Optional[str]`，指定标的代码
- 🔢返回值说明
  - `list`或`None`，当日无委托则返回`None`，否则返回[`Order`](/supermind/reference/api/zhong-yao-dui-xiang#订单对象-order类)对象的列表，若不传入`order_id`和`order_book_id`，则返回当天所有委托
- 📝示例：
  - 调用
    ```python
    odr_id = order('000001.SZ', 200)
    print(get_orders(odr_id))
    ```
  - 返回值
    ```python
    [Order({'order_id': 'aade994938b64871a4191971e8501eaf', 'symbol': '000001.SZ', 'created': datetime.datetime(2024, 11, 18, 9, 31), 'order_type': 'LONG', 'limit_price': 0, 'amount': 8500, 'filled_amount': 8500, 'type': ORDER_TYPE.MARKET, 'transaction_cost': 19.820427500000005, 'avg_price': 11.659075000000001, 'status': ORDER_STATUS.FILLED, 'datetime': datetime.datetime(2024, 11, 18, 9, 31), 'offset_flag': None})]
    ```

### 获取当日所有未完成委托详情：get_open_orders

- 👑调用方法
  ```python
  get_open_orders(order_id=None, order_book_id=None)
  ```
- 🔧作用
  - 查询函数，用于获得当日所有未完成的委托详情，支持指定订单编号或标的代码
- 📚参数说明
  - `order_id`: `Optional[str]`，指定订单编号，由下单函数返回
  - `order_book_id`: `Optional[str]`，指定标的代码
- 🔢返回值说明
  - `list`或`None`，当日无未完成委托则返回`None`，否则返回[`Order`](/supermind/reference/api/zhong-yao-dui-xiang#订单对象-order类)对象的列表，若不传入`order_id`和`order_book_id`，则返回当天所有未完成委托
- 📝示例：
  - 调用
    ```python
    odr_id = order('000001.SZ', 200)
    print(get_open_orders(odr_id))
    ```
  - 返回值
    ```python
    [Order({'order_id': 'aade994938b64871a4191971e8501eaf', 'symbol': '000001.SZ', 'created': datetime.datetime(2024, 11, 18, 9, 31), 'order_type': 'LONG', 'limit_price': 0, 'amount': 8500, 'filled_amount': 8500, 'type': ORDER_TYPE.MARKET, 'transaction_cost': 19.820427500000005, 'avg_price': 11.659075000000001, 'status': ORDER_STATUS.FILLED, 'datetime': datetime.datetime(2024, 11, 18, 9, 31), 'offset_flag': None})]
    ```

### 获取当日所有成交详情：get_tradelogs

```python
get_tradelogs(order_id=None, order_book_id=None)
```

- 🔧作用
  - 查询函数，用于获取当日所有成交详情，支持指定订单编号或标的代码
- 📚参数说明
  - `order_id`: `Optional[str]`，表示订单ID
  - `order_book_id`: `Optional[str]`，表示证券代码
- 🔢返回值说明
  - `list`或`None`，当日无成交则返回`None`，否则返回[`Trade`](/supermind/reference/api/zhong-yao-dui-xiang#成交对象-trade类)对象的列表，若不传入`order_id`和`order_book_id`，则返回当天所有成交
- 📝示例：
  - 调用
    ```python
    def init(context):   
        pass

    def handle_bar(context, bar_dict):
        odr_id_1 = order('000001.SZ', 200)
        log.info(get_tradelogs())
    ```
  - 返回值
    ```python
    [Trade({'order_book_id': '000001.SZ', 'trading_datetime': datetime.datetime(2024, 11, 19, 9, 31), 'datetime': datetime.datetime(2024, 11, 19, 9, 31), 'order_id': '97ae3e30206d4d3fa5d28a15d0b08018', 'last_price': 11.779375, 'last_quantity': 8400, 'commission': 19.789350000000002, 'tax': 0, 'transaction_cost': 19.789350000000002, 'side': SIDE.BUY, 'position_effect': None, 'exec_id': 'e4815a0f45954586b221d4a2ae4530d1', 'frozen_price': 11.75, 'close_today_amount': 0, 'pnl': None})]
    ```

### 撤销未完成委托订单：cancel_order

- 👑调用方法
  ```python
  cancel_order(order)
  ```
- 🔧作用
  - 用于撤销未完成委托订单
- 📚参数说明
  - `order`: 可以是`Order`对象，也可以是订单id
- 🔢返回值说明
  - `None`或`list`，撤单失败返回`None`，否则返回`Order`对象列表，里面的元素是撤单指定委托
- 📝示例：
  - 调用
    ```python
    # 以开盘价买入平安银行股票1000股  
    oid = order('000001.SZ', 1000)
    cancel_order(orders)
    ```
  - 返回值
    ```python
    None # 委托已经成交，撤单失败，返回None
    ```

### 撤销所有未完成委托订单：cancel_order_all

- 👑调用方法
  ```python
  cancel_order_all()
  ```
- 🔧作用
  - 用于撤销所有未完成委托订单
- 🔢返回值说明
  - `None`或`list`，撤单失败返回`None`，否则返回`Order`对象列表，里面的元素是撤单指定委托
- 📝示例：
  - 调用
    ```python
    # 以开盘价买入平安银行股票1000股  
    oid = order('000001.SZ', 1000)
    cancel_order_all()
    ```
  - 返回值
    ```python
    None # 委托已经成交，撤单失败，返回None
    ```

## 期货

### 下单函数，根据数量下单：order_future

- 👑调用方法：
  `order_future(symbol,amount,offset_flag,order_type,limit_price=None)`
- 🔧作用：

  - 下单函数，根据手数下单购买期货合约
- 📚参数说明：

  - symbol：合约代码，str
  - amount：委托数量（手），float
  - offset\_flag：开平仓标识，str，'open'为开仓，'close'为平仓
  - order\_type：多空仓标识，str，'long'为多仓，'short'为空仓
  - limit\_price：限定价格，float，默认为None，表示市价即时单，否则委托单变为限价即时单
- 📝示例：

  ```python
  #初始化账户  
  def init(context):  
      set_subportfolios([{'type':'FUTURE','cash':10000000}])
      #设定期货品种代码  
      context.symbol = 'RB1812'  

  def handle_bar(context,bar_dict):  
      #下单10手螺纹钢1812合约，开多仓
      order_future(context.symbol,10,"open","long",limit_price=None)
  ```

---

### 下单函数，平今仓单：order_close_today

- 👑调用方法：
  `order_close_today(symbol,amount,order_type,limit_price=None)`
- 🔧作用：

  - 平今仓单，仅仅能够平掉今天新开的仓位
- 📚参数说明：

  - symbol：合约代码，str
  - amount：委托数量（手），float
  - order\_type：多空仓标识，str，'long'为多仓，'short'为空仓
  - limit\_price：限定价格，float，默认为None，表示市价即时单，否则委托单变为限价即时单
- 📝示例：

  ```python
  #初始化账户  
  def init(context):  
      set_subportfolios([{'type':'FUTURE','cash':10000000}])
      #设定期货品种代码  
      context.symbol=    'RB1812'  

  def handle_bar(context,bar_dict):  
      #下单10手螺纹钢1812合约，开多仓
      order_future(context.symbol,10,"open","long")
      #平今仓5手螺纹钢1812合约
      order_close_today(context.symbol, 5,'long',limit_price=None)
  ```

---

## 期权

### 下单函数，根据数量下单：order_option

- 👑调用方法：
  `order_option(order_book_id, amount, side, position_effect, price=None)`
- 🔧作用：

  - 期权下单函数
- 📚参数说明：

  - order\_book\_id：期权代码，str
  - amount：委托数量（手），float
  - side：方向，str，'buy'为多仓，'sell'为空仓
  - position\_effect：开平仓，str，'open'为开仓，'close'为平仓
  - price：限定价格，float，默认为None，表示市价即时单，否则委托单变为限价即时单
- 📝示例：

  ```python
  def init(context):
      set_subportfolios([{'cash': 100000, 'type': 'option'}])
      set_option_commission(5)        # 默认也是5
      g.ins= '10001485.SH'            # 看跌，20181128行权价2.7
      g.day = 1

  def handle_bar(context, bar_dict):
      if g.day == 1:
          order_option(g.ins, 10, 'buy', 'open')
      elif g.day == 2:
          order_option(g.ins, 10, 'sell', 'close')
      g.day += 1
  ```

---

<!--

#### 外汇

##### 下单函数：order_fx

- 👑调用方法：
  `order_fx(symbol, amount, side=’buy’, position_effect=’open’, close_today=False, price=None)`
- 🔧作用：
  
  - 外汇API中的下单函数,根据手数下单购买双向宝合约，1手为100单位目标货币，下单手数必须为整数
- 📚参数说明：
  
  - order\_book\_id：期权代码，str
  - amount：委托数量（手），float
  - side：方向，str，'buy'为多仓，'sell'为空仓，默认为'buy'
  - position\_effect：开平仓，str，'open'为开仓，'close'为平仓
  - close_today:是否平今，bool，True表示若平仓会平今仓, False表示若平仓不会平今仓, 默认为False
  - price：限定价格，float，默认为None，表示市价即时单，否则委托单变为限价即时单
- ❗注意事项：
  
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  
  ```python
  def init(context):   
      #设置要交易的合约(美日货币对合约) 
      g.contract = 'USDJPY'  
      subscribe(g.contract)
  
  #设置买卖条件，每个交易频率（日/分钟）调用一次   
  def handle_bar(context, bar_dict):
      #做多开仓买入1手
      order_fx(g.contract, 1, 'buy', 'open')
  ```

---

##### 获取订单详情：get_order_fx

- 👑调用方法：
  `get_order_fx(id)`
- 🔧作用：
  
  - 外汇API中获取订单详情
- 📚参数说明：
  
  - id:订单编号，由下单函数返回
- ❗注意事项：
  
  - 该函数用来获取订单详情，只需要在下单函数植入id即可.随后将id放入get_order_fx(id)
  - 如需查看详情，还需要log.info(get_order_fx(id))来打印数据
- 📝示例：
  
  ```python
  def init(context):   
      #设置要交易的合约  
      subscribe(id_or_symbols = ['USDJPY', 'AUDUSD'])
  
  #设置买卖条件，每个交易频率（日/分钟/tick）调用一次   
  def handle_bar(context, bar_dict):   
      order_id = order_fx('AUDUSD', 10, 'buy', 'open')
      log.info(get_order_fx(order_id))
  ```

---

##### 获取当日所有未完成订单：get_open_orders_fx

- 👑调用方法：
  `get_open_orders_fx()`
- 🔧作用：
  
  - 外汇API中一次性获取当日所有未完成订单
- ❗注意事项：
  
  - 一般回测时，下单都是全部完全的，当没有未完成订单时，会返回None

---

##### 撤销未完成委托订单：cancel_order_fx

- 👑调用方法：
  `cancel_order_fx(order)`
- 🔧作用：
  
  - 在外汇API中，用于撤销未完成委托订单
- 📚参数说明：
  
  - order:可以是order订单对象，也可以是订单id
- ❗注意事项：
  
  - 若订单处于不可撤销的状态，此函数会报错，可配合try关键字使用
- 📝示例：
  
  ```python
  def init(context):  
      #设置要交易的合约  
      g.contract = 'USDJPY'  
      subscribe('USDJPY')
  
  #设置买卖条件，每个交易频率（日/分钟/tick）调用一次  
  def handle_bar(context, bar_dict):  
      order_id = order_fx(g.contract, 1, 'buy', 'open', price=0.1)
      log.info(get_open_orders_fx(order_id))
      cancel_order_fx(order_id)
  ```

---

#### T+D

##### 下单函数，根据数量下单：order_td

- 👑调用方法：
  `order_td(symbol, amount, side='buy', position_effect='open', close_today=False, price=None)`
- 🔧作用：
  
  - T+D API中的下单函数,根据数量下单，支持交易Au(T+D)、mAu(T+D)、Ag(T+D)
- 📚参数说明：
  
  - symbol：期权代码，str
  - amount：委托数量（手），float
  - side：方向，str，'buy'为多仓，'sell'为空仓，默认为'buy'
  - position\_effect：开平仓，str，'open'为开仓，'close'为平仓
  - close_today:是否平今，bool，True表示若平仓会平今仓, False表示若平仓不会平今仓, 默认为False
  - price：限定价格，float，默认为None，表示市价即时单，否则委托单变为限价即时单
- ❗注意事项：
  
  - **下单失败可能由于如下原因**
    - 标的不存在
    - 可用资金不足或可用持仓不足
  - **下单设置和实际下单存在差异，会在log中添加警告信息**
    - 买入股票时，下单数量受到当前账户可用资金的限制
    - 卖出股票时，下单数量受到持仓可卖数量的影响
- 📝示例：
  
  ```python
  def init(context):   
      #设置要交易的合约(AuT+D合约)   
      g.contract = 'AUTD'   
      subscribe('AUTD')
  
  #设置买卖条件，每个交易频率（日/分钟）调用一次   
  def handle_bar(context, bar_dict):
      #做多开仓买入1手Au(T+D)合约
      order_td(g.contract, 1, 'buy', 'open')
  ```

---

##### 获取订单详情：get_order_td

- 👑调用方法：
  `get_order_td(id)`
- 🔧作用：
  
  - T+D API中获取订单详情
- 📚参数说明：
  
  - id:订单编号，由下单函数返回
- ❗注意事项：
  
  - 该函数用来获取订单详情，只需要在下单函数植入id即可.随后将id放入get_order_td(id)
  - 如需查看详情，还需要log.info(get_order_td(id))来打印数据
- 📝示例：
  
  ```python
  def init(context):   
      #设置要交易的合约(AuT+D合约)   
      g.contract = 'AUTD'   
      subscribe('AUTD')
  
  #设置买卖条件，每个交易频率（日/分钟）调用一次   
  def handle_bar(context, bar_dict):
      #做多开仓买入1手Au(T+D)合约
      order_id = order_td(g.contract, 1, 'buy', 'open')
      log.info(get_order_td(order_id))
  ```

---

##### 获取当日所有未完成订单：get_open_orders_td

- 👑调用方法：
  `get_open_orders_td()`
- 🔧作用：
  
  - T+D API中一次性获取当日所有未完成订单
- ❗注意事项：
  
  - 一般回测时，下单都是全部完全的，当没有未完成订单时，会返回None

---

##### 撤销未完成委托订单：cancel_order_td

- 👑调用方法：
  `cancel_order_td(order)`
- 🔧作用：
  
  - 在外汇API中，用于撤销未完成委托订单
- 📚参数说明：
  
  - order:可以是order订单对象，也可以是订单id
- ❗注意事项：
  
  - 若订单处于不可撤销的状态，此函数会报错，可配合try关键字使用
- 📝示例：
  
  ```python
  def init(context):  
      #设置要交易的合约  
      g.contract = 'AUTD'  
      subscribe('AUTD')
  
  #设置买卖条件，每个交易频率（日/分钟/tick）调用一次  
  def handle_bar(context, bar_dict):  
      order_id = order_td(g.contract, 1, 'buy', 'open', price=0.1)
      log.info(get_open_orders_td(order_id))
      cancel_order_td(order_id)
  ```

---

-->

## 场外基金

### 申购基金：order_fund

- 👑调用方法：
  `order_fund(order_book_id, value)`
- 🔧作用：

  - 在场外基金API中，用于申购基金
- 📚参数说明：

  - order\_book\_id：基金代码，str
  - value：下单金额，float
- ❗注意事项：

  - 只支持金额下单
  - 下单成功返回order_id，下单失败返回None
- 📝示例：

  ```python
  def init(context):
      # 设置3个子账户，股票，期货，场外基金初始资金都为100000
      set_subportfolios([{'cash': 100000, 'type': 'fund'}, {'cash': 100000, 'type': 'future'}, {'cash': 100000, 'type': 'stock'}])
      context.ins = '000717.OF'

  def handle_bar(context, bar_dict):
      order_id = order_fund(context.ins, 1000)
      log.info('申购', order_id)
  ```

---

### 赎回基金：redeem_fund

- 👑调用方法：
  `redeem_fund(order_book_id, amount)`
- 🔧作用：

  - 在场外基金API中，用于赎回基金
- 📚参数说明：

  - order\_book\_id：基金代码，str
  - amount：下单份额，float
- ❗注意事项：

  - 只支持份额下单
  - 下单成功返回order_id，下单失败返回None
- 📝示例：

  ```python
  def init(context):
      # 设置3个子账户，股票，期货，场外基金初始资金都为100000
      set_subportfolios([{'cash': 100000, 'type': 'fund'}, {'cash': 100000, 'type': 'future'}, {'cash': 100000, 'type': 'stock'}])
      context.ins = '000717.OF'

  def handle_bar(context, bar_dict):
      order_id = order_fund(context.ins, 1000)
      log.info('申购', order_id)
      order_id = redeem_fund(context.ins, 500)
      log.info('赎回', order_id)
  ```

---
