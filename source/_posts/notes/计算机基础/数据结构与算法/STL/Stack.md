---
title: "Stack"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Stack.html
tags: [计算机基础]
---

# `STL-stack`

定义于头文件 `<stack>` (C++98起)

```c++
template<
    class T,
    class Container = std::deque<T>
> class stack;
```

`std::stack` 是一个容器适配器，提供后进先出（LIFO）栈功能，基于底层容器（默认 `std::deque`）。

*未定义行为：对空栈调用 `top` 或 `pop` 会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::stack` 支持多种构造方式，初始化元素或配置底层容器。

```c++
// 1. 默认构造（空栈）
std::stack<int> stk1;

// 2. 指定底层容器
std::stack<int, std::vector<int>> stk2;

// 3. 从容器构造
std::vector<int> vec = {1, 2, 3};
std::stack<int, std::vector<int>> stk3(vec);

// 4. 拷贝构造
std::stack<int> stk4(stk1);

// 5. 移动构造 (C++11起)
std::stack<int> stk5 = std::move(stk1); // stk1变为空

// 6. 从容器构造并指定容器类型
std::deque<int> deq = {4, 5, 6};
std::stack<int, std::deque<int>> stk6(deq);
```

#### 析构函数

销毁 stack 的所有元素并释放底层容器的内存.

#### operator=

以来自另一 stack 的元素重写 stack 的内容。

```c++
// 1. 拷贝赋值
std::stack<int> stk1;
stk1.push(1); stk1.push(2);
std::stack<int> stk2;
stk2 = stk1; // stk2现在包含{1, 2}（底部到顶部）

// 2. 移动赋值 (C++11起)
std::stack<int> stk3;
stk3 = std::move(stk1); // stk1变为空
```

### 元素访问

#### `top`

访问栈顶元素。

```c++
std::stack<int> stk;
stk.push(1); stk.push(2);
const std::stack<int> cstk = stk;

std::cout << "stk.top(): " << stk.top() << "\n"; // 输出 2
std::cout << "cstk.top(): " << cstk.top() << "\n"; // 输出 2
stk.top() = 100; // 修改栈顶元素
std::cout << "After stk.top()=100: " << stk.top() << "\n"; // 输出 100
```

*未定义行为：对空栈调用 `top` 是未定义行为。*

### 容量

| 函数            | 描述             |
| --------------- | ---------------- |
| `empty` (C++98) | 检查栈是否为空   |
| `size` (C++98)  | 返回当前元素数量 |

### 修改器

| 函数              | 描述                 |
| ----------------- | -------------------- |
| `push` (C++98)    | 插入元素到栈顶       |
| `emplace` (C++11) | 构造并插入元素到栈顶 |
| `pop` (C++98)     | 移除栈顶元素         |
| `swap` (C++11)    | 交换内容             |

```c++
// push 示例
std::stack<int> stk;
stk.push(1); // 栈包含{1}
stk.push(2); // 栈包含{1, 2}

// emplace 示例
stk.emplace(3); // 栈包含{1, 2, 3}

// pop 示例
stk.pop(); // 栈包含{1, 2}

// swap 示例
std::stack<int> stk1;
stk1.push(1); stk1.push(2);
std::stack<int> stk2;
stk2.push(3);
stk1.swap(stk2); // stk1包含{3}，stk2包含{1, 2}
```

*未定义行为：对空栈调用 `pop` 是未定义行为。*

### 底层容器访问

| 函数        | 描述                                             |
| ----------- | ------------------------------------------------ |
| `c` (C++98) | 访问底层容器（受保护成员，需通过继承或友元访问） |

*注意：`std::stack` 不直接公开底层容器，需通过自定义方式访问（如继承）。*

### 非成员函数

| 函数                            | 描述                |
| ------------------------------- | ------------------- |
| `operator==`                    | 比较 stack 中的元素 |
| `operator!= < <= > >=`          | (C++20 中移除)      |
| `operator<=>`                   | C++20               |
| `std::swap`(std::stack) (C++11) | 特化 std::swap 算法 |

```c++
// operator== 示例
std::stack<int> stk1;
stk1.push(1); stk1.push(2);
std::stack<int> stk2;
stk2.push(1); stk2.push(2);
bool equal = (stk1 == stk2); // true

// std::swap 示例
std::stack<int> stk3;
stk3.push(3);
std::swap(stk1, stk3); // stk1包含{3}，stk3包含{1, 2}
```