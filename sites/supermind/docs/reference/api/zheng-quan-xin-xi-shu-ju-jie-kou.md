---
title: "证券信息数据接口"
---

# 证券信息数据接口
## 获取单只证券的基本信息：get_security_info

- 👑调用方法
  
  ```
  get_security_info(symbol)
  ```
- 🔧作用
  
  - 用于获取单只证券的基本信息
- 📚参数说明：
  
  - `symbol`: `str`，表示股票、期货、基金、指数等证券标的对应的同花顺代码
- 🔢返回值说明：
  
  - `Instrument`，返回一个`Instrument`对象，包含证券的各项基本信息，如证券名称、上市交易所、证券类型、上市日期等，通过取类属性来使用，如`instrument.display_name`
- ❗注意事项：
  
  - `symbol`需要满足同花顺的格式，否则无法正常取到数据
  - 该函数获取的标的简称在回测中不可用于判断是否为ST股
- 📝示例：
  
  - 调用：
    
    ```python
    data = get_security_info('000001.SZ')
    ```
  - 返回值：
    
    ```python
    Instrument(benchmark=None, de_listed_date=datetime.datetime(2200, 1, 1, 0, 0), display_name='平安银行', end_date=datetime.datetime(2200, 1, 1, 0, 0), exchange='深交所', listed_date=datetime.datetime(1991, 4, 3, 0, 0), market1='212100', market2='001001', market_hq='33', min_round_lot=0, name='payh', order_book_id='000001.SZ', parent='nan', price_limit=0.0, round_lot=100, start_date=datetime.datetime(1991, 4, 3, 0, 0), symbol='000001.SZ', symbol_hq='000001', type='stock', underlying_symbol=None)
    ```

## 获取所有证券信息：get_all_securities

- 👑调用方法
  
  ```
  get_all_securities(ty=None, date=None)
  ```
- 🔧作用
  
  - 获取指定日期所有上市证券列表及其基本信息。
- 📚参数说明：
  
  - `ty`: `Optional[str]`，证券类型，默认取所有证券类型
    - `ty='stock'`：A股
    - `ty='hstock'`：港股
    - `ty='ustock'`：美股
    - `ty='index'`：指数
    - `ty='etf'`：ETF基金
    - `ty='lof'`：LOF基金
    - `ty='fja'`：分级A基金
    - `ty='fjb'`：分级B基金
    - `ty='qdii'`：qdii基金
    - `ty='ota'`：场外基金
    - `ty='fund'`：资产支持证券
    - `ty='futures'`：金融期货
    - `ty='commodity_futures'`：商品期货
    - `ty='bond_futures'`：国债期货
    - `ty='option'`：ETF期权
    - `ty='cbond'`：A股可转债
    - `ty='forex'`：外汇（中国银行双向宝）合约
    - `ty='metal'`：T+D延期交收合约
  - `date`: `Optional[str]`，查询日期，格式为 'YYYYMMDD'。回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
- 🔢返回值说明：
  
  - `pandas.DataFrame`，返回一个DataFrame，索引为证券代码，列包括证券简称、上市日期、退市日期、类型等信息。
- ❗注意事项：
  
  - 该函数获取的标的简称在回测中不可用于判断是否为ST股。
- 📝示例：
  
  - 调用：
    ```python
    #查询2023年8月1日处于上市状态的沪京深股票信息
    data = get_all_securities('stock','20230801')
    print(data)
    ```
  - 返回值：
    ```
    benchmark de_listed_date display_name   end_date exchange  \
    symbol                                                  
    002789.SZ      None     2200-01-01        *ST建艺 2200-01-01      深交所   
    600562.SH      None     2200-01-01         国睿科技 2200-01-01      上交所   
    ...             ...            ...          ...        ...      ...   
    
             listed_date market1 market2 market_hq  min_round_lot  name  \
    symbol                                                   
    002789.SZ  2016-03-11  212100  001001        33              0  stjy   
    600562.SH  2003-01-28  212001  001001        17              0  grkj   
    ...               ...     ...     ...       ...            ...   ...   
    
             order_book_id parent  price_limit  round_lot start_date symbol_hq  \
    symbol                                                          
    002789.SZ     002789.SZ    nan         0.00        100 2016-03-11    002789   
    600562.SH     600562.SH    nan         0.00        100 2003-01-28    600562   
    ...                 ...    ...          ...        ...        ...       ...   
    
                type underlying_symbol  
    symbol                
    002789.SZ  stock              None  
    600562.SH  stock              None  
    ...          ...               ...  
    
    [5453 rows x 19 columns]
    ```

