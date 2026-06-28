# 快递计算器（重量 / 体积）

一个独立的小工具，用于比较快递包裹的**实际重量**与**体积重量**，自动取较大者作为**计费重量**，并提示是「按千克」还是「按体积」计费。

> 该项目是一个独立的纯前端工具，与本仓库的 Mintlify 文档内容相互独立。

## 计算规则

| 项目 | 公式 |
| --- | --- |
| 实际重量 | 直接输入的千克数 (kg) |
| 体积重量 | 长 × 宽 × 高 (cm) ÷ 9000 |
| 计费重量 | `max(实际重量, 体积重量)` |
| 计费方式 | 体积重量更大 → 按体积；否则 → 按千克 |

> 除数默认为 **9000**，页面上可按需修改（部分承运商使用 5000 / 6000 等）。

## 使用方法

直接用浏览器打开 `index.html` 即可，无需任何构建步骤或依赖。

```
shipping-calculator/
├── index.html      # 页面结构
├── style.css       # 样式
├── calculator.js   # 计算逻辑 + 交互
└── README.md
```

## 核心函数

`calculator.js` 中的 `calcShipping()` 同时可在 Node.js 中引入用于测试：

```js
const { calcShipping } = require('./calculator.js');

// 实际 5kg，尺寸 60×40×30cm，除数 9000
calcShipping(5, 60, 40, 30, 9000);
// => { actual: 5, volumetric: 8, chargeable: 8, method: 'volume' }
```
