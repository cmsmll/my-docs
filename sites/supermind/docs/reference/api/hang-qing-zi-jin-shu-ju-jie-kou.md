---
title: "行情资金数据接口"
---

# 行情资金数据接口
## 行情数据：get_price

- 👑调用方法
  ```python
  get_price(
      securities,
      start_date,
      end_date,
      fre_step,
      fields,
      skip_paused=False,
      fq='pre',
      bar_count=0,
      is_panel=False,
  )
  ```
- 🔧作用
  - 获取多只证券多属性历史行情数据
- 📚参数说明
  - `securities`: `str`或`list`，标的代码
  - `start_date`: `None`、`str`或`datetime-like`，起始时间
  - `end_date`: `str`、`datetime-like`，结束时间
  - `fre_step`: `str`，时间步长，支持分钟、日
    - `fre_step = 'xd'`：x为正整数，代表x天，例如'1d'代表1天
    - `fre_step = 'xm'`：x为正整数，代表x分钟，例如'1m'代表1分钟
  - `fields`: `list`，需要获取的字段，可参考
    - 日频：[股票日行情数据(A股)](http://quant.10jqka.com.cn/view/dataplatform/detail/8)
    - 分钟：[股票分钟行情数据(A股)](http://quant.10jqka.com.cn/view/dataplatform/detail/12)
    - 当步长不为'1m'或'1d'时，fields仅支持'open', 'close', 'high', 'low', 'volume', 'turnover'这几个字段
  - `skip_paused`: `bool`，是否跳过停牌，默认为不跳过
  - `fq`: `str`，复权模式
    - `fq=None`: 不复权
    - `fq='post'`: 后复权
    - `fq='pre'`: 动态前复权
  - `bar_count`: `int`，历史长度。`start_date`为 `None`时，`bar_count`必须为正整数；`start_date`不为 `None`时，`bar_count`必须为0
  - `is_panel`: `bool`，返回数据格式，默认为False
- 🔢返回值说明
  - `dict`或`pd.Panel`或`pd.DataFrame`，根据参数返回不同格式的数据
    - 当取多个标的行情数据且`is_panel=False`时，返回`dict`，key为股票代码，value为`pd.DataFrame`，索引为时间，列名为字段
    - 当取多个标的行情数据且`is_panel=True`时，返回`pd.Panel`
    - 当取单个标的行情数据时，返回`pd.DataFrame`，索引为时间，列名为字段
- ❗注意事项
  - 该函数支持获取实时行情
  - 该函数还支持查询场内基金、指数、可转债等标的的行情数据，支持字段可查询[SuperMind数据平台](http://quant.10jqka.com.cn/view/dataplatform)
  - 返回panel格式数据时，可以用to_frame()方法将数据转换为一个具有mutilindex的二维dataframe
  - 暂不支持获取CSI结尾指数的历史分钟行情数据
- 📝示例：
  - 调用（多只股票，is_panel=False）
    
    ```python
    get_price(['000001.SZ','000002.SZ'], None, '20230201', '1d', ['close', 'high', 'low'], True, None, 3)
    ```
  - 返回值
    
    ```python
    {'000001.SZ':             close   high    low
    2023-01-30  15.15  15.74  14.89
    2023-01-31  14.99  15.51  14.96
    2023-02-01  14.70  15.08  14.51, '000002.SZ':             close   high    low
    2023-01-30  18.09  19.00  18.00
    2023-01-31  18.29  18.35  17.95
    2023-02-01  18.19  18.28  17.90}
    ```
  - 调用（多只股票，is_panel=True）
    
    ```python
    get_price(['000001.SZ','000002.SZ'], None, '20230201', '1d', ['close', 'high', 'low'], True, None, 3, is_panel=True)
    ```
  - 返回值
    
    ```python
    <class 'pd.Panel'>
    Dimensions: 3 (items) x 3 (major_axis) x 2 (minor_axis)
    Items axis: close to low
    Major_axis axis: 2023-01-30T00:00:00.000000000 to 2023-02-01T00:00:00.000000000
    Minor_axis axis: 000001.SZ to 000002.SZ
    ```
  - 调用（单只股票）
    
    ```python
    get_price('000001.SZ', None, '20230201', '1d', ['close', 'high', 'low'], True, None, 3)
    ```
  - 返回值
    
    ```python
    close   high    low
    2023-01-30  15.15  15.74  14.89
    2023-01-31  14.99  15.51  14.96
    2023-02-01  14.70  15.08  14.51
    ```

## 开盘竞价成交信息：get_call_auction

- 👑调用方法
  ```python
  get_call_auction(symbol, dt=None)
  ```
- 🔧作用
  - 用于获取指定标的在指定日期的集合竞价行情数据。
- 📚参数说明
  - `symbol`: `str`或`list[str]`，表示标的代码
  - `dt`: `str`, `datetime-like`或`None`，表示日期
- 🔢返回值说明
  - `pandas.core.frame.DataFrame`，返回一个DataFrame，包含'price'和'turnover'列，分别表示集合竞价价格和成交量，索引为'symbol'
- ❗注意事项
  - 当`symbol`为字符串列表时，可一次查询多个标的的数据
- 📝示例：
  - 调用
    ```python
    get_call_auction(['000001.SZ', '600000.SH'], '20230613')
    ```
  - 返回值
    ```python
    price   turnover
    symbol         
    600000.SH   7.43   704364.0
    000001.SZ  11.76  3988992.0
    ```
  - 调用
    ```python
    get_call_auction('000001.SZ', '20230613')
    ```
  - 返回值
    ```python
    price   turnover
    symbol         
    000001.SZ  11.76  3988992.0
    ```

## 期货行情数据：get_price_future

- 👑调用方法
  ```python
  get_price_future(
      symbol_list,
      start_date,
      end_date,
      fre_step,
      fields,
      skip_paused=False,
      fq=None,
      bar_count=0,
      is_panel=0,
  )
  ```
- 🔧作用
  - 用于获取期货合约的历史行情数据。
- 📚参数说明
  - `symbol_list`: `str`或`list[str]`，表示标的代码。
  - `start_date`: `str`、`datetime-like`，表示起始时间。
  - `end_date`: `str`、`datetime-like`，表示结束时间。
  - `fre_step`: `str`，表示时间步长，支持分钟、日。
    - `fre_step = 'xd'`：x为正整数，代表x天，例如'1d'代表1天。
    - `fre_step = 'xm'`：x为正整数，代表x分钟，例如'1m'代表1分钟。
  - `fields`: `list[str]`，表示需要获取的字段。可参考
    - 日频：[期货日行情数据(A股)](http://quant.10jqka.com.cn/view/dataplatform/detail/174)
    - 分钟：[期货分钟行情数据(A股)](http://quant.10jqka.com.cn/view/dataplatform/detail/422)
    - 当步长不为'1m'或'1d'时，fields仅支持'open', 'close', 'high', 'low', 'volume', 'turnover'这几个字段。
  - `skip_paused`: `bool`，表示是否跳过停牌。默认为`False`。
  - `fq`: `str`，表示复权类型
    - `fq='pre'`：前复权
    - `fq='post'`：后复权
    - `fq=None`：不复权
  - `bar_count`: `int`，表示历史长度。`start_date`为 `None`时，`bar_count`必须为正整数；`start_date`不为 `None`时，`bar_count`必须为0
  - `is_panel`: `bool`，表示返回数据格式。默认为`False`。
- 🔢返回值说明
  - 根据输入参数的不同，返回值类型会变化：
    - 当`is_panel=True`且`symbol_list`为多个标的时，返回`pd.Panel`
    - 当`is_panel=False`且`symbol_list`为多个标的时，返回`dict[str, pandas.DataFrame]`，key为标的代码，value为对应标的的DataFrame行情数据，索引为时间，列名为字段名。
    - 当`symbol_list`为单个标的时，返回`pandas.DataFrame`，包含该标的的历史行情数据，索引为时间，列名为字段名。
- ❗注意事项
  - 该函数支持获取实时行情。
  - 返回panel格式数据时，可以用`to_frame()`方法将数据转换为一个具有mutilindex的二维dataframe。
- 📝示例：
  - 调用
    ```python
    # 获取IC2304、IF2304两个标的在2023年4月6日前3天的收盘价、最高价、最低价，返回Panel格式
    value_panel = get_price_future(
        symbol_list=['IC2304', 'IF2304'],
        start_date=None,
        end_date='20230406',
        fre_step='1d',
        fields=['close', 'high', 'low'],
        bar_count=3,
        is_panel=1
    )
    print(value_panel)
    ```
  - 返回值
    ```python
    <class 'mgquant_mod_mindgo.utils.compat.panel.pd_Panel'>
    Dimensions: 3 (items) x 3 (major_axis) x 2 (minor_axis)
    Items axis: close to low
    Major_axis axis: 2023-04-03T00:00:00.000000000 to 2023-04-06T00:00:00.000000000
    Minor_axis axis: IC2304 to IF2304
    ```
  - 调用
    ```python
    # 获取IC2304、IF2304两个标的在2023年4月6日前3天的收盘价、最高价、最低价，返回字典格式
    value_dict = get_price_future(
        symbol_list=['IC2304', 'IF2304'],
        start_date=None,
        end_date='20230406',
        fre_step='1d',
        fields=['close', 'high', 'low'],
        bar_count=3,
        is_panel=0
    )
    print(value_dict)
    ```
  - 返回值
    ```python
    {'IC2304':               close    high     low
     2023-04-03  6406.0  6429.6  6353.0
     2023-04-04  6415.0  6417.2  6382.2
     2023-04-06  6411.4  6427.2  6391.0, 'IF2304':               close    high     low
     2023-04-03  4091.2  4104.4  4063.8
     2023-04-04  4111.8  4114.0  4082.0
     2023-04-06  4098.0  4105.8  4085.6}
    ```
  - 调用
    ```python
    # 获取单个标的IC2304在2023年4月6日前3天的收盘价、最高价、最低价
    value_df = get_price_future(
        symbol_list='IC2304',
        start_date=None,
        end_date='20230406',
        fre_step='1d',
        fields=['close', 'high', 'low'],
        bar_count=3
    )
    print(value_df)
    ```
  - 返回值
    ```python
    close    high     low
    2023-04-03  6406.0  6429.6  6353.0
    2023-04-04  6415.0  6417.2  6382.2
    2023-04-06  6411.4  6427.2  6391.0
    ```

## 蜡烛图数据：get_candle_stick

- 👑调用方法：
  ```python
  get_candle_stick(
      securities,
      end_date='20180101',
      fre_step='1d',
      fields=None,
      skip_paused=False,
      fq='pre',
      bar_count=0,
      is_panel=False,
  )
  ```
- 📚参数说明：
  - securities：str或list, 标的代码
  - end_date：str,int,float,datetime-like，结束时间
  - fre\_step：str，时间步长，支持分钟、日、周、月、年
    
    - 分钟：支持'1m','5m','15m','30m','60m'
    - 日频：支持自定义天数，'nd'，例如'2d'代表2天
    - 周：'week'
    - 月：'month'
    - 年：'year'
  - fields：list，需要获取的字段，仅支持'open','high','low','close','volume','turnover'
  - skip_paused：bool，是否跳过停牌，默认为不跳过
  - fq：str，复权模式
    
    - `fq=None`: 不复权
    - `fq='post'`: 后复权
    - `fq='pre'`: 动态前复权
  - bar_count：int，历史长度，`bar_count`必须为正整数。
  - is_panel：bool，返回数据格式，默认为False
    
    - 当取多个标的行情数据时，`is_panel=False`时，返回key为股票代码，value为dataframe的字典
    - 当取多个标的行情数据时，`is_panel=True`时，返回panel格式数据
    - 当取单个标的行情数据时，返回dataframe
- 🔧作用：
  - 获取股票、债券、基金的历史蜡烛图数据
- ❗注意事项：
  - 返回panel格式数据时，可以用to_frame()方法将数据转换为一个具有mutilindex的二维dataframe
- 📝示例：
  ```python
  # 获取600519.SH、000002.SZ两个标的在2023年8月1日前3个月线的行情数据
  data = get_candle_stick(
      ['600519.SH','000002.SZ'], 
      end_date='20230801',
      fre_step='month',
      fields=['open', 'close', 'high', 'low', 'volume'],
      skip_paused=False,
      fq='pre',
      bar_count=3,
      is_panel=0
  )
  # 打印收盘价数据
  print(value['close'])
  ```
- 返回数据示例：

## 获取实时行情快照数据：get_last_tick

- 👑调用方法
  ```python
  get_last_tick(securities, fields, level=None)
  ```
- 🔧作用
  - 用于获取多只证券的实时行情快照数据。
- 📚参数说明
  - `securities`: `str`或`list[str]`，表示标的代码。
  - `fields`: `list[str]`，表示需要获取的字段，可参考[实时行情快照](http://quant.10jqka.com.cn/view/dataplatform/detail/20)。
  - `level`: `Optional[str]`，表示数据级别。
- 🔢返回值说明
  - `pandas.DataFrame`，返回数据框，包含所请求的字段和标的代码。
- ❗注意事项
  - 获取当日数据时，响应时间超过六秒会报超时错误。
- 📝示例：
  - 调用（传入单只股票）
    ```python
    from mindgo_api import *
    data = get_last_tick('000001.SZ', ['current'])
    ```
  - 返回值
    ```python
    id_stock  current
    0  000001.SZ     11.7
    ```
  - 调用（传入多只股票）
    ```python
    from mindgo_api import *
    data = get_last_tick(['000001.SZ', '600000.SH'], ['current'])
    ```
  - 返回值
    ```python
    id_stock  current
    0  000001.SZ    11.70
    1  600000.SH    11.66
    ```

## 获取历史行情快照数据：get_tick

- 👑调用方法
  ```python
  get_tick(securities, start_date, end_date, fields, level=None)
  ```
- 🔧作用
  - 用于获取指定证券在特定时间范围内的历史行情快照数据。
- 📚参数说明
  - `securities`: `str`或`list[str]`，表示标的代码。
  - `start_date`: `str`或`datetime-like`，表示起始时间。
  - `end_date`: `str`或`datetime-like`，表示结束时间。
  - `fields`: `list[str]`，表示需要获取的字段，可参考[历史行情快照](http://quant.10jqka.com.cn/view/dataplatform/detail/16)。
  - `level`: `Optional[str]`，表示数据级别。
- 🔢返回值说明
  - `pandas.DataFrame`，返回包含指定字段的历史行情快照数据的 DataFrame。
- ❗注意事项
  - 该函数也支持获取日内快照数据。
  - 获取当日数据时，响应时间超过六秒会报超时错误。
- 📝示例：
  - 调用
    ```python
    data = get_tick('000001.SZ', '20230801 09:23', '20230801 09:30', ['current'])
    ```
  - 返回值
    ```python
    id_stock          trade_date  current
    0   000001.SZ 2023-08-01 09:23:00    12.28
    1   000001.SZ 2023-08-01 09:23:09    12.28
    2   000001.SZ 2023-08-01 09:23:18    12.28
    ...
    15  000001.SZ 2023-08-01 09:30:00    12.26
    ```

## 统计涨跌区间个股数量：get_stats

- 👑调用方法
  ```python
  get_stats(date=None)
  ```
- 🔧作用
  - 用于获取每日/实时行情中各个涨跌区间的个股数量。
- 📚参数说明
  - `date`: `Optional[str]`，表示查询日期，默认为当日。
- 🔢返回值说明
  - `list`，返回一个列表，列表中的每个元素代表对应涨跌区间的个股数量。
- ❗注意事项
  - 一共有21个涨跌幅区间： (无穷小,-9)，[-9,-8)...[-1,0),[0],(0,1]...(9,无穷大)
- 📝示例：
  - 调用
    ```python
    data = get_stats('20230810')
    ```
  - 返回值
    ```python
    [10, 2, 5, 13, 13, 26, 76, 113, 418, 1175, 222, 1706, 737, 245, 106, 77, 28, 18, 8, 3, 31]
    ```

## 压力支撑位数据：get_resistance_support

- 👑调用方法
  ```python
  get_resistance_support(
      symbol_list,
      start_date,
      end_date,
      fre_step,
      fields,
      bar_count=0,
      is_panel=0,
  )
  ```
- 🔧作用
  - 用于获取多只证券股价压力位、支撑位数据
- 📚参数说明
  - `symbol_list`: `str`或`list`，表示标的代码
  - `start_date`: `None`,`str`或`datetime-like`，表示起始时间。
  - `end_date`: `str`或`datetime-like`，表示结束时间
  - `fre_step`: `str`，表示时间步长，支持'1d','30m','5m'三种步长
  - `fields`: `list`，表示需要获取的字段
    - `'resistance_line'`：价格压力位(元)
    - `'support_line'`：价格支撑位(元)
  - `bar_count`: `int`，表示历史长度。`start_date`为 `None`时，`bar_count`必须为正整数；`start_date`不为 `None`时，`bar_count`必须为0。
  - `is_panel`: `bool`，表示返回数据格式，默认为False
- 🔢返回值说明
  - `dict`：当`is_panel=0`时，返回一个字典，key为股票代码，value为包含相应数据的`DataFrame`。
  - `pd_Panel`：当`is_panel=1`时，返回一个Panel格式的数据。
- ❗注意事项
  - 返回panel格式数据时，可以用to_frame()方法将数据转换为一个具有mutilindex的二维dataframe
- 📝示例：
  - 调用（返回`dict`）
    ```python
    data_dict = get_resistance_support(
        symbol_list=['600000.SH', '000001.SZ'],
        start_date='20230801',
        end_date='20230810',
        fields=['support_line', 'resistance_line'],
        is_panel=0
    )
    ```
  - 返回值（`dict`）
    ```python
    {'600000.SH':             support_line  resistance_line
    trade_date                     
    2023-08-01          6.82             7.85
    2023-08-02          6.82             7.63, '000001.SZ':             support_line  resistance_line
    trade_date                     
    2023-08-01         11.15           12.500
    2023-08-02         11.15           12.500}
    ```
  - 调用（返回`pd_Panel`）
    ```python
    panel_data = get_resistance_support(
        symbol_list=['600000.SH', '000001.SZ'],
        start_date='20230801',
        end_date='20230810',
        fields=['support_line', 'resistance_line'],
        is_panel=1
    )
    ```
  - 返回值（`pd_Panel`）
    ```python
    <class 'mgquant_mod_mindgo.utils.compat.panel.pd_Panel'>
    Dimensions: 2 (items) x 8 (major_axis) x 2 (minor_axis)
    Items axis: support_line to resistance_line
    Major_axis axis: 2023-08-01T00:00:00.000000000 to 2023-08-10T00:00:00.000000000
    Minor_axis axis: 600000.SH to 000001.SZ
    ```

## 获取基金净值数据：get_extras

- 👑调用方法
  
  ```python
  get_extras(
      security_list,
      start_date,
      end_date,
      fields,
      count=None,
      is_panel=False,
  )
  ```
- 🔧作用
  
  - 用于获取多只基金的净值数据。
- 📚参数说明
  
  - `security_list`: `list`，表示标的代码列表。
  - `start_date`: `None`、`str`或`datetime-like`，表示起始时间。
  - `end_date`: `str`或`datetime-like`，表示结束时间，默认为`'20180101'`。
  - `fields`: `list`，表示需要获取的字段列表。
    - `'unit_net_value'`：单位净值(元/份)
    - `'acc_net_value'`：累计净值(元/份)
    - `'pre_net_value'`：复权净值(元/份)
  - `count`: `Optional[int]`，表示历史长度。`start_date`为 `None`时，`count`必须为正整数时；`start_date`不为 `None`时，`count`必须为0或`None`。
  - `is_panel`: `bool`，表示返回数据格式，默认为`False`。
- 🔢返回值说明
  
  - `dict[str, pandas.DataFrame]`：当`is_panel=False`时，返回一个字典，键为证券代码，值为包含所请求字段的DataFrame。
  - `pd_Panel`：当`is_panel=True`时，返回panel格式数据。
- ❗注意事项
  
  - `start_date` 和 `count` 参数不能同时使用。
  - 返回panel格式数据时，可以用`to_frame()`方法将数据转换为一个具有MultiIndex的二维DataFrame。
- 📝示例：
  
  - 调用
    ```python
    # 获取沪深300ETF和中证500ETF在指定日期的单位净值和累计净值，返回字典格式
    data = get_extras(['510300.SH', '510500.SH'], start_date='20230801', end_date='20230805', fields=['unit_net_value', 'acc_net_value'])
    ```
  - 返回值
    ```python
    {'510300.SH':             unit_net_value  acc_net_value
    2023-08-01          4.0679         1.7316
    2023-08-02          4.0396         1.7211
    2023-08-03          4.0750         1.7342
    2023-08-04          4.0911         1.7402, '510500.SH':             unit_net_value  acc_net_value
    2023-08-01          6.2086         1.9935
    2023-08-02          6.1866         1.9864
    2023-08-03          6.2080         1.9933
    2023-08-04          6.2400         2.0035}
    ```
  - 调用
    ```python
    # 获取沪深300ETF和中证500ETF在指定日期的单位净值和累计净值，返回Panel格式
    panel_data = get_extras(['510300.SH', '510500.SH'], start_date='20230801', end_date='20230805', fields=['unit_net_value', 'acc_net_value'], is_panel=True)
    ```
  - 返回值
    ```python
    <class 'mgquant_mod_mindgo.utils.compat.panel.pd_Panel'>
    Dimensions: 2 (items) x 4 (major_axis) x 2 (minor_axis)
    Items axis: unit_net_value to acc_net_value
    Major_axis axis: 2023-08-01 00:00:00 to 2023-08-04 00:00:00
    Minor_axis axis: 510300.SH to 510500.SH
    ```

## 融资融券数据：get_mtss

- 👑调用方法
  ```python
  get_mtss(
      security_list,
      start_date,
      end_date,
      fields,
      count=None,
      is_panel=False,
  )
  ```
- 🔧作用
  - 用于获取股票的历史融资融券数据。
- 📚参数说明
  - `security_list`: `str`、`list[str]`，表示标的代码。
  - `start_date`: `None`、`str`或`datetime-like`，表示起始时间。
  - `end_date`: `str` 或 `datetime-like`，表示结束时间。
  - `fields`: `list[str]`，表示需要获取的字段。
    - `'fin_value'`：融资余额(元)
    - `'fin_buy_value'`：融资买入额(元)
    - `'fin_refund_value'`：融资偿还额(元)
    - `'sec_value'`：融券余额(元)
    - `'sec_sell_value'`：融券卖出额(元)
    - `'sec_refund_value'`：融券偿还额(元)
    - `'fin_sec_value'`：融资融券余额(元)
  - `count`: `Optional[int]`，表示历史长度。`start_date`为 `None`时，`count`必须为正整数时；`start_date`不为 `None`时，`count`必须为0或`None`。
  - `is_panel`: `bool`，表示返回数据格式，默认为 `False`。为 `True` 时返回 `Panel` 格式，为 `False` 时返回字典格式。
- 🔢返回值说明
  - `dict` 或 `pandas.Panel`，根据 `is_panel` 参数返回不同格式的数据。
    - 当 `is_panel=False` 时，返回 `dict[str, pandas.DataFrame]`，键为股票代码，值为对应股票的融资融券数据 `DataFrame`。
    - 当 `is_panel=True` 时，返回 `pandas.Panel`。
- ❗注意事项
  - 返回 `Panel` 格式数据时，可以用 `to_frame()` 方法将数据转换为一个具有 `MultiIndex` 的二维 `DataFrame`。
  - 仅支持日频数据。
- 📝示例：
  - 调用 (返回字典格式)
    ```python
    # 获取单只股票过去20天的融资融券数据
    data = get_mtss(['000001.SZ'], end_date='20230801', fields=['fin_value', 'sec_value'], count=20)
    ```
  - 返回值
    ```python
    # {'000001.SZ':                fin_value   sec_value
    # 2023-07-05  4.303148e+09  28070628.0
    # 2023-07-06  4.311947e+09  30216087.0
    # 2023-07-07  4.321500e+09  30577837.0
    # ...}
    ```
  - 调用 (返回Panel格式)
    ```python
    # 获取多只股票的融资融券Panel数据
    panel_data = get_mtss(['000001.SZ', '600000.SH'], end_date='20230801', fields=['fin_value', 'sec_value'], count=20, is_panel=True)
    ```
  - 返回值
    ```python
    # <class 'pd_Panel'>
    # Dimensions: 2 (items) x 20 (major_axis) x 2 (minor_axis)
    # Items axis: fin_value to sec_value
    # Major_axis axis: 2023-07-05 00:00:00 to 2023-08-01 00:00:00
    # Minor_axis axis: 000001.SZ to 600000.SH
    ```

## 获取历史资金数据：get_money_flow_step

- 👑调用方法
  
  ```python
  get_money_flow_step(
      security_list,
      start_date,
      end_date,
      fre_step,
      fields,
      count=None,
      is_panel=False
  )
  ```
- 🔧作用
  
  - 用于获取股票的历史资金流向数据
- 📚参数说明
  
  - `security_list`: `list[str]`，表示标的代码列表
  - `start_date`:`None`、`str`或`datetime-like`，表示起始时间。
  - `end_date`: `str`、`int`、`float`或`datetime-like`，表示结束时间，默认为'20180101'
  - `fre_step`: `str`，表示时间步长，支持'1d'、'30m'、'5m'三种步长，默认为'1d'
  - `fields`: `list`，表示需要获取的字段，可参考[资金流向数据](http://quant.10jqka.com.cn/view/dataplatform/detail/125)，默认为全部字段
  - `count`: `Optional[int]`，表示历史长度。`start_date`为 `None`时，`count`必须为正整数时；`start_date`不为 `None`时，`count`必须为0或`None`。
  - `is_panel`: `bool`，表示返回数据格式，默认为False
- 🔢返回值说明
  
  - 当`is_panel=False`时返回`dict`，key为股票代码，value为DataFrame；
  - 当`is_panel=True`时返回`pd_Panel`
- ❗注意事项
  
  - 返回panel格式数据时，可以用to_frame()方法将数据转换为一个具有mutilindex的二维dataframe
  - 大单、中单、小单的标准如下：
    
    A.上证A股、深证主板大单标准：
    
    | 类型   | 标准                                      |
| ------ | ----------------------------------------- |
| 小单   | 1万股以下         或     5万元以下        |
| 中单   | 1万股到6万股       或     5万元—30万元   |
| 大单   | 6万股到20万股      或     30万元—100万元 |
| 特大单 | 20万股以上        或     100万元以上      |
    
    B.中小板、创业板大单标准：
    
    | 类型   | 金额                                 |
| ------ | ------------------------------------ |
| 小单   | 5万元以下                            |
| 中单   | 5万元—20万元(包括5万，不包括20万)   |
| 大单   | 20万元—50万元(包括20万，不包括50万) |
| 特大单 | 50万元以上                           |
    
    
- 📝示例：
  
  - 调用（返回字典格式）
    ```python
    data = get_money_flow_step(
        security_list=['000001.SZ', '600000.SH'],
        start_date='20230801',
        end_date='20230810',
        fields=['act_buy_xl'],
        is_panel=False
    )
    ```
  - 返回值（字典格式）
    ```python
    {'000001.SZ':              act_buy_xl
    2023-08-01   77794210.0
    2023-08-02  144867230.0
    2023-08-03  271395280.0
    2023-08-04  174036910.0
    2023-08-07   26917745.0
    2023-08-08   72404551.0
    2023-08-09   90129986.0
    2023-08-10   29415443.0, '600000.SH':             act_buy_xl
    2023-08-01  18543544.0
    2023-08-02  28330619.0
    2023-08-03  19100554.0
    2023-08-04  16758347.0
    2023-08-07   3185453.0
    2023-08-08   6347852.0
    2023-08-09   5820379.6
    2023-08-10   7758793.8}
    ```
  - 调用（返回Panel格式）
    ```python
    data = get_money_flow_step(
        security_list=['000001.SZ', '600000.SH'],
        start_date='20230801',
        end_date='20230810',
        fields=['act_buy_xl'],
        is_panel=True
    )
    ```
  - 返回值（Panel格式）
    ```python
    <class 'pd_Panel'>
    Dimensions: 1 (items) x 8 (major_axis) x 2 (minor_axis)
    Items axis: act_buy_xl to act_buy_xl
    Major_axis axis: 2023-08-01T00:00:00.000000000 to 2023-08-10T00:00:00.000000000
    Minor_axis axis: 000001.SZ to 600000.SH
    ```
