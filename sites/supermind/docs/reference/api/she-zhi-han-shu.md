---
title: "设置函数"
---

# 设置函数
## 设置基准收益：set_benchmark

- 👑调用方法
  ```python
  set_benchmark(symbol)
  ```
- 🔧作用
  - 用于设置基准收益，其不影响策略的运行。
- 📚参数说明
  - `symbol`: `str`，表示股票或者其他品种代码。例如：'000300.SH' (沪深300) 或 '511010.SH' (国债ETF)。
- ❗注意事项
  - 必须在 `init(context)` 函数下设置，否则无效。
  - `symbol` 参数必须输入字符串，且只能输入一个代码（例如：'000300.SH' 正确，['000300.SH'] 错误）。
  - 如果策略中未设置该函数，则默认基准为沪深300指数。
- 📝示例：
  - 调用
    ```python
    def init(context):
        # 初始化策略时设置基准为沪深300指数
        set_benchmark('000300.SH')
    ```

## 设置策略滑点：set_slippage

- 👑调用方法
  ```python
  set_slippage(slippage)
  ```
- 🔧作用
  - 用于设置策略滑点，该设置不影响策略的运行，默认为0.002的可变滑点。
- 📚参数说明
  - `slippage`: `PriceSlippage` 或 `FixedSlippage`，表示滑点对象。
    - `PriceSlippage`：可变滑点对象，例如`PriceSlippage(0.1)`，表示买入价为实际价格乘1.05，卖出价为实际价格乘0.95。
    - `FixedSlippage`：固定滑点对象，例如`FixedSlippage(10)`，表示买入价为实际价格加5，卖出价为实际价格减5。
- ❗注意事项
  - 该函数为初始设置函数，必须在 `init(context)` 中调用，否则设置无效。
- 📝示例：
  - 调用
    ```python
    def init(context):
        #设置可变滑点2%，表示买入价为实际价格乘101%，卖出价为实际价格乘99%
        set_slippage(PriceSlippage(0.02))
    ```

## 设置交易手续费：set_commission

- 👑调用方法：
  `set_commission(cal_style)`
- 📚参数说明：

  - cal_style:PerShare或PerTrade对象
    - PerShare：**比例交易手续费**，例如 `PerShare(type='stock',cost=0.0002)`，表示手续费为交易额的0.02%
    - PerTrade：**固定交易手续费**，例如 `PerTrade(type='future',cost=5.0)`，表示每笔交易手续费5元
- 🔧作用：

  - set_commission函数用来设置交易手续费，其不影响策略的运行,默认交易手续费为：交易额的0.02%
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
- 📝示例：

  ```python
  def init(context):
      #设置股票手续费为交易额的0.01%(万一)，最低手续费为0元(免5)
      set_commission(PerShare(type='stock',cost=0.0001,min_trade_cost=0.0))
  ```

---

## 设置回测策略账户初始持仓：set_holding_stocks

- 👑调用方法：
  `set_holding_stocks(holdings)`
- 📚参数说明：

  - holdings:dict对象，key为持仓的symbol，value为持仓的数量(必须为正整数)
- 🔧作用：

  - set_holding_stocks函数用来设置回测策略账户初始持仓(设置初始持仓并不会减少账户的初始资金)
- ❗注意事项：

  - 若进行策略回测, 则该函数默认使用回测开始日期的前一个交易日收盘价持有初始持仓
  - 若回测起始日期小于等于所添加股票的上市日期或股票已经退市, 则无法添加该股票持仓
  - 该函数必须在init函数下设置,否则是无效的
- 📝示例：

  ```python
  def init(context):
      #设置策略初始持仓
      set_holding_stocks({'000001.SZ': 200,'300033.SZ': 500,'600519.SH': 700})
  ```

---

## 设置设置子账户：set_subportfolios

- 👑调用方法：
  `set_subportfolios([dict_1,dict_2,...])`
- 📚参数说明：

  - dict_1:dict对象，key为 `cash`、`type`的字典
    - cash:子账户初始资金,例如:'cash':500000,设置子账户初始资金为50万
    - type:子账户类型,例如： 'type': 'future',设置该子账户为期货账户.配合'cash'一起使用:{'cash':500000,'type':'future'}
- 🔧作用：

  - set_subportfolios函数用来设置设置子账户
- ❗注意事项：

  - 该函数设置后，子账户初始资金之和必须等于总的初始资金(回测时需要填写总的初始资金)
  - 模拟交易时，函数设置的期货和股票账户资金必须对应模拟交易中期货和股票账户的资金。设置函数或者创建模拟账户时,必须考虑到这点,不然无法正常模拟交易
  - 如果整个策略没有该函数,则无法进行期货交易
  - 该函数必须在init函数下设置,否则是无效的
- 📝示例：

  ```python
  def init(context):
      #设置子账户,股票账户50万，期货账户50万.
      set_subportfolios([{'cash':500000,'type':'stock'},{'cash':500000,'type':'future'}])
  ```

  ---

## 设置最大成交比例：set_volume_limit

- 👑调用方法：
  `set_volume_limit(daily, minute)`
- 📚参数说明：

  - daily:float，例如 `daily=0.25`,则意味着下单数量超过日线级成交量25%的部分无法成交；`daily=None`,则表示不做成交量限制
  - minute:float，例如 `minute=0.5`,则意味着下单数量超过分钟线级成交量50%的部分就无法成交；`minute=None`,则表示不做成交量限制
- 🔧作用：

  - set_volume_limit函数用来设置最大成交比例,若下单数量超过当前时间周期的成交量一定比例，则按允许的最大数量成交
- ❗注意事项：

  - 如果策略没有该函数，则默认daily=0.25，minute=0.5
  - 该函数设置后，一旦触发，则本次下单可能会部分成交
- 📝示例：

  ```python
  def init(context):
      #设置最大成交比例日级成交量比例50%,分钟级成交量比例50%
      set_volume_limit(daily=0.5, minute=0.5)
  ```

---

## 设置下单后延迟成交时间：set_trade_delay

- 👑调用方法：
  `set_trade_delay(delay_time)`
- 📚参数说明：

  - delay_time:int，延迟delay_time个bar后成交，例如 `delay_time=5`
    - 在日级回测中下单后，延迟5个交易日成交
    - 在分钟级回测中下单后，推迟5分钟成交
- 🔧作用：

  - 设置下单后延迟成交时间
- ❗注意事项：

  - 该函数在模拟交易中无效，只能在回测环境中使用它
  - 该函数必须在init(context)函数下设置,否则无效
- 📝示例：

  ```python
  def init(context):
      #下单后推迟3分钟/交易日成交
      set_trade_delay(delay_time=3)
  ```

---

## 设置log输出级别：set_log_level

- 👑调用方法：
  `set_log_level(level,is_limit=True,filename=None)`
- 📚参数说明：

  - level:str，log对应的级别，如果设定level为'warn',则log打印函数只会打印'warn'、'error'级别
  - is_limit:bool,日志数量限制，默认True为10000条
  - filename:str，重定向日志文件路径(仅研究平台有效)
- 🔧作用：

  - set_log_level函数用来设置log输出级别,log打印一般有三种log.info()、log.warn()、log.error(),优先级排序为：error>warn>info
- ❗注意事项：

  - 该函数不仅可以在 `init(context)`函数下设置,也可以在 `handle_bar(context, bar_dict)`函数下设置
  - 当log.error()打印数据时,整个回测就会停止,类似一个报错终止机制
- 📝示例：

  ```python
  def init(context):
      #设置日志级别:warn
      set_log_level(level='warn')
  ```

---

## 设置回测成交机制：set_execution

- 👑调用方法：
  `set_execution(str)`
- 📚参数说明：

  - str:撮合成交机制，可选'close','next_open'
    - 'close':当前bar收盘价撮合
    - 'next_open':下一个bar开盘价撮合
- 🔧作用：

  - set_execution函数用来设置回测成交机制, 不同的设置会采用不同的价格进行撮合成交(只在分钟回测中有效，默认next_open)
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 该函数的str参数, 必须输入字符串, 且只能输入一个，例如: `set_execution('next_open')`
  - 如果整个策略没有该函数, 则默认策略采用next_open模式进行回测
