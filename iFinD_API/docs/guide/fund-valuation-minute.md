---
title: 11、基金实时估值(分钟)
---

# 11、基金实时估值(分钟)

## URL

```text
https://quantapi.51ifind.com/api/v1/fund_valuation
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"000001.OF,000003.OF" |
| `functionpara` | 是 | key-value的参数 | 见下方表格 |
| `outputpara` | 是 | 半角逗号分隔的Y/N来控制是否显示该字段 | "changeRatioValuation:Y,realTimeValuation:Y,Deviation30TDays:Y" |

## functionpara参数说明

| 名称 | keys | value说明 | 省略时逻辑 |
| --- | --- | --- | --- |
| 仅返回最新估值 | `onlyLastest` | 1-仅返回最新估值0-返回时间区间估值 | 不能省略 |
| 开始时间 | `beginTime` |  | 仅返回最新估值可省略 |
| 结束时间 | `endTime` |  | 仅返回最新估值可省略 |

## outputpara说明

| 字段名称 | 字段中文 |
| --- | --- |
| `changeRatioValuation` | 估值涨跌幅 |
| `realTimeValuation` | 基金实时估值 |
| `Deviation30TDays` | 30交易日估算平均偏差（%） |
| `rank` | 请求基金最新估值涨跌幅排名 |

## 示例

```python
para = {
    "codes": "000001.OF,000003.OF",
    "functionpara": {
        "onlyLastest": "0",
        "beginTime": "2021-08-24 09:15:00",
        "endTime": "2021-08-24 15:15:00"
    },
    "outputpara": "date:Y,thscode:Y,security_name:Y,weight:Y"
}
```

## 输出

| 属性 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
| `datatype` | 指标格式 | 返回获取数据的指标格式 |
| `tables` | 结构体 | 包括基金实时估值、估值涨跌幅、30日平均偏差等 |
| `inputParams` | 输入参数 | 基金实时估值函数暂为空，忽略 |