## 获取期货期权品种相关信息：get_futures_info

- 👑调用方法
  
  ```
  get_futures_info(symbol, date=None)
  ```
- 🔧作用
  
  - 用于获取期货品种的相关信息。
- 📚参数说明：
  
  - `symbol`: `str`，表示期货品种类型。
  - `date`: `Optional[str]`，表示查询日期，回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日。
- 🔢返回值说明：
  
  - `dict`，返回一个字典，包含期货品种的详细信息。字典的键值说明如下：
    - `'symbol'`: `str`，期货合约代码。
    - `'name'`: `str`，期货合约名称。
    - `'commission'`: `float`，手续费率。
    - `'margin_rate'`: `float`，保证金率。
    - `'contract_multiplier'`: `float`，合约乘数。
    - `'exchange'`: `str`，交易所名称。
    - `'unit'`: `float`，交易单位。
- 📝示例：
  
  - 调用
    ```python
    # 查询螺纹钢期货的2023年8月1日的品种信息
    data = get_futures_info('RB', '20230801')
    ```
  - 返回值
    ```python
    {'symbol': 'RB', 'name': '螺纹钢', 'commission': 0.0001, 'margin_rate': 0.05, 'contract_multiplier': 10.0, 'exchange': '上海期货交易所', 'unit': 1.0}
    ```

## 获取主力合约代码：get_futures_dominate

- 👑调用方法：
  ```
  get_futures_dominate(symbol, date=None, seq=0)
  ```
- 🔧作用：
  - 获取指定期货品种的主力合约代码
- 📚参数说明：
  - `symbol`: `str`，期货合约品种代码，例如螺纹钢期货为'RB'
  - `date`: `Optional[str]`，查询日期，回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
  - `seq`: `int`，序列号，用于指定返回第几个主力合约，默认为0表示主力合约
- 🔢返回值说明：
  - `str`，返回字符串，表示主力合约代码
- ❗注意事项：
  - 当seq=0时返回当前主力合约代码
- 📝示例：
  - 调用：`get_futures_dominate('RB', '20230801', 0)`
  - 返回值：`'RB2310'`

## 获取指定品种所有可交易的合约：get_future_code

- 👑调用方法：
  
  ```python
  get_future_code(underlying_symbol, date=None)
  ```
- 🔧作用
  
  - 获取指定品种所有可交易的期货合约
- 📚参数说明：必须根据函数签名，保证参数完整
  
  - `underlying_symbol`: `str`，品种名称，例如：'RB'
  - `date`: `Optional[str]`，获取合约的时间，时间格式：'%Y%m%d'
- 🔢返回值说明
  
  - `list`，返回合约代码列表，例如：['RB1809', 'RB1810', 'RB1811', ...]
- ❗注意事项：若无可省略
- 📝示例：
  
  - 调用
    
    ```python
    future_code_all = get_future_code('RB', '20180910')
    ```
  - 返回值
    
    ```python
    ['RB1809', 'RB1810', 'RB1811', 'RB1812', 'RB1901', 'RB1902', 'RB1903', 'RB1904', 'RB1905', 'RB1906', 'RB1907', 'RB1908']
    ```

## 获取可交易的期权合约列表：get_option_code

- 👑调用方法
  ```python
  get_option_code(date=None)
  ```
- 🔧作用
  - 用于获取当前所有可交易的沪深交易所ETF期权合约。
- 📚参数说明
  - `date`: `Optional[str]`，表示查询日期。
