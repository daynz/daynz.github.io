---
title: "Set"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Set.html
tags: [计算机基础]
---

# `STL-set`

定义于头文件 `<set>` (C++98起)

```c++
template<
    class Key,
    class Compare = std::less<Key>,
    class Allocator = std::allocator<Key>
> class set;
```

std::set 是关联容器，含有 Key 类型对象的已排序集。用比较函数 比较 (Compare) 进行排序。搜索、移除和插入拥有对数复杂度。 set 通常以红黑树实现。

*未定义行为：访问越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::set` 支持多种构造方式，初始化元素或配置比较器和分配器。

```c++
// 1. 默认构造（空set）
std::set<int> set1;

// 2. 指定比较器
std::set<int, std::greater<int>> set2; // 降序排序

// 3. 指定比较器和分配器
std::set<int, std::less<int>, std::allocator<int>> set3;

// 4. 初始化列表 (C++11起)
std::set<int> set4 = {1, 2, 3, 4, 5};

// 5. 拷贝构造
std::set<int> set5(set4);

// 6. 移动构造 (C++11起)
std::set<int> set6 = std::move(set5); // set5变为空

// 7. 范围构造
std::set<int> set7(set4.begin(), set4.end());

// 8. 范围构造并指定比较器
std::set<int, std::greater<int>> set8(set4.begin(), set4.end());

// 9. 范围构造并指定比较器和分配器
std::set<int, std::less<int>, std::allocator<int>> set9(set4.begin(), set4.end());
```

#### 析构函数

销毁 set 的所有元素并释放内存。

#### operator=

以来自另一 set 的元素重写 set 的内容。

```c++
// 1. 拷贝赋值
std::set<int> set1 = {1, 2, 3};
std::set<int> set2;
set2 = set1; // set2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::set<int> set3;
set3 = std::move(set1); // set1变为空

// 3. 初始化列表赋值 (C++11起)
set3 = {4, 5, 6};
```

### 元素访问

*注意：`std::set` 不提供直接元素访问（如 `at` 或 `operator[]`），因为它只存储键，且元素按序排列，只能通过迭代器或查找函数访问。*

### 迭代器

| 迭代器                     | 描述                     |
| -------------------------- | ------------------------ |
| `begin` `cbegin` (C++11)   | 返回指向起始的迭代器     |
| `end` `cend` (C++11)       | 返回指向末尾的迭代器     |
| `rbegin` `crbegin` (C++11) | 返回指向起始的逆向迭代器 |
| `rend` `crend` (C++11)     | 返回指向末尾的逆向迭代器 |

### 容量

| 函数               | 描述                     |
| ------------------ | ------------------------ |
| `empty` (C++98)    | 检查容器是否为空         |
| `size` (C++98)     | 返回当前元素数量         |
| `max_size` (C++98) | 返回可容纳的最大元素数量 |

### 修改器

| 函数 | 描述 |
| --- | --- |
| `clear` (C++98) | 移除所有元素 |
| `insert` (C++98) | 插入元素 |
| `emplace` (C++11) | 构造并插入元素 |
| `emplace_hint` (C++11) | 使用提示构造并插入元素 |
| `erase` (C++98) | 移除指定键的元素或范围 |
| `swap` (C++98) | 交换内容 |
| `extract` (C++17) | 提取节点以进行重新插入 |
| `merge` (C++17) | 从另一 set 合并元素 |

### 查找

| 函数                  | 描述                         |
| --------------------- | ---------------------------- |
| `count` (C++98)       | 返回指定键的元素数量（0或1） |
| `find` (C++98)        | 查找指定键的元素             |
| `contains` (C++20)    | 检查是否存在指定键           |
| `lower_bound` (C++98) | 返回不小于指定键的迭代器     |
| `upper_bound` (C++98) | 返回大于指定键的迭代器       |
| `equal_range` (C++98) | 返回指定键的范围             |

### 观察器

| 函数                 | 描述                                     |
| -------------------- | ---------------------------------------- |
| `key_comp` (C++98)   | 返回用于键比较的函数                     |
| `value_comp` (C++98) | 返回用于值比较的函数（与 key_comp 相同） |

### 非成员函数

| 函数                              | 描述                   |
| --------------------------------- | ---------------------- |
| `operator==`                      | 比较 set 中的元素      |
| `operator!= < <= > >=`            | (C++20 中移除)         |
| `operator<=>`                     | C++20                  |
| `std::swap`(std::set) (C++98)     | 特化 std::swap 算法    |
| `std::erase_if`(std::set) (C++20) | 移除满足特定条件的元素 |