- 📝示例：

```python
def init(context):
    #初始化策略时设置撮合机制为下一个bar的open
    set_execution('next_open')
```

---

## 调整handle_bar运行时间：enable_open_bar

- 👑调用方法：
  `enable_open_bar()`
- 🔧作用：

  - 该函数在init调用，功能为在股票日级回测中，handle_bar执行时间调整为9:30；在分钟级回测中，handle_bar在9:30增加一次运行
- 📝示例：

  ```python
  # 股票策略模版
  # 初始化函数,全局只运行一次
  def init(context):
      enable_open_bar()

  #每日开盘前9:00被调用一次,用于储存自定义参数、全局变量,执行盘前选股等
  def before_trading(context):
      pass

  ## 开盘时运行函数
  def handle_bar(context, bar_dict):
      order("300033.SZ", 100)

  ## 收盘后运行函数,用于储存自定义参数、全局变量,执行盘后选股等
  def after_trading(context):
      pass
  ```

---

## 定义列式计算的信号名以及计算方式：reg_signal

- 👑调用方法：
  `reg_signal(name,func)`
- 📚参数说明：

  - name:指标计算名称
  - func:指标的计算方式,定义方式为 `def func(data):`,data代表订阅的tick数据,格式为pd.DataFrame,返回值为一个索引与data对齐的pd.Series
- 🔧作用：

  - 定义列式计算的信号名以及计算方式
  -
- ❗注意事项：

  - 若订阅了多只股票，则对每只股票分别进行计算
  - 需要与get_signal配合使用
- 📝示例：

```python
#定义一个名为’big’的信号，算法为tick数据大于10等于True，否则等于False.
def init(context):
    reg_signal('big',get_big)

def get_big(data):
    return data[‘current’]>10
```

---

## 设置某一品种的保证金比例：set_margin_rate

- 👑调用方法：
  `set_margin_rate(symbol,long_value,short_value)`
- 📚参数说明：

  - symbol:标的代码
  - long_value:做多保证金比例
  - short_value:做空保证金比例
- 🔧作用：
- 该函数用于设置某一品种的保证金比例
- 📝示例：

  ```python
  # 设置螺纹钢的保证金比例为9%
  def init(context):
      set_margin_rate('RB',0.09,0.09)
  ```

---

## 设置期权手续费：set_option_commission

- 👑调用方法：
  `set_option_commission(cost)`
- 📚参数说明：

  - cost:单张期权合约的手续费(元)
- 🔧作用：

  - 该函数设置期权手续费（元/单张10000份），默认为5元
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
- 📝示例：

  ```python
  # 设置期权手续费为10元/张
  def init(context):
      set_option_commission(10)
  ```

---

## 设置期权交易滑点：set_option_slippage

- 👑调用方法：
  `set_option_slippage(rate)`
- 📚参数说明：

  - rate:设置的期权交易浮动滑点比例
- 🔧作用：

  - 该函数设置期权交易滑点, 其不影响策略的运行，默认为0.001
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
- 📝示例：

  ```python
  # 设置期权交易滑点为双边0.004(单边0.002)
  def init(context):
      set_option_slippage(0.004)
  ```

---

## 设置场外基金申购折扣率：set_discount_rate

- 👑调用方法：
  `set_discount_rate(rate)`
- 📚参数说明：

  - rate:基金申购折扣率，在0到1之间，默认为0.1
- 🔧作用：

  - 该函数设置场外基金申购折扣率
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
- 📝示例：

  ```python
  def init(context):
      # 初始化策略时设置折扣率10%
      set_discount_rate(0.1)
  ```

---

## 设置场外基金申购折扣率：set_dividend_mode

- 👑调用方法：
  `set_dividend_mode(mode)`
- 📚参数说明：

  - mode:基金分红处理模式，可选 `cash`/`invest`
    - `cash`:现金分红
    - `invest`:红利再投资
- 🔧作用：

  - 该函数设置场外基金申购折扣率
- ❗注意事项：

  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果未设置，系统默认为红利再投资
