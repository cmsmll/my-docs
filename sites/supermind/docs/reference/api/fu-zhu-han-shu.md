---
title: "辅助函数"
---

# 辅助函数
## 日志函数：log

- 👑调用方法：

  ```python
  log.info(content)
  log.warn(content)
  log.error(content)
  ```
- 📚参数说明：

  - content：需要打印输出的日志内容，可以是字符串，也可以是某个对象
- 🔧作用：

  - log.info，log.warn，log.error是三种不同级别的打印函数,级别排序(先后)：error>warn>info
- ❗注意事项：

  - log.error是一个打印输出结果函数,当该函数执行后,整个策略会终止回测运行
  - 需要将日志另存为文件持久化的话可以通过set_log_level函数进行设置
  - 研究环境中同样可以使用
- 📝示例：

  ```python
  def init(context):
      pass

  def handle_bar(context,bar_dict):
      # 获得当前Bar时间
      time =get_datetime()
      log.info('目前Bar时间:'+str(time))
  ```

## 画图函数：record

- 👑调用方法：

  ```python
  record(**kwargs)
  ```
- 📚参数说明：

  可变参数：key为曲线名称，value为当前日期下曲线对应的值
- 🔧作用：

  - 画图函数，根据策略需求，自定义画图
- ❗注意事项：

  - 该函数可以画出多条key线图走势，也可以是一条
- 📝示例：

  ```python
  #画出平安银行的5.10.20日均线走势图.
  def init(context):
      pass

  def handle_bar(context,bar_dict):
      value = history('000001.SZ', ['close'], 20, '1d', True, fq='pre')
      MA5=value['close'].iloc[-5:].mean()
      MA10=value['close'].iloc[-10:].mean()
      MA20=value['close'].iloc[-20:].mean()
      record(MA5=MA5, MA10=MA10,MA20=MA20)
  ```

## 性能分析函数：enable_profile

- 👑调用方法：

  ```python
  enable_profile(func_list)
  ```
- 📚参数说明：

  - func_list：所需分析函数的名称,一般根据实际需求填写需要分析的函数名,不填默认分析所有函数
- 🔧作用：

  - 性能分析函数,获取策略中各个函数的运行时间
- ❗注意事项：

  - 该函数在策略框架函数之外执行
  - 性能分析结果再日志的最后部分显示
  - func_list参数如果不填写，则默认为分析所有函数
- 📝示例：

```python
#将初始双均线策略进行函数性能分析.
#初始化账户
def init(context):
    context.security = '600519.SH'

def handle_bar(context,bar_dict):
    close = history(context.security, ['close'], 20, '1d')
    MA5 = close.values[-5:].mean()
    MA20 = close.values.mean()
    if MA5 > MA20:
        order_target_percent(context.security,1)
    if MA5 < MA20:
        order_target(context.security,0)

enable_profile()
```
