---
title: 5、实时行情
---

# 5、实时行情

## URL

```text
https://quantapi.51ifind.com/api/v1/real_time_quotation
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"300033.SZ,600030.SH" |
| `indicators` | 是 | 半角逗号分隔的所有指标 | "indicators":"open,high" |
| `functionpara` | 否 | key-value格式。仅包含债券报价方式（pricetype ）控件失效时，不生成，否则生成。 | 见下方代码块 |

## indicators参数说明

| 指标名 | 指标说明 | 指标备注 |
| --- | --- | --- |
| `tradeDate` | 交易日期 | 通用 |
| `tradeTime` | 交易时间 | 通用 |
| `preClose` | 前收盘价 | 通用 |
| `open` | 开盘价 | 通用 |
| `high` | 最高价 | 通用 |
| `low` | 最低价 | 通用 |
| `latest` | 最新价 | 通用 |
| `avgPrice` | 均价 | 通用 |
| `change` | 涨跌 | 通用 |
| `changeRatio` | 涨跌幅 | 通用 |
| `totalShares` | 总股本 | 股票 |
| `totalCapital` | 总市值 | 股票 |
| pb | 市净率 | 股票 |
| `riseDayCount` | 连涨天数 | 股票 |
| `suspensionFlag` | 停牌标志 | 股票 |
| `tradeStatus` | 交易状态 | 股票 |
| mv | 流通市值 | 股票 |
| `vol_ratio` | 量比 | 股票 |
| `committee` | 委比 | 股票 |
| `commission_diff` | 委差 | 股票 |
| `pe_ttm` | 市盈率TTM | 股票 |
| `pbr_lf` | 市净率LF | 股票 |
| `swing` | 振幅 | 股票 |
| `lastest_price` | 最新成交价 | 股票 |
| `af_backward` | 后复权因子(分红方案计算) | 股票 |
| `priceDiff` | 买卖价差 | 港股专用 |
| `sharesPerHand` | 每手股数 | 港股专用 |
| `expiryDate` | 到期日 | 港股专用 |
| `tradeStatus` | 交易状态 | 港股专用 |
| `iopv` | IOPV (净值估值) | 基金专用 |
| `premium` | 折价 | 基金专用 |
| `riseCount` | 上涨家数 | 指数专用 |
| `fallCount` | 下跌家数 | 指数专用 |
| `upLimitCount` | 涨停家数 | 指数专用 |
| `downLimitCount` | 跌停家数 | 指数专用 |
| `suspensionCount` | 停牌家数 | 指数专用 |
| `pure_bond_value_cb` | 纯债价值 | 指数专用 |
| `surplus_term` | 剩余期限(天) | 指数专用 |
| `dealDirection` | 成交方向 | 期货期权专用 |
| `dealtype` | 成交性质 | 期货期权专用 |
| `impliedVolatility` | 隐含波动率 | 期权专用 |
| `historyVolatility` | 历史波动率 | 期权专用 |
| `delta` | `Delta` | 期权专用 |
| `gamma` | `Gamma` | 期权专用 |
| `vega` | `Vega` | 期权专用 |
| `theta` | `Theta` | 期权专用 |
| `rho` | `Rho` | 期权专用 |
| `pre_open_interest` | 前持仓量 | 期权专用 |
| `pre_implied_volatility` | 前隐含波动率 | 期权专用 |
| `volume_pcr_total` | 成交量pcr (品种) | 期权专用 |
| `volume_pcr_month` | 成交量pcr (同月) | 期权专用 |

## 示例

```python
para = {
    "codes": "300033.SZ,600000.SH",
    "indicators": "open,high"
}
```

## 输出

| 字段 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `tables` | 结构体 | 返回内容包括thscode、table （具体的数据内容）等 |
| `datatype` | 指标格式 | 返回获取数据的指标格式 |
| `inputParams` | 输入参数 | 返回输入的参数 |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
