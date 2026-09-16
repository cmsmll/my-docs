---
title: 9、组合管理
---

# 9、组合管理

## (1 ）组合新建

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 |  | "func":"newportf" |
| 组合名称 | `name` | 是 |  | "name":"股债策略组合" |
| 所属分组 | `group` | 是 |  | "group": 11580 |
| 业绩基准，基准代码和名称 | `performbm` | 否，默认填充沪深300 | 键值对 | "performbm": {"code": "000300.SH", "name": "沪深300"} |
| 跌价基准，基准代码、基准名称、基准类型 | `supbm` | 否，省略时为空 | 键值对 | "supbm": {"code":"000001.SH", "name": "上证指数", "benchmarkType": "1"} |
| 交易日 | `tday` | 否，默认国内交易所 | 枚举值国内交易所、港股、美股、国内银行间 | "tday":"国内交易所" |
| 基准货币 | `currency` | 否，默认人民币 | 枚举值CND、HKD、USD | "currency":"CNY" |
| 融资利率% | `finacrate` | 否，默认为空 |  | "finacrate":"7.5" |
| 融券利率% | `secrate` | 否，默认为空 |  | "secrate":"5.5" |
| 组合说明 | `info` | 否，默认为空 |  | "info":"股票与债券结合的策略组合" |

### 示例

```python
para = {
    "func": "newportf",
    "name": "股债联动",
    "group": 11580,
    "performbm": {
        "code": "000300.SH",
        "name": "沪深300"
    },
    "supbm": {
        "code": "",
        "name": ""
    },
    "tday": "国内交易所",
    "currency": "CNY",
    "finacrate": "",
    "secrate": "",
    "info": "股票与债券结合的策略组合"
}
```

## (2 ）组合导入

### 1). 模板导入

通过读取组合文件的内容，进行上传完成组合导入。

#### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

#### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `importf` | "func": "importf" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 组合内容 | `content` | 是 | 二维表 |  |

#### 示例

```python
para = {
    "func": "importf",
    "name": "股债策略组合",
    "portfid": 161390,
    "content": [["交易日期", "证券代码", "业务类型", "数量", "价格", "成交金额", "费用", "证券类型"], ["2020-03-30", "CNY", "现金存入", "", "", 10000000, "", ""], ["2020-04-01", "600000.SH", "买入", 100, 10.09, 1009, 5.225, "A股"]]
}
```

### 2).文件导入

通过文件对象的形式提交，来实现组合导入。

#### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `fileimport` | "func": "fileimport" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 组合文件 | `file` | 是 | 文件对象 | file:{本地文件} |

#### 示例

```python
para = {
    "func": "fileimport",
    "name": "股债策略组合",
    "portfid": 161930,
    "file": "股债策略组合内容.xlsx"
}

# file_object 为待导入组合的文件对象
files = {
    "file": ("股债策略组合内容.xlsx", open("C:\\demo\\股债策略组合内容.xlsx", "rb"))
}
```

### 3).状态查询

适用于大文件导入、导入历史持仓计算量较大的组合导入时，查询导入状态。

#### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

#### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `fileimport` | "func": "query_commit" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 组合文件 | `jobid` | 是 | 文件导入后返回 | "jobid":21 |

#### 示例

```python
para = {
    "func": "query_commit",
    "portfid": 161930,
    "jobid": 21
}
```

## (3)现金存取

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `cashacs` | "func": "cashacs" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 功能参数 | `functionpara` | 是 |  | "functionpara": {"acesscls": "101", "amount": "10000"} |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 存取类型 | `acesscls` | 存入-不计入收益：101 ；取出-不计入收益：102 | 不能省略 |
| 现金数额 | `amount` |  | 不能省略 |

### 示例

```python
para = {
    "func": "cashacs",
    "name": "bldptf5",
    "portfid": 161390,
    "functionpara": {
        "acesscls": "101",
        "amount": "10000"
    }
}
```

## (4)普通交易

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `deal` | "func": "deal" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 功能参数 | `functionpara` | 是 |  |  |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 行情代码 | `thscode` |  | 不能省略 |
| 交易方向 | `direct` | 买入：buy ；卖出：sell | 不能省略 |
| 标的名称 | `codeName` |  | 不能省略 |
| 交易市场 | `marketCode` |  | 不能省略 |
| 标的类型 | `securityType` |  | 不能省略 |
| 成交价格 | `price` |  | 不能省略 |
| 成交数量 | `volume` |  | 不能省略 |
| 结算货币 | `currency` |  | 不能省略 |
| 费用 | `fee` |  | 不能省略 |
| 费率 | `feep` |  | 不能省略 |
| 汇率 | `rate` |  | 不能省略 |
| 分红方式 | `bonus` | 适用基金，现金分红：1 ；红利再投资：2 |  |

### 示例

```python
para = {
    "func": "deal",
    "name": "股债策略组合",
    "portfid": 161390,
    "functionpara": {
        "thscode": "300033",
        "direct": "buy",
        "codeName": "同花顺",
        "marketCode": "212100",
        "securityType": "001001",
        "price": 78.7,
        "volume": 100,
        "currency": "CNY",
        "fee": "0",
        "feep": 0,
        "rate": "1.00",
        "bonus": ""
    }
}
```

## (5)交易流水

目前支持最大时间区间为7天

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `query_exchange_records` | "func": "query_exchange_records" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 指标 | `indicators` | 是 |  | "indicators": "date,code,name,dealPrice" |
| 开始时间 | `startdate` | 是 |  | "startdate": "2022-10-18" |
| 结束时间 | `enddate` | 是 |  | "enddate": "2022-10-20" |
| 功能参数 | `functionpara` | 否 |  | "functionpara": {"keyword": ""} |

### indicators说明

| 指标名称 | 英文名称 | 备注 |
| --- | --- | --- |
| 交易日期 | `date` |  |
| 证券代码 | `code` |  |
| 证券简称 | `name` |  |
| 成交价格 | `dealPrice` |  |
| 成交数量 | `dealNumber` |  |
| 发生金额 | `realPrice` |  |
| 业务名称 | `businessName` |  |
| 手续费 | `serviceCharge` |  |
| 证券类型 | `type` |  |
| 币种 | `currency` |  |
| 汇率 | `exchangeRate` |  |
| 市场 | `marketName` |  |
| 备注信息 | `importType` |  |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 关键字 | `keyword` |  | 默认为空 |

### 示例

```python
para = {
    "func": "query_exchange_records",
    "name": "股债策略组合",
    "portfid": 161390,
    "indicators": "date,code,name,dealPrice,dealNumber,realPrice,businessName,serviceCharge,type,currency,exchangeRate,marketName,importType",
    "startdate": "2022-10-18",
    "enddate": "2022-10-20",
    "functionpara": {
        "keyword": ""
    }
}
```

## (6)组合监控

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `query_overview` | "func": "query_overview" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 指标 | `indicators` | 是 |  |  |

### indicators说明

| 指标名称 | 英文名称 | 备注 |
| --- | --- | --- |
| 资产分类 | `category` |  |
| 证券代码 | `thscode` |  |
| 证券简称 | `stockName` |  |
| 最新价格 | `newPrice` |  |
| 涨跌 | `increase` |  |
| 涨跌幅 | `increseRate` |  |
| 持仓数量 | `number` |  |
| 持仓市值 | `marketValue` |  |
| 最新权重 | `weight` |  |
| 当日盈亏 | `todayProfit` |  |
| 浮动盈亏 | `floatProfit` |  |
| 浮动盈亏率 | `floatProfitRate` |  |
| 累计盈亏 | `totalProfit` |  |
| 累计盈亏率 | `totalProfitRate` |  |
| 分红派息 | `interestIncome` |  |
| 已实现盈利 | `realizedProfit` |  |
| 成本价格 | `positionPrice` |  |
| 持仓成本 | `positionCost` |  |
| 保本价格 | `breakevenPrice` |  |
| 手续费 | `serviceCharge` |  |
| 币种 | `moneyType` |  |
| 汇率 | `currentPrice` |  |
| 更新时间 | `updateTime` |  |

### 示例

```python
para = {
    "func": "query_overview",
    "name": "股债策略组合",
    "portfid": 161390,
    "indicators": "category,thscode,stockName,newPrice,increase,increaseRate,number,marketValue,weight,todayProfit,floatProfit,floatProfitRate,totalProfit,totalProfitRate,interestIncome,realizedProfit,positionPrice,positionCost,breakevenPrice,serviceCharge,moneyType,currentPrice,updateTime"
}
```

## (7)持仓分析

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `query_positions` | "func": "query_positions" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 指标 | `indicators` | 是 |  |  |
| 功能参数 | `functionpara` | 是 |  | "functionpara": {"penetrate": "false"} |

### indicators说明

| 指标名称 | 英文名称 | 备注 |
| --- | --- | --- |
| 证券类型 | `categoryName` |  |
| 证券名称 | `securityName` |  |
| 证券代码 | `thsCode` |  |
| 权重 | `weight` |  |
| 持仓市值 | `marketPrice` |  |
| 持仓成本 | `cost` |  |
| 浮动盈亏 | `wavepl` |  |
| 累计收益 | `cumpl` |  |
| 收盘价 | `price` |  |
| 涨跌幅 | `increaseRate` |  |
| 持仓数量 | `amount` |  |
| 持仓成本价 | `costPrice` |  |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 是否穿透 | `penetrate` | 不穿透：false ；穿透：true | 不能省略 |

