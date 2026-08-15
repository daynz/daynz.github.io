---
title: "Auto_ptr"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Auto_ptr.html
tags: [计算机基础]
---

# `STL-auto_ptr`

定义于头文件 `<memory>` (C++98起，C++11弃用，C++17移除)

```c++
template<class T> class auto_ptr;
```

`std::auto_ptr` 是一个智能指针，独占拥有动态分配的对象，确保资源在作用域结束时自动释放。由于其设计缺陷（如拷贝时转移所有权），已被 `std::unique_ptr` 取代，C++17起移除，仅在旧代码中可能遇到。

*未定义行为：解引用空或无效的 `auto_ptr`、多次删除同一对象或在对象释放后访问会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::auto_ptr` 支持多种构造方式，初始化指针。

```c++
// 1. 默认构造（空auto_ptr）
std::auto_ptr<int> ap1;

// 2. 从原始指针构造
int* raw = new int(42);
std::auto_ptr<int> ap2(raw);

// 3. 拷贝构造（转移所有权）
std::auto_ptr<int> ap3(ap2); // ap2变为空

// 4. 从另一auto_ptr构造（不同类型，需可转换）
struct Base {};
struct Derived : Base {};
std::auto_ptr<Derived> ap4(new Derived);
std::auto_ptr<Base> ap5(ap4); // ap4变为空
```

#### 析构函数

销毁 `auto_ptr` 管理的对象（通过 `delete`），若指针非空则释放资源。

#### operator=

以来自另一 `auto_ptr` 的资源重写 `auto_ptr` 的内容，转移所有权。

```c++
// 1. 拷贝赋值（转移所有权）
std::auto_ptr<int> ap1(new int(10));
std::auto_ptr<int> ap2;
ap2 = ap1; // ap1变为空，ap2接管资源

// 2. 拷贝赋值（不同类型，需可转换）
std::auto_ptr<Derived> ap3(new Derived);
std::auto_ptr<Base> ap4;
ap4 = ap3; // ap3变为空，ap4接管资源
```

### 元素访问

#### `operator*`

解引用获取管理的对象。

```c++
std::auto_ptr<int> ap(new int(42));
std::cout << "*ap: " << *ap << "\n"; // 输出 42
*ap = 100; // 修改对象
std::cout << "After *ap=100: " << *ap << "\n"; // 输出 100
```

#### `operator->`

访问管理的对象的成员。

```c++
struct S { int x; };
std::auto_ptr<S> ap(new S{42});
std::cout << "ap->x: " << ap->x << "\n"; // 输出 42
ap->x = 100;
std::cout << "After ap->x=100: " << ap->x << "\n"; // 输出 100
```

*未定义行为：对空 `auto_ptr` 调用 `operator\*` 或 `operator->` 是未定义行为。*

#### `get`

返回管理的原始指针。

```c++
std::auto_ptr<int> ap(new int(42));
int* raw = ap.get(); // 获取原始指针
std::cout << "*raw: " << *raw << "\n"; // 输出 42
```

### 修改器

| 函数              | 描述                     |
| ----------------- | ------------------------ |
| `release` (C++98) | 释放所有权并返回原始指针 |
| `reset` (C++98)   | 替换管理的对象           |

```c++
// release 示例
std::auto_ptr<int> ap1(new int(42));
int* raw = ap1.release(); // ap1变为空，raw接管资源
delete raw; // 需手动释放

// reset 示例
std::auto_ptr<int> ap2(new int(10));
ap2.reset(new int(20)); // 原对象被删除，ap2管理新对象
ap2.reset(); // 释放资源，ap2变为空
```

### 观察器

| 函数                    | 描述                     |
| ----------------------- | ------------------------ |
| `operator bool` (C++98) | 检查是否管理对象（非空） |

```c++
std::auto_ptr<int> ap1;
std::auto_ptr<int> ap2(new int(42));
if (!ap1) std::cout << "ap1 is null\n"; // 输出
if (ap2) std::cout << "ap2 is not null\n"; // 输出
```

### 非成员函数

| 函数         | 描述                          |
| ------------ | ----------------------------- |
| `operator==` | 比较 `auto_ptr`（比较指针值） |
| `operator!=` | 比较 `auto_ptr`（比较指针值） |

```c++
// operator== 示例
std::auto_ptr<int> ap1(new int(42));
std::auto_ptr<int> ap2 = ap1; // ap1变为空
bool equal = (ap1 == ap2); // false，ap1为空
```