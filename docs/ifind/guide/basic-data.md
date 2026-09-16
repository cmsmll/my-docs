---
title: 1、基础数据
---

# 1、基础数据

## URL

```text
https://quantapi.51ifind.com/api/v1/basic_data_service
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"300033.SZ,600030.SH" |
| `indipara` | 是 | 各个指标及其相关参数，indicator代表指标英文名，indiparams代表该指标的用户层的参数，otherparams代表用户无需知晓但传输给服务端所需的其他参数。otherparams中sys用来标记服务端所需的name中为True的参数。推荐使用超级命令生成。 | 见下方代码块 |

## 示例

```python
para = {
    "codes": "300033.SZ,600030.SH",
    "indipara": [
        {
            "indicator": "ths_roe_stock",
            "indiparams": ["20241231"]
        },
        {
            "indicator": "ths_roe_avg_by_ths_stock",
            "indiparams": ["20241231"]
        }
    ]
}
```

该示例表示提取同花顺和中信证券在2024年年报的净资产收益率ROE;净资产收益率ROE(平均,同花顺计算)

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
