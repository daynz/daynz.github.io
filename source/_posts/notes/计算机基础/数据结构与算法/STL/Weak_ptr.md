---
title: "Weak_ptr"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Weak_ptr.html
tags: [计算机基础]
---

# `STL-weak_ptr`

定义于头文件 `<memory>` (C++11起)

```c++
template<class T> class weak_ptr;
```

`std::weak_ptr` 是一个智能指针，提供对 `std::shared_ptr` 管理的对象的非拥有型引用，不会影响引用计数，用于打破 `shared_ptr` 的循环引用问题。

*未定义行为：解引用已过期（expired）的 `weak_ptr` 或访问无效的 `weak_ptr` 会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::weak_ptr` 支持多种构造方式，初始化弱引用。

```c++
// 1. 默认构造（空weak_ptr）
std::weak_ptr<int> wp1;

// 2. 从shared_ptr构造
std::shared_ptr<int> sp(new int(42));
std::weak_ptr<int> wp2(sp);

// 3. 从另一weak_ptr构造（拷贝构造）
std::weak_ptr<int> wp3(wp2);

// 4. 移动构造 (C++11起)
std::weak_ptr<int> wp4 = std::move(wp3); // wp3变为空

// 5. 从nullptr构造（等效默认构造）
std::weak_ptr<int> wp5(nullptr);
```

#### 析构函数

销毁 `weak_ptr`，不影响被引用的对象（不减少引用计数）。

#### operator=

以来自另一 `weak_ptr` 或 `shared_ptr` 的弱引用重写 `weak_ptr` 的内容。

```c++
// 1. 拷贝赋值
std::shared_ptr<int> sp(new int(10));
std::weak_ptr<int> wp1 = sp;
std::weak_ptr<int> wp2;
wp2 = wp1; // wp2现在引用同一对象

// 2. 移动赋值 (C++11起)
std::weak_ptr<int> wp3;
wp3 = std::move(wp1); // wp1变为空

// 3. 从shared_ptr赋值
std::shared_ptr<int> sp2(new int(20));
wp3 = sp2; // wp3现在引用sp2的对象

// 4. 从nullptr赋值
wp3 = nullptr; // wp3变为空
```

### 元素访问

*注意：`std::weak_ptr` 不提供直接访问操作（如 `operator\*` 或 `operator->`），需通过 `lock()` 获取 `shared_ptr` 来访问对象。*

#### `lock`

返回一个 `std::shared_ptr`，若 `weak_ptr` 未过期则共享对象所有权，否则返回空 `shared_ptr`。

```c++
std::shared_ptr<int> sp = std::make_shared<int>(42);
std::weak_ptr<int> wp = sp;
auto locked_sp = wp.lock(); // 获取shared_ptr
if (locked_sp) {
    std::cout << "*locked_sp: " << *locked_sp << "\n"; // 输出 42
}
sp.reset(); // 释放shared_ptr
locked_sp = wp.lock(); // 返回空shared_ptr
if (!locked_sp) {
    std::cout << "wp is expired\n"; // 输出
}
```

### 修改器

| 函数            | 描述                       |
| --------------- | -------------------------- |
| `reset` (C++11) | 清空弱引用                 |
| `swap` (C++11)  | 交换两个 `weak_ptr` 的内容 |

```c++
// reset 示例
std::shared_ptr<int> sp(new int(10));
std::weak_ptr<int> wp = sp;
wp.reset(); // wp变为空

// swap 示例
std::shared_ptr<int> sp1(new int(30));
std::shared_ptr<int> sp2(new int(40));
std::weak_ptr<int> wp1 = sp1;
std::weak_ptr<int> wp2 = sp2;
wp1.swap(wp2); // wp1引用sp2的对象，wp2引用sp1的对象
```

### 观察器

| 函数                   | 描述                                     |
| ---------------------- | ---------------------------------------- |
| `use_count` (C++11)    | 返回关联 `shared_ptr` 的引用计数         |
| `expired` (C++11)      | 检查弱引用是否已过期（对象是否已被释放） |
| `owner_before` (C++11) | 比较控制块的所有权                       |

```c++
// use_count 示例
std::shared_ptr<int> sp(new int(42));
std::weak_ptr<int> wp = sp;
std::cout << "wp.use_count(): " << wp.use_count() << "\n"; // 输出 1
{
    std::shared_ptr<int> sp2 = sp;
    std::cout << "wp.use_count(): " << wp.use_count() << "\n"; // 输出 2
}
std::cout << "wp.use_count(): " << wp.use_count() << "\n"; // 输出 1

// expired 示例
sp.reset();
if (wp.expired()) {
    std::cout << "wp is expired\n"; // 输出
}
```

### 非成员函数

| 函数                               | 描述                          |
| ---------------------------------- | ----------------------------- |
| `operator==`                       | 比较 `weak_ptr`（比较指针值） |
| `operator!= < <= > >=`             | (C++20 中移除)                |
| `operator<=>`                      | C++20                         |
| `std::swap`(std::weak_ptr) (C++11) | 特化 std::swap 算法           |

```c++
// operator== 示例
std::shared_ptr<int> sp(new int(42));
std::weak_ptr<int> wp1 = sp;
std::weak_ptr<int> wp2 = sp;
bool equal = (wp1 == wp2); // true

// std::swap 示例
std::shared_ptr<int> sp1(new int(30));
std::shared_ptr<int> sp2(new int(40));
std::weak_ptr<int> wp3 = sp1;
std::weak_ptr<int> wp4 = sp2;
std::swap(wp3, wp4); // wp3引用sp2的对象，wp4引用sp1的对象
```