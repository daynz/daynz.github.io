---
title: "Map"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/Map.html
tags: [计算机基础]
---

# `STL-map`

定义于头文件 `<map>` (C++98起)

```c++
template<
    class Key,
    class T,
    class Compare = std::less<Key>,
    class Allocator = std::allocator<std::pair<const Key, T>>
> class map;
```

std::map 是有序键值对容器，它的元素的键是唯一的。用比较函数 Compare 排序键。搜索、移除和插入操作拥有对数复杂度。 map 通常实现为红黑树。

*未定义行为：访问不存在的键或越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::map` 支持多种构造方式，初始化键值对。

```c++
// 定义分配器（使用默认分配器）
std::allocator<std::pair<const std::string, int>> alloc;

// 1. 默认构造（空map）
std::map<std::string, int> map1;

// 2. 初始化列表构造 (C++11起)
std::map<std::string, int> map2 = {{"apple", 1}, {"banana", 2}, {"cherry", 3}};

// 3. 拷贝构造
std::map<std::string, int> map3(map2);

// 4. 拷贝构造（带分配器）
std::map<std::string, int> map3_with_alloc(map2, alloc);

// 5. 移动构造 (C++11起)
std::map<std::string, int> map4 = std::move(map3);  // map3变为空

// 6. 移动构造（带分配器）
std::map<std::string, int> map4_with_alloc(std::move(map4), alloc);

// 7. 指定比较器
std::map<std::string, int, std::greater<std::string>> map5;  // 降序排序

// 8. 指定比较器和分配器
std::map<std::string, int, std::greater<std::string>> map6(alloc);

// 9. 范围构造（从另一个map的迭代器范围）
std::map<std::string, int> map7(map2.begin(), map2.end());

// 10. 范围构造（带比较器）
std::map<std::string, int, std::greater<std::string>> map8(map2.begin(), map2.end());

// 11. 范围构造（带比较器和分配器）
std::map<std::string, int, std::greater<std::string>> map9(
    map2.begin(), map2.end(), std::greater<std::string>(), alloc
);

// 12. 初始化列表构造（带比较器和分配器）
std::map<std::string, int, std::greater<std::string>> map10(
    {{"apple", 1}, {"banana", 2}}, std::greater<std::string>(), alloc
);
```

#### 析构函数

销毁 map 的所有元素并释放内存。

#### operator=

以来自另一 map 的键值对重写 map 的内容。

```c++
// 1. 拷贝赋值
std::map<std::string, int> map1 = {{"apple", 1}, {"banana", 2}};
std::map<std::string, int> map2;
map2 = map1; // map2现在包含{"apple", 1}, {"banana", 2}

// 2. 移动赋值 (C++11起)
std::map<std::string, int> map3;
map3 = std::move(map1); // map1变为空

// 3. 初始化列表赋值 (C++11起)
map3 = {{"orange", 4}, {"grape", 5}};
```

### 元素访问

#### `at`

访问指定键的映射值，同时进行键存在性检查。

```c++
std::map<std::string, int> map = {{"apple", 1}, {"banana", 2}, {"cherry", 3}};
const std::map<std::string, int> cmap = {{"x", 10}, {"y", 20}, {"z", 30}};

try {
    std::cout << "map.at(\"banana\"): " << map.at("banana") << "\n";
    std::cout << "cmap.at(\"y\"): " << cmap.at("y") << "\n";
    map.at("grape") = 100; // 键不存在
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若键不存在则抛出 `std::out_of_range`。

#### `operator[]`

访问或插入指定键的映射值，无键存在性检查。

```c++
std::map<std::string, int> map = {{"apple", 1}, {"banana", 2}};

std::cout << "map[\"apple\"]: " << map["apple"] << "\n";
map["orange"] = 3; // 插入新键值对
std::cout << "After map[\"orange\"]=3: " << map["orange"] << "\n";
```

*未定义行为：通过此运算符访问不存在的键会插入默认值，不算未定义行为，但需注意性能开销。*

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

| 函数                      | 描述                                       |
| ------------------------- | ------------------------------------------ |
| `clear` (C++98)           | 移除所有元素                               |
| `insert` (C++98)          | 插入键值对                                 |
| `insert_or_assign`(C++17) | 插入元素，或若键已存在则赋值给当前元素     |
| `emplace` (C++11)         | 构造并插入键值对                           |
| `emplace_hint`(C++11)     | 使用提示原位构造元素                       |
| `try_emplace`(C++17)      | 若键不存在则原位插入，若键存在则不做任何事 |
| `erase` (C++98)           | 移除指定键的元素或范围                     |
| `swap` (C++98)            | 交换内容                                   |
| `extract` (C++17)         | 提取节点以进行重新插入                     |
| `merge` (C++17)           | 从另一 map 合并键值对                      |

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

| 函数         | 描述                                       |
| ------------ | ------------------------------------------ |
| `key_comp`   | 返回用于比较键的函数                       |
| `value_comp` | 回用于在value_type类型的对象中比较键的函数 |

### 非成员函数

| 函数                              | 描述                   |
| --------------------------------- | ---------------------- |
| `operator==`                      | 比较 map 中的键值对    |
| `operator!= < <= > >=`            | (C++20 中移除)         |
| `operator<=>`                     | C++20                  |
| `std::swap`(std::map) (C++98)     | 特化 std::swap 算法    |
| `std::erase_if`(std::map) (C++20) | 移除满足特定条件的元素 |
