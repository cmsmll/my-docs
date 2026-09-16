---
title: "研究环境的使用"
---

# 研究环境的使用
## 储存资源

- 研究环境默认提供2G内存与1G硬盘，并支持扩展，如有扩展需求，可与我们的工作人员取得联系

### 文件上传

- 可以通过左上角上传按钮将本地文件上传到研究环境中

![9343f2e558635c45161fbea712f0203e.png](http://u.thsi.cn/imgsrc/pefile/9343f2e558635c45161fbea712f0203e.png)

<!--

- 可以通过本地SDK的upload_file函数实现将本地文件上传至SuperMind研究环境，具体请参考[本地SDK-云端环境交互](/supermind/guide/other/yi-qian-yan#云端环境交互)
-->

## 研究环境关闭规则

- 6小时不活动会被关闭。不活动是至浏览器、客户端关闭，计算器休眠等情况
- 研究环境最大生存时间为24小时
- 对于SuperMind正式付费用户，可以申请延长研究环境的生存时间，具体请咨询工作人员

## 研究环境如何关闭？

python3.5 环境关闭研究环境：

![9fbd560837573c043cb6c9e8c1c67147.png](http://u.thsi.cn/imgsrc/pefile/9fbd560837573c043cb6c9e8c1c67147.png)

python3.8 环境关闭研究环境：

![bebbc999a616a3bf3dc20e3717be5154.png](http://u.thsi.cn/imgsrc/pefile/bebbc999a616a3bf3dc20e3717be5154.png)

关闭之后，重新进入研究环境就可以启动研究环境。

## 定时任务Crontab

定时任务是在研究环境开启的状态下，可由后台定时调起脚本，执行任务。

**您的文件名称 (every 1minutes from 9.25am to 2.50pm).ipynb**

**您的文件名称 (every 1minutes from 9.25am to 2.50pm).py**

**用法：**

+ 开通权限后Jupyter的home页面会有个crontabs文件夹，这个文件夹里的脚本会由后台自动调起
+ 通过命名来设定定时任务执行的方式，如

  + schedule (every 1minutes from 9.25am to 2.50pm).ipynb
    + ![5cbd716fe3e4e2561bfee75c96e6d452.png](http://u.thsi.cn/imgsrc/pefile/5cbd716fe3e4e2561bfee75c96e6d452.png)
  + 括号内为具体参数，即9:25到2：50每分钟执行一次，前后时间一致则只执行一次，注意am,pm
  + **首次添加之后需要重启下研究环境** 点此关闭 后 再开启：[https://quant.10jqka.com.cn/notebook/hub/home](https://quant.10jqka.com.cn/notebook/hub/home)
+ 定时任务不支持并行，会按时间顺序排队执行，如果超过设定时间则今日不会执行
+ crontabs.log中会显示增加任务、执行任务的日志，（notebook中并不会打印出日志）。
+ 支持设置超时时间如下(py文件也可以)

  ```python
  helloworld (every 5minutes from 9.00am to 7.10pm) with {timeout:10}.ipynb
  # 或者
  helloworld (every 5minutes from 9.00am to 7.10pm) with {timeout:10}.py
  ```
+ 如果有2个文件命名如何命名？

  Crontab 文件的命名是可以变更的 括号里面按照要求即可

  2个的话 可以叫不一样的名字，默认会进行串行执行 按照名字进行排序执行。

  第一个叫：
  AAA (every 1minutes from 9.25am to 2.50pm).ipynb

  第二个叫：
  BBB (every 1minutes from 9.25am to 2.50pm).ipynb
+ **定时任务只有在研究平台保持开启的状态下才会执行，请关注研究平台状态**

  + 开启即能看到界面。
    + ![b12a04395eeac78420fdff94a8250189.png](http://u.thsi.cn/imgsrc/pefile/b12a04395eeac78420fdff94a8250189.png)
  + ![b12a04395eeac78420fdff94a8250189.png](http://u.thsi.cn/imgsrc/pefile/b12a04395eeac78420fdff94a8250189.png)
  + 如需多个定时任务并行，请联系工作人员，并提供userid，获取方法见[怎么获取userid](#怎么获取userid)

## 实盘可以云端托管么？

我们的研究环境是云端的，但是也必须开着Supermind客户端。因为为了安全，我们是不能在云端记录您的资金账号的，所以必须通过您的客户端来读取资金账号，所以必须开着客户端。请谅解。

### 那我没有条件一直开着电脑怎么办？

建议您购买一个最便宜的windows 云主机 ，一年可能只需要几百，比如一些用户会用天翼云。

这样的话即使没有条件一直开着电脑，也可以一直开着Supermind客户端

## 可以实现完全无人值守么？我可以一直不用管运行的程序么？

可以实现7天内的无人值守，

您需要确保以下3点：

1、客户端一直开启。

2、设定好Crontab定时任务，能在盘前自动开启脚本（因为如果用我们的和回测框架开发的策略，盘后会关闭。但如果自己开发的代码 如果能确保一直运行的话 就不需要开启crontab），crontab相关的知识请看：[定时任务](/supermind/guide/other/yan-jiu-huan-jing-de-shi-yong#定时任务crontab)

3、申请好7天不重启服务器，付费购买之后，您可以向您对接的经理 或者 supermind社群群主申请 7天服务器不重启。（默认情况下是24小时会重启，更多关于服务器重启规则的描述请看：[研究环境存活时间](/supermind/guide/other/yan-jiu-huan-jing-de-shi-yong#研究环境关闭规则)

## 我可以申请超过7天么？

不行，因为量化交易及其容易出现问题，我们建议至少7天要进服务器看下代码运行情况。以便能及时发现问题。

另外：我们正在研发更方便易用的实盘管理工具，届时就可以比较方便的实现无人值守，尽情期待！

## 为什么研究环境报“服务器不可用或无法访问”?

![b2e0620bc604580dc84fdf583310163b.png](http://u.thsi.cn/imgsrc/pefile/b2e0620bc604580dc84fdf583310163b.png)

大部分通过云主机来运行客户端出现过这个问题，

确保云主机的防火墙关闭，如果还是有这个问题，

那么请开启经典模式：

![5b28382f5814690adf42b0b43a497e5b.png](http://u.thsi.cn/imgsrc/pefile/5b28382f5814690adf42b0b43a497e5b.png)

## 为什么研究环境卡住不断刷新？

当研究环境出现不断刷新的情况，说明内存爆满。点击此处进行关闭研究环境，并重新开启：

[点此关闭研究环境（如果研究环境没有开启 是无法访问的）](https://quant.10jqka.com.cn/notebook/hub/home)

## 研究环境可以网页运行？

是的，

如果不实盘的情况下 可以用网页运行：[http://quant.10jqka.com.cn/platform/html/study-research.html](http://quant.10jqka.com.cn/platform/html/study-research.html)

如果需要仿真或者实盘需要下载客户端进行：

支持仿真模拟实盘的客户端：[https://download.10jqka.com.cn/index/download/id/709](https://download.10jqka.com.cn/index/download/id/709)

（仿真实盘和真实实盘的差异 在于用的资金账号是模拟的还是真实的，其他流程都一致，建议真实实盘之前用仿真的测试好策略）

支持实盘的客户端：需要付费之后提供。

## 研究环境的快捷键有哪些？

[http://quant.10jqka.com.cn/view/article/2998](https://quant.10jqka.com.cn/view/article/2998)

## 为什么会内存爆满？

可能因为您开启了过多的文档，建议不要开启很多文档，文档很消耗内存。

如何关闭？

注意仅关闭打开页面不会释放内存，关闭内核才会释放内存。

![a08355cd035104bdbb244c5bdc7f02aa.png](http://u.thsi.cn/imgsrc/pefile/a08355cd035104bdbb244c5bdc7f02aa.png)

另外如果你开启了较多的策略 也会消耗内存。基本上一个策略会消耗0.5G 到1G之间的内存。如果有很多的数据读取和处理逻辑可能会更大。

## 云端2G内存，不够怎么办？

**关闭不需要的进程**
![13f0bbf9f3be4e4c39714de6cf42d730.png](http://u.thsi.cn/imgsrc/pefile/13f0bbf9f3be4e4c39714de6cf42d730.png)### 为什么打开文件会报错

![b8a4cee489d9ad57789d3101c62b193f.png](http://u.thsi.cn/imgsrc/pefile/b8a4cee489d9ad57789d3101c62b193f.png)

出于服务器安全性考虑，部分系统函数不能使用，量化平台提供了替代函数，参照[文档](/supermind/reference/api/gong-ju-han-shu#读取文件函数-read-file)

## 为什么不能使用os,sys等包

出于服务器安全性考虑，涉及系统级操作的包都被禁用

## 怎么获取userid

**方法一**
先在网页上登录
![](https://wdcdn.qpic.cn/MTY4ODg1ODAyMDI4MTExNg_624681_gVrJQnlCPzEfnNh0_1706581647?w=1920&h=219&type=image/png)
**方法二**
研究环境3.8
![85fe9742bf6249eba9512f6553313b6b.png](http://u.thsi.cn/imgsrc/pefile/85fe9742bf6249eba9512f6553313b6b.png)

![5508d873cdc6958b3f8093c27b7f4533.png](http://u.thsi.cn/imgsrc/pefile/5508d873cdc6958b3f8093c27b7f4533.png)

研究环境3.5
![48c90459581d02273d7c2ea103edf67d.png](http://u.thsi.cn/imgsrc/pefile/48c90459581d02273d7c2ea103edf67d.png)

![5508d873cdc6958b3f8093c27b7f4533.png](http://u.thsi.cn/imgsrc/pefile/5508d873cdc6958b3f8093c27b7f4533.png)
