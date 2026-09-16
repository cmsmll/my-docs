---
title: "工具函数"
---

# 工具函数
## 股票代码格式转换：normalize_symbol

- 👑调用方法
  
  ```python
  normalize_symbol(symbol, ty=None)
  ```
- 🔧作用
  
  - 将不同格式的股票或基金代码，转换为 SuperMind 平台的标准格式代码。
- 📚参数说明：
  
  - `symbol`: `str`: 待转换的股票或基金代码，例如 `'300033'`。
  - `ty`:  `str`，可选，指定代码类型。`'stock'` 代表股票，`'ota'` 代表基金。如果为 `None`，则函数会自动判断。默认为 `None`。
- 🔢返回值说明：
  
  - `str`: 返回 SuperMind 平台下的标准格式代码，例如 `'300033.SZ'`。
- ❗注意事项：
  
  - 输入的代码 `symbol` 必须为字符串格式。
  - 即使不指定 `ty` 参数（即使用默认值 `None`），函数通常也能正确识别并转换代码。
  - 在研究环境和策略环境中均可使用。
- 📝示例：
  
  - **调用**
    ```python
    # 指定类型转换
    normalize_symbol('300033', ty='stock')
    
    # 使用默认参数转换
    normalize_symbol('300033')
    ```
  - **返回值**
    ```
    '300033.SZ'
    ```

## 保存文件函数：write_file

- 👑调用方法：
  ```python
  write_file(path, content, append=False)
  ```
- 🔧作用：
  - 将内容保存到研究环境的指定文件路径中。
- 📚参数说明：
  - `path`: `str`，文件保存的相对路径。例如，'test.txt'表示在研究环境根目录下创建或写入文件。
  - `content`：`str` 或 `bytes`，需要保存的内容。可以是字符串或二进制内容。如果是字符串，将使用UTF-8编码后存储。
  - `append`：`bool`，是否为追加模式。默认为 `False`。
    - `True`: 在文件末尾追加内容，保留原有内容。
    - `False`: 覆盖文件原有内容。
- 🔢返回值说明：
  - `int`，写入的字节长度。
- ❗注意事项：
  - 保存的内容需要是 `str` 或 `bytes` 类型。
  - 该函数在研究环境中可用。
- 📝示例：
  - **调用：**
    ```python
    write_file('log.txt', 'Hello, this is a log message.')
    ```
  - **返回值：**
    ```python
    24
    ```

## 读取文件函数：read_file

- 👑调用方法
  ```python
  read_file(path)
  ```
- 🔧作用
  - 读取研究环境中的指定文件。
- 📚参数说明：
  - `path`: `str`，文件的相对路径。例如，`'folder/file.txt'` 代表读取 `folder` 文件夹下的 `file.txt` 文件；`'file.txt'` 代表读取根目录下的 `file.txt` 文件。
- 🔢返回值说明：
  - `bytes`，返回文件内容的字节流。
- ❗注意事项：
  - 文件保存在文件夹中，则`path`的格式必须是`'文件夹名/文件名'`。
  - 文件保存在根目录下，则`path`格式为`'文件名'`。
  - 返回值为 `bytes` 类型，如果需要字符串，可能需要使用 `decode()` 方法进行解码。
- 📝示例：
  - 调用
    ```python
    # 首先，创建一个文件用于读取
    write_file('example.txt', '你好，世界')
    
    # 调用 read_file 读取文件
    data = read_file('example.txt')
    
    # 打印查看返回值类型和内容
    print(type(data))
    print(data)
    
    # 如果需要字符串，可以解码
    print(data.decode('utf-8'))
    ```
  - 返回值
    ```
    <class 'bytes'>
    b'\xe4\xbd\xa0\xe5\xa5\xbd\xef\xbc\x8c\xe4\xb8\x96\xe7\x95\x8c'
    你好，世界
    ```

## 查询研究环境指定路径下的文件：list_file

- 👑调用方法
  
  ```python
  list_file(path, isfile=None, isdir=None, abspath=False)
  ```
- 🔧作用
  
  - 查询研究环境指定路径下的文件和目录列表，可按文件或目录进行筛选。
- 📚参数说明：
  
  - `path`: `str`，研究环境文件路径，例如，'test'代表在研究环境根目录中名为test的文件夹。
  - `isfile`: `bool`，是否只返回文件，默认为`None`。
  - `isdir`: `bool`，是否只返回文件夹，默认为`None`。
  - `abspath`: `bool`，是否返回绝对路径，默认为`False`。
- 🔢返回值说明：
  
  - `list`，包含文件/目录路径字符串的列表。
- ❗注意事项：
  
  - `isfile`和`isdir`都为`None`时，表示同时返回文件和文件夹。
  - 当`isfile`与`isdir`同时为`True`时，同样返回文件和文件夹。
  - `abspath`参数默认为`False`，即返回相对路径。
  - 此函数同样可用于查询研究环境内的文件。
- 📝示例：
  
  - 调用：
    ```python
    list_file('')
    ```
  - 返回值：
    ```python
    ['crontabs/requirements.txt', 'crontabs/infer_daban (every 1minutes from 7.00am to 7.00am).html', 'crontabs/c4 (every 1minutes from 9.01am to 9.01am).py.output.txt', 'crontabs/crontabs.log', 'crontabs/model.toml', 'crontabs/c4 (every 1minutes from 9.01am to 9.01am).py', ... ]
    ```

## 复制/剪贴文件或文件夹：copy_file

- 👑调用方法
  ```python
  copy_file(src, dst, move=False)
  ```
- 🔧作用
  - 复制/剪贴文件或文件夹
- 📚参数说明：
  - `src`: `str`，需要操作的文件或文件夹的路径
  - `dst`: `str`，目标路径(研究环境),例如，'test'代表在研究环境根目录中名为test的文件夹
  - `move`: `bool`，是否剪贴，默认为`False`
- 🔢返回值说明：
  - `str`，值为被操作文件的源路径。
- ❗注意事项：
  - 迁移单个文件时，设置目标路径时也需要具体到文件名
  - 可以利用此函数新建文件夹：copy_file(None,'new_folder')，代表在根目录下新建名为‘new_folder’的文件夹
  - 研究环境中同样可以使用
- 📝示例：
  - 调用
    ```python
    copy_file('test.txt', 'new_folder/abc.txt', move=True)
    ```
  - 返回值
    ```python
    'test.txt'
    ```

## 删除文件或文件夹：remove_file

- 👑调用方法
  ```python
  remove_file(path, trash=True)
  ```
- 🔧作用
  - 删除文件或文件夹
- 📚参数说明：
  - `path`: `str`，表示需要删除文件/文件夹的路径
  - `trash`: `bool`，表示是否移入回收站，默认为True，为False时意味着彻底删除
- 🔢返回值说明：
  - `NoneType`，无返回值
- ❗注意事项：
  - `trash=False`时意味着彻底删除文件，不可恢复
  - 研究环境中同样可以使用
- 📝示例：
  - 调用：
    ```python
    remove_file('test.txt')
    ```
  - 返回值：
    ```
    None
    ```

## 消息推送函数：notify_push

- 👑调用方法：
  
  ```python
  notify_push(
      content, 
      channel='wxpusher', 
      subject='SuperMind消息提醒', 
      email_list=None, 
      uids=None, 
      topic_ids=None, 
      group_id=None,
      url=None,
      payload=None,
  )
  ```
- 📚参数说明：
  
  - content：需要推送的消息文本
  - channel: 目前支持微信推送、webhook，参数值分别为 `"wxpusher"`、`"webhook"`
  - subject: 消息主题
  - uids: `list`，`channel`为 `wxpusher`需要填写，用户的UID，关注公众号，点击“我的－我的UID”获取用户UID信息
  - url: `str`，`channel`为 `webhook`需要填写，webhook地址
  - payload: `dict`，`channel`为 `webhook`需要填写，消息格式，如钉钉的消息格式为 `{"msgtype": "text", "text": {"content": "$content"}}`，其中 `$content`会被替换为 `content`参数传入的值
- 🔧作用：
  
  - 消息推送函数，在研究环境、策略编辑等模块均可使用
- ❗注意事项：
  
  - `channel='wxpusher'`时，需要先关注公众号：
    ![](http://wxpusher.zjiecode.com/api/qrcode/jGYu4SdkDOTGPRz5ZgZbusvFYq7AfAeBK7DziHDHpytBajgaVoI7VBrHrwxodE5d.jpg)
  - webhook教程见：[模拟仿真 (10jqka.com.cn)](/guide/simulation/mo-ni-jiao-yi#什么是webhook)
- 📝示例：

```python
try:
    raise
except:
    # 微信推送
    notify_push(
        '程序报错', 
        channel='wxpusher', 
        subject='SuperMind消息提醒', 
        uids='XXXXXX',
    )
    # 钉钉webhook推送
    notify_push(
        '程序报错', 
        channel='webhook',   
        url='XXXXXX',
        payload={"msgtype": "text", "text": {"content": "$content"}},
    )
```

## 自选板块：custom_sector

- 👑调用方法：
  
  ```python
  custom_sector(name=None, action='query', symbol=None, rename=None)
  ```
- 📚参数说明：
  
  - name：str，板块名称
  - action: str，insert - 新建name的板块，update - 更新指定板块的股票列表或重命名，append - 在指定板块中新增股票，pop - 移除指定板块内的个别股票，remove - 移除指定板块
  - symbol：list，股票列表
  - rename: str，重命名板块名称
- 🔧作用：
  
  - 读取或修改自选板块
- 📝示例：

```python
custom_sector() # 返回所有板块的dataframe

custom_sector('板块1') # 返回 板块1 的属性和股票

custom_sector('板块1', 'insert', ['000001.SZ']) # 新建板块1的股票列表

custom_sector('板块1', 'update', ['000001.SZ'], '新名字') # 更新板块1的股票列表或名字

custom_sector('板块1', 'append', ['000001.SZ']) # 增加板块1的股票列表

custom_sector('板块1', 'pop', ['000001.SZ']) # 移除板块1的股票

custom_sector('板块1', 'remove') # 删除板块1
```

## 文件加密：compile_pyfile

- 👑调用方法：
  
  ```python
  open_api = get_open_api('public')
  open_api.compile_pyfile('xxx.py')
  open_api.import_cpyfile('xxx.cpython-38-x86_64-linux-gnu.cpy')
  ```
- 🔧作用：
  
  - 对指定的 py 源文件进行编译与加密，加密完成后可删除原始 `.py` 文件，从而实现策略源代码的保护。
  - 生成的xxx.cpython-38-x86\_64-linux-gnu.cpy加密文件可在不同用户间进行分发与使用。
  - 文件需上传至研究平台目录中方可调用，注意无法跨py版本使用。
- 📝示例：

```python
# 编译加密py文件
open_api = get_open_api('public')
open_api.compile_pyfile('untitled1.py')

#初始化cpy加密文件，该操作仅需执行一次，之后即可通过 import untitled1 进行调用
open_api = get_open_api('public') 
open_api.import_cpyfile('untitled1.cpython-38-x86_64-linux-gnu.cpy')
```