- 📝示例：

  ```python
  def init(context):
      #初始化策略时设置分红模式为红利再投资
      set_dividend_mode(invest)
  ```

---

<!--

#### 设置中国银行”双向宝“合约交易的保证金比例：set_margin_rate_fx

- 👑调用方法：
  `set_margin_rate_fx(rate)`
- 📚参数说明：
  
  - rate:中国银行"双向宝"合约保证金比例(%),默认100%
- 🔧作用：
  
  - 此函数函数用于设置中国银行”双向宝“合约交易的保证金比例
- ❗注意事项：
  
  - 此函数须在 `init(context)`函数下设置，否则无效
  - 如未进行此设置，则按银行规定的交易保证金比例执行
- 📝示例：
  
  ```python
  #设置双向宝合约保证金比例设为50%
  def init(context):
      set_margin_rate_fx(rate=50)
  ```

---

#### 设置"双向宝"交易手续费：set_commission_fx

- 👑调用方法：
  `set_commission_fx(cal_style)`
- 📚参数说明：
  
  - cal_style:PerShare或PerTrade对象
    - PerShare：**比例交易手续费**，例如 `PerTrade(cost=0.0002)`，表示手续费为交易额的0.02%
    - PerTrade：**固定交易手续费**，例如 `PerTrade(cost=5.0)`，表示每笔交易手续费5元
- 🔧作用：
  
  - set_commission_fx函数用来设置"双向宝"交易手续费，其不影响策略的运行
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果整个双向宝策略没有该函数, 则默认交易手续费为0
- 📝示例：
  
  ```python
  def init(context):
      #初始化策略时设置双向宝交易手续费为交易额的0.02%
      set_commission_fx(PerShare(cost=0.0002))
  ```

---

#### 设置最大成交比例：set_volume_limit_fx

- 👑调用方法：
  `set_volume_limit_fx(volume_percent)`
- 📚参数说明：
  
  - volume_percent:最大成交量比例，如果set_volume_limit_fx(0.25), 则意味着若下单数量超过当前时间周期内的历史真实成交量的25%, 则全部不成交
- 🔧作用：
  
  - 该函数用来设置最大成交比例, 若下单数量超过当前时间周期的历史真实成交量一定比例, 则全部不成交
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果策略没有该函数，则默认回测中下单量不能超过当前时间周期的历史真实成交量的25%, 策略模拟交易中不能超过前一时间周期的历史真实成交量的25%
- 📝示例：
  
  ```python
  def init(context):
      #设置"双向宝"最大成交比例25%
      set_volume_limit_fx(0.25)
  ```

---

#### 设置滑点：set_spread（不推荐使用）

- 👑调用方法：
  `set_spread(dif)`
- 📚参数说明：
  
  - dif:买卖价差比例(滑点)，如果set_sread(0.004), 则意味买入价为行情均价 * 1.002, 卖出价为行情均价 * 0.998
- 🔧作用：
  
  - 设置滑点（不推荐使用）
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果策略没有该函数，则默认买入价为行情均价 * 1.002, 卖出价为行情均价 * 0.998
- 📝示例：
  
  ```python
  def init(context):
      #设置买卖价差比例为千分之五
      set_spread(0.005)
  ```

---

#### 风险度阈值设置函数：set_risk_border_fx

- 👑调用方法：
  `set_risk_border_fx(risk_border)`
- 📚参数说明：
  
  - risk_border:风险度阈值，例如set_risk_border_fx(1.4)表示风险度超过140%时将会不允许开新仓, 默认值为1.4
- 🔧作用：
  
  - 该函数是风险度阈值设置函数, 通过保证金占比判断能否开新仓
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 若用户未使用该函数, 则默认风险度上限为140%
- 📝示例：
  
  ```python
  def init(context):
      #设置风险度上限为150%
      set_risk_border_fx(1.5)
  ```

---

#### 设置贵金属T+D合约的保证金比例：set_margin_rate_td

- 👑调用方法：
  `set_margin_rate_fx(autd=8.4, mautd=8.4, agtd=9.8)`