### 示例

```python
para = {
    "func": "query_positions",
    "name": "股债策略组合",
    "portfid": 161390,
    "indicators": "categoryName,securityName,thsCode,weight,marketPrice,cost,wavepl,cumpl,price,increaseRate,amount,costPrice",
    "date": "2022-10-19",
    "functionpara": {
        "penetrate": "false"
    }
}
```

## (8)绩效指标

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `query_perform` | "func": "cashacs" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 日期 | `date` | 是 |  | 适用于当日实时，"date": "2020-06-02" ； |
| 开始日期 | `startdate` | 是 |  | 开始日期适用于区间"startdate": "2020-06-02" |
| 结束日期 | `enddate` | 是 |  | 开始日期适用于区间"enddate": "2020-06-02" |
| 业绩基准 | `performbm` | 是 |  | "performbm": "000300" |
| 功能参数 | `functionpara` | 是 |  | "functionpara": {"pfclass": "utnv", "cycle": "day"} |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 业绩类型 | `pfclass` | 业绩表现：perform 净资产：nasset 组合净值：utnv | 不能省略 |
| 周期 | `cycle` | 当日实时:rquota 日:day 周:week 月:month 半年:halfYear 年:year | 不能省略 |

### 示例

```python
para = {
    "func": "query_perform",
    "name": "股债策略组合",
    "portfid": 161390,
    "performbm": "000300",
    "startdate": "2020-06-02",
    "enddate": "2022-10-20",
    "functionpara": {
        "pfclass": "utnv",
        "cycle": "day"
    }
}
```

## (9)风险指标

### URL

```text
https://quantapi.51ifind.com/api/v1/portfolio_manage
```

### formData

| 名称 | key | 是否必须 | value | 示例 |
| --- | --- | --- | --- | --- |
| 功能名称 | `func` | 是 | `query_risk_profits` | "func": "query_risk_profits" |
| 组合名称 | `name` | 否 |  | "name": "股债策略组合" |
| 组合ID | `portfid` | 是 |  | "portfid": 161390 |
| 指标 | `indicators` | 是 |  | "indicators": ["alpha,yield,annual_yield,sharpe_ratio"] |
| 开始日期 | `startdate` | 是 |  | "startdate": "2021-10-19" |
| 结束日期 | `enddate` | 是 |  | "enddate": "2022-10-19" |
| 功能参数 | `functionpara` | 是 |  | "functionpara": {"cycle": "day", "benchmark": "000300"} |

### indicators说明

| 指标名称 | 英文名称 | 备注 |
| --- | --- | --- |
| `ALPHA` | `ALPHA` |  |
| 累计收益 | `yield` |  |
| 年化收益 | `annual_yield` |  |
| 夏普比率 | `sharpe_ratio` |  |
| 信息比率 | `information_ratio` |  |
| 索提诺比率 | `sortino_ratio` |  |
| 詹森阿尔法 | `jensen_alpha` |  |
| 特雷诺比率 | `treynor_ratio` |  |
| 胜率 | `win_ratio` |  |
| 正收益期数 | `positiveMonth` |  |
| `BETA` | `beta` |  |
| 年化波动率 | `annual_volatility` |  |
| 跟踪误差 | `tracking_error` |  |
| 下行风险 | `downside_risk` |  |
| 在险价值 | `value_at_risk` |  |
| 最大回撤 | `max_drawdown` |  |
| 最大回撤形成期 | `maxdrawdownRepairNum` |  |
| 最大回撤修复期 | `maxdownNum` |  |
| 连续下跌最大幅度 | `max_cont_decline` |  |
| R-square | `rSquare` |  |

### functionpara说明

| 名称 | key | value | 省略时 |
| --- | --- | --- | --- |
| 数据频率 | `cycle` | 日:day;周:week;月:month;季:season;年:year | 不能省略 |
| 计算基准 | `benchmark` |  | 不能省略 |

### 示例

```python
para = {
    "func": "query_risk_profits",
    "name": "股债策略组合",
    "portfid": 161390,
    "indicators": "alpha,yield,annual_yield,sharpe_ratio",
    "startdate": "2021-10-19",
    "enddate": "2022-10-19",
    "functionpara": {
        "cycle": "day",
        "benchmark": "000300"
    }
}
```
