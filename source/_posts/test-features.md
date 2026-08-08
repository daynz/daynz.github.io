---
title: 功能测试
date: 2026-08-08 16:45:00
tags: [测试]
categories: [测试]
---

## 数学公式

行内公式：$E = mc^2$ 和 $e^{i\pi} + 1 = 0$。

行间公式：

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

## mermaid 流程图

```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[处理]
    B -->|否| D[结束]
    C --> D
```

## plantuml 时序图

```plantuml
@startuml
Alice -> Bob: 你好
Bob --> Alice: 你好呀
@enduml
```

## 代码块

```javascript
function hello(name) {
  console.log('Hello, ' + name + '!');
}
hello('World');
```
