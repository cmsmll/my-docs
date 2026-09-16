---
title: 4、高频序列
---

# 4、高频序列

## URL

```text
https://quantapi.51ifind.com/api/v1/high_frequency
```

## formData

| key | 是否必须 | value | 示例 |
| --- | --- | --- | --- |
| `codes` | 是 | 半角逗号分隔的所有代码 | "codes":"300033.SZ,600030.SH" |
| `indicators` | 是 | 半角逗号分隔所有指标 | "indicators":"open,high" |
| `functionpara` | 否 | key-value格式。所有key均取默认时，functionpara省略。技术指标额外在calculate生成，生成规则见下文。 | 见下方代码块 |
| `starttime` | 是 | 开始日期，支持"YYYYMMDD HH:mm:ss""YYYY-MM-DD HH:mm:ss""YYYY/MM/DD HH:mm:ss"三种时间格式 | "starttime":"2018-01-01 09:15:00" |
| `endtime` | 是 | 结束日期，支持"YYYYMMDD HH:mm:ss""YYYY-MM-DD HH:mm:ss""YYYY/MM/DD HH:mm:ss"三种日期格式 | "endtime":"2018-01-01 15:15:00" |

## indicators参数说明

| 指标名 | 指标说明 | 指标备注 |
| --- | --- | --- |
| `open` | 开盘价 | 通用 |
| `high` | 最高价 | 通用 |
| `low` | 最低价 | 通用 |
| `close` | 收盘价 | 通用 |
| `avgPrice` | 均价 | 通用 |
| `volume` | 成交量 | 通用 |
| `amount` | 成交额 | 通用 |
| `change` | 涨跌 | 通用 |
| `changeRatio` | 涨跌幅 | 通用 |
| `turnoverRatio` | 换手率 | 通用 |
| `sellVolume` | 内盘 | 通用 |
| `buyVolume` | 外盘 | 通用 |
| `changeRatio_accumulated` | 涨跌幅(累计) | 股票，仅支持当天 |
| `BBI` | BBI多空指数 | 股票 |
| `DDI` | DDI方向标准离差指数 | 股票 |
| `DMA` | DMA平均线差 | 股票 |
| MA | MA简单移动平均 | 股票 |
| `EXPMA` | EXPMA指数平均数 | 股票 |
| `MACD` | MACD指数平滑异同平均 | 股票 |
| `MTM` | MTM动力指标 | 股票 |
| `PRICEOSC` | PRICEOSC价格振荡指标 | 股票 |
| `TRIX` | TRIX三重指数平滑平均 | 股票 |
| `BIAS` | BIAS乖离率 | 股票 |
| `CCI` | CCI顺势指标 | 股票 |
| `DBCD` | DBCD异同离差乖离率 | 股票 |
| `DPO` | DPO区间震荡线 | 股票 |
| `KDJ` | KDJ随机指标 | 股票 |
| `LWR` | LWR威廉指标 | 股票 |
| `ROC` | ROC变动速率 | 股票 |
| `RSI` | RSI相对强弱指标 | 股票 |
| SI | SI摆动指标 | 股票 |
| `SRDM` | SRDM动向速度比率 | 股票 |
| `VROC` | VROC量变动速率 | 股票 |
| `VRSI` | VRSI量相对强弱 | 股票 |
| WR | WR威廉指标 | 股票 |
| `ARBR` | ARBR人气意愿指标 | 股票 |
| CR | CR能量指标 | 股票 |
| `PSY` | PSY心理指标 | 股票 |
| VR | VR成交量比率 | 股票 |
| `WAD` | WAD威廉聚散指标 | 股票 |
| `MFI` | MFI资金流向指标 | 股票 |
| `OBV` | OBV能量潮 | 股票 |
| `PVT` | PVT量价趋势指标 | 股票 |
| `WVAD` | WVAD威廉变异离散量 | 股票 |
| `BBIBOLL` | BBIBOLL多空布林线 | 股票 |
| `BOLL` | BOLL布林线 | 股票 |
| `CDP` | CDP逆势操作 | 股票 |
| `ENV` | ENV指标 | 股票 |
| `MIKE` | MIKE麦克指标 | 股票 |
| LB | 量比 | 股票 |
| `VMA` | VMA量简单移动平均 | 股票 |
| `VMACD` | VMACD量指数平滑异同平均 | 股票 |
| `VOSC` | VOSC成交量震荡 | 股票 |
| `TAPI` | TAPI加权指数成交值 | 股票 |
| `VSTD` | VSTD成交量标准差 | 股票 |
| `ADTM` | ADTM动态买卖气指标 | 股票 |
| MI | MI动量指标 | 股票 |
| `MICD` | MICD异同离差动力指数 | 股票 |
| RC | RC变化率指数 | 股票 |
| `RCCD` | RCCD异同离差变化率指数 | 股票 |
| `SRMI` | SRMI(MI修正指标) | 股票 |
| `DPTB` | DPTB大盘同步指标 | 股票 |
| `JDQS` | JDQS阶段强势指标 | 股票 |
| `JDRS` | JDRS阶段弱势指标 | 股票 |
| `ZDZB` | ZDZB筑底指标 | 股票 |
| `ATR` | ATR真实波幅 | 股票 |
| `MASS` | MASS梅丝线 | 股票 |
| `STD` | STD标准差 | 股票 |
| `VHF` | VHF纵横指标 | 股票 |
| `CVLT` | CVLT佳庆离散指标 | 股票 |

