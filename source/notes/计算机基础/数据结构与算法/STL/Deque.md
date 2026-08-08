# `STL-deque`

定义于头文件 `<deque>` (C++98起)

```c++
template<
    class T,
    class Allocator = std::allocator<T>
> class deque;
```

`std::deque` （ double-ended queue ，双端队列）是有下标顺序容器，它允许在其首尾两端快速插入及删除。另外，在 deque 任一端插入或删除不会非法化指向其余元素的指针或引用。

`std::deque` (double-ended queue) 是一个支持在两端高效插入和删除的动态大小序列容器，支持随机访问。

*未定义行为：访问超出当前大小的元素或迭代器越界时，会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::deque` 支持多种构造方式，初始化元素或分配内存。

```c++
// 定义一个分配器（通常使用默认分配器）
std::allocator<int> alloc;

// 1. 默认构造（空deque）
std::deque<int> deq1;

// 2. 指定大小并默认初始化
std::deque<int> deq2(5); // 5个默认初始化的元素（值为0）

// 3. 指定大小和初始值
std::deque<int> deq3(5, 10); // 5个值为10的元素

// 4. 初始化列表 (C++11起)
std::deque<int> deq4 = {1, 2, 3, 4, 5};

// 5. 拷贝构造
std::deque<int> deq5(deq4); // 拷贝deq4的所有元素

// 6. 拷贝构造（带分配器参数）
std::deque<int> deq5_with_alloc(deq4, alloc); // 使用指定分配器拷贝构造

// 7. 移动构造 (C++11起)
std::deque<int> deq6 = std::move(deq5); // 移动deq5的资源，deq5变为空

// 8. 移动构造（带分配器参数）
std::deque<int> deq6_with_alloc(std::move(deq6), alloc); // 使用指定分配器移动构造

// 9. 使用分配器构造空deque
std::deque<int> deq7(alloc); // 构造空deque，使用指定分配器

// 10. 范围构造
int arr[] = {10, 20, 30, 40};
std::deque<int> deq8(std::begin(arr), std::end(arr)); // 从数组范围构造

// 11. 范围构造（带分配器）
std::deque<int> deq9(std::begin(arr), std::end(arr), alloc); // 从范围构造，使用指定分配器

// 12. 初始化列表构造（带分配器）
std::deque<int> deq10({1, 2, 3}, alloc); // 从初始化列表构造，使用指定分配器
```

#### 析构函数

销毁 deque 的所有元素并释放内存。

#### operator=

以来自另一 deque 的元素重写 deque 的内容。

```c++
// 1. 拷贝赋值
std::deque<int> deq1 = {1, 2, 3};
std::deque<int> deq2;
deq2 = deq1; // deq2现在包含{1, 2, 3}

// 2. 移动赋值 (C++11起)
std::deque<int> deq3;
deq3 = std::move(deq1); // deq1变为空

// 3. 初始化列表赋值 (C++11起)
deq3 = {4, 5, 6};
```

### 元素访问

#### `at`

访问指定位置的元素，同时进行越界检查。

```c++
std::deque<int> deq = {1, 2, 3, 4, 5};
const std::deque<int> cdeq = {10, 20, 30, 40, 50};

try {
    std::cout << "deq.at(2): " << deq.at(2) << "\n";
    std::cout << "cdeq.at(3): " << cdeq.at(3) << "\n";
    deq.at(10) = 100; // 越界访问
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若 `!(pos < size())` 则抛出 `std::out_of_range`。

#### `operator[]`

访问指定位置的元素，无越界检查。

```c++
std::deque<int> deq = {1, 2, 3, 4, 5};
const std::deque<int> cdeq = {10, 20, 30, 40, 50};

std::cout << "deq[0]: " << deq[0] << "\n";
deq[1] = 100;
std::cout << "After deq[1]=100: " << deq[1] << "\n";
```

*未定义行为：通过此运算符访问不存在的元素是未定义行为。*

| 函数            | 描述             |
| --------------- | ---------------- |
| `front` (C++98) | 访问第一个元素   |
| `back` (C++98)  | 访问最后一个元素 |

### 迭代器

| 迭代器                     | 描述                     |
| -------------------------- | ------------------------ |
| `begin` `cbegin` (C++11)   | 返回指向起始的迭代器     |
| `end` `cend` (C++11)       | 返回指向末尾的迭代器     |
| `rbegin` `crbegin` (C++11) | 返回指向起始的逆向迭代器 |
| `rend` `crend` (C++11)     | 返回指向末尾的逆向迭代器 |

### 容量

| 函数                    | 描述                     |
| ----------------------- | ------------------------ |
| `empty` (C++98)         | 检查容器是否为空         |
| `size` (C++98)          | 返回当前元素数量         |
| `max_size` (C++98)      | 返回可容纳的最大元素数量 |
| `shrink_to_fit` (C++11) | 请求释放未使用的内存     |

### 修改器

| 函数                    | 描述                     |
| ----------------------- | ------------------------ |
| `clear` (C++98)         | 移除所有元素             |
| `insert` (C++98)        | 在指定位置插入元素       |
| `emplace` (C++11)       | 在指定位置构造元素       |
| `erase` (C++98)         | 移除指定位置的元素或范围 |
| `push_back` (C++98)     | 在末尾添加元素           |
| `emplace_back` (C++11)  | 在末尾构造元素           |
| `pop_back` (C++98)      | 移除最后一个元素         |
| `push_front` (C++98)    | 在前端添加元素           |
| `emplace_front` (C++11) | 在前端构造元素           |
| `pop_front` (C++98)     | 移除第一个元素           |
| `resize` (C++98)        | 更改容器大小             |
| `swap` (C++98)          | 交换内容                 |

### 非成员函数

| 函数                                | 描述                          |
| ----------------------------------- | ----------------------------- |
| `operator==`                        | 按照字典顺序比较 deque 中的值 |
| `operator!= < <= > >=`              | (C++20 中移除)                |
| `operator<=>`                       | C++20                         |
| `std::swap`(std::deque) (C++98)     | 特化 std::swap 算法           |
| `std::erase`(std::deque) (C++20)    | 移除满足条件的元素            |
| `std::erase_if`(std::deque) (C++20) | 移除满足特定条件的元素        |