---
title: "枚举常量"
---

# 枚举常量
## ORDER_STATUS - 委托状态


| 枚举值           | 含义   |
| ---------------- | ------ |
| `PENDING_NEW`    | 创建中 |
| `ACTIVE`         | 未成交 |
| `FILLED`         | 已成交 |
| `REJECTED`       | 废单   |
| `PENDING_CANCEL` | 取消中 |
| `CANCELLED`      | 已取消 |

## ORDER_TYPE - 委托类型


| 枚举值   | 含义     |
| -------- | -------- |
| `MARKET` | 市价委托 |
| `LIMIT`  | 限价委托 |

## SIDE- 交易方向


| 枚举值 | 含义 |
| ------ | ---- |
| `BUY`  | 买入 |
| `SELL` | 卖出 |

## POSITION_EFFECT - 仓位类型


| 枚举值             | 含义     |
| ------------------ | -------- |
| `OPEN`             | 开仓     |
| `CLOSE`            | 平仓     |
| `CLOSE_TODAY`      | 平今仓   |
| `CLOSE_ONLY_TODAY` | 只平今仓 |

---
