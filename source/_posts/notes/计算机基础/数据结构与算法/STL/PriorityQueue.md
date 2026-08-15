---
title: "PriorityQueue"
date: 2026-08-08 18:04:25
permalink: /notes/计算机基础/数据结构与算法/STL/PriorityQueue.html
tags: [计算机基础]
---

# `STL-priority_queue`

定义于头文件 `<queue>` (C++98起)

```c++
template<
    class T,
    class Container = std::vector<T>,
    class Compare = std::less<typename Container::value_type>
> class priority_queue;
```

`std::priority_queue` 是一个容器适配器，提供优先级队列功能，基于底层容器（默认 `std::vector`），元素按比较器（默认 `std::less`）排序，最大值优先（顶部元素为最大值）。

*未定义行为：访问空优先级队列的顶部元素或尝试弹出空队列会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::priority_queue` 支持多种构造方式，初始化元素或配置底层容器和比较器。

```c++
// 1. 默认构造（空优先级队列）
std::priority_queue<int> pq1;

// 2. 指定比较器
std::priority_queue<int, std::vector<int>, std::greater<int>> pq2; // 最小值优先

// 3. 指定底层容器
std::priority_queue<int, std::deque<int>> pq3;

// 4. 指定比较器和底层容器
std::priority_queue<int, std::deque<int>, std::greater<int>> pq4;

// 5. 范围构造
std::vector<int> vec = {3, 1, 4, 1, 5};
std::priority_queue<int> pq5(vec.begin(), vec.end()); // 最大值优先

// 6. 范围构造并指定比较器
std::priority_queue<int, std::vector<int>, std::greater<int>> pq6(vec.begin(), vec.end()); // 最小值优先

// 7. 范围构造并指定比较器和底层容器
std::priority_queue<int, std::deque<int>, std::greater<int>> pq7(vec.begin(), vec.end());

// 8. 拷贝构造
std::priority_queue<int> pq8(pq5);

// 9. 移动构造 (C++11起)
std::priority_queue<int> pq9 = std::move(pq8); // pq8变为空

// 10. 初始化列表构造 (C++11起)
std::priority_queue<int> pq10 = {1, 2, 3, 4, 5};
```

#### 析构函数

销毁 priority_queue 的所有元素并释放底层容器的内存。

#### operator=

以来自另一 priority_queue 的元素重写 priority_queue 的内容。

```c++
// 1. 拷贝赋值
std::priority_queue<int> pq1 = {1, 2, 3};
std::priority_queue<int> pq2;
pq2 = pq1; // pq2现在包含{1, 2, 3}，按最大值优先排序

// 2. 移动赋值 (C++11起)
std::priority_queue<int> pq3;
pq3 = std::move(pq1); // pq1变为空
```

### 元素访问

#### `top`

访问优先级队列的顶部元素（最大或最小值，取决于比较器）。

```c++
std::priority_queue<int> pq = {1, 2, 3, 4, 5};
const std::priority_queue<int> cpq = {10, 20, 30};

std::cout << "pq.top(): " << pq.top() << "\n"; // 输出 5（最大值）
std::cout << "cpq.top(): " << cpq.top() << "\n"; // 输出 30（最大值）
```

*未定义行为：对空优先级队列调用 `top` 是未定义行为。*

### 容量

| 函数            | 描述             |
| --------------- | ---------------- |
| `empty` (C++98) | 检查容器是否为空 |
| `size` (C++98)  | 返回当前元素数量 |

### 修改器

| 函数              | 描述                     |
| ----------------- | ------------------------ |
| `push` (C++98)    | 插入元素并重新排序       |
| `emplace` (C++11) | 构造并插入元素并重新排序 |
| `pop` (C++98)     | 移除顶部元素并重新排序   |
| `swap` (C++11)    | 交换内容                 |

*未定义行为：对空优先级队列调用 `pop` 是未定义行为。*

### 底层容器访问

| 函数        | 描述                                             |
| ----------- | ------------------------------------------------ |
| `c` (C++98) | 访问底层容器（受保护成员，需通过继承或友元访问） |

*注意：`std::priority_queue` 不直接公开底层容器，需通过自定义方式访问（如继承）。*

### 非成员函数

| 函数                                     | 描述                |
| ---------------------------------------- | ------------------- |
| `std::swap`(std::priority_queue) (C++11) | 特化 std::swap 算法 |

