---
title: "4. Operators"
---

# 4. Operators
## 4.1 Unary Operators

- `Neg(X)`：对序列 X 逐元素取相反数。
- `Abs(X)`：对序列 X 逐元素取绝对值。
- `Inv(X)`：对序列 X 逐元素取倒数。
- `Sign(X)`：对序列 X 逐元素取符号。
- `Sqrt(X)`：对序列 X 逐元素开平方。
- `UnsignedSqrt(X)`：对序列 X 逐元素先取绝对值，再开平方。
- `SignedSqrt(X)`：对序列 X 逐元素先取绝对值开平方，再保留原符号。
- `Square(X)`：对序列 X 逐元素平方。
- `Curt(X)`：对序列 X 逐元素取立方根。
- `UnsignedCurt(X)`：对序列 X 逐元素先取绝对值，再取立方根。
- `SignedCurt(X)`：对序列 X 逐元素先取绝对值立方根，再保留原符号。
- `Cube(X)`：对序列 X 逐元素立方。
- `Log(X)`：对序列 X 逐元素取自然对数。
- `UnsignedLog(X)`：对序列 X 逐元素先取绝对值，再取自然对数。
- `SignedLog(X)`：对序列 X 逐元素先取绝对值自然对数，再保留原符号。
- `Exp(X)`：对序列 X 逐元素取指数。
- `TanH(X)`：对序列 X 逐元素计算双曲正切。
- `Sigmoid(X)`：对序列 X 逐元素计算 sigmoid。
- `ReLU(X)`：对序列 X 逐元素计算 ReLU。
- `GeLU(X)`：对序列 X 逐元素计算 GeLU。
- `UnaryCount(X)`：在横截面维度上统计 X 的非空元素个数。
- `UnarySum(X)`：在横截面维度上对 X 的所有元素求和。
- `UnaryProd(X)`：在横截面维度上对 X 的所有元素求积。
- `UnaryMean(X)`：在横截面维度上计算 X 的均值。
- `UnaryMed(X)`：在横截面维度上计算 X 的中位数。
- `UnaryMad(X)`：在横截面维度上计算 X 的中位绝对偏差。
- `UnaryVar(X)`：在横截面维度上计算 X 的方差。
- `UnaryStd(X)`：在横截面维度上计算 X 的标准差。
- `UnaryIncv(X)`：在横截面维度上计算 X 的逆变异系数。
- `UnarySkew(X)`：在横截面维度上计算 X 的偏度。
- `UnaryKurt(X)`：在横截面维度上计算 X 的峰度。
- `UnaryRank(X)`：在横截面维度上对 X 做升序排名。
- `UnaryDescendRank(X)`：在横截面维度上对 X 做降序排名。
- `UnaryMax(X)`：在横截面维度上取 X 的最大值。
- `UnaryMin(X)`：在横截面维度上取 X 的最小值。
- `UnaryCentral(X)`：在横截面维度上对 X 做去均值中心化。
- `UnaryZScoreNorm(X)`：在横截面维度上对 X 做 Z-score 标准化。
- `UnaryL1Norm(X)`：在横截面维度上对 X 做 L1 归一化。
- `UnaryL2Norm(X)`：在横截面维度上对 X 做 L2 归一化。
- `UnaryMinMaxNorm(X)`：在横截面维度上对 X 做 Min-Max 归一化。
- `UnarySoftmax(X)`：在横截面维度上对 X 做 Softmax 变换。

## 4.2 Binary Operators

- `Add(X, Y)`：对 X 和 Y 逐元素相加。
- `Sub(X, Y)`：对 X 和 Y 逐元素相减，计算 X 减 Y。
- `Mul(X, Y)`：对 X 和 Y 逐元素相乘。
- `Div(X, Y)`：对 X 和 Y 逐元素相除，计算 X 除以 Y。
- `Pow(X, Y)`：对 X 和 Y 逐元素做幂运算，计算 X 的 Y 次幂。
- `UnsignedPow(X, Y)`：对 X 逐元素先取绝对值，再做 Y 次幂运算。
- `SignedPow(X, Y)`：对 X 逐元素先取绝对值做 Y 次幂，再乘回原始符号。
- `BinaryLog(X, Y)`：对 X 逐元素以 Y 为底取对数。
- `UnsignedBinaryLog(X, Y)`：对 X 和 Y 逐元素先取绝对值，再以 `Abs(Y)` 为底对 `Abs(X)` 取对数。
- `SignedBinaryLog(X, Y)`：对 X 和 Y 逐元素先按绝对值取对数，再乘回 X 的原始符号。
- `BinaryMax(X, Y)`：对 X 和 Y 逐元素比较，取两者中较大值。
- `BinaryMin(X, Y)`：对 X 和 Y 逐元素比较，取两者中较小值。
- `BinaryCov(X, Y)`：在横截面维度上计算 X 和 Y 的协方差。
- `BinaryPearson(X, Y)`：在横截面维度上计算 X 和 Y 的 Pearson 相关系数。
- `BinarySpearman(X, Y)`：在横截面维度上计算 X 和 Y 的 Spearman 秩相关系数。
- `BinaryAlpha(X, Y)`：在横截面维度上对 Y 关于 X 做线性回归，取 alpha 系数。
- `BinaryBeta(X, Y)`：在横截面维度上对 Y 关于 X 做线性回归，取 beta 系数。
- `BinaryResidual(X, Y)`：在横截面维度上对 Y 关于 X 做线性回归，取回归残差。

