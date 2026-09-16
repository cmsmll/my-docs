---
title: 12、基金实时估值(日)
---

# 12、基金实时估值(日)

## URL

```text
https://quantapi.51ifind.com/api/v1/final_fund_valuation
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"000001.OF,000003.OF" |
| `functionpara` | 是 | key-value的参数，包括开始日期beginDate ，截止日期endDate | 见下方示例 |
| `outputpara` | 是 | 半角逗号分隔的Y/N来控制是否显示该字段 | "finalValuation:Y,netAssetValue:Y,deviation:Y" |

## outputpara说明

| 字段名称 | 字段中文 |
| --- | --- |
| `finalValuation` | 日最终估值 |
| `netAssetValue` | 日实际净值 |
| `deviation` | 估值相对净值偏差率（%） |

## 示例

```python
para = {
    "codes": "000001.OF,000003.OF",
    "functionpara": {
        "beginDate": "2021-06-01",
        "endDate": "2021-09-02"
    },
    "outputpara": "finalValuation:Y,netAssetValue:Y,deviation:Y"
}
```