- 🔢返回值说明
  - `DataFrame`，返回一个DataFrame，包含可交易的期权合约代码(symbol)和到期月份(month)信息。
- 📝示例：
  - 调用
    ```python
    # 获取指定日期的期权合约代码
    options_all = get_option_code('20230801')
    ```
  - 返回值
    ```python
    symbol month
    0    90001832.SZ  None
    1    90001824.SZ  None
    2    90002275.SZ  None
    3    90002114.SZ  None
    4    90002105.SZ  None
    ```

## 获取指数成份股：get_index_stocks

- 👑调用方法
  
  ```python
  get_index_stocks(symbol, date=None)
  ```
- 🔧作用
  
  - 用于获取指定指数在指定日期的成分股股票代码列表
- 📚参数说明
  
  - `symbol`: `str`，表示指数代码，如 `'000016.SH'`
  - `date`: `Optional[str]`，表示查询日期，格式为 'YYYYMMDD'，回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
- 🔢返回值说明
  
  - `list`，返回字符串列表，每个元素为一个成分股的股票代码（如 `'600519.SH'`）
- ❗注意事项
  
  - 该函数若在模拟交易的 init 函数中使用，则必须填写 date 参数
- 📝示例：
  
  - 调用
    
    ```python
    stock_list = get_index_stocks('000016.SH', '20230801')
    ```
  - 返回值
    
    ```python
    ['600436.SH', '603288.SH', '600519.SH', '601857.SH', '600036.SH', '600050.SH', '603260.SH', '601288.SH', '601166.SH', '600900.SH', '601012.SH', '600309.SH', '600406.SH', '600031.SH', '600010.SH', '600048.SH', '600809.SH', '688111.SH', '601088.SH', '603799.SH', '601398.SH', '601066.SH', '600887.SH', '600111.SH', '601669.SH', '601318.SH', '600690.SH', '600276.SH', '600028.SH', '603501.SH', '600745.SH', '601888.SH', '601728.SH', '600905.SH', '600438.SH', '603986.SH', '600089.SH', '601919.SH', '600030.SH', '601668.SH', '603259.SH', '601390.SH', '601225.SH', '601628.SH', '600893.SH', '600104.SH', '601899.SH', '601633.SH', '688599.SH', '600196.SH']
    ```

## 获取指数成份股权重：get_index_weight

- 👑调用方法
  
  ```python
  get_index_weight(symbol, date=None)
  ```
- 🔧作用
  
  - 用于获取指定指数在指定日期的成分股权重数据，返回包含股票代码和对应权重的DataFrame
- 📚参数说明
  
  - `symbol`: `str`，表示指数代码，如'000016.SH'
  - `date`: `Optional[str]`，表示查询日期，格式为'YYYYMMDD'；回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
- 🔢返回值说明
  
  - `pandas.core.frame.DataFrame`，返回包含两列的DataFrame：'symbol'（股票代码）和'weight'（权重值），权重为百分比形式
- ❗注意事项
  
  - 部分等权指数会返回空的DataFrame，例如同花顺指数
  - 该函数若在模拟交易的init函数中使用，则必须填写date参数
- 📝示例：
  
  - 调用
    
    ```python
    weight = get_index_weight('000016.SH', '20230801')
    ```
  - 返回值
    
    ```python
    symbol  weight
    0  600309.SH   2.627
    1  600104.SH   1.033
    2  600030.SH   3.356
    ...
    49 600893.SH   0.769
    ```

## 获取指数列表：get_index_list

- 👑调用方法
  ```python
  get_index_list(suffix, date=None)
  ```
- 🔧作用
  - 根据指数代码后缀查询对应的指数列表
- 📚参数说明
  - `suffix`: `str`，表示指数代码后缀，如 'TI'
  - `date`: `Optional[str]`，表示查询日期，格式为 'YYYYMMDD'，回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
- 🔢返回值说明
  - `list`，返回字符串列表，每个元素为完整的指数代码（如 '885760.TI'）
- ❗注意事项
  - 返回列表中的指数代码格式为「六位数字+后缀」，后缀由 `suffix` 参数指定
  - 若无匹配指数，返回空列表
- 📝示例：
  - 调用
    ```python
    index_list = get_index_list('TI', '20230801')
    ```
  - 返回值
    ```python
    ['885760.TI', '883400.TI', '885423.TI', ...]
    ```

## 获取行业成份股：get_industry_stocks

- 👑调用方法
  ```python
  get_industry_stocks(symbol, date=None)
  ```
- 🔧作用
  - 用于获取指定行业指数代码在指定日期的成分股股票代码列表
- 📚参数说明
  - `symbol`: `str`，表示行业指数代码，如'CI311000'
  - `date`: `Optional[str]`，表示查询日期，格式为'YYYYMMDD'；回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日
- 🔢返回值说明
  - `list`，返回字符串列表，每个元素为一个股票代码（如'600693.SH'）
- ❗注意事项
  - 返回的股票代码包含交易所后缀（如'.SH'或'.SZ'），请确保与目标系统兼容
- 📝示例：
  - 调用
    ```python
    index_list = get_industry_stocks('CI311000', '20230801')
    ```
  - 返回值
    ```python
    ['600693.SH', '601366.SH', '600694.SH', '002251.SZ', '601116.SH', '000759.SZ', '600697.SH', '601010.SH', '000564.SZ', '002561.SZ', '002336.SZ', '600712.SH', '600280.SH', '603031.SH', '002419.SZ', '600729.SH', '002187.SZ', '603123.SH', '600738.SH', '600628.SH', '000501.SZ', '605188.SH', '600778.SH', '603708.SH', '603101.SH', '002697.SZ', '600785.SH', '601086.SH', '000419.SZ', '600814.SH', '000417.SZ', '600306.SH', '600824.SH', '600827.SH', '600828.SH', '600838.SH', '000679.SZ', '600858.SH', '600859.SH', '600861.SH', '000715.SZ', '600865.SH', '000882.SZ', '002277.SZ', '601933.SH', '002264.SZ']
    ```

## 获取行业分类信息：get_industry_relate

- 👑调用方法
  ```python
  get_industry_relate(date='now', types='industryid1', fields=None)
  ```
- 🔧作用
  - 用于获取A股行业分类信息，可查到行业分类及对应代码。