- 📚参数说明：
  
  - autd:Au(T+D)的保证金比例(%),默认8.4(%)
  - mautd:	mAu(T+D)的保证金比例(%),默认8.4(%)
  - agtd:Ag(T+D)的保证金比例(%),默认9.8(%)
- 🔧作用：
  
  - 用来设置贵金属T+D合约的保证金比例, 该函数的默认参数为中国银行的规定保证金比例
- ❗注意事项：
  
  - 此函数须在 `init(context)`函数下设置，否则无效
  - 如未进行此设置，则按银行规定的交易保证金比例执行
- 📝示例：
  
  ```python
  def init(context):
      #设置Au(T+D)合约保证金比例设为9.8%
      #mAu(T+D)合约保证金比例设为9.8%
      #Ag(T+D)合约保证金比例设为12.6%
      set_margin_rate_td(autd=9.8, mautd=9.8, agtd=12.6)
  ```

---

#### 设置T+D合约交易手续费：set_commission_td

- 👑调用方法：
  `set_commission_td(cal_style)`
- 📚参数说明：
  
  - cal_style:PerShare或PerTrade对象
    - PerShare：**比例交易手续费**，例如 `PerTrade(cost=0.0002)`，表示手续费为交易额的0.02%
    - PerTrade：**固定交易手续费**，例如 `PerTrade(cost=5.0)`，表示每笔交易手续费5元
- 🔧作用：
  
  - 此函数用来设置T+D合约交易手续费，其不影响策略的运行
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果整个策略没有该函数, 则默认交易手续费为交易额的0.02%
- 📝示例：
  
  ```python
  def init(context):
      #初始化策略时设置T+D合约交易手续费为交易额的0.02%
      set_commission_td(PerShare(cost=0.0002))
  ```

---

#### 设置最大成交比例：set_volume_limit_td

- 👑调用方法：
  `set_volume_limit_td(volume_percent)`
- 📚参数说明：
  
  - volume_percent:最大成交量比例，如果set_volume_limit_td(0.25), 则意味着若下单数量超过当前时间周期内的历史真实成交量的25%, 则全部不成交
- 🔧作用：
  
  - 该函数用来设置最大成交比例, 若下单数量超过当前时间周期的历史真实成交量一定比例, 则全部不成交
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果策略没有该函数，则默认回测中下单量不能超过当前时间周期的历史真实成交量的25%, 策略模拟交易中不能超过前一时间周期的历史真实成交量的25%
- 📝示例：
  
  ```python
  def init(context):
      #设置T+D合约回测最大成交比例25%
      set_volume_limit_td(0.25)
  ```

---

#### 设置T+D合约交易滑点：set_slippage_td

- 👑调用方法：
  `set_slippage_td(slippage)`
  
  - slippage:PriceSlippage或FixedSlippage对象
    - PriceSlippage：**可变滑点对象**，例如PriceSlippage(0.1)，表示买入价为实际价格乘1.05，卖出价为实际价格乘0.95
    - FixedSlippage：**固定滑点对象**，例如FixedSlippage(10)，表示买入价为实际价格加5，卖出价为实际价格减5
- 🔧作用：
  
  - 该函数用来设置T+D合约交易滑点，其不影响策略的运行
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 如果整个策略没有该函数，则默认无滑点
- 📝示例：
  
  ```python
  def init(context):
      #设置可变滑点2%
      set_slippage_td(PriceSlippage(0.02))
  ```

---

#### 风险度阈值设置函数：set_risk_border_td

- 👑调用方法：
  `set_risk_border_td(risk_border)`
- 📚参数说明：
  
  - risk_border:风险度阈值，例如set_risk_border_td(1.4)表示风险度超过140%时将会不允许开新仓, 默认值为1.4
- 🔧作用：
  
  - 该函数是风险度阈值设置函数, 通过保证金占比判断能否开新仓
- ❗注意事项：
  
  - 该函数必须在 `init(context)`函数下设置, 否则无效
  - 若用户未使用该函数, 则默认风险度上限为140%
- 📝示例：
  
  ```python
  def init(context):
      #设置风险度上限为150%
      set_risk_border_td(1.5)
  ```
---
-->