## 技术指标规则说明

选择技术指标时，需同时在functionpara的calculate字段以indicators为key ，以半角逗号拼接各个参数字符串为value。为下列特殊的参数额外使用下列英文名，其他的沿用下拉框英文值。

## indicators参数说明

| 指标名 | 指标说明 | 指标备注 |
| --- | --- | --- |
| `BBI` | BBI多空指数 | {周期1},{周期2},{周期3},{周期4} |
| `DDI` | DDI方向标准离差指数 | {周期1},{周期2},{平滑因子},{周期3},{DDI or ADDI or AD} |
| `DMA` | DMA平均线差 | {短周期},{长周期},{周期},{DDD or AMA} |
| MA | MA简单移动平均 | {周期} |
| `EXPMA` | EXPMA指数平均数 | {周期} |
| `MACD` | MACD指数平滑异同平均 | {短周期},{长周期},{周期},{DIFF or DEA or MACD} |
| `MTM` | MTM动力指标 | {间隔周期},{周期},{MTM or MTMMA} |
| `PRICEOSC` | PRICEOSC价格振荡指标 | {短周期},{长周期} |
| `TRIX` | TRIX三重指数平滑平均 | {周期1},{周期2},{TRIX or TRMA} |
| `BIAS` | BIAS乖离率 | {周期} |
| `CCI` | CCI顺势指标 | {周期} |
| `DBCD` | DBCD异同离差乖离率 | {周期1},{周期2},{周期3},{DBCD or MM} |
| `DPO` | DPO区间震荡线 | {周期1},{周期2},{DPO or MADPO} |
| `KDJ` | KDJ随机指标 | {周期},{周期1},{周期2},{K or D or J} |
| `LWR` | LWR威廉指标 | {周期},{周期1},{周期2},{LWR1 or LWR2} |
| `ROC` | ROC变动速率 | {间隔周期},{周期},{ROC or ROCMA} |
| `RSI` | RSI相对强弱指标 | {周期} |
| SI | SI摆动指标 |  |
| `SRDM` | SRDM动向速度比率 | {周期},{SRDM or ASRDM} |
| `VROC` | VROC量变动速率 | {周期} |
| `VRSI` | VRSI量相对强弱 | {周期} |
| WR | WR威廉指标 | {周期} |
| `ARBR` | ARBR人气意愿指标 | {周期},{AR or BR} |
| CR | CR能量指标 | {周期} |
| `PSY` | PSY心理指标 | {周期1},{周期2},{PSY or MAPSY} |
| VR | VR成交量比率 | {周期} |
| `WAD` | WAD威廉聚散指标 | {周期},{WAD or MAWAD} |
| `MFI` | MFI资金流向指标 | {周期} |
| `OBV` | OBV能量潮 | {OBV or OBV_XZ} |
| `PVT` | PVT量价趋势指标 |  |
| `WVAD` | WVAD威廉变异离散量 | {周期1},{周期2},{WVAD or MAWVAD} |
| `BBIBOLL` | BBIBOLL多空布林线 | {周期},{宽带},{BBIBOLL or UPR or DWN} |
| `BOLL` | BOLL布林线 | {周期},{宽带},{MID or UPPER or LOWER} |
| `CDP` | CDP逆势操作 | {CDP or AH or AL or NH or NL} |
| `ENV` | ENV指标 | {周期},{UPPER or LOWER} |
| `MIKE` | MIKE麦克指标 | {周期},{WR or MR or SR or WS or MS or SS} |
| LB | 量比 | {周期} |
| `VMA` | VMA量简单移动平均 | {周期} |
| `VMACD` | VMACD量指数平滑异同平均 | {短周期},{长周期},{周期},{DIFF or DEA or MACD} |
| `VOSC` | VOSC成交量震荡 | {短周期},{长周期} |
| `TAPI` | TAPI加权指数成交值 | {周期},{TAPI or MATAPI} |
| `VSTD` | VSTD成交量标准差 | {周期} |
| `ADTM` | ADTM动态买卖气指标 | {周期},{周期1},{ADTM or MAADTM} |
| MI | MI动量指标 | {周期},{A or MI} |
| `MICD` | MICD异同离差动力指数 | {周期},{周期1},{周期2},{DIF or MICD} |
| RC | RC变化率指数 | {周期} |
| `RCCD` | RCCD异同离差变化率指数 | {周期},{周期1},{周期2},{DIF or RCCD} |
| `SRMI` | SRMI(MI修正指标) | {周期} |
| `DPTB` | DPTB大盘同步指标 | {周期},{000001 or 000010 or 399001 or 000300} |
| `JDQS` | JDQS阶段强势指标 | {周期},{000001 or 000010 or 399001 or 000300} |
| `JDRS` | JDRS阶段弱势指标 | {周期},{000001 or 000010 or 399001 or 000300} |
| `ZDZB` | ZDZB筑底指标 | {周期},{周期1},{周期2},{B or D} |
| `ATR` | ATR真实波幅 | {周期},{TR or ATR} |
| `MASS` | MASS梅丝线 | {周期1},{周期2} |
| `STD` | STD标准差 | {周期} |
| `VHF` | VHF纵横指标 | {周期} |
| `CVLT` | CVLT佳庆离散指标 | {周期} |

