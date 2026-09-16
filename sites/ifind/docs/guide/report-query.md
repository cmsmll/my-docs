---
title: 18、公告查询
---

# 18、公告查询

## URL

```text
https://quantapi.51ifind.com/api/v1/report_query
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码，如参数内容为空下面functionpara中mode参数板块必填 | "codes":"300033.SZ,600030.SH" |
| `functionpara` | 否 | key-value格式。所有key均取默认时，functionpara省略。 | 见下方说明 |
| `outputpara` | 是 | 输出指标 | 见下方说明 |

## functionpara说明

| 名称 | keys | value说明 | 是否可省略 | 示例 |
| --- | --- | --- | --- | --- |
| 提取方式 | `mode` | allAStock-全部A股，allBond-全部债券等按照证券板块全部代码提取 | 可 | "mode":"allAStock" |
| 公告类型 | `reportType` | 903-全部；901002004-上市公告书等 | 可 | reportType:901 |
| 公告开始日期 | `beginrDate` | 根据公告开始日期筛选 | 可 | "beginrDate": "2024-09-10" |
| 公告截止日期 | `endrDate` | 根据公告截止日期筛选 | 可 | "endrDate": "2025-09-10" |
| 发布开始时间 | `begincTime` | 根据发布时间筛选 | 可 | "begincTime":"2023-09-10 19:50:36" |
| 发布截止时间 | `endcTime` | 根据发布时间筛选 | 可 | "endcTime":"2025-09-10 20:50:36" |
| 开始seq | `beginSeq` | 根据seq筛选 | 可 | "beginSeq":"4569556291" |
| 截止seq | `endSeq` | 根据seq筛选 | 可 | "endSeq":"4679626676" |
| 标题关键词 | `keyWord` | 根据公告标题关键词筛选 | 可 | "keyWord":"半年度报告" |

## outputpara说明

| 名称 | value说明 |
| --- | --- |
| 公告日期 | `reportDate` |
| 证券代码 | `thscode` |
| 证券简称 | `secName` |
| 发布时间 | `ctime` |
| 公告标题 | `reportTitle` |
| 公告链接 | `pdfURL` |
| 唯一标号 | `seq` |

注意：用户可以通过查询到的‘pdfURL’下载公告文件。

## 示例

```python
para = {
    "codes": "300033.SZ,600000.SH",
    "functionpara": {
        "reportType": "901"
    },
    "beginrDate": "2024-09-10",
    "endrDate": "2025-09-10",
    "outputpara": "reportDate:Y,thscode:Y,secName:Y,ctime:Y,reportTitle:Y,pdfURL:Y,seq:Y"
}
```

## 输出

| 字段 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `tables` | 结构体 | 返回内容包括thscode、reportDate等outputpara选择返回的指标 |
| `datatype` | 指标格式 | 返回获取数据的指标格式，目前本函数返回为空 |
| `inputParams` | 输入参数 | 返回输入的参数，目前本函数返回为空 |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
