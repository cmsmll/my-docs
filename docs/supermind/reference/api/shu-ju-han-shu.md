---
title: "数据函数"
---

# 数据函数
## 订阅标的：subscribe

- 👑调用方法
  ```python
  subscribe(id_or_symbols)
  ```
- 🔧作用
  - 订阅标的，使合约池内合约增加
- 📚参数说明
  - `id_or_symbols`: `str` 或 `list`，需要订阅的标的代码，支持单个订阅或多个订阅
- 🔢返回值说明
  - `None`
- ❗注意事项
  - 策略会根据订阅的标的所属的交易所交易时间的并集确定策略执行 `handle_bar`、`before_trading`、`after_trading`运行时间，默认为沪深交易所时间
  - 在tick级回测中必须订阅合约，否则不会触发tick行情事件
  - 在外汇(双向宝)策略中必须订阅合约
  - 在T+D合约策略中必须订阅合约
- 📝示例：
  - 调用
    ```python
    def init(context):
        #订阅螺纹主力合约
        subscribe('RB9999')
    ```
  - 返回值
    ```python
    None
    ```

## 取消订阅标的：unsubscribe

- 👑调用方法
  ```python
  unsubscribe(id_or_symbols)
  ```
- 🔧作用
  - 取消订阅标的，使合约池内合约减少
- 📚参数说明
  - `id_or_symbols`: `str`或`list`，需要取消订阅的标的代码，支持单个取消订阅或多个取消订阅
- 🔢返回值说明
  - `None`
- 📝示例：
  - 调用
    ```python
    # 取消订阅螺纹主力合约
    unsubscribe('RB9999')

    # 批量取消订阅多个合约
    unsubscribe(['RB9999', 'HC9999'])
    ```
  - 返回值
    ```python
    None
    None
    ```

## 获取当前bar的时间：get_datetime

- 👑调用方法
  ```python
  get_datetime()
  ```
- 🔧作用
  - 用于获取当前bar的时间。
- 📚参数说明
  - 无
- 🔢返回值说明
  - `datetime.datetime`，表示当前bar的时间。
- ❗注意事项
  - 该函数没有参数，直接使用。
  - 在tick级策略中使用时，返回当前交易日的开盘时间。
- 📝示例：
  - 调用
    ```python
    time = get_datetime()
    ```
  - 返回值
    ```python
    datetime.datetime(2024, 11, 13, 9, 31)
    ```

## 获取上一个bar的时间：get_last_datetime

- 👑调用方法
  ```python
  get_last_datetime()
  ```
- 🔧作用
  - 用于获取上一个bar的时间。
- 📚参数说明
  - 无
- 🔢返回值说明
  - `pandas.Timestamp`，表示上一个bar的时间。
- ❗注意事项
  - 该函数没有参数，直接使用。
  - 在tick级策略中使用时，返回前一交易日的收盘时间。
- 📝示例：
  - 调用
    ```python
    last_datetime = get_last_datetime()
    ```
  - 返回值
    ```python
    Timestamp('2024-11-12 09:31:00')
    ```

## 获取股票历史行情：history

- 👑调用方法
  ```python
  history(symbol_list, fields, bar_count, fre_step, skip_paused=False, fq='pre', df=True, is_panel=False)
  ```
- 🔧作用
  - 获取股票多属性的历史行情数据，仅可在策略API内使用
- 📚参数说明
  - `symbol_list`: `str`或`list`，标的代码，取单个股票数据时可以传入字符串，若需要取多个标的，需传入列表
  - `fields`: `list`，数据字段，支持字段可参考[A股日行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/8)、[A股分钟行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/12)
  - `bar_count`: `int`，历史长度，例如 `bar_count = 5`，表示获取过去5个时间步长的历史数据
  - `fre_step`: `str`，时间步长'Xd'/'Xm'，X必须为正整数，`fre_step = '1d'`表示时间步长为1天
  - `skip_paused`: `bool`，是否跳过停牌数据，默认`False`
  - `fq`: `Optional[str]`，复权选项
    - `fq='pre'`: 前复权
    - `fq='post'`: 后复权
    - `fq=None`: 不复权
  - `df`: `bool`，与`is_panel`共同决定返回值类型，详见返回值说明
  - `is_panel`: `bool`，与`df`共同决定返回值类型，详见返回值说明
