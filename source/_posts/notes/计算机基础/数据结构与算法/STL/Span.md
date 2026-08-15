---
title: "Span"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Span.html
tags: [计算机基础]
---

# `STL-span`

定义于头文件 `<span>` (C++20起)

```c++
template<
    class T,
    std::size_t Extent = std::dynamic_extent
> class span;
```

`std::span` 是一个非拥有型视图容器，提供对连续内存块的轻量级访问，支持固定或动态大小的序列。

*未定义行为：访问超出 `span` 范围的元素或使用无效的迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::span` 支持多种构造方式，初始化视图范围。

```c++
// 1. 默认构造（空span，仅动态大小）
std::span<int> sp1;

// 2. 从指针和大小构造（动态大小）
int arr[] = {1, 2, 3, 4, 5};
std::span<int> sp2(arr, 5);

// 3. 从指针和结束指针构造（动态大小）
std::span<int> sp3(arr, arr + 5);

// 4. 从数组构造（固定大小）
std::span<int, 5> sp4(arr);

// 5. 从容器构造（动态大小，C++20起）
std::vector<int> vec = {1, 2, 3};
std::span<int> sp5(vec);

// 6. 拷贝构造
std::span<int> sp6(sp2);

// 7. 从固定大小span构造（仅当Extent兼容）
std::span<int, 5> sp7(sp4);

// 8. 从动态大小span构造固定大小span（需大小匹配）
std::span<int, 5> sp8(sp2); // 需确保sp2大小为5
```

#### 析构函数

`std::span` 不管理内存，无需销毁任何元素。

#### operator=

以来自另一 span 的范围重写 span 的内容。

```c++
// 1. 拷贝赋值
std::span<int> sp1;
int arr[] = {1, 2, 3};
std::span<int> sp2(arr, 3);
sp1 = sp2; // sp1现在引用arr的前3个元素

// 2. 固定大小span赋值
std::span<int, 3> sp3;
sp3 = sp2; // 需确保sp2大小为3
```

### 元素访问

#### `operator[]`

访问指定位置的元素，无越界检查。

```c++
int arr[] = {1, 2, 3, 4, 5};
std::span<int> sp(arr, 5);

std::cout << "sp[0]: " << sp[0] << "\n";
sp[1] = 100;
std::cout << "After sp[1]=100: " << sp[1] << "\n";
```

*未定义行为：通过此运算符访问超出范围的元素是未定义行为。*

#### `at` (C++26起)

访问指定位置的元素，进行越界检查。

```c++
int arr[] = {1, 2, 3, 4, 5};
std::span<int> sp(arr, 5);
const std::span<int> csp(arr, 5);

try {
    std::cout << "sp.at(2): " << sp.at(2) << "\n";
    std::cout << "csp.at(3): " << csp.at(3) << "\n";
    sp.at(10) = 100; // 越界访问
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若 `!(pos < size())` 则抛出 `std::out_of_range`。

| 函数            | 描述                   |
| --------------- | ---------------------- |
| `front` (C++20) | 访问第一个元素         |
| `back` (C++20)  | 访问最后一个元素       |
| `data` (C++20)  | 返回指向底层数据的指针 |

*未定义行为：对空 span 调用 `front` 或 `back` 是未定义行为。*

### 迭代器

| 迭代器                     | 描述                     |
| -------------------------- | ------------------------ |
| `begin` `cbegin` (C++20)   | 返回指向起始的迭代器     |
| `end` `cend` (C++20)       | 返回指向末尾的迭代器     |
| `rbegin` `crbegin` (C++20) | 返回指向起始的逆向迭代器 |
| `rend` `crend` (C++20)     | 返回指向末尾的逆向迭代器 |

### 容量

| 函数                 | 描述               |
| -------------------- | ------------------ |
| `empty` (C++20)      | 检查 span 是否为空 |
| `size` (C++20)       | 返回元素数量       |
| `size_bytes` (C++20) | 返回元素占用字节数 |

### 子视图

| 函数              | 描述                        |
| ----------------- | --------------------------- |
| `first` (C++20)   | 返回前 N 个元素的子 span    |
| `last` (C++20)    | 返回后 N 个元素的子 span    |
| `subspan` (C++20) | 返回从指定位置开始的子 span |

```c++
int arr[] = {1, 2, 3, 4, 5};
std::span<int> sp(arr, 5);

auto sp_first = sp.first(3); // {1, 2, 3}
auto sp_last = sp.last(2);   // {4, 5}
auto sp_sub = sp.subspan(1, 3); // {2, 3, 4}
```

### 观察器

| 函数             | 描述                                     |
| ---------------- | ---------------------------------------- |
| `extent` (C++20) | 返回 span 的大小（编译期常量或动态大小） |

### 非成员函数

| 函数                             | 描述                               |
| -------------------------------- | ---------------------------------- |
| `operator==`                     | 比较 span 中的元素                 |
| `operator!= < <= > >=`           | (C++20 中移除)                     |
| `operator<=>`                    | C++20                              |
| `std::as_bytes` (C++20)          | 将 span 转换为字节视图             |
| `std::as_writable_bytes` (C++20) | 将非 const span 转换为可写字节视图 |

```c++
// as_bytes 示例
int arr[] = {1, 2, 3};
std::span<int> sp(arr, 3);
auto byte_view = std::as_bytes(sp); // 字节视图
std::span<const std::byte> byte_span = byte_view;

// as_writable_bytes 示例
auto writable_byte_view = std::as_writable_bytes(sp); // 可写字节视图
```