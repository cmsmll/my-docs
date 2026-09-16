---
title: 2、日期序列
---

# 2、日期序列

## URL

```text
https://quantapi.51ifind.com/api/v1/date_sequence
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"300033.SZ,600030.SH" |
| `functionpara` | 否 | key-value格式。所有key均取默认时，functionpara省略。 | 见下方说明 |
| `startdate` | 是 | 开始日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种日期格式 | "startdate":"2018-01-01" |
| `enddate` | 是 | 结束日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种日期格式 | "enddate":"2018-01-01" |
| `indipara` | 是 | 各个指标及其相关参数，indicator代表指标英文名，indiparams代表该指标的用户层的参数，otherparams代表用户无需知晓但传输给服务端所需的其他参数。otherparams中sys用来标记服务端所需的name中为True的参数。推荐使用Windows超级命令生成。 | 见下方代码块 |

## functionpara说明

| 名称 | keys | value说明 | 省略时逻辑 |
| --- | --- | --- | --- |
| 时间周期 | `Interval` | D-日W-周M-月Q-季S-半年Y-年 | D-日 |
| 日期类型 | `Days` | Tradedays-交易日Alldays-日历日 | Tradedays-交易日 |
| 非交易间隔处理 | `Fill` | Previous-沿用之前数据Blank-空值 | Previous-沿用之前数据 |

## 示例

```python
para = {
    "codes": "300033.SZ,600030.SH",
    "startdate": "20230101",
    "enddate": "20241231",
    "functionpara": {
        "Days": "Alldays",
        "Fill": "Blank",
        "Interval": "Y"
    },
    "indipara": [
        {
            "indicator": "ths_total_equity_atoopc_stock",
            "indiparams": ["", "100"]
        },
        {
            "indicator": "ths_regular_report_actual_dd_stock",
            "indiparams": [""]
        }
    ]
}
```

该示例表示提取同花顺和中信证券在2023-24年年报的归属于母公司所有者权益合计;定期报告实际披露日期

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
