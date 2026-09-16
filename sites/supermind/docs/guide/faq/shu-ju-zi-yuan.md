---
title: "数据资源"
---

# 数据资源
## SuperMind都有什么数据？

核新同花顺是中国市场的精准金融数据服务供应商，为量化投资与各类金融业务系统提供准确、及时、完整的落地数据，数据更新会在每日9点之前完成。目前平台为您提供了以下数据，助您运筹帷幄，决胜千里。

* 股票数据：涵盖了完整的沪深两市所有股票数据，包括基本信息、交易日历、股票行情；
* 公司财务：沪深两市所有A股的三大财务报表数据、财务估值数据，同时我们也为您提供了四大类财务指标数据，包括营运能力指标、偿债能力指标、盈利能力指标、成长能力指标；
* 股票分类：SuperMind支持分类选股，内容包括：行业分类、概念分类、地区分类、上市状态分类、板块分类；
* 指数：目前SuperMind支持上证指数、深证指数、中证指数在内的300种股票指数，内容包括指数基本信息、指数成分股、指数行情。
* 基金：沪深两市所有上市交易的基金，包括ETF、分级基金、LOF和货币基金的行情数据和基本信息。

更详细的数据接口介绍详见：[http://quant.10jqka.com.cn/view/dataplatform](https://http://quant.10jqka.com.cn/view/dataplatform)

我们的数据是支持落地到本地的。如果有兴趣可以联系我们：supermind@myhexin.com

---

## SuperMind的数据可以下载吗？

SuperMind量化平台提供的数据目前暂不支持下载。

## 如何声明全局变量？

在g中声明全局变量即可。
例如：g.day, g.variable等

---

## get\_iwencai选股和问财选股结果为什么不一致？

SuperMind是基于历史数据提供回测服务，而问财选股则基于当前数据提供数据检索服务，二者业务不同，为避免回测中涉及未来数据，SuperMind在数据解析和逻辑处理上与问财有所差异，以致选股结果不一致。

---

## 如何上传自定义数据？

在“我的研究”模块中可上传用户本地的自定义数据：
![](http://u.thsi.cn/fileupload/data/Sns/2017/a0ba12eb578472ec83b66b912c6666cd.jpg)

* “我的研究”中可通过pandas库包直接调用该数据
* “我的策略”中可通过read\_file函数调用该数据(参见 帮助》API文档》API介绍》其他函数》read\_file)
  注：目前支持上传的数据格式包括excel、txt

---

## 如何调用自定义Python库？

1. 在“我的研究”中新建一个文本：
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/63697a300970b3265247d1eb2eee7f00.png)
2. 点击“文件”>>“重命名”，将“.txt”的后缀改为“.py”
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/1e789eff78516d2e19fa459738aa6d7b.jpg)
3. 在文件中写入自己的代码,然后点击“文件”>>“保存”：
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/7872c33005b87e24d472739b8827768f.png)
4. 在“我的策略”中调用自定义库：
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/4ecc1bd2706281dcede26bc178fb0672.png)
   **注：**若编译时对自定义库频繁进行修改，建议在使用时reload自定义库（目前该功能被禁用）：
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/f8e6340cf0892c30ccf6881c378f6260.png)
5. 在“我的研究”中调用自定义库：
   ![](http://u.thsi.cn/fileupload/data/Sns/2017/a01422e0f8384e5214d23b6c3c58d1b2.png)

---

## 为什么研究环境进不去？提示的404：Not Found错误怎么解决？

如果在打开研究环境页面时，提示404：Not Found，无法正常进入研究环境，则需要进行清缓存操作。

![6523a290d5b86a815b1a76586aaec7a0.png](http://u.thsi.cn/imgsrc/pefile/6523a290d5b86a815b1a76586aaec7a0.png)

清缓存快捷键操作：Ctrl+Shift+delete,即可快速进入清除浏览数据界面。

![](http://u.thsi.cn/fileupload/data/Sns/2017/e39d718ebdd6ed31a9ffb493840ab77d.jpg)