## functionpara控件说明

| 名称 | keys | value说明 | 省略时逻辑 |
| --- | --- | --- | --- |
| 设置时间区间-开始时间 | `Limitstart` | 限定每个交易日数据的开始时间 |  |
| 设置时间区间-结束时间 | `Limitend` | 限定每个交易日数据的截止时间 |  |
| 时间周期 | `Interval` | 1-1分钟3-3分钟5-5分钟10-10分钟15-15分钟30-30分钟60-60分钟 | 1-1分钟 |
| 非交易间隔处理 | `Fill` | Previous-沿用之前数据Blank-空值具体数值-自定义数值Original-不处理 | Original-不处理 |
| 分红再投复权方式 | `CPS` | 后复权（分红方案计算）-backward1 前复权（交易所价格计算）-forward3 后复权（交易所价格计算）-backward3 全流通前复权（分红方案计算）-forward2 全流通后复权（分红方案计算）-backward2 全流通前复权（交易所价格计算）-forward4全流通后复权（交易所价格计算）-backward4 不复权-no | no-不复权 |
| 时间戳格式 | `Timeformat` | BeiJingTime-北京时间LocalTime-当地时间 | BeiJingTime-北京时间 |
| 设定复权基点 | `BaseDate` | 复权基点日期，"YYYY-MM-DD" | 后复权按上市日，前复权按最新日 |

## 示例

```python
para = {
    "codes": "300033.SZ,600030.SH",
    "indicators": "open,high,SI,MACD,DPTB,OBV,KDJ",
    "starttime": "2018-01-01 09:15:00",
    "endtime": "2018-01-01 09:50:00",
    "functionpara": {
        "Interval": "1",
        "Fill": "Original",
        "calculate": {
            "SI": "",
            "MACD": "12,26,9,MACD",
            "DPTB": "7,000001",
            "OBV": "OBV_XZ",
            "KDJ": "9,3,3,K"
        }
    }
}
```

## 输出

| 字段 | 字段名称 | 字段描述 |
| --- | --- | --- |
| `errorcode` | 错误ID | 代码运行错误码，errorcode =0表示代码运行正常。若为其他则需查找错误原因 |
| `errmsg` | 错误信息 | 若errorcode返回非空，此处会返回具体的错误信息 |
| `tables` | 结构体 | 返回内容包括thscode、table （具体的数据内容）等 |
| `datatype` | 指标格式 | 返回获取数据的指标格式 |
| `inputParams` | 输入参数 | 返回输入的参数 |
| `perf` | 处理时间 | 返回请求命令整体耗时（ms） |
| `dataVol` | 数据量 | 返回当前命令消耗的数据量 |
