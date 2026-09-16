---
title: 三、错误说明
---

# 三、错误说明

| 错误码 | 错误信息 | 错误提示 |
| --- | --- | --- |
| -1010 | your account has been loggout out. | token已失效 |
| -1000 | datasvr error! | 数据服务器错误 |
| -1001 | gwsvr error! | 网关服务器错误 |
| -1002 | timeout! | 超时 |
| -1003 | access-token can not be empty! | 数据服务器错误 |
| -1004 | datasvrhq error! | 传值不能为空 |
| -1005 | auth user error! | 用户验证错误 |
| -1201 | failed,please change your input condition. | 查询失败 |
| -1202 | there are errors in your parameters,please have a check. | 参数错误 |
| -1203 | parsing failed. | 解析失败 |
| -1300 | Not legal User | token无效 |
| -1301 | Refresh_Token is expired or illegal | refresh_token无效 |
| -1302 | Access_Token is expired or ilegal | Access_Token无效 |
| -1303 | Device exceed limit | access_token绑定超过20个IP |
| -1305 | Exceeded the maximum number of token acquistions for the day | 每天请求token次数超过限制 |
| -4001 | no data. | 数据为空 |
| -4100 | please log in first! | 请先登录iFind |
| -4101 | database execution error | 数据库执行错误 |
| -4102 | server internal error. | 服务端请求超时 |
| -4103 | unreasonable request! your account has been locked. please contact the saler to unlock | 超时请求过多，账号被锁 |
| -4201 | the data server is incorrect | 数据服务器取值错误 |
| -4203 | request format is wrong | 请求格式错误 |
| -4204 | wrong time format | 错误的时间格式 |
| -4205 | the start time can not be greater than the end time | 开始时间不能大于结束时间 |
| -4206 | include the wrong thscode | 含有错误的同花顺代码 |
| -4207 | sorry,currently we do not support bonds of this market. | 用户参数错误:不支持银行间债券 |
| -4208 | sorry, currently we just support kinds of securities of SSE, SZSE and CFFEX. | 目前仅支持上交所深交所 |
| -4209 | sorry, the startDate and endDate of Shopshot command should be the same, please have a check. | 起始、结束日期要求同一天 |
| -4210 | error happen with input parameters, please have a check. | 输入参数错误 |
| -4211 | sorry, there is no trading date in the date range, please have a check | 时间区间内无交易日 |
| -4212 | sorry, the input endDate is earlier than the listDates of the input security codes | 时间区间内股票未上市 |
| -4230 | you currently do not have permission for real-time Us stock market quotes | 没有美股实时行情权限 |
| -4213 | sorry, startDate can't later than endDate in the command, please have a check | 开始日期大于截止日期 |
| -4301 | sorry, your usage of basic data has exceeded 5 million this week. | 对不起，这周基础数据提取已经超过500万条 |
| -4302 | sorry, your usage of quote data has exceeded 150 million this week. | 对不起，这周报价数据提取已经超过1亿5千万条 |
| -4303 | sorry, your usage of EDB data has exceeded 5 million this week. | 对不起，这周EDB数据提取已经超过500万条 |
| -4317 | sorry, your usage of data has exceeded 1w this week. | 对不起，您本周数据量已超过1万 |
| -4318 | sorry, your usage of data has exceeded this month. | 对不起，本月使用量已经超限 |
| -4320 | sorry, your account must use the corresponding. | 抱歉，您的账户必须使用对应客户端 |
| -4321 | sorry, the free Acount can support requiring 10W data at most, please modify your input params! | 免费账号单次提取限制10万 |
| -4304 | sorry, the HighFrequeceSequence command can support requiring 200W data at most, please modify your input params | 单条命令请求数据量过大 |
| -4305 | sorry, the BasicData command can support requiring 20W data at most, please modify your input params | 单条命令请求数据量过大 |
| -4306 | sorry, the Snapshot command can support requiring 200W data at most, please modify your input params | 单条命令请求数据量过大 |
| -4319 | sorry, the free Acount can support requiring 5W data at most, please modify your input params | 免费用户单条命令请求数据量过大 |
| -4321 | sorry, the free Acount can support requiring 10W data at most, please modify your input params | 免费用户单条命令请求数据量过大 |
| -4322 | sorry, the free Acount can support requiring 1W data at most, please modify your input params | 免费用户单条命令请求数据量过大 |
| -4307 | data extraction is overrun. | 数据提取量超限 |
| -4308 | the range between startDate and endDate must be smaller than 1 month.Please check your input parameters. | 请求区间不能超过一个月 |
| -4309 | sorry, trial account can get 1 year data for authority limited, so as to acquire more data, please transfer it to formal account | 超出时间限制 |
| -4310 | sorry, trial account can get 1 month data for authority limited, so as to acquire more data, please transfer it to formal account | 超出时间限制 |
| -4311 | sorry, trial account can get 5 year data for authority limited, so as to acquire more data, please transfer it to formal account | 超出时间限制 |
| -4312 | sorry, the HistoryQuotes command can support requiring 200W data at most, please modify your input params | 超出200W限制 |
| -4313 | sorry,the interval should be smaller than 3 years,please change your startDate or endDate. | 对不起，开始时间与结束时间间隔不能超过3年 |
| -4314 | sorry,the interval should be smaller than 6 months,please change your startDate or endDate. | 对不起，开始时间与结束时间间隔不能超过6个月 |
| -4315 | sorry,the interval should be smaller than 3 months,please change your startDate or endDate. | 对不起，开始时间与结束时间间隔不能超过3个月 |
| -4316 | sorry,the interval should be smaller than 1 year,please change your startDate or endDate. | 对不起，开始时间与结束时间间隔不能超过1年 |
| -4400 | sorry, we just support 600 requests per minute. | 对不起，我们每分钟最多支持600条数据请求 |
| -5001 | sorry,data server parameter error. | 请求远程服务器参数错误 |
| -5002 | sorry,data server is busy now. | 查询失败 |
| -5003 | sorry,does not support the stock box selection calculation. | 不支持该股权查询 |
| -5004 | sorry,data process waiting timeout. | 等待超时 |
| -5005 | sorry, data calculation error. | 计算错误 |
| -5006 | sorry,data process query failed. | 查询失败 |
| -5007 | sorry,data process Waiting for calculation. | 等待计算 |
| -5008 | sorry,data process calculating. | 正在计算 |
| -5009 | sorry,must complete the last instruction request. | 必须完成上一次计算请求 |
| -5010 | sorry,only supports single code incoming. | 仅支持单代码传入 |
| -5100 | Sorry,account type is not supported. | 抱歉，您的账户类型不支持 |
| -5101 | Please confirm,you have not used the amount of date for the month. | 请确认，您尚未使用本月的数据量 |
| -5102 | Sorry,you have exceeded the maximum number of cleaes. | 抱歉，您已超过最大清零次数 |
| -5103 | Sorry,Do not allow accounts to operate in unbound mac code environments. | 抱歉，不允许账户在非绑定mac代码环境中运行 |
| -5104 | Sorry,this mac code has been bound . | 抱歉，该机器的mac已被绑定 |
| -5000 | please enter a reasonable expected dividend growth rate | 请输入合理的预期红利增长率数值 |