## 4.3 Ternary Operators

- `PositiveCond(C, X, Y)`：若 `C` 为正，返回 `X`，否则返回 `Y`。
- `NonNegativeCond(C, X, Y)`：若 `C` 非负，返回 `X`，否则返回 `Y`。
- `NegativeCond(C, X, Y)`：若 `C` 为负，返回 `X`，否则返回 `Y`。
- `NonPositiveCond(C, X, Y)`：若 `C` 非正，返回 `X`，否则返回 `Y`。
- `FiniteCond(C, X, Y)`：若 `C` 有限，返回 `X`，否则返回 `Y`。

## 4.4 Rolling Operators

- `RollingCount(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内统计有效元素个数。
- `RollingSum(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内所有元素求和。
- `RollingProd(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内所有元素求积。
- `RollingMean(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算均值。
- `RollingMed(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算中位数。
- `RollingMad(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算中位绝对偏差。
- `RollingVar(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算方差。
- `RollingStd(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算标准差。
- `RollingIncv(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算逆变异系数。
- `RollingSkew(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算偏度。
- `RollingKurt(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内计算峰度。
- `RollingMax(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内取最大值。
- `RollingMin(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内取最小值。
- `Argmax(X, Bar)`：返回序列 X 在长度为 Bar 的滚动窗口内最大值所在位置。
- `Argmin(X, Bar)`：返回序列 X 在长度为 Bar 的滚动窗口内最小值所在位置。
- `ArgmaxArgmin(X, Bar)`：返回序列 X 在长度为 Bar 的滚动窗口内最大值位置与最小值位置之差。
- `RollingRank(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内对当前值做升序排名。
- `RollingDescendRank(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内对当前值做降序排名。
- `RollingCentral(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做去均值中心化。
- `RollingZScoreNorm(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做 Z-score 标准化。
- `RollingL1Norm(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做 L1 归一化。
- `RollingL2Norm(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做 L2 归一化。
- `RollingMinMaxNorm(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做 Min-Max 归一化。
- `RollingSoftmax(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做 Softmax 变换。
- `DecayLinear(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做线性衰减加权。
- `DescendDecayLinear(X, Bar)`：对序列 X 在长度为 Bar 的滚动窗口内做降序线性衰减加权。

## 4.5 Shifting Operators

- `Ref(X, Bar)`：返回序列 X 向前偏移 Bar 期后的值。
- `Delta(X, Bar)`：返回序列 X 当前值与 Bar 期前数值的差。
- `Ratio(X, Bar)`：返回序列 X 当前值与 Bar 期前数值的比值。
- `DeltaRatio(X, Bar)`：返回序列 X 当前值相对 Bar 期前数值的变化率。

## 4.6 Pair Rolling Operators

- `PairRollingCov(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内计算协方差。
- `PairRollingPearson(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内计算 Pearson 相关系数。
- `PairRollingSpearman(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内计算 Spearman 秩相关系数。
- `PairRollingAlpha(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内做线性回归，取 alpha 系数。
- `PairRollingBeta(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内做线性回归，取 beta 系数。
- `PairRollingResidual(X, Y, Bar)`：对序列 X 和 Y 在长度为 Bar 的滚动窗口内做线性回归，取回归残差。

## 4.7 Moving Average Operators

- `SMA(X, Constant1, Constant2)`：对序列 X 计算加权平滑移动平均，公式为 `SMA[i] = (SMA[i-1] * (Constant2 - Constant1) + X[i] * Constant1) / Constant2`。
- `EMA(X, Constant)`：对序列 X 计算指数移动平均，公式为 `EMA[i] = EMA[i-1] * (1 - Constant) + X[i] * Constant`。
