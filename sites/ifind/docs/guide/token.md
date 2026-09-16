---
title: 一、TOKEN获取与使用
---

# 一、TOKEN获取与使用

接口鉴权方案分为长期的refresh_token和短期的access_token。

## 1、refresh_token说明：

作用：refresh_token只用来请求当前有效的access_token或者获取一个新access_token。

有效期：refresh_token与获取时账号到期日一致，如账号有续期或者权限变更，需要更新refresh_token来更新权限。

获取方式：refresh_token可以通过Windows接口包中超级命令客户端"工具-refresh_token查询/更新"或者网页版本超级命令-账号信息查看或者更新。

注意：refresh_token更新后，所有环境过去的refresh_token、access_token均会失效，更refresh_token相当于更改HTTP接口的账号密码。

## 2、access_token说明：

作用：access_token用来直接向同花顺服务器请求数据。

有效期：access_token会在初次生成的七天后失效。

注意：单个access_token最多支持绑定20个IP。

### 1 ）、获取当前有效的access_token

#### 请求参数

| 项目 | 传参说明 |
| --- | --- |
| `URL` | https://quantapi.51ifind.com/api/v1/get_access_token |
| `requestMethod` | POST/GET |
| `requestHeaders` | {"Content-Type":"application/json","refresh_token":user_refresh_token} |

注：refresh_token放BODY也可

### 2 ）、获取一个新的access_token

获取一个新的access_token会造成所有旧的access_token失效

#### 请求参数

| 项目 | 传参说明 |
| --- | --- |
| `URL` | https://quantapi.51ifind.com/api/v1/update_access_token |
| `requestMethod` | POST/GET |
| `requestHeaders` | {"Content-Type":"application/json","refresh_token":user_refresh_token} |

示例——使用python请求当前有效的access_token

```python
import requests
import json

getAccessTokenUrl = 'https://quantapi.51ifind.com/api/v1/get_access_token'
refreshToken = 'eyJzaWduX3RpbWUiOiIyMDIxLTEyduX3RpbWUiO iIyMjI1In0=.eyJ1aWQiOiIxMDYxMDUwMDMifQ==.F4CBBBC230969B0F220F9D6ECB666A230969B0F220FFBBCDA4156A3B78A1BB896'
getAccessTokenHeader = {"Content-Type": "application/json", "refresh_token": refreshToken}
getAccessTokenResponse = requests.post(url=getAccessTokenUrl, headers=getAccessTokenHeader)
accessToken = json.loads(getAccessTokenResponse.content)['data']['access_token']
print(accessToken)
```

### 3 ）、使用access_token向同花顺服务器取数

#### 使用超级命令协助获取协议

基础函数、日期序列函数、EDB函数、专题报表函数的指标与科目过多，很难把所有内容都集中在文档中，目前还是推荐用户使用Windows SDK接口包中的超级命令终端或者网页版本超级命令协助获取协议。

#### 协议说明

requestMethod需要为POST

requestHeaders需要包含{"Content-Type":"application/json","access_token":user_access_token}

各函数的formData或者requestURL见下方协议或者使用超级命令生成

请求参数需要统一处理为urlencode ，请求参数压缩支持：Accept-Encoding: gzip,deflate

返回内容统一为unicode编码

示例——以Python请求300033实时行情为例

```python
# -*- coding: utf-8 -*-
import requests
thsUrl = 'https://quantapi.51ifind.com/api/v1/real_time_quotation'
accessToken = '12fe737bc2014f39f195a2b7b03e3b11ec63b66b'
thsHeaders = {"Content-Type": "application/json", "access_token": accessToken}
thsPara = {"codes": "300033.SZ", "indicators": "open,high,low,latest"}
thsResponse = requests.post(url=thsUrl, json=thsPara, headers=thsHeaders)
print(thsResponse.content)
```
