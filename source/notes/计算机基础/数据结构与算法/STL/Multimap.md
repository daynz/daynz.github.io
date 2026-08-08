# `STL-multimap`

定义于头文件 `<map>` (C++98起)

```c++
template<
    class Key,
    class T,
    class Compare = std::less<Key>,
    class Allocator = std::allocator<std::pair<const Key, T>>
> class multimap;
```

`std::multimap` 是一个关联容器，存储键值对，按键排序，允许重复键。

*未定义行为：访问越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::multimap` 支持多种构造方式，初始化键值对或配置比较器和分配器。

```c++
// 1. 默认构造（空multimap）
std::multimap<std::string, int> mmap1;

// 2. 指定比较器
std::multimap<std::string, int, std::greater<std::string>> mmap2; // 降序排序

// 3. 指定比较器和分配器
std::multimap<std::string, int, std::less<std::string>, std::allocator<std::pair<const std::string, int>>> mmap3;

// 4. 初始化列表 (C++11起)
std::multimap<std::string, int> mmap4 = {{"apple", 1}, {"apple", 2}, {"banana", 3}};

// 5. 拷贝构造
std::multimap<std::string, int> mmap5(mmap4);

// 6. 移动构造 (C++11起)
std::multimap<std::string, int> mmap6 = std::move(mmap5); // mmap5变为空

// 7. 范围构造
std::multimap<std::string, int> mmap7(mmap4.begin(), mmap4.end());

// 8. 范围构造并指定比较器
std::multimap<std::string, int, std::greater<std::string>> mmap8(mmap4.begin(), mmap4.end());

// 9. 范围构造并指定比较器和分配器
std::multimap<std::string, int, std::less<std::string>, std::allocator<std::pair<const std::string, int>>> mmap9(mmap4.begin(), mmap4.end());
```

#### 析构函数

销毁 multimap 的所有元素并释放内存.

#### operator=

以来自另一 multimap 的键值对重写 multimap 的内容。

```c++
// 1. 拷贝赋值
std::multimap<std::string, int> mmap1 = {{"apple", 1}, {"apple", 2}};
std::multimap<std::string, int> mmap2;
mmap2 = mmap1; // mmap2现在包含{{"apple", 1}, {"apple", 2}}

// 2. 移动赋值 (C++11起)
std::multimap<std::string, int> mmap3;
mmap3 = std::move(mmap1); // mmap1变为空

// 3. 初始化列表赋值 (C++11起)
mmap3 = {{"orange", 4}, {"orange", 5}};
```

### 元素访问

*注意：`std::multimap` 不提供直接元素访问（如 `at` 或 `operator[]`），因为它允许重复键，且元素按序排列，只能通过迭代器或查找函数访问。*

### 迭代器

| 迭代器                     | 描述                               |
| -------------------------- | ---------------------------------- |
| `begin` `cbegin` (C++11)   | 返回指向首元素的迭代器             |
| `end` `cend` (C++11)       | 返回指向末尾的迭代器               |
| `rbegin` `crbegin` (C++11) | 返回指向最后一个元素的逆向迭代器   |
| `rend` `crend` (C++11)     | 返回指向首元素之前位置的逆向迭代器 |

### 容量

| 函数               | 描述                     |
| ------------------ | ------------------------ |
| `empty` (C++98)    | 检查容器是否为空         |
| `size` (C++98)     | 返回当前元素数量         |
| `max_size` (C++98) | 返回可容纳的最大元素数量 |

### 修改器

| 函数                   | 描述                       |
| ---------------------- | -------------------------- |
| `clear` (C++98)        | 移除所有元素               |
| `insert` (C++98)       | 插入键值对                 |
| `emplace` (C++11)      | 构造并插入键值对           |
| `emplace_hint` (C++11) | 使用提示构造并插入键值对   |
| `erase` (C++98)        | 移除指定键的元素或范围     |
| `swap` (C++98)         | 交换内容                   |
| `extract` (C++17)      | 提取节点以进行重新插入     |
| `merge` (C++17)        | 从另一 multimap 合并键值对 |

```c++
// insert 示例
std::multimap<std::string, int> mmap = {{"apple", 1}};
mmap.insert({"apple", 2}); // mmap包含{{"apple", 1}, {"apple", 2}}

// merge 示例
std::multimap<std::string, int> mmap1 = {{"apple", 1}, {"apple", 2}};
std::multimap<std::string, int> mmap2 = {{"banana", 3}, {"banana", 4}};
mmap1.merge(mmap2); // mmap1包含{{"apple", 1}, {"apple", 2}, {"banana", 3}, {"banana", 4}}，mmap2为空
```

### 查找

| 函数                  | 描述                     |
| --------------------- | ------------------------ |
| `count` (C++98)       | 返回指定键的元素数量     |
| `find` (C++98)        | 查找指定键的第一个元素   |
| `contains` (C++20)    | 检查是否存在指定键       |
| `lower_bound` (C++98) | 返回不小于指定键的迭代器 |
| `upper_bound` (C++98) | 返回大于指定键的迭代器   |
| `equal_range` (C++98) | 返回指定键的范围         |

```c++
// count 示例
std::multimap<std::string, int> mmap = {{"apple", 1}, {"apple", 2}, {"banana", 3}};
std::cout << "Count of apple: " << mmap.count("apple") << "\n"; // 输出 2

// equal_range 示例
auto range = mmap.equal_range("apple"); // 返回包含所有"apple"的范围
for (auto it = range.first; it != range.second; ++it) {
    std::cout << it->second << " "; // 输出 1 2
}
```

### 观察器

| 函数                 | 描述                 |
| -------------------- | -------------------- |
| `key_comp` (C++98)   | 返回用于键比较的函数 |
| `value_comp` (C++98) | 返回用于值比较的函数 |

### 非成员函数

| 函数                                   | 描述                     |
| -------------------------------------- | ------------------------ |
| `operator==`                           | 比较 multimap 中的键值对 |
| `operator!= < <= > >=`                 | (C++20 中移除)           |
| `operator<=>`                          | C++20                    |
| `std::swap`(std::multimap) (C++98)     | 特化 std::swap 算法      |
| `std::erase_if`(std::multimap) (C++20) | 移除满足特定条件的元素   |

```c++
// std::erase_if 示例
std::multimap<std::string, int> mmap = {{"apple", 1}, {"apple", 2}, {"banana", 3}};
std::erase_if(mmap, [](const auto& p) { return p.second > 1; }); // 移除值大于1的元素，mmap包含{{"apple", 1}}
```