---
title: 7、经济数据库(EDB)
---

# 7、经济数据库(EDB)

## URL

```text
https://quantapi.51ifind.com/api/v1/edb_service
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `indicators` | 是 | 半角逗号分隔的所有指标，宏观指标过多，推荐使用Windows超级命令生成。 | "indicators":"M001620326,M002822183" |
| `functionpara` | 否 | key-value格式,省略时不进行更新时间筛选。两个时间控件更新起始时间（startrtime ）和更新结束时间（endrtime ），不勾选时省略 | 见下方代码块 |
| `startdate` | 是 | 开始日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种时间格式 | "startdate":"2018-01-01" |
| `enddate` | 是 | 结束日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种日期格式 | "enddate":"2018-01-01" |

## 示例

```python
para = {
    "indicators": "M001620326,M002822183",
    "startdate": "2018-01-01",
    "enddate": "2018-01-01",
    "functionpara": {
        "startrtime": "2018-01-01 09:15:00",
        "endrtime": "2018-01-01 10:15:00"
    }
}
```

## 输出

| 字段 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `tables` | 结构体 | 返回内容包括ID、time 等 |
| `datatype` | 指标格式 | 返回获取数据的指标格式 |
| `inputParams` | 输入参数 | 返回输入的参数 |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
