---
title: "Vector"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Vector.html
tags: [计算机基础]
---

# `STL-vector`

定义于头文件 `<vector>` (C++98起)

```c++
template<
    class T,
    class Allocator = std::allocator<T>
> class vector;
```

`std::vector` 是封装动态数组的顺序容器。

vector 的存储是自动管理的，按需扩张收缩。 `vector` 通常占用多于静态数组的空间，因为要分配更多内存以管理将来的增长。 `vector` 所用的方式不在每次插入元素时，而只在额外内存耗尽时重分配。分配的内存总量可用 [capacity()](mk:@MSITStore:D:\eBook\cppreference-zh.chm::/chmhelp/cpp-container-vector-capacity.html) 函数查询。可通过调用 [shrink_to_fit()](mk:@MSITStore:D:\eBook\cppreference-zh.chm::/chmhelp/cpp-container-vector-shrink_to_fit.html) 返回多出的内存给系统。 (C++11 起)

*未定义行为：当访问超出当前大小的元素或迭代器越界时，会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::vector` 支持多种构造方式，初始化元素或分配内存。

```c++
// 定义一个分配器（通常使用默认分配器）
std::allocator<int> alloc;

// 1. 默认构造（空vector）
std::vector<int> vec1;

// 2. 指定大小并默认初始化
std::vector<int> vec2(5); // 5个默认初始化的元素（值为0）

// 3. 指定大小和初始值
std::vector<int> vec3(5, 10); // 5个值为10的元素

// 4. 初始化列表 (C++11起)
std::vector<int> vec4 = {1, 2, 3, 4, 5};

// 5. 拷贝构造（带分配器参数）
std::vector<int> vec5(vec4, alloc); // 拷贝vec4的元素，使用指定分配器

// 6. 移动构造 (C++11起)
std::vector<int> vec6(std::move(vec5), alloc); // 移动vec5的资源，使用指定分配器，vec5变为空

// 7. 使用分配器构造空vector
std::vector<int> vec7(alloc); // 构造空vector，使用指定分配器

// 8. 范围构造（带分配器）
int arr[] = {10, 20, 30, 40};
std::vector<int> vec8(std::begin(arr), std::end(arr), alloc); // 从数组范围构造，使用指定分配器

// 9. 初始化列表构造（带分配器）
std::vector<int> vec9({1, 2, 3}, alloc); // 从初始化列表构造，使用指定分配器
```

#### 析构函数

销毁 vector 的所有元素并释放内存。

#### operator=

以来自另一 vector 的元素重写 vector 的内容。

```c++
// 1. 拷贝赋值
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2;
vec2 = vec1; // vec2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::vector<int> vec3;
vec3 = std::move(vec1); // vec1变为空

// 3. 初始化列表赋值 (C++11起)
vec3 = {4, 5, 6};
```

### 元素访问

#### `at`

访问指定位置的元素，同时进行越界检查。

```c++
std::vector<int> vec = {1, 2, 3, 4, 5};
const std::vector<int> cvec = {10, 20, 30, 40, 50};

try {
    std::cout << "vec.at(2): " << vec.at(2) << "\n";
    std::cout << "cvec.at(3): " << cvec.at(3) << "\n";
    vec.at(10) = 100; // 越界访问
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若 `!(pos < size())` 则抛出 `std::out_of_range`。

#### `operator[]`

访问指定位置的元素，无越界检查。

```c++
std::vector<int> vec = {1, 2, 3, 4, 5};
const std::vector<int> cvec = {10, 20, 30, 40, 50};

std::cout << "vec[0]: " << vec[0] << "\n";
vec[1] = 100;
std::cout << "After vec[1]=100: " << vec[1] << "\n";
```

*未定义行为：通过此运算符访问不存在的元素是未定义行为。*

| 函数            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `front` (C++98) | 访问第一个元素                                               |
| `back` (C++98)  | 访问最后一个元素                                             |
| `data` (C++11)  | 直接访问底层数组（若 size() 为 0，则可能或可能不返回空指针） |

### 迭代器

| 迭代器                     | 描述                     |
| -------------------------- | ------------------------ |
| `begin` `cbegin` (C++11)   | 返回指向起始的迭代器     |
| `end` `cend` (C++11)       | 返回指向末尾的迭代器     |
| `rbegin` `crbegin` (C++11) | 返回指向起始的逆向迭代器 |
| `rend` `crend` (C++11)     | 返回指向末尾的逆向迭代器 |

### 容量

| 函数                    | 描述                       |
| ----------------------- | -------------------------- |
| `empty` (C++98)         | 检查容器是否为空           |
| `size` (C++98)          | 返回当前元素数量           |
| `max_size` (C++98)      | 返回可容纳的最大元素数量   |
| `reserve` (C++98)       | 预分配存储空间             |
| `capacity` (C++98)      | 返回当前分配的存储空间大小 |
| `shrink_to_fit` (C++11) | 请求释放未使用的内存       |

### 修改器

| 函数                   | 描述                     |
| ---------------------- | ------------------------ |
| `clear` (C++98)        | 移除所有元素             |
| `insert` (C++98)       | 在指定位置插入元素       |
| `emplace` (C++11)      | 在指定位置构造元素       |
| `erase` (C++98)        | 移除指定位置的元素或范围 |
| `push_back` (C++98)    | 在末尾添加元素           |
| `emplace_back` (C++11) | 在末尾构造元素           |
| `pop_back` (C++98)     | 移除最后一个元素         |
| `resize` (C++98)       | 更改容器大小             |
| `swap` (C++98)         | 交换内容                 |

### 非成员函数

| 函数                                 | 描述                           |
| ------------------------------------ | ------------------------------ |
| `operator==`                         | 按照字典顺序比较 vector 中的值 |
| `operator!= < <= > >=`               | (C++20 中移除)                 |
| `operator<=>`                        | C++20                          |
| `std::swap`(std::vector) (C++98)     | 特化 std::swap 算法            |
| `std::erase`(std::vector) (C++20)    | 移除满足条件的元素             |
| `std::erase_if`(std::vector) (C++20) | 移除满足特定条件的元素         |

```c++
std::erase_if(cnt, [](char x) { return (x - '0') % 2 == 0; });
```

