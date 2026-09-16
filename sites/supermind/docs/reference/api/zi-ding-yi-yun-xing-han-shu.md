---
title: "自定义运行函数"
---

# 自定义运行函数
## 每日定时运行函数：run_daily

- 👑调用方法
  ```python
  run_daily(func, time_rule='every_bar', hours=None, minutes=None, reference_security=None)
  ```
- 🔧作用
  - 用于每日定时运行指定的函数。通常在分钟级策略中，用于在特定时间点执行任务。
- 📚参数说明
  - `func`: `callable`，需要执行的函数。
  - `time_rule`: `str`，默认为`'every_bar'`时间计算规则。可选值：
    - `'after_open'`: 开盘后运行。配合`hours`和`minutes`参数设置开盘后多久运行，取值范围为1分钟至4小时。
    - `'before_close'`: 收盘前运行。配合`hours`和`minutes`参数设置收盘前多久运行，取值范围为1分钟至4小时。
    - `'every_bar'`: 每分钟都会运行。使用此规则时，`hours`和`minutes`参数会被忽略。
  - `hours`: `Optional[int]`，运行时间(小时)。与`minutes`配合使用。
  - `minutes`: `Optional[int]`，运行时间(分钟)。与`hours`配合使用。
  - `reference_security`: `Optional[str]`，参考标的，用于确定交易时间。默认为`None`。例如：
    - 股票: `'000001.SZ'`，交易时间为9:30-15:00。
    - 股指期货: `'IC1508'`，交易时间在20160101之前为9:15-15:15，之后为9:30-15:00。
    - `None`:等同于股票
- ❗注意事项
  - 如果在日频策略中使用该函数，不需要传入 `time_rule`, `hours`, `minutes`，默认在9点31分执行，实际和日频 `handle_bar`效果相同。
  - 此函数中 `reference_security`参数，如果以股票为标的，则传入任何一个股票代码都是可以的，期货同理。
  - 该函数的 `time_rule`参数，如果填写 `'every_bar'`，则不需要填写 `hours`和`minutes`两个参数，如果填写了，是无效的，不会报错，也不影响运行。
- 📝示例：
  - 在每个交易日开盘后30分钟执行一次
    ```python
    def init(context):
        # 每个交易日开盘后30分执行一次
        run_daily(func=test_day, time_rule='after_open', hours=0, minutes=30, reference_security='000856.SZ')

    def test_day(context, bar_dict):
        log.info('定时运行')
    ```

## 每周定时运行函数：run_weekly

- 👑调用方法
  ```python
  run_weekly(func, date_rule, reference_security=None)
  ```
- 🔧作用
  - 用于每周定时运行函数,在指定日的开盘时执行。
- 📚参数说明
  - `func`: `callable`，要执行的函数，通常为自定义函数，用于实现特定目标。
  - `date_rule`: `int`，时间计算规则。正数(取值范围为[1,5])表示每周的第几个交易日，负数(取值范围为[-5,-1])表示每周倒数第几个交易日。
  - `reference_security`: `Optional[str]`，参考标的，用于确定交易时间。默认为`None`
    - 若为股票代码(如'000001.SZ')，交易时间为9:30-15:00；
    - 若为股指期货代码(如'IC1508')，则交易时间分为9:15-15:15和9:30-15:00两种，并以20160101为界划分。
    - `None`：等同于股票标的。
- ❗注意事项
  - 该函数既可以用于分钟级策略，也可以用于日级策略。
  - `reference_security` 参数不填写时，自动默认为股票标的。
  - `reference_security` 参数以股票为标的时，传入任何一个有效的股票代码均可；期货同理。
  - `date_rule` 参数必须填写，取值范围为 1 至 5 或 -5 至 -1。如果大于 5，则会报错；如果小于 -5，策略会继续运行，但该函数不生效。
- 📝示例：
  - 调用
    ```python
    def init(context):
        # 每周第一个交易日执行
        run_weekly(func=test_week, date_rule=1, reference_security='000001.SZ')

    def test_week(context, bar_dict):
        log.info('定时运行')
    ```

## 每月定时运行函数：run_monthly

- 👑调用方法
  ```python
  run_monthly(func, date_rule, reference_security=None)
  ```
- 🔧作用
  - 用于每月定时运行函数，在指定日开盘时执行。
- 📚参数说明
  - `func`: `callable`，表示执行的函数，一般为自定义函数，用于实现特定目标。
  - `date_rule`: `int`，表示时间计算规则。正数(取值范围为[1,23])表示为每月的第几个交易日，负数(取值范围为[-23,-1])表示为每月倒数第几个交易日。
  - `reference_security`: `Optional[str]`，表示参考标的，用于确定交易时间。默认为`None`
    - 若为股票(如'000001.SZ')，交易时间为9:30-15:00；
    - 若为股指期货(如'IC1508')，交易时间分为9:15-15:15和9:30-15:00两种，以20160101划分。
    - `None`：等同于股票
- ❗注意事项
  - 该函数既可以用于分钟级策略，也可以用于日级策略。
  - 此函数中 `reference_security`参数不填写，则自动默认为股票标的。
  - 此函数中 `reference_security`参数，如果以股票为标的，则传入任何一个股票代码都是可以的，期货同理。
  - 该函数的 `date_rule`参数，必须填写(取值范围为1至23或-23至-1)，输入数值超出范围，则会报错。
- 📝示例：
  - 调用
    ```python
    def init(context):
        # 每月第5个交易日执行
        run_monthly(func=test_month, date_rule=5, reference_security='000001.SZ')

    def test_month(context, bar_dict):
        log.info('定时运行')
    ```
