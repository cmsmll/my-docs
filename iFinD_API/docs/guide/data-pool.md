---
title: 8、专题报表函数
---

# 8、专题报表函数

## URL

```text
https://quantapi.51ifind.com/api/v1/data_pool
```

## formData

报表过多，推荐使用超级命令查看生成命令。

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `reportname` | 是 |  | "reportname":"p03341" |
| `functionpara` | 是 | key-value的参数，key按照过去的指标名称 | 见下方代码块 |
| `outputpara` | 是 | 半角逗号分隔的Y/N来控制是否显示该字段 | "outputpara":"date:Y,thscode:Y,security_name:Y,weight:Y" |

## 示例

```python
para = {
    "reportname": "p03341",
    "functionpara": {
        "sdate": "20210421",
        "edate": "20211119",
        "xmzt": "全部",
        "jcsslx": "全部",
        "jys": "全部"
    },
    "outputpara": "p03341_f001:Y,p03341_f002:Y"
}
```

提取‘REITs项目一览’ 报表函数数据，对应报表编码‘p03341’

## 输出

| 字段 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `tables` | 结构体 | 返回内容包括p03341_f001、p03341_f002 （具体的数据内容）等 |
| `datatype` | 指标格式 | 报表函数暂为空，忽略 |
| `inputParams` | 输入参数 | 报表函数暂为空，忽略 |
| `outParams` | 输出指标 | 返回报表指标与中文名称，如：'p03291_f002': '同花顺代码' |
| `descrs` | 输出信息 | 如：'name': 'p03291_f001', 'type': 'DT_DATE', 'attrs': [] |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
