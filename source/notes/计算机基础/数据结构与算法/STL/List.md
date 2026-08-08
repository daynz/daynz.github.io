# `STL-list`

定义于头文件 `<list>` (C++98起)

```c++
template<
    class T,
    class Allocator = std::allocator<T>
> class list;
```

`std::list` 是一个双向链表容器，支持在任意位置高效插入和删除，支持双向迭代，不支持随机访问。

*未定义行为：访问超出范围的元素或使用无效的迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::list` 支持多种构造方式，初始化元素或配置分配器。

```c++
// 1. 默认构造（空list）
std::list<int> lst1;

// 2. 指定元素数量和默认值
std::list<int> lst2(5, 10); // 5个值为10的元素

// 3. 指定分配器
std::list<int, std::allocator<int>> lst3;

// 4. 初始化列表 (C++11起)
std::list<int> lst4 = {1, 2, 3, 4, 5};

// 5. 拷贝构造
std::list<int> lst5(lst4);

// 6. 移动构造 (C++11起)
std::list<int> lst6 = std::move(lst5); // lst5变为空

// 7. 范围构造
std::list<int> lst7(lst4.begin(), lst4.end());

// 8. 范围构造并指定分配器
std::list<int, std::allocator<int>> lst8(lst4.begin(), lst4.end());

// 9. 指定元素数量和分配器
std::list<int, std::allocator<int>> lst9(5, 10, std::allocator<int>{});
```

#### 析构函数

销毁 list 的所有元素并释放内存。

#### operator=

以来自另一 list 的元素重写 list 的内容。

```c++
// 1. 拷贝赋值
std::list<int> lst1 = {1, 2, 3};
std::list<int> lst2;
lst2 = lst1; // lst2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::list<int> lst3;
lst3 = std::move(lst1); // lst1变为空

// 3. 初始化列表赋值 (C++11起)
lst3 = {4, 5, 6};
```

### 元素访问

#### `front`

访问链表的第一个元素。

```c++
std::list<int> lst = {1, 2, 3};
const std::list<int> clst = {10, 20, 30};

std::cout << "lst.front(): " << lst.front() << "\n"; // 输出 1
std::cout << "clst.front(): " << clst.front() << "\n"; // 输出 10
lst.front() = 100; // 修改第一个元素
std::cout << "After lst.front()=100: " << lst.front() << "\n";
```

#### `back`

访问链表的最后一个元素。

```c++
std::list<int> lst = {1, 2, 3};
const std::list<int> clst = {10, 20, 30};

std::cout << "lst.back(): " << lst.back() << "\n"; // 输出 3
std::cout << "clst.back(): " << clst.back() << "\n"; // 输出 30
lst.back() = 300; // 修改最后一个元素
std::cout << "After lst.back()=300: " << lst.back() << "\n";
```

*未定义行为：对空 list 调用 `front` 或 `back` 是未定义行为。*

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

| 函数                    | 描述                           |
| ----------------------- | ------------------------------ |
| `clear` (C++98)         | 移除所有元素                   |
| `insert` (C++98)        | 在指定迭代器位置插入元素       |
| `emplace` (C++11)       | 在指定迭代器位置构造元素       |
| `erase` (C++98)         | 移除指定位置的元素或范围       |
| `push_front` (C++98)    | 在前端添加元素                 |
| `emplace_front` (C++11) | 在前端构造元素                 |
| `pop_front` (C++98)     | 移除首元素                     |
| `push_back` (C++98)     | 在末尾添加元素                 |
| `emplace_back` (C++11)  | 在末尾构造元素                 |
| `pop_back` (C++98)      | 移除末尾元素                   |
| `resize` (C++98)        | 更改链表大小                   |
| `swap` (C++98)          | 交换内容                       |
| `merge` (C++98)         | 合并两个已排序的 list          |
| `splice` (C++98)        | 从另一 list 转移元素到指定位置 |
| `remove` (C++98)        | 移除满足特定值的元素           |
| `remove_if` (C++98)     | 移除满足特定条件的元素         |
| `reverse` (C++98)       | 反转链表顺序                   |
| `sort` (C++98)          | 对链表排序                     |
| `unique` (C++98)        | 移除连续的重复元素             |

```c++
// merge 示例
std::list<int> lst1 = {1, 3, 5};
std::list<int> lst2 = {2, 4, 6};
lst1.merge(lst2); // lst1包含{1, 2, 3, 4, 5, 6}，lst2为空

// splice 示例
std::list<int> lst3 = {1, 2, 3};
std::list<int> lst4 = {4, 5};
lst3.splice(std::next(lst3.begin()), lst4); // lst3包含{1, 4, 5, 2, 3}，lst4为空

// remove 示例
std::list<int> lst5 = {1, 2, 2, 3};
lst5.remove(2); // lst5包含{1, 3}
```

### 查找

| 函数               | 描述                                          |
| ------------------ | --------------------------------------------- |
| `find`             | 需自行实现（如通过 `std::find` 算法）         |
| `contains` (C++20) | 需自行实现（如通过 `std::find` 检查是否存在） |

*注意：`std::list` 不直接提供查找函数，需使用标准算法（如 `std::find`）或手动遍历。*

### 非成员函数

| 函数                               | 描述                   |
| ---------------------------------- | ---------------------- |
| `operator==`                       | 比较 list 中的元素     |
| `operator!= < <= > >=`             | (C++20 中移除)         |
| `operator<=>`                      | C++20                  |
| `std::swap`(std::list) (C++98)     | 特化 std::swap 算法    |
| `std::erase_if`(std::list) (C++20) | 移除满足特定条件的元素 |

```c++
// std::erase_if 示例
std::list<int> lst = {1, 2, 3, 4, 5};
std::erase_if(lst, [](int x) { return x % 2 == 0; }); // 移除偶数，lst包含{1, 3, 5}
```