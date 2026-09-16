---
title: "表数据接口"
---

# 表数据接口
### 构建数据表查询对象：query

- 👑调用方法：
  
  ```
  query(*args, **kwargs)
  ```
- 🔧作用：
  
  - 构造query对象，传入需要取数的信息，支持的数据可在[SuperMind数据平台](http://quant.10jqka.com.cn/view/dataplatform)中查询
- 📚参数说明
  
  - 传入数据表对象，或数据表的个别字段
- 🔢返回值说明
  
  - `Query`，在[`run_query`](/supermind/reference/api/biao-shu-ju-jie-kou#取表数据-run-query)和[`get_fundamentals`](/supermind/reference/api/biao-shu-ju-jie-kou#取财务表数据-get-fundamentals)中使用
- 🚀️使用方法：
  
  - 取整张表
    
    ```python
    #取concept_classification表
    q = query(concept_classification)
    ```
  - 仅取某字段：有时候不需要把整张表取出，仅仅想取表中的某几个字段
    
    ```python
    #只取concept_classification表的symbol、date、concept三个字段
    q = query(
        concept_classification.symbol,#格式为：表名.字段
        concept_classification.date,
        concept_classification.concept
    )
    ```
  - filter操作：设置条件，相当于SQL中的where方法
    
    ```python
    #只取concept_classification表的symbol、date、concept三个字段，并只取同花顺2023年2月1日之后的数据
    q = query(
        concept_classification.symbol,#格式为：表名.字段
        concept_classification.date,
        concept_classification.concept
    ).filter(
        concept_classification.symbol=='300033.SZ',
        concept_classification.date>'20230201'
    )
    ```
    
    ```python
    #只取concept_classification表的symbol、date、concept三个字段，并取同花顺、贵州茅台在2023年2月1日当天的数据
    q = query(
        concept_classification.symbol,#格式为：表名.字段
        concept_classification.date,
        concept_classification.concept
    ).filter(
        concept_classification.symbol.in_(['300033.SZ','600519.SH']),
        concept_classification.date=='20230201'
    )
    ```
  - limit操作：指定查询前n行数据
    
    ```python
    #只取concept_classification表的symbol、date、concept三个字段的前10行
    q = query(
        concept_classification.symbol,#格式为：表名.字段
        concept_classification.date,
        concept_classification.concept
    ).limit(10)
    ```
  - order_by操作：指定一列数据进行排序
    
    ```python
    #只取concept_classification表的symbol、date、concept，并跟据date降序排列
    q = query(
        concept_classification.symbol,#格式为：表名.字段
        concept_classification.date,
        concept_classification.concept
    ).order_by(
        concept_classification.date.desc()
    )
    ```
- ❗注意事项：
  
  - order_by从大到小排序则使用：.desc(),从小到大排序则使用：.asc()
  - 更多详细使用方法可以参考[sqlalchemy官方文档](https://docs.sqlalchemy.org/en/20/orm/query.html)
  - 构造完query对象后需要用 `run_query`或者 `get_fundamentals`取数

### 取表数据：run_query

- 👑调用方法：
  
  ```
  run_query(query_object)
  ```
- 🔧作用：
  
  - 查询函数，可查询除财务数据表以外的所有数据表
- 📚参数说明：
  
  - `query_object`: `Query`，构造方法可参考[query](/supermind/reference/api/biao-shu-ju-jie-kou#构建数据表查询对象-query)
- 🔢返回值说明
  
  - `pd.DataFrame`，index为序号，column为`f"{表名}_{字段名称}"`
- ❗注意事项：
  
  - 财务数据表不支持使用此函数查询
  - 支持的数据可在[SuperMind数据平台](http://quant.10jqka.com.cn/view/dataplatform)中查询
- 📝示例：
  
  - 调用
    
    ```
    data = run_query(query(concept_classification).limit(5))
    ```
  - 返回值
    
    ```
    concept_classification_symbol concept_classification_date
    0                     000001.SZ                    20130221
    1                     000001.SZ                    20130225
    2                     000001.SZ                    20130227
    3                     000001.SZ                    20130304
    4                     000001.SZ                    20130306
    
    concept_classification_concept
    0                           融资融券
    1                           融资融券
    2                     融资融券,转融券标的
    3                     融资融券,转融券标的
    4                     融资融券,转融券标的
    ```

### 取财务表数据：get_fundamentals

- 👑调用方法：
  
  ```
  get_fundamentals(query_object, date=None, statDate=None, latest=False)
  ```
- 🔧作用：
  
  - 查询函数，可查询财务数据表
- 📚参数说明：
  
  - `query_object`: `Query`，构造方法可参考[query](/supermind/reference/api/biao-shu-ju-jie-kou#构建数据表查询对象-query)
  - `date`: `str`，`date`和`statDate`只能并且必须填写一个，格式'%Y%m%d'。例如：'20170808'(必须是交易日)
  - `statDate`: `str`，`date`和`statDate`只能并且必须填写一个，
    - 季报：'年+q+季度序号'，例如：'2015q1'表示2015年一季报年报：
    - 年报，例如：'2015'表示2015年年报
  - `latest`：`bool`，是否返回最新的财报，个别情况下可能存在财报修正
- 🔢返回值说明
  
  - `pd.DataFrame`，index为序号，column为`f"{表名}_{字段名称}"`
- ❗注意事项：
  
  - 此函数仅支持查询财务数据表，列表如下：
    - `valuation` - 估值指标表
    - `balance` - 资产负债表
    - `cashflow` - 现金流量表
    - `income` - 利润表
    - `operating` - 运营能力表
    - `debtrepay` - 偿还能力表
    - `profit_report` - 业绩快报
    - `profit` - 盈利能力表
    - `growth` - 成长能力表
    - `asharevalue` - 估值指标表
    - `ashareoperate` - 运营能力表
    - `asharedebt` - 偿还能力表
    - `ashareprofit` - 盈利能力表
    - `cashflow_sq` - 现金流量表(单季度)
    - `income_sq` - 利润表(单季度)
    - `profit_sq` - 盈利能力表(单季度)
    - `growth_sq` - 成长能力表(单季度)
    - `profit_forecast` - 业绩预告
  - date和statDate参数传其中之一即可
  - date和statDate全为None时，date默认取当前时间的前一日
  - 支持的数据可在[SuperMind数据平台](http://quant.10jqka.com.cn/view/dataplatform)中查询
- 📝示例：
  
  - 调用
    
    ```python
    #查询2023年8月1日的总市值数据，并降序排列
    data = get_fundamentals(
    	query(
    		valuation.symbol,
    		valuation.market_cap
    	).order_by(
    		valuation.market_cap.desc()
    	),
    	date = '20230810'
    )
    print(data.head())
    ```
  - 返回值
    
    ```python
    valuation_symbol  valuation_market_cap
    0        600519.SH          2.355371e+12
    1        601398.SH          1.550490e+12
    2        601857.SH          1.396562e+12
    3        600941.SH          1.212461e+12
    4        601288.SH          1.199709e+12
    ```
