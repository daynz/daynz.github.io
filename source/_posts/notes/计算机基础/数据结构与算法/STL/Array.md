---
title: "Array"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Array.html
tags: [计算机基础]
---

# `STL-array`

定义于头文件 `<array>`(C++11起)

```c++
template<
	class T,
	std::size_t N 
> struct array;
```

`std::array` 是封装固定大小数组的容器。

*未定义行为：当其长度为零时 `array` （ `N == 0` ）有特殊情况。此时， `array.begin() == array.end()` ，并拥有某个唯一值。在零长 array 上调用 front() 或 back() 是未定义的。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

遵循聚合初始化的规则初始化 `array` （注意默认初始化可以导致非类的 T 的不确定值）

```C++
// 1. 默认构造（元素未初始化）
std::array<int, 3> arr1;

// 2. 移动构造（实际是拷贝）
std::array<int, 5> arr4 = std::move(arr3);// arr3 仍然有效

// 3. 统一初始化
std::array<int, 5> arr5{ {7, 8, 9, 10, 11} };
std::array<int, 5> arr5{ 7, 8, 9, 10, 11 }; // C++17 起可以单括号
```

#### 析构函数

销毁 array 的每个元素

#### operator=

以来自另一 array 的每个元素重写 array 的对应元素

```c++
// 1. 聚合初始化
std::array<int, 5> arr2 = { 1, 2, 3, 4, 5 };

// 2. 拷贝构造
std::array<int, 5> arr3 = arr2;
```

### 元素访问

#### `at`

访问指定的元素，同时进行越界检查

```c++
std::array<int, 5> arr = { 1, 2, 3, 4, 5 };
const std::array<int, 5> carr = { 10, 20, 30, 40, 50 };

try {
	std::cout << "arr.at(2): " << arr.at(2) << "\n";
	std::cout << "carr.at(3): " << carr.at(3) << "\n";
	arr.at(10) = 100; // 越界访问
}
catch (const std::out_of_range& e) {
	std::cout << "Exception: " << e.what() << "\n";
}
```

若 `!(pos < size())` 则抛出 `std::out_of_range`

#### `operator[]`

访问指定的元素

```c++
std::array<int, 5> arr = { 1, 2, 3, 4, 5 };
const std::array<int, 5> carr = { 10, 20, 30, 40, 50 };

std::cout << "arr[0]: " << arr[0] << "\n";
arr[1] = 100;
std::cout << "After arr[1]=100: " << arr[1] << "\n";
```

*未定义行为：通过此运算符访问不存在的元素是未定义行为*

| 函数 | 描述 |
| --- | --- |
| `front` (C++11) | 访问第一个元素 |
| `back` (C++11) | 访问最后一个元素 |
| `data` (C++11) | 直接访问底层数组(若 size() 为 0 ，则可能或可能不返回空指针。) |

### 迭代器

| 迭代器 | 描述 |
| --- | --- |
| `begin` `cbegin` (C++11) | 返回指向起始的迭代器 |
| `end` `cend` (C++11) | 返回指向末尾的迭代器 |
| `rbegin` `crbegin` (C++11) | 返回指向起始的逆向迭代器 |
| `rend` `crend` (C++11) | 返回指向末尾的逆向迭代器 |

### 容量

| 函数 | 描述 |
| --- | --- |
| `empty` (C++11) | 检查容器是否为空 |
| `size` (C++11) | 返回容纳的元素数 |
| `max_size` (C++11) | 返回可容纳的最大元素数 |

### 操作

| 函数 | 描述 |
| --- | --- |
| `fill` (C++11) | 以指定值填充容器 |
| `swap` (C++11) | 交换内容 |

### 非成员函数

| 函数 | 描述 |
| --- | --- |
| `operator==` | 按照字典顺序比较 array 中的值 |
| `operator!= < <= > >=` | (C++20 中移除) |
| `operator<=>` | C++20 |
| `std::get`(std::array) | 访问 `array` 的一个元素 |
| `std::swap`(std::array) (C++11) | 特化 std::swap 算法 |
| `to_array` (C++20) | 从内建数组创建 `std::array` 对象 |

### 辅助类

| 函数 | 描述 |
| --- | --- |
| std::tuple_size (C++11) | 获得 `array` 的大小 (类模板特化) |
| std::tuple_element (C++11) | 获得 `array` 元素的类型 (类模板特化) |

```c++
//std::tuple_size
std::array<int, 5> arr = {1, 2, 3, 4, 5};
constexpr size_t size = std::tuple_size<decltype(arr)>::value;//编译期即可确定数组大小
//应用
//1. 元编程中需要在编译期获取 std::array 大小的场景。
//2. 模板函数中需要根据数组大小进行分支处理时。

//std::tuple_element
std::array<int, 3> arr = {10, 20, 30};

using elem_type = std::tuple_element<0, decltype(arr)>::type;
std::cout << "元素类型: " << typeid(elem_type).name() << std::endl;  // 输出可能为 "int"
// 使用获取的类型定义变量
elem_type value = arr[0];  // 等价于 int value = arr[0]
//1. 元编程中需要根据索引获取 std::array 元素类型时。
//2. 编写泛型代码时，需动态适配数组元素类型的场景。
```