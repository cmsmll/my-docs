---
title: 10、智能选股
---

# 10、智能选股

## URL

```text
https://quantapi.51ifind.com/api/v1/smart_stock_picking
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `searchstring` | 是 | 搜索关键词 | "searchstring":"个股热度" |
| `searchtype` | 是 | 搜索类别 | "searchtype":"stock" |

## 示例

```python
para = {
    "searchstring": "个股热度",
    "searchtype": "stock"
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
