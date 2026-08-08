# `STL-unordered_map`

定义于头文件 `<unordered_map>` (C++11起)

```c++
template<
    class Key,
    class T,
    class Hash = std::hash<Key>,
    class KeyEqual = std::equal_to<Key>,
    class Allocator = std::allocator<std::pair<const Key, T>>
> class unordered_map;
```

`std::unordered_map` 是一个关联容器，存储键值对，使用哈希表实现，不按键排序，支持唯一键，平均提供常数时间复杂度的查找、插入和删除操作。

*未定义行为：访问不存在的键或越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::unordered_map` 支持多种构造方式，初始化键值对或配置哈希表参数。

```c++
// 1. 默认构造（空unordered_map）
std::unordered_map<std::string, int> umap1;

// 2. 指定桶数量
std::unordered_map<std::string, int> umap2(100); // 至少100个桶

// 3. 指定哈希函数
std::unordered_map<std::string, int, std::hash<std::string>> umap3;

// 4. 指定哈希函数和键比较器
std::unordered_map<std::string, int, std::hash<std::string>, std::equal_to<std::string>> umap4;

// 5. 指定桶数量、哈希函数和分配器
std::unordered_map<std::string, int, std::hash<std::string>, std::equal_to<std::string>, std::allocator<std::pair<const std::string, int>>> umap5(100);

// 6. 初始化列表 (C++11起)
std::unordered_map<std::string, int> umap6 = {{"apple", 1}, {"banana", 2}, {"cherry", 3}};

// 7. 拷贝构造
std::unordered_map<std::string, int> umap7(umap6);

// 8. 移动构造 (C++11起)
std::unordered_map<std::string, int> umap8 = std::move(umap7); // umap7变为空

// 9. 范围构造
std::unordered_map<std::string, int> umap9(umap6.begin(), umap6.end());

// 10. 指定桶数量、哈希函数、键比较器和分配器
std::unordered_map<std::string, int> umap10(100, std::hash<std::string>{}, std::equal_to<std::string>{}, std::allocator<std::pair<const std::string, int>>{});
```

#### 析构函数

销毁 unordered_map 的所有元素并释放内存。

#### operator=

以来自另一 unordered_map 的键值对重写 unordered_map 的内容。

```c++
// 1. 拷贝赋值
std::unordered_map<std::string, int> umap1 = {{"apple", 1}, {"banana", 2}};
std::unordered_map<std::string, int> umap2;
umap2 = umap1; // umap2现在包含{"apple", 1}, {"banana", 2}

// 2. 移动赋值 (C++11起)
std::unordered_map<std::string, int> umap3;
umap3 = std::move(umap1); // umap1变为空

// 3. 初始化列表赋值 (C++11起)
umap3 = {{"orange", 4}, {"grape", 5}};
```

### 元素访问

#### `at`

访问指定键的映射值，同时进行键存在性检查。

```c++
std::unordered_map<std::string, int> umap = {{"apple", 1}, {"banana", 2}, {"cherry", 3}};
const std::unordered_map<std::string, int> cumap = {{"x", 10}, {"y", 20}, {"z", 30}};

try {
    std::cout << "umap.at(\"banana\"): " << umap.at("banana") << "\n";
    std::cout << "cumap.at(\"y\"): " << cumap.at("y") << "\n";
    umap.at("grape") = 100; // 键不存在
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若键不存在则抛出 `std::out_of_range`。

#### `operator[]`

访问或插入指定键的映射值，无键存在性检查。

```c++
std::unordered_map<std::string, int> umap = {{"apple", 1}, {"banana", 2}};

std::cout << "umap[\"apple\"]: " << umap["apple"] << "\n";
umap["orange"] = 3; // 插入新键值对
std::cout << "After umap[\"orange\"]=3: " << umap["orange"] << "\n";
```

*未定义行为：通过此运算符访问不存在的键会插入默认值，不算未定义行为，但需注意性能开销。*

### 迭代器

| 迭代器                   | 描述                 |
| ------------------------ | -------------------- |
| `begin` `cbegin` (C++11) | 返回指向起始的迭代器 |
| `end` `cend` (C++11)     | 返回指向末尾的迭代器 |

*注意：`unordered_map` 不提供逆向迭代器（如 `rbegin`、`rend`），因为元素无序。*

### 容量

| 函数               | 描述                     |
| ------------------ | ------------------------ |
| `empty` (C++11)    | 检查容器是否为空         |
| `size` (C++11)     | 返回当前元素数量         |
| `max_size` (C++11) | 返回可容纳的最大元素数量 |

### 修改器

| 函数                       | 描述                            |
| -------------------------- | ------------------------------- |
| `clear` (C++11)            | 移除所有元素                    |
| `insert` (C++11)           | 插入键值对                      |
| `insert_or_assign` (C++17) | 插入或更新键值对                |
| `emplace` (C++11)          | 构造并插入键值对                |
| `emplace_hint` (C++11)     | 使用提示构造并插入键值对        |
| `erase` (C++11)            | 移除指定键的元素或范围          |
| `swap` (C++11)             | 交换内容                        |
| `extract` (C++17)          | 提取节点以进行重新插入          |
| `merge` (C++17)            | 从另一 unordered_map 合并键值对 |

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

| 函数                                        | 描述                          |
| ------------------------------------------- | ----------------------------- |
| `operator==`                                | 比较 unordered_map 中的键值对 |
| `operator!=`                                | (C++20 中移除)                |
| `operator<=>`                               | C++20                         |
| `std::swap`(std::unordered_map) (C++11)     | 特化 std::swap 算法           |
| `std::erase_if`(std::unordered_map) (C++20) | 移除满足特定条件的元素        |