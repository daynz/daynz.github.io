---
title: "ForwardList"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/ForwardList.html
tags: [计算机基础]
---

# `STL-forward_list`

定义于头文件 `<forward_list>` (C++11起)

```c++
template<
    class T,
    class Allocator = std::allocator<T>
> class forward_list;
```

`std::forward_list` 是一个单向链表容器，支持在任意位置高效插入和删除，仅提供前向迭代，不支持随机访问或反向遍历。

*未定义行为：访问超出范围的元素或使用无效的迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::forward_list` 支持多种构造方式，初始化元素或配置分配器。

```c++
// 1. 默认构造（空forward_list）
std::forward_list<int> flist1;

// 2. 指定元素数量和默认值
std::forward_list<int> flist2(5, 10); // 5个值为10的元素

// 3. 指定分配器
std::forward_list<int, std::allocator<int>> flist3;

// 4. 初始化列表 (C++11起)
std::forward_list<int> flist4 = {1, 2, 3, 4, 5};

// 5. 拷贝构造
std::forward_list<int> flist5(flist4);

// 6. 移动构造 (C++11起)
std::forward_list<int> flist6 = std::move(flist5); // flist5变为空

// 7. 范围构造
std::forward_list<int> flist7(flist4.begin(), flist4.end());

// 8. 范围构造并指定分配器
std::forward_list<int, std::allocator<int>> flist8(flist4.begin(), flist4.end());

// 9. 指定元素数量和分配器
std::forward_list<int, std::allocator<int>> flist9(5, 10, std::allocator<int>{});
```

#### 析构函数

销毁 forward_list 的所有元素并释放内存。

#### operator=

以来自另一 forward_list 的元素重写 forward_list 的内容。

```c++
// 1. 拷贝赋值
std::forward_list<int> flist1 = {1, 2, 3};
std::forward_list<int> flist2;
flist2 = flist1; // flist2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::forward_list<int> flist3;
flist3 = std::move(flist1); // flist1变为空

// 3. 初始化列表赋值 (C++11起)
flist3 = {4, 5, 6};
```

### 元素访问

#### `front`

访问链表的第一个元素。

```c++
std::forward_list<int> flist = {1, 2, 3};
const std::forward_list<int> cflist = {10, 20, 30};

std::cout << "flist.front(): " << flist.front() << "\n"; // 输出 1
std::cout << "cflist.front(): " << cflist.front() << "\n"; // 输出 10
flist.front() = 100; // 修改第一个元素
std::cout << "After flist.front()=100: " << flist.front() << "\n";
```

*未定义行为：对空 forward_list 调用 `front` 是未定义行为。*

#### `before_begin` `cbefore_begin` (C++11)

返回指向链表首元素之前位置的迭代器，用于插入操作。

```c++
std::forward_list<int> flist = {1, 2, 3};
auto it = flist.before_begin(); // 指向首元素之前
flist.insert_after(it, 0); // 在首元素前插入0
```

### 迭代器

| 迭代器                                 | 描述                           |
| -------------------------------------- | ------------------------------ |
| `begin` `cbegin` (C++11)               | 返回指向首元素的迭代器         |
| `end` `cend` (C++11)                   | 返回指向末尾的迭代器           |
| `before_begin` `cbefore_begin` (C++11) | 返回指向首元素之前位置的迭代器 |

*注意：`forward_list` 不提供逆向迭代器（如 `rbegin`、`rend`），因为它是单向链表。*

### 容量

| 函数               | 描述                     |
| ------------------ | ------------------------ |
| `empty` (C++11)    | 检查容器是否为空         |
| `max_size` (C++11) | 返回可容纳的最大元素数量 |

*注意：`forward_list` 不提供 `size` 函数，因为计算大小需要遍历整个链表。*

### 修改器

| 函数                    | 描述                                       |
| ----------------------- | ------------------------------------------ |
| `clear` (C++11)         | 移除所有元素                               |
| `insert_after` (C++11)  | 在指定迭代器之后插入元素                   |
| `emplace_after` (C++11) | 在指定迭代器之后构造元素                   |
| `erase_after` (C++11)   | 移除指定迭代器之后的元素或范围             |
| `push_front` (C++11)    | 在前端添加元素                             |
| `emplace_front` (C++11) | 在前端构造元素                             |
| `pop_front` (C++11)     | 移除首元素                                 |
| `resize` (C++11)        | 更改链表大小                               |
| `swap` (C++11)          | 交换内容                                   |
| `merge` (C++11)         | 合并两个已排序的 forward_list              |
| `splice_after` (C++11)  | 从另一 forward_list 转移元素到指定位置之后 |
| `remove` (C++11)        | 移除满足特定值的元素                       |
| `remove_if` (C++11)     | 移除满足特定条件的元素                     |
| `reverse` (C++11)       | 反转链表顺序                               |
| `sort` (C++11)          | 对链表排序                                 |
| `unique` (C++11)        | 移除连续的重复元素                         |

```c++
// merge 示例
std::forward_list<int> flist1 = {1, 3, 5};
std::forward_list<int> flist2 = {2, 4, 6};
flist1.merge(flist2); // flist1包含{1, 2, 3, 4, 5, 6}，flist2为空

// splice_after 示例
std::forward_list<int> flist3 = {1, 2, 3};
std::forward_list<int> flist4 = {4, 5};
flist3.splice_after(flist3.begin(), flist4); // flist3包含{1, 4, 5, 2, 3}，flist4为空

// remove 示例
std::forward_list<int> flist5 = {1, 2, 2, 3};
flist5.remove(2); // flist5包含{1, 3}
```

### 查找

| 函数               | 描述                                          |
| ------------------ | --------------------------------------------- |
| `find`             | 需自行实现（如通过 `std::find` 算法）         |
| `contains` (C++20) | 需自行实现（如通过 `std::find` 检查是否存在） |

*注意：`forward_list` 不直接提供查找函数，需使用标准算法（如 `std::find`）或手动遍历。*

### 非成员函数

| 函数                                       | 描述                       |
| ------------------------------------------ | -------------------------- |
| `operator==`                               | 比较 forward_list 中的元素 |
| `operator!= < <= > >=`                     | (C++20 中移除)             |
| `operator<=>`                              | C++20                      |
| `std::swap`(std::forward_list) (C++11)     | 特化 std::swap 算法        |
| `std::erase_if`(std::forward_list) (C++20) | 移除满足特定条件的元素     |

```c++
// std::erase_if 示例
std::forward_list<int> flist = {1, 2, 3, 4, 5};
std::erase_if(flist, [](int x) { return x % 2 == 0; }); // 移除偶数，flist包含{1, 3, 5}
```