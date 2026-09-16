---
title: "6. API调用"
---

# 6. API调用
需要先导入模块`api = get_shared_api('factorsrl.api')`

## 计算：get_formula_value

- 👑调用方法：

  ```
  get_formula_value(formula, symbols, start_date, end_date)
  ```
- 🔧作用：

  - 计算表达式
- 📚参数说明：

  - `formula`: `str`，表达式
  - `symbols`: `list[str]`，股票代码列表
  - `start_date`: `str`，开始时间
  - `end_date`: `str`，结束时间
- 🔢返回值说明

  - `pd.DataFrame`，index为日期，column为股票代码`
- 📝示例：

  - 调用

    ```
    api = get_shared_api('factorsrl.api')
    api.get_formula_value('DeltaRatio($open, 5)', ['000001.SZ'], '20250101', '20250110')
    ```
  - 返回值

    ```
    000001.SZ
    2025-01-02	-0.010961
    2025-01-03	-0.040268
    2025-01-06	-0.041279
    2025-01-07	-0.030558
    2025-01-08	-0.036044
    2025-01-09	-0.019606
    ```

## 回测：formula_backtest

- 👑调用方法：

  ```
  formula_backtest(start_date: str, end_date: str, formula: str, index: str = '000300.SH')
  ```
- 🔧作用：

  - 计算表达式
- 📚参数说明：

  - `start_date`: `str`，开始时间
  - `end_date`: `str`，结束时间
  - `formula`: `str`，表达式
  - `index`: `str`，回测股票池
- 🔢返回值说明

  - `dict`，回测结果
- 📝示例：

  - 调用

    ```
    api = get_shared_api('factorsrl.api')
    api.formula_backtest("20240101", "20250101", "DeltaRatio($close, 3)", "000300.SH")
    ```
  - 返回值

    ```
    {'png': '',
     'ic': 0.00610627606511116,
     'ric': 0.003960831556469202,
     'ic_ir': 0.02874748408794403,
     'ric_ir': 0.017184071242809296,
     'long_return': -0.0001597835507709533,
     'long_info_ratio': -0.006641531828790903,
     'long_cum_return': -0.038667596876621246,
     'long_max_drawdown': -0.282393217086792,
     'ls_return': -0.0006236198241822422,
     'ls_info_ratio': -0.03399030119180679,
     'ls_cum_return': -0.15091603994369507,
     'ls_max_drawdown': -0.4293464124202728}
    ```
