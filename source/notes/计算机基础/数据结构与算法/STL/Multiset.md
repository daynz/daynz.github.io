# `STL-multiset`

定义于头文件 `<set>` (C++98起)

```c++
template<
    class Key,
    class Compare = std::less<Key>,
    class Allocator = std::allocator<Key>
> class multiset;
```

`std::multiset` 是一个关联容器，存储按键排序的元素，允许重复键。

*未定义行为：访问越界迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::multiset` 支持多种构造方式，初始化元素或配置比较器和分配器。

```c++
// 1. 默认构造（空multiset）
std::multiset<int> mset1;

// 2. 指定比较器
std::multiset<int, std::greater<int>> mset2; // 降序排序

// 3. 指定比较器和分配器
std::multiset<int, std::less<int>, std::allocator<int>> mset3;

// 4. 初始化列表 (C++11起)
std::multiset<int> mset4 = {1, 2, 2, 3, 3, 4};

// 5. 拷贝构造
std::multiset<int> mset5(mset4);

// 6. 移动构造 (C++11起)
std::multiset<int> mset6 = std::move(mset5); // mset5变为空

// 7. 范围构造
std::multiset<int> mset7(mset4.begin(), mset4.end());

// 8. 范围构造并指定比较器
std::multiset<int, std::greater<int>> mset8(mset4.begin(), mset4.end());

// 9. 范围构造并指定比较器和分配器
std::multiset<int, std::less<int>, std::allocator<int>> mset9(mset4.begin(), mset4.end());
```

#### 析构函数

销毁 multiset 的所有元素并释放内存。

#### operator=

以来自另一 multiset 的元素重写 multiset 的内容。

```c++
// 1. 拷贝赋值
std::multiset<int> mset1 = {1, 2, 2, 3};
std::multiset<int> mset2;
mset2 = mset1; // mset2现在包含{1, 2, 2, 3}

// 2. 移动赋值 (C++11起)
std::multiset<int> mset3;
mset3 = std::move(mset1); // mset1变为空

// 3. 初始化列表赋值 (C++11起)
mset3 = {4, 4, 5, 6};
```

### 元素访问

*注意：`std::multiset` 不提供直接元素访问（如 `at` 或 `operator[]`），因为它只存储键，且元素按序排列，只能通过迭代器或查找函数访问。*

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

| 函数                   | 描述                     |
| ---------------------- | ------------------------ |
| `clear` (C++98)        | 移除所有元素             |
| `insert` (C++98)       | 插入元素                 |
| `emplace` (C++11)      | 构造并插入元素           |
| `emplace_hint` (C++11) | 使用提示构造并插入元素   |
| `erase` (C++98)        | 移除指定键的元素或范围   |
| `swap` (C++98)         | 交换内容                 |
| `extract` (C++17)      | 提取节点以进行重新插入   |
| `merge` (C++17)        | 从另一 multiset 合并元素 |

```c++
// insert 示例
std::multiset<int> mset = {1, 2, 2};
mset.insert(2); // mset包含{1, 2, 2, 2}

// merge 示例
std::multiset<int> mset1 = {1, 2, 2};
std::multiset<int> mset2 = {3, 3, 4};
mset1.merge(mset2); // mset1包含{1, 2, 2, 3, 3, 4}，mset2为空
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
std::multiset<int> mset = {1, 2, 2, 3};
std::cout << "Count of 2: " << mset.count(2) << "\n"; // 输出 2

// equal_range 示例
auto range = mset.equal_range(2); // 返回包含所有2的范围
for (auto it = range.first; it != range.second; ++it) {
    std::cout << *it << " "; // 输出 2 2
}
```

### 观察器

| 函数                 | 描述                                     |
| -------------------- | ---------------------------------------- |
| `key_comp` (C++98)   | 返回用于键比较的函数                     |
| `value_comp` (C++98) | 返回用于值比较的函数（与 key_comp 相同） |

### 非成员函数

| 函数                                   | 描述                   |
| -------------------------------------- | ---------------------- |
| `operator==`                           | 比较 multiset 中的元素 |
| `operator!= < <= > >=`                 | (C++20 中移除)         |
| `operator<=>`                          | C++20                  |
| `std::swap`(std::multiset) (C++98)     | 特化 std::swap 算法    |
| `std::erase_if`(std::multiset) (C++20) | 移除满足特定条件的元素 |

```c++
// std::erase_if 示例
std::multiset<int> mset = {1, 2, 2, 3, 4};
std::erase_if(mset, [](int x) { return x % 2 == 0; }); // 移除偶数，mset包含{1, 3}
```