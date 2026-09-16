---
title: "问财接口"
---

# 问财接口
## 问财接口使用前必读

问财选股接口因为他的便利和速度而广受喜欢。

然而问财的诞生之初是用于实时选股，而非回测。所以在回测的场景必然会存在一些问题。这些问题解决需要时间和精力，如果你发现问题记得及时反馈给supermind官方。我们会持续推动解决。

建议用问财来快速验证想法，然后自己用pyhton实现代码是比较好的方式。

`query_iwencai` 和 `get_iwencai` 的结果是不一样的，因为二者调用的服务是不一样的：`query_iwencai`，基于[i问财智能投顾](https://www.iwencai.com/)，主要用于实时选股，注意，目前iwencai分为2套，API返回结果与旧版是一致的；`get_iwencai`基于[BackTest 量化策略平台 (10jqka.com.cn)](https://backtest.10jqka.com.cn/)，主要用于历史回测，`get_iwencai` 为了避免一些未来函数，会再回测环境对某些语句不可用，会出现iwencai初始化失败的提示。

自然语言解析较为复杂，最好先到对应的问财网站对问句进行试验，确认解析结果没有问题之后，再应用到策略当中。

## 问财实时数据：query_iwencai (研究环境使用)

- 👑调用方法
  ```python
  query_iwencai(query, domain='股票', timeout=6, df=True)
  ```
- 🔧作用
  - 用于通过输入自然语言，执行智能选股并获取股票列表
- 📚参数说明
  - `query`: `str`，表示自然语句
  - `domain`: `str`，可选'股票'、'基金'、'指数'、'新三板'、'港股'、'美股'，默认为'股票'
  - `timeout`: `int`，表示超时时间，默认为6
  - `df`: `bool`，表示是否格式化为DataFrame，默认为True
- 🔢返回值说明
  - `pandas.DataFrame`或`list`，当df=True时返回DataFrame，当df=False时返回list，包含选股结果
- ❗注意事项
  - 该函数可获得和网页版问财相同的结果
  - 该函数有调用次数限制，每15分钟内限制调用5000次
  - 该函数不是为回测而设计，回测中慎用
- 📝示例：
  - 调用
    ```python
    query_iwencai("市值>1000亿，日成交额>30亿，换手率大于4.5%")
    ```
  - 返回值
    ```python
    股票代码     股票简称     总市值       成交额       换手率
    0  301308.SZ  江波龙  1.517310e+12   4395865700.00   4.52
    1  000988.SZ  华工科技  1.221896e+12   9411697100.00   7.85
    2  688525.SH  佰维存储  1.156106e+12   5972511300.00   5.15
    ```
  - 调用
    ```python
    query_iwencai("市值>1000亿，日成交额>30亿，换手率大于4.5%", df=False)
    ```
  - 返回值
    ```python
    [{'股票代码': '301308.SZ', '股票简称': '江波龙','总市值': 123398012088.76, '成交额': '4346865700.00', '换手率: '4.52'}]
    ```

## 问财昨日数据：get_iwencai(回测环境使用)

- 👑调用方法
  
  ```python
  get_iwencai(question, set_attr='iwencai_securities', version=None)
  ```
- 🔧作用
  
  - 用于通过输入自然语言执行智能选股并获取股票列表
- 📚参数说明
  
  - `question`: `str`，表示自然语句
  - `set_attr`: `str`，表示用于存储股票列表结果的`context`对象的属性名，默认为'iwencai_securities'
  - `version`: `Optional[str]`，表示版本，'stable'为稳定版，'online'为正式版。若希望与问财官网保持一致，请使用'online'。默认为`None`，表示稳定版
- 🔢返回值说明
  
  - `None`: 函数无直接返回值，选股结果会保存在由`set_attr`参数指定的`context`对象的属性中，默认为`context.iwencai_securities`，选股结果为`list[str]`，为股票列表。
- ❗注意事项
  
  - 该函数必须在`init`初始化函数中调用。
  - 该函数会在每个交易日自动执行选股，并将结果保存至`context`对象中。
  - 该函数有调用次数限制，每15分钟内限制调用5000次。
- 📝示例：
  
  - 调用
    ```python
    def init(context):
        # 选出非ST且市值大于100亿的股票
        get_iwencai('非ST，市值大于100亿')
    
    def handle_bar(context, bar_dict):
        # 打印前一日收盘后的选股结果
        log.info(context.iwencai_securities)
    ```
  - 返回值
    ```python
    # 假设选出的股票如下
    ['000001.SZ', '600519.SH']
    ```
- 💥特殊用法
  当前已经支持在研究环境调用`get_iwencai`
  
  - 调用
    
    ```python
    # 研究环境中使用get_iwencai
    get_iwencai = get_open_api('public').get_iwencai
    stk_pool = get_iwencai('净利润增长大于20%,股价位于20日均线上方','20230701','20230801',version='stable')
    ```
  - 返回值
    
    ```python
    {'20230710': ['301292.SZ', '300780.SZ', '301192.SZ', '301016.SZ', '301398.SZ'], '20230707': ['300817.SZ', '301192.SZ', '300657.SZ', '301488.SZ', '301141.SZ'], '20230706': ['301202.SZ', '920505.BJ', '300128.SZ', '300127.SZ', '301141.SZ'], '20230705': ['301488.SZ', '920533.BJ', '301007.SZ', '301255.SZ', '301221.SZ'], '20230704': ['920204.BJ', '300827.SZ', '300254.SZ', '300282.SZ', '688663.SH'], '20230703': ['688582.SH', '300769.SZ', '300503.SZ', '688609.SH', '300412.SZ'], '20230630': ['688429.SH', '920378.BJ', '920663.BJ', '920221.BJ', '300780.SZ']}
    ```

## 问财接口是否支持本地接口调用？

不支持。supermind 中只有极少的数据支持本地接口调用，详见：[https://quant.10jqka.com.cn/view/help/3](/guide/other/yi-qian-yan)

## 市面ZUI全！一文讲透问财语句深度使用技巧（含50个案例）

[https://quant.10jqka.com.cn/view/article/2183](https://quant.10jqka.com.cn/view/article/2183)
