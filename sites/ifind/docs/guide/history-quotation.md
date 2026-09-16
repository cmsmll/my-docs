---
title: 3、历史行情
---

# 3、历史行情

## URL

```text
https://quantapi.51ifind.com/api/v1/cmd_history_quotation
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"300033.SZ,600030.SH" |
| `indicators` | 是 | 半角逗号分隔的所有指标 | "indicators":"preClose,open" |
| `functionpara` | 否 | key-value格式。所有key均取默认时，functionpara省略。 | 见下方说明 |
| `startdate` | 是 | 开始日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种日期格式 | "startdate":"2018-01-01" |
| `enddate` | 是 | 结束日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种日期格式 | "enddate":"2018-01-01" |

## indicators参数说明

| 指标名 | 指标说明 | 指标备注 |
| --- | --- | --- |
| `preClose` | 前收盘价 |  |
| `open` | 开盘价 |  |
| `high` | 最高价 |  |
| `low` | 最低价 |  |
| `close` | 收盘价 |  |
| `avgPrice` | 均价 |  |
| `change` | 涨跌 |  |
| `changeRatio` | 涨跌幅 |  |
| `volume` | 成交量 |  |
| `amount` | 成交额 |  |
| `turnoverRatio` | 换手率 |  |
| `transactionAmount` | 成交笔数 |  |
| `totalShares` | 总股本 |  |
| `totalCapital` | 总市值 |  |
| `floatSharesOfAShares` | A股流通股本 |  |
| `floatSharesOfBShares` | B股流通股本 |  |
| `floatCapitalOfAShares` | A股流通市值 |  |
| `floatCapitalOfBShares` | B股流通市值 |  |
| `pe_ttm` | 市盈率（TTM ） |  |
| pe | PE市盈率 |  |
| pb | PB市净率 |  |
| ps | PS市销率 |  |
| `pcf` | PCF市现率 |  |
| `ths_trading_status_stock` | 交易状态 |  |
| `ths_up_and_down_status_stock` | 涨跌停状态 |  |
| `ths_af_stock` | 复权因子 |  |
| `ths_vol_after_trading_stock` | 盘后成交量 |  |
| `ths_trans_num_after_trading_stock` | 盘后成交笔数 |  |
| `ths_amt_after_trading_stock` | 盘后成交额 |  |
| `ths_vaild_turnover_stock` | 有效换手率 |  |
| `netAssetValue` | 单位净值 | 基金专用 |
| `adjustedNAV` | 复权单位净值 | 基金专用 |
| `accumulatedNAV` | 累计单位净值 | 基金专用 |
| `premium` | 贴水 | 基金专用 |
| `premiumRatio` | 贴水率 | 基金专用 |
| `estimatedPosition` | 估算仓位 | 基金专用 |
| `floatCapital` | 流通市值 | 指数专用 |
| `pe_ttm_index` | PE(TTM) | 指数专用 |
| `pb_mrq` | PB(MRQ) | 指数专用 |
| `pe_indexPublisher` | PE(指数发布方） | 指数专用 |
| `yieldMaturity` | 到期收益率 | 债券专用 |
| `remainingTerm` | 剩余期限 | 债券专用 |
| `maxwellDuration` | 麦氏久期 | 债券专用 |
| `modifiedDuration` | 修正久期 | 债券专用 |
| `convexity` | 凸性 | 债券专用 |
| `close_2330` | 收盘价（23 ：30 ） | 外汇交易中心专用 |
| `openInterest` | 持仓量 | 期权专用 |
| `positionChange` | 持仓变动 | 期权专用 |
| `preSettlement` | 前结算价 | 期货专用 |
| `settlement` | 结算价 | 期货专用 |
| `change_settlement` | 涨跌（结算价） | 期货专用 |
| `chg_settlement` | 涨跌幅（结算价） | 期货专用 |
| `openInterest` | 持仓量 | 期货专用 |
| `positionChange` | 持仓变动 | 期货专用 |
| `amplitude` | 振幅 | 期货专用 |

## functionpara参数说明

| 名称 | keys | value说明 | 省略时逻辑 |
| --- | --- | --- | --- |
| 时间周期 | `Interval` | D-日W-周M-月Q-季S-半年Y-年同抽样周期二选一，返回周期汇总统计值 | D-日 |
| 抽样周期 | `SampleInterval` | D-日W-周M-月Q-季S-半年Y-年同时间周期二选一，返回周期最后一个交易日日频数据 | D-日 |
| 复权方式 | `CPS` | 1-不复权2-前复权（分红再投）3-后复权（分红再投）4-全流通前复权（分红再投）5-全流通后复权（分红再投）6-前复权（现金分红）7-后复权（现金分红） | 1-不复权 |
| 报价类型 | `PriceType` | 1-全价2-净价仅债券生效 | 1-全价 |
| 非交易间隔处理 | `Fill` | Previous-沿用之前数据Blank-空值具体数值-自定义数值Omit-缺省值 | Previous-沿用之前数据 |
| 设定复权基点 | `BaseDate` | 复权基点日期，"YYYY-MM-DD" | 后复权按上市日，前复权按最新日 |
| 货币 | `Currency` | MHB-美元GHB-港元RMB-人民币YSHB-原始货币 | YSHB-原始货币 |

## 示例

```python
para = {
    "codes": "300033.SZ,600030.SH",
    "indicators": "open,close,volume",
    "startdate": "2024-08-25",
    "enddate": "2025-08-25",
    "functionpara": {
        "Interval": "W",
        "CPS": "3",
        "Currency": "RMB",
        "Fill": "Blank"
    }
}
```

该示例表示提取同花顺和中信证券在20240825-20250825年周频率的开盘价、收盘价、成交量后复权分红再投数据

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
