---
title: "组合优化器"
---

# 组合优化器
## 构造组合优化

### 初始化组合优化器

* 👑调用方法：
  
  ```python
  OptimizePort(stock_return, trade_date, return_expect, opt_focus='UI', benchmark='000905.SH', loss_aversion=0.5, cost=0.003, period='d', holds=0, long_short='long-only')
  ```
* 📚参数说明：
  
  * stock\_return：股票预期收益率，支持pd.Series或dict格式
    * pd.Series格式：index表示股票代码，values为预期收益率
    * dict格式：key表示股票代码，value为预期收益率
  * trade\_date：str，表示优化日期，例如'2022-12-14'
  * return\_expect： bool，预期收益计算方式
    * `return_expect = True`：采用个股历史平均值作为预期收益率
    * `return_expect = False`：按stock\_return作为预期收益率
  * opt\_focus：str,优化方式
    * `opt_focus='UI'`：效用最大化，默认
    * `opt_focus='IR'`：为最大信息比率
    * `opt_focus='MVO'`：为夏普比率
  * benchmark：str，基准指数，目前仅支持'000905.SH' (默认)，'000300.SH' 、 '000016.SH' 、'000906.SH'、'000010.SH' 、'000001.SH'
  * loss\_aversion：float，风险厌恶系数，默认为0.5
  * cost：float，交易成本，默认为0.003
  * period：str，调仓周期
    * `period='d'`：按天调仓
    * `period='w'`：按周调仓
    * `period='m'`：按月调仓
  * holds:当前持仓权重，支持pd.Series或dict格式
    * pd.Series格式：index表示股票代码，values为持仓权重
    * dict格式：key表示股票代码，value为持仓权重
    * int(0)：代表没有持仓(默认)
  * long_short：str，表示是否做空
    * `long_short='long-only'`：只能做多
    * `long_short='short-long'`：可以做多也可以做空
* 🔧作用：
  
  * 用来构造组合优化器
* ❗注意事项：
  
  * 该函数在策略框架函数之外执行
  * 性能分析结果再日志的最后部分显示
  * func\_list参数如果不填写，则默认为分析所有函数

### 添加约束条件

- 👑调用方法：

```python
opt.add_constraint(con_type, args=())
```

- 📚参数说明：
  
  * stock\_return：str，约束类型
    
    * `stock_return='turnover_target'`：换手率约束
    * `stock_return='tracking_error'`：跟踪误差约束
    * `stock_return='port_risk'`：组合风险约束
    * `stock_return='stock_weight'`：个股权重约束
    * `stock_return='special_style'`：风格因子暴露度约束
    * `stock_return='industry'`：行业因子暴露度约束
  * args：不同约束类型传的参数不同
    
    * `stock_return='turnover_target'`：输入tuple(换手率上限，换手率下限)，默认为(0.0, 100.0)，100表示100%
    * `stock_return='tracking_error'`：输入tuple(跟踪误差下限，跟踪误差上限)，默认为(0.0, inf)
    * `stock_return='port_risk'`：输入tuple(组合风险下限，组合风险上限)。默认为(0.0, inf)
    * `stock_return='stock_weight'`：输入pd.Series或dict. key为股票代码，value为权重
    * `stock_return='special_style'`：输入dict，且key为因子名，value为list: [暴露度下限，暴露度上限]，该约束没有默认值，必须传参数，例如{'size':[0,0.5]}
    * `stock_return='industry'`：输入str或dict. 当为str且为'industry_neutralize'时所有行业下限为0，上限为0.1;否则key为行业代码，value为list:[暴露度下限，暴露度上限]，该约束没有默认值，必须传参数，例如{'ci4000000':[0.0, 0.5]}

🔧作用：

* 通过约束类型来添加约束条件

❗注意事项：

* 可同时添加多种约束

### 组合优化器应用示例

```python
# 从中证500中随机选取50股票，模拟中证500走势，周频调仓
# Stratified Sampling 方法优点：
#1.当指数标的过多时，完全复制的资金量要求较高
#2.指数标的中很多股票的成交量过小，交易成本较高，甚至无法完全复制中证500标的成分股权重
import random
def init(context):
    # 设置基准收益：中证500指数
    set_benchmark('000905.SH')
    # 打印日志
    log.info('策略开始运行,初始化函数全局只运行一次')
    # 设置股票每笔交易的手续费为万分之二(手续费在买卖成交后扣除,不包括税费,税费在卖出成交后扣除)
    set_commission(PerShare(type='stock',cost=0.0002))
    # 设置股票交易滑点0.5%,表示买入价为实际价格乘1.005,卖出价为实际价格乘0.995
    set_slippage(PriceSlippage(0.002))
    # 设置日级最大成交比例25%,分钟级最大成交比例50%
    # 日频运行时，下单数量超过当天真实成交量25%,则全部不成交
    # 分钟频运行时，下单数量超过当前分钟真实成交量50%,则全部不成交
    set_volume_limit(0.25,0.5)
    # 从中证500中随机选取50股票
    stocks=random.sample(list(get_index_stocks('000905.SH','2017-12-21')), 50)
    #构建股票列表，形式为dict，以便后续使用组合优化器
    context.security={ia:0 for ia in stocks} 
    #构建初始股票权重
    context.hold={ia:0 for ia in stocks}
    #股票权重限制
    context.weight={ia :[0.0,100.0] for ia in stocks}
    #周频调仓
    run_weekly(func=optmize, date_rule=1, reference_security='000001.SZ')

def optmize(context, bar_dict):
    time=get_datetime().strftime('%Y%m%d')
    #构造组合优化器，优化目标设置为最大化效用，使用历史收益率作为预期收益率
    opt=OptimizePort(context.security, '2017-12-21', True, opt_focus='UI', benchmark='000905.SH', period='w', holds=context.hold, long_short='long-only')
    opt.add_constraint('stock_weight',context.weight)
    #添加跟踪误差约束
    opt.add_constraint('tracking_error',(-0.02,0.02))
    # opt.add_constraint('industry','industry_neutralize')
    #使用组合优化器进行求解
    stock_weight = opt.optimized_weight()
    #根据组合优化器结果进行权重调整
    for ia in stock_weight.keys():
        order_target_percent(ia, stock_weight[ia]/100)
```
