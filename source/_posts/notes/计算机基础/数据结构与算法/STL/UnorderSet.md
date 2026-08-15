---
title: "UnorderSet"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/UnorderSet.html
tags: [计算机基础]
---

# `STL-unordered_set`

定义于头文件 `<unordered_set>` (C++11起)

```c++
template<
    class Key,
    class Hash = std::hash<Key>,
    class KeyEqual = std::equal_to<Key>,
    class Allocator = std::allocator<Key>
> class unordered_set;
```

`std::unordered_set` 是一个关联容器，存储唯一键，使用哈希表实现，不按键排序，平均提供常数时间复杂度的查找、插入和删除操作。

*未定义行为：访问越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::unordered_set` 支持多种构造方式，初始化元素或配置哈希表参数。

```c++
// 1. 默认构造（空unordered_set）
std::unordered_set<int> uset1;

// 2. 指定桶数量
std::unordered_set<int> uset2(100); // 至少100个桶

// 3. 指定哈希函数
std::unordered_set<int, std::hash<int>> uset3;

// 4. 指定哈希函数和键比较器
std::unordered_set<int, std::hash<int>, std::equal_to<int>> uset4;

// 5. 指定桶数量、哈希函数和分配器
std::unordered_set<int, std::hash<int>, std::equal_to<int>, std::allocator<int>> uset5(100);

// 6. 初始化列表 (C++11起)
std::unordered_set<int> uset6 = {1, 2, 3, 4, 5};

// 7. 拷贝构造
std::unordered_set<int> uset7(uset6);

// 8. 移动构造 (C++11起)
std::unordered_set<int> uset8 = std::move(uset7); // uset7变为空

// 9. 范围构造
std::unordered_set<int> uset9(uset6.begin(), uset6.end());

// 10. 指定桶数量、哈希函数、键比较器和分配器
std::unordered_set<int, std::hash<int>, std::equal_to<int>, std::allocator<int>> uset10(100, std::hash<int>{}, std::equal_to<int>{}, std::allocator<int>{});
```

#### 析构函数

销毁 unordered_set 的所有元素并释放内存。

#### operator=

以来自另一 unordered_set 的元素重写 unordered_set 的内容。

```c++
// 1. 拷贝赋值
std::unordered_set<int> uset1 = {1, 2, 3};
std::unordered_set<int> uset2;
uset2 = uset1; // uset2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::unordered_set<int> uset3;
uset3 = std::move(uset1); // uset1变为空

// 3. 初始化列表赋值 (C++11起)
uset3 = {4, 5, 6};
```

### 元素访问

*注意：`std::unordered_set` 不提供直接元素访问（如 `at` 或 `operator[]`），因为它只存储键，元素无序，只能通过迭代器或查找函数访问。*

### 迭代器

| 迭代器                   | 描述                 |
| ------------------------ | -------------------- |
| `begin` `cbegin` (C++11) | 返回指向起始的迭代器 |
| `end` `cend` (C++11)     | 返回指向末尾的迭代器 |

*注意：`unordered_set` 不提供逆向迭代器（如 `rbegin`、`rend`），因为元素无序。*

### 容量

| 函数               | 描述                     |
| ------------------ | ------------------------ |
| `empty` (C++11)    | 检查容器是否为空         |
| `size` (C++11)     | 返回当前元素数量         |
| `max_size` (C++11) | 返回可容纳的最大元素数量 |

### 修改器

| 函数                   | 描述                          |
| ---------------------- | ----------------------------- |
| `clear` (C++11)        | 移除所有元素                  |
| `insert` (C++11)       | 插入元素                      |
| `emplace` (C++11)      | 构造并插入元素                |
| `emplace_hint` (C++11) | 使用提示构造并插入元素        |
| `erase` (C++11)        | 移除指定键的元素或范围        |
| `swap` (C++11)         | 交换内容                      |
| `extract` (C++17)      | 提取节点以进行重新插入        |
| `merge` (C++17)        | 从另一 unordered_set 合并元素 |

### 查找

| 函数                  | 描述                         |
| --------------------- | ---------------------------- |
| `count` (C++11)       | 返回指定键的元素数量（0或1） |
| `find` (C++11)        | 查找指定键的元素             |
| `contains` (C++20)    | 检查是否存在指定键           |
| `equal_range` (C++11) | 返回指定键的范围             |

### 桶接口

| 函数                                     | 描述                   |
| ---------------------------------------- | ---------------------- |
| `begin(size_t)` `cbegin(size_t)` (C++11) | 返回指定桶的起始迭代器 |
| `end(size_t)` `cend(size_t)` (C++11)     | 返回指定桶的末尾迭代器 |
| `bucket_count` (C++11)                   | 返回当前桶数量         |
| `max_bucket_count` (C++11)               | 返回最大桶数量         |
| `bucket_size` (C++11)                    | 返回指定桶的元素数量   |
| `bucket` (C++11)                         | 返回键所在的桶索引     |

### 哈希策略

| 函数                      | 描述                   |
| ------------------------- | ---------------------- |
| `load_factor` (C++11)     | 返回当前负载因子       |
| `max_load_factor` (C++11) | 获取或设置最大负载因子 |
| `rehash` (C++11)          | 设置桶数量并重新哈希   |
| `reserve` (C++11)         | 为指定元素数量预留空间 |

### 观察器

| 函数                    | 描述                 |
| ----------------------- | -------------------- |
| `hash_function` (C++11) | 返回使用的哈希函数   |
| `key_eq` (C++11)        | 返回用于键比较的函数 |

### 非成员函数

| 函数                                        | 描述                        |
| ------------------------------------------- | --------------------------- |
| `operator==`                                | 比较 unordered_set 中的元素 |
| `operator!=`                                | (C++20 中移除)              |
| `operator<=>`                               | C++20                       |
| `std::swap`(std::unordered_set) (C++11)     | 特化 std::swap 算法         |
| `std::erase_if`(std::unordered_set) (C++20) | 移除满足特定条件的元素      |