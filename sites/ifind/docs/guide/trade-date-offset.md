---
title: 14、日期偏移函数
---

# 14、日期偏移函数

## URL

```text
https://quantapi.51ifind.com/api/v1/get_trade_dates
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `marketcode` | 是 | 见日期查询函数说明 | "marketcode":"212001" |
| `functionpara` | 是 | key-value的参数 | 见下方代码块 |
| `startdate` | 是 | 基准日期，支持"YYYYMMDD""YYYY-MM-DD""YYYY/MM/DD"三种时间格式 | "startdate":"2018-01-01" |

## functionpara说明

| 对应字段 | 字段类型 | 是否可省略 | 省略时逻辑 | 命令生成示例说明 |
| --- | --- | --- | --- | --- |
| 日期类型 | 字符串 | 不可 |  | 交易日"dateType":"0" 日历日"dateType":"1" |
| 日期格式 | 字符串 | 不可 |  | YYYY-MM-DD "dateFormat":"0" YYYY/MM/DD "dateFormat":"1" YYYYMMDD "dateFormat":"2" |
| 前推后退 | 字符串 | 不可 |  | 前推"offset":"-5" 后推"offset":"5" |
| 时间周期 | 字符串 | 不可 |  | 日"period":"D" 周"period":"W" 月"period":"M" 季"period":"Q" 半年"period":"S" 年"period":"Y" |
| 时间周期内偏移 | 字符串 | 可 | 默认 | 默认省略时间周期正数第1日"periodnum":"1" 时间周期倒数第1日"periodnum":"-1" |
| 输出选项 | 字符串 | 不可 |  | 所有日期"output":"sequencedate" 单个日期"output":"singledate" |

## 示例

```python
para = {
    "marketcode": "212001",
    "functionpara": {
        "dateType": "0",
        "period": "D",
        "offset": "-1",
        "dateFormat": "0",
        "output": "sequencedate"
    },
    "startdate": "2025-09-10"
}
```
