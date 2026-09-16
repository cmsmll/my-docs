---
title: 17、证券代码证券简称转同花顺代码
---

# 17、证券代码证券简称转同花顺代码

## URL

```text
https://quantapi.51ifind.com/api/v1/get_thscode
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| seccode/secname | 是 | 行情代码/简称 | "seccode":"000001" |
| `mode` | 是 | seccode/secname | "mode":"seccode" |
| `sectype` | 是 | 证券类型 | "sectype":"001" |
| `market` | 是 | 市场 | "market":"212001" |
| `tradestatus` | 是 | 0，1，2 | "tradestatus":"0" |
| `isexact` | 是 | 0 ，1 | "isexact":"1" |

## 示例

```python
para = {
    "seccode": "300033",
    "functionpara": {
        "mode": "seccode",
        "sectype": "",
        "market": "",
        "tradestatus": "0",
        "isexact": "0"
    }
}
```