- 🔢返回值说明
  - `symbol_list`为`list`，`is_panel`为True时，df`不生效，返回pd.Panel
  - `symbol_list`为`list`，`df`为True，`is_panel`为False时，返回`dict`，key为标的代码，value为`pd.DataFrame`(index是日期，columns为字段)
  - `symbol_list`为`list`，`df`为False，`is_panel`为False时，返回`dict`，key是标的代码，value是`dict`(key为字段，value为1维np.ndarray)
  - `symbol_list`为`str`，`df`为True时，`is_panel`不生效，返回`pd.DataFrame`，index是日期，columns为字段
  - `symbol_list`为`str`，`df`为False时，`is_panel`不生效，返回`dict`，key为字段，value为1维np.ndarray
- ❗注意事项
  - 由于策略框架的运行机制，取日频历史行情时，不包含当前bar的数据；取分钟频历史行情，包含当前bar数据
  - 当`fre_step`的X不等于1时，field仅支持'open','high','low','close','volume','turnover'这几个字段
- 📝示例：
  - 调用
    ```python
    history('000001.SZ',['close'],5,'1m',False,'pre',True,True)
    ```
  - 返回值
    ```python
    close
    2024-11-15 14:57:00  11.44
    2024-11-15 14:58:00  11.44
    2024-11-15 14:59:00  11.44
    2024-11-15 15:00:00  11.44
    2024-11-18 09:31:00  11.69
    ```

## 当前bar行情数据：get_current

- 👑调用方法
  ```python
  get_current(inst_id_list)
  ```
- 🔧作用
  - 用于获取多只证券当前bar的行情数据。仅在策略框架内可用。
- 📚参数说明
  - `inst_id_list`: `str或list`，表示标的代码
- 🔢返回值说明
  - `dict`，key为标的代码，value为[`Bar`对象](/supermind/reference/api/zhong-yao-dui-xiang#bar类)
- 📝示例：
  - 调用
    ```python
    get_current(inst_id_list=['300033.SZ'])
    ```
  - 返回值
    ```python
    {'300033.SZ': Bar(symbol: '300033.SZ', datetime: datetime.datetime(2024, 11, 18, 9, 31), open: 271.0, high: 275.55, low: 270.3, close: 275.2, volume: 2021272.0, turnover: 550619639.86, high_limit: 327.0, low_limit: 218.0, prev_close: 272.5, avg_price: 272.41244120534003, is_st: False, is_paused: False)}
    ```

## 获取期货历史行情：history_future

- 👑调用方法
  ```python
  history_future(symbol_list, fields, bar_count, fre_step, skip_paused=False, fq='pre', is_panel=False)
  ```
- 🔧作用
  - 获取股票多属性的历史行情数据，仅可在策略API内使用
- 📚参数说明
  - `symbol_list`: `str`或`list`，标的代码，取单个股票数据时可以传入字符串，若需要取多个标的，需传入列表
  - `fields`: `list`，数据字段，支持字段可参考[期货日行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/174)、[期货分钟行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/422)
  - `bar_count`: `int`，历史长度，例如 `bar_count = 5`，表示获取过去5个时间步长的历史数据
  - `fre_step`: `str`，时间步长'Xd'/'Xm'，X必须为正整数，`fre_step = '1d'`表示时间步长为1天
  - `skip_paused`: `bool`，是否跳过停牌数据，默认`False`
  - `fq`: `Optional[str]`，复权选项
    - `fq='pre'`: 前复权
    - `fq='post'`: 后复权
    - `fq=None`: 不复权
  - `is_panel`: `bool`，决定返回值类型，详见返回值说明
- 🔢返回值说明
  - `is_panel`为True时，返回pd.Panel
  - `is_panel`为False时，返回`dict`，key为标的代码，value为`pd.DataFrame`(index是日期，columns为字段)
- ❗注意事项
  - 由于策略框架的运行机制，取日频历史行情时，不包含当前bar的数据；取分钟频历史行情，包含当前bar数据
  - 当`fre_step`的X不等于1时，field仅支持'open','high','low','close','volume','turnover'这几个字段
- 📝示例：
  - 调用
    ```python
    history_future('RB8888', ['close'], 5, '1m', False, 'pre')
    ```
  - 返回值
    ```python
    {'RB8888':                          close
    2024-11-18 09:28:00  3283.0085
    2024-11-18 09:29:00  3283.1423
    2024-11-18 09:30:00  3284.7830
    2024-11-18 09:31:00  3285.0599
    2024-11-18 09:32:00  3284.9491}
    ```

## 获取历史tick行情快照：history_ticks

- 🔧作用：

  - 获取历史tick行情快照数据,仅可在策略API内使用
- 👑调用方法：

  ```python
  history_ticks(
      symbol_list,
      fields,
      bar_count, 
      is_panel=0
  )
  ```
- 📚参数说明：

  - symbol_list:str或list，标的代码,取单个合约数据时可以传入字符串，若需要取多个合约，需传入列表
  - fields:list,数据字段,支持字段可参考[历史行情快照数据](https://quant.10jqka.com.cn/view/dataplatform/detail/16)
  - bar_count:历史长度，例如 `bar_count = 5`，表示获取过去5个时间步长的历史数据
  - is_panel:返回数据格式是否为panel，默认 `is_panel = 0`
    - `is_panel = 0`: 返回 `dict`对象，其key是symbol即证券代码、值是 `pandas.Dataframe`，行索引是 `datetime.datetime`对象，列索引是字段名称
    - `is_panel = 1`: 返回 `Panel`对象，key为fileds字段。`Panel`为 `pandas.DataFrame`的三维结构，选定字段后输出的便是 `pandas.DataFrame`对象
- ❗注意事项：

  - 只能在tick级策略中使用
- 📝示例：

  ```python
  def init(context):
      #设定标的代码
      context.symbol = ['000001.SZ']
      subscribe(context.symbol)

  def handle_tick(context,tick):
      price=history_ticks(context.symbol, ['open','prev_close'], 10, is_panel=0)
      log.info(price)
  ```

---

<!--

#### 获取中国银行'双向宝'合约历史行情：history_fx

- 🔧作用：
  
  - 获取中国银行'双向宝'合约多属性的历史行情数据,仅可在外汇策略内使用
- 👑调用方法：
  
  ```python
  history_fx(
      symbol_list,
      fields,
      bar_count, 
      fre_step,
      is_panel=0
  )
  ```
- 📚参数说明：
  
  - symbol_list:str或list，标的代码,取单个合约数据时可以传入字符串，若需要取多个合约，需传入列表
  - fields:list,数据字段,支持字段可参考[外汇日行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/324)、[外汇分钟行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/325)
  - bar_count:历史长度，例如 `bar_count = 5`，表示获取过去5个时间步长的历史数据
  - fre_step:时间步长'Xd'/'Xm',X必须为正整数，`fre_step = '1d'`表示时间步长为1天
  - is_panel:返回数据格式是否为panel，默认 `is_panel = 0`
    - `is_panel = 0`: 返回 `dict`对象，其key是symbol即证券代码、值是 `pandas.Dataframe`，行索引是 `datetime.datetime`对象，列索引是字段名称
    - `is_panel = 1`: 返回 `Panel`对象，key为fileds字段。`Panel`为 `pandas.DataFrame`的三维结构，选定字段后输出的便是 `pandas.DataFrame`对象
- ❗注意事项：
  
  - 由于策略框架的运行机制，取日频历史行情时，不包含当前bar的数据；取分钟频历史行情，包含当前bar数据
- 📝示例：
  
  ```python
  def init(context):
      #设定期货品种代码
      subscribe('XAUUSD')
  
  def handle_bar(context,bar_dict):
      price = history_fx(['USDJPY','XAUUSD'], ['open','close'], 3, '1d', is_panel=0)
      log.info(price['XAUUSD'])
  ```

---

#### 获取当前bar的时间：get_datetime_fx

- 👑调用方法：
  `get_datetime_fx()`
- 🔧作用：
  
  - 获取当前bar的时间,外汇策略中专用
- ❗注意事项：
  
  - 该函数没有参数，直接使用
- 📝示例：
  
  ```python
  from datetime import timedelta as td
  
  def init(context):
      subscribe('USDJPY') 
  
  def handle_bar(context,bar_dict):
      # 获取当前bar的时间
      time = get_datetime()
      log.info(time)
      # 获取回测前一天日期
      yesterday_time = get_datetime_fx()-td(days=1)
      yesterday_date = yesterday_time.strftime("%Y%m%d")
      log.info(yesterday_date)
  ```

---

#### 获取上一个bar的时间：get_last_datetime_fx

- 👑调用方法：
  `get_last_datetime_fx()`
- 🔧作用：
  
  - 获取上一个bar的时间,外汇策略中专用
- ❗注意事项：
  
  - 该函数没有参数，直接使用
- 📝示例：
  
  ```python
  def init(context):
      subscribe('USDJPY')
  
  def handle_bar(context,bar_dict):
      # 获取上一个bar的时间
      last_datetime = get_last_datetime_fx()
      log.info('回测前一个handle_bar调用时间：'+str(last_datetime))
  ```

---

#### 获取T+D合约历史行情：history_td

- 🔧作用：
  
  - 获取T+D合约多属性的历史行情数据,仅可在T+D策略内使用
- 👑调用方法：
  
  ```python
  history_td(
      symbol_list,
      fields,
      bar_count, 
      fre_step,
      is_panel=0
  )
  ```
- 📚参数说明：
  
  - symbol_list:str或list，标的代码,取单个合约数据时可以传入字符串，若需要取多个合约，需传入列表
  - fields:list,数据字段,支持字段可参考[T+D合约日行情数据](https://quant.10jqka.com.cn/view/dataplatform/detail/185)、T+D合约分钟行情数据
  - bar_count:历史长度，例如 `bar_count = 5`，表示获取过去5个时间步长的历史数据
  - fre_step:时间步长'Xd'/'Xm',X必须为正整数，`fre_step = '1d'`表示时间步长为1天
  - is_panel:返回数据格式是否为panel，默认 `is_panel = 0`
    - `is_panel = 0`: 返回 `dict`对象，其key是symbol即证券代码、值是 `pandas.Dataframe`，行索引是 `datetime.datetime`对象，列索引是字段名称
    - `is_panel = 1`: 返回 `Panel`对象，key为fileds字段。`Panel`为 `pandas.DataFrame`的三维结构，选定字段后输出的便是 `pandas.DataFrame`对象
- ❗注意事项：
  
  - 由于策略框架的运行机制，取日频历史行情时，不包含当前bar的数据；取分钟频历史行情，包含当前bar数据
- 📝示例：
  
  ```python
  def init(context):
      #设定期货品种代码
      subscribe('AUTD')
  
  def handle_bar(context,bar_dict):
      price = history_td(['AUTD','AGTD'], ['open','close'], 3, '1d', is_panel=0)
      log.info(price['AUTD'])
  ```

---

#### 获取当前bar的时间：get_datetime_td

- 👑调用方法：
  `get_datetime_td()`
- 🔧作用：
  
  - 获取当前bar的时间,仅在T+D合约策略中可用
- ❗注意事项：
  
  - 该函数没有参数，直接使用
- 📝示例：
  
  ```python
  from datetime import timedelta as td
  
  def init(context):
      subscribe('AUTD') 
  
  def handle_bar(context,bar_dict):
      # 获取当前bar的时间
      time = get_datetime()
      log.info(time)
      # 获取回测前一天日期
      yesterday_time = get_datetime_td()-td(days=1)
      yesterday_date = yesterday_time.strftime("%Y%m%d")
      log.info(yesterday_date)
  ```

---

#### 获取上一个bar的时间：get_last_datetime_td

- 👑调用方法：
  `get_last_datetime_td()`
- 🔧作用：
  
  - 获取上一个bar的时间,仅在T+D合约策略中可用
- ❗注意事项：
  
  - 该函数没有参数，直接使用
- 📝示例：
  
  ```python
  def init(context):
      subscribe('AUTD')  
  
  def handle_bar(context,bar_dict):
      # 获取上一个bar的时间
      last_datetime = get_last_datetime_td()
      log.info('回测前一个handle_bar调用时间：'+str(last_datetime))
  ```

---

-->