- 📚参数说明
  - `date`: `str`，表示查询日期，默认为 `'now'`。
  - `types`: `str`，表示行业分类类型，可以参考[行业分类信息字段](http://quant.10jqka.com.cn/view/dataplatform/detail/24)，默认为 `'industryid1'`。
  - `fields`: `Optional[list[str]]`，表示字段名，默认为 `None` 即返回所有字段。可以参考[行业分类信息字段](http://quant.10jqka.com.cn/view/dataplatform/detail/24)。
- 🔢返回值说明
  - `pandas.DataFrame`，返回DataFrame，包含行业分类的详细信息，如行业名称、代码、类型等。
- 📝示例：
  - 调用
    ```python
    # 查询2023年8月1日中信二级行业分类信息
    industry_info = get_industry_relate(date='20230801', types='ci_industryid2')
    print(industry_info.head())
    ```
  - 返回值
    ```python
    available_date disabled_date industry_index  industry_rank  \
    industry_name
    一般零售                    None          None       CI005811            2.0
    专业市场经营Ⅱ           2019-12-02          None       CI005815            2.0
    专用机械                    None          None       CI005805            2.0
    专用材料Ⅱ             2019-12-02          None       CI005800            2.0
    专营连锁              2019-12-02          None       CI005813            2.0
    
                                  industry_symbol industry_thscode industry_type industry_typecode
    industry_name
    一般零售                 CI311000      CI005811.CI          中信行业            002012
    专业市场经营Ⅱ              CI315000      CI005815.CI          中信行业            002012
    专用机械                 CI262000      CI005805.CI          中信行业            002012
    专用材料Ⅱ                CI246000      CI005800.CI          中信行业            002012
    专营连锁                 CI313000      CI005813.CI          中信行业            002012
    ```

## 获取股票所属行业数据：get_symbol_industry

- 👑调用方法
  ```python
  get_symbol_industry(symbol, date=None)
  ```
- 🔧作用
  - 用于获取个股的行业分类信息，支持同花顺行业分类、申万行业分类、中信行业分类、证监会行业分类、标普行业分类。
- 📚参数说明
  - `symbol`: `str`，表示股票代码
  - `date`: `Optional[str]`，表示查询日期，默认为None
- 🔢返回值说明
  - `Symbol_Industry`，返回一个Symbol_Industry对象，包含多个行业分类信息。
- 📝示例：
  - 调用
    ```python
    # 查询指定股票在特定日期的行业分类信息
    get_symbol_industry('300033.SZ', date='20230801')
    ```
  - 返回值
    ```python
    Symbol_Industry(date=Timestamp('2023-08-01 00:00:00'), industryid1='T10', industryid2='T1003', industryid3='T100301', s_industryid1='S71', s_industryid2='S7104', s_industryid3='S710401', c_industryid='69', c_industryid2='J', ci_industryid1='CI620000', ci_industryid2='CI625000', ci_industryid3='CI625010', gi_industryid1='45', gi_industryid2='4510', gi_industryid3='451030', gi_industryid4='45103010')
    ```

## 获取所有同花顺概念成分股：get_concept_stocks

- 👑调用方法
  ```python
  get_concept_stocks(symbol, date=None)
  ```
- 🔧作用
  - 用于获取指定概念下的成分股。
- 📚参数说明
  - `symbol`: `str`，概念代码或者概念指数代码。
  - `date`: `Optional[str]`，查询日期，格式为 'YYYYMMDD'，如 '20230801'。回测时默认为当前回测时间的前一交易日，研究环境中默认为前一交易日。
- 🔢返回值说明
  - `list`，返回一个列表，包含指定概念的成分股代码。
- ❗注意事项
  - 通常在同花顺行情软件上能看到行情的都是概念指数，代码以TI结尾。
  - 概念不一定有对应的概念指数。
  - 概念指数的成分股也可以通过 `get_index_stocks`函数获取。
- 📝示例：
  - 调用
    ```python
    stock_list = get_concept_stocks('886031.TI', date='20230801')
    ```
  - 返回值
    ```python
    ['300235.SZ', '002722.SZ', '300229.SZ', '688609.SH', ...]
    ```

## 获取所有同花顺概念信息：get_concept_relate

- 👑调用方法
  ```python
  get_concept_relate(date='now', levels=None, fields=None)
  ```
- 🔧作用
  - 用于获取所有同花顺概念分类信息及对应的指数代码。
- 📚参数说明
  - `date`: `str`，表示查询日期，默认为'now'
  - `levels`: `Optional[str | list]`，表示概念类型，默认为None，即获取所有概念
  - `fields`: `Optional[list[str]]`，表示需要查询的字段，默认为None，即返回所有字段，参照[同花顺概念分类](https://quant.10jqka.com.cn/view/dataplatform/detail/66)
- 🔢返回值说明
  - `pandas.DataFrame`，返回一个DataFrame，包含同花顺概念的名称、代码、类型、级别等信息。
- ❗注意事项
  - 通常在同花顺行情软件上能看到行情的都是概念指数，代码以TI结尾
  - 概念不一定有对应的概念指数
- 📝示例：
  - 调用
    ```python
    concept_info = get_concept_relate(date='20230801')
    ```
  - 返回值
    ```python
    concept_symbol concept_code ... concept_thscode available_date
    concept_name                                          ...                         
    2021年送转填权概念              308986     00090126 ...       883402.TI     2022-07-01
    3D打印                         301963     00060044 ...            None           None
    3D打印                         300127     00030035 ...       885537.TI     2014-04-25
    3D打印[US]                     306516     00040130 ...       865045.TI     2019-01-28
    3D玻璃                         302116     00032341 ...            None           None
    ```

## 获取指定时间段交易日：get_trade_days

- 👑调用方法
  ```python
  get_trade_days(start_date=None, end_date='20180101', count=None)
  ```
- 🔧作用
  - 获取沪深京交易所指定时间段交易日
- 📚参数说明
  - `start_date`: `None`、`str`、 `int`、`datetime_like`，起始日期，默认为None
  - `end_date`: `str, int, datetime_like`，结束日期，默认为'20180101'
  - `count`: `Optional[int]`，交易日数量
- 🔢返回值说明
  - `pandas.core.indexes.datetimes.DatetimeIndex`，返回指定时间段的交易日
- ❗注意事项
  - 当start_date、end_date全部不为None时，count参数不生效
- 📝示例：
  - 调用
    ```python
    tdays_list = get_trade_days('20230101', '20230801')
    ```
  - 返回值
    ```python
    DatetimeIndex(['2023-01-03', '2023-01-04', '2023-01-05', '2023-01-06',
                   '2023-01-09', '2023-01-10', '2023-01-11', '2023-01-12',
                   '2023-01-13', '2023-01-16',
                   ...
                   '2023-07-19', '2023-07-20', '2023-07-21', '2023-07-24',
                   '2023-07-25', '2023-07-26', '2023-07-27', '2023-07-28',
                   '2023-07-31', '2023-08-01'],
                  dtype='datetime64[ns]', length=140, freq=None)
    ```

## 获取所有交易日：get_all_trade_days

- 👑调用方法
  ```python
  get_all_trade_days()
  ```
- 🔧作用
  - 用于获取沪深京交易所所有交易日。
- 🔢返回值说明
  - `pandas.core.indexes.datetimes.DatetimeIndex`，返回一个时间索引对象，包含了从历史至今的所有交易日日期。
- 📝示例：
  - 调用
    ```python
    tdays = get_all_trade_days()
    ```
  - 返回值
    ```python
    DatetimeIndex(['1990-12-19', '1990-12-20', '1990-12-21', '1990-12-24',
                   '1990-12-25', '1990-12-26', '1990-12-27', '1990-12-28',
                   '1990-12-31', '1991-01-02',
                   ...
                   '2028-12-18', '2028-12-19', '2028-12-20', '2028-12-21',
                   '2028-12-22', '2028-12-25', '2028-12-26', '2028-12-27',
                   '2028-12-28', '2028-12-29'],
                  dtype='datetime64[ns]', length=9285, freq=None)
    ```

## 获取因子数据：get_sfactor_data

- 👑调用方法
  ```python
  get_sfactor_data(start_date, end_date, stocks, factor_names)
  ```
- 🔧作用
  - 用于获取经过数据处理（去极值、标准化）后的因子数据。
- 📚参数说明
  - `start_date`: `str, int, datetime_like`，表示起始日期
  - `end_date`: `str, int, datetime_like`，表示结束日期
  - `stocks`: `list`，表示股票池
  - `factor_names`: `list`，表示因子池
    - [技术指标类因子](http://quant.10jqka.com.cn/view/dataplatform/detail/285)
    - [财务指标类因子](http://quant.10jqka.com.cn/view/dataplatform/detail/289)
- 🔢返回值说明
  - `dict`，返回字典，表示因子数据。字典的键为因子名，值为一个 pandas.DataFrame，该 DataFrame 的索引为股票代码，列为日期，值为处理后的因子值。
- ❗注意事项
  - 此函数支持获取自定义因子
- 📝示例：
  - 调用
    ```python
    start_date, end_date = '20230801', '20230805'
    stocks, factor_names = ['600519.SH','300033.SZ'], ['macd']
    result = get_sfactor_data(start_date, end_date, stocks, factor_names)
    ```
  - 返回值
    ```python
    {'macd':            2023-08-01  2023-08-02  2023-08-03  2023-08-04
    600519.SH     32.4820     28.7126     24.1070     21.2735
    300033.SZ      6.0546      5.8856      6.6241      6.9331}
    ```
