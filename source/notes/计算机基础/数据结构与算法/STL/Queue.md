# `STL-queue`

定义于头文件 `<queue>` (C++98起)

```c++
template<
    class T,
    class Container = std::deque<T>
> class queue;
```

`std::queue` 是一个容器适配器，提供先进先出（FIFO）队列功能，基于底层容器（默认 `std::deque`）。

*未定义行为：对空队列调用 `front`, `back`, 或 `pop` 会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::queue` 支持多种构造方式，初始化元素或配置底层容器。

```c++
// 1. 默认构造（空队列）
std::queue<int> q1;

// 2. 指定底层容器
std::queue<int, std::list<int>> q2;

// 3. 从容器构造
std::deque<int> deq = {1, 2, 3};
std::queue<int, std::deque<int>> q3(deq);

// 4. 拷贝构造
std::queue<int> q4(q1);

// 5. 移动构造 (C++11起)
std::queue<int> q5 = std::move(q1); // q1变为空

// 6. 从容器构造并指定容器类型
std::list<int> lst = {4, 5, 6};
std::queue<int, std::list<int>> q6(lst);
```

#### 析构函数

销毁 queue 的所有元素并释放底层容器的内存.

#### operator=

以来自另一 queue 的元素重写 queue 的内容。

```c++
// 1. 拷贝赋值
std::queue<int> q1;
q1.push(1); q1.push(2);
std::queue<int> q2;
q2 = q1; // q2现在包含{1, 2}（前端到后端）

// 2. 移动赋值 (C++11起)
std::queue<int> q3;
q3 = std::move(q1); // q1变为空
```

### 元素访问

#### `front`

访问队列前端的元素。

```c++
std::queue<int> q;
q.push(1); q.push(2);
const std::queue<int> cq = q;

std::cout << "q.front(): " << q.front() << "\n"; // 输出 1
std::cout << "cq.front(): " << cq.front() << "\n"; // 输出 1
q.front() = 100; // 修改前端元素
std::cout << "After q.front()=100: " << q.front() << "\n"; // 输出 100
```

#### `back`

访问队列后端的元素。

```c++
std::queue<int> q;
q.push(1); q.push(2);
const std::queue<int> cq = q;

std::cout << "q.back(): " << q.back() << "\n"; // 输出 2
std::cout << "cq.back(): " << cq.back() << "\n"; // 输出 2
q.back() = 200; // 修改后端元素
std::cout << "After q.back()=200: " << q.back() << "\n"; // 输出 200
```

*未定义行为：对空队列调用 `front` 或 `back` 是未定义行为。*

### 容量

| 函数            | 描述             |
| --------------- | ---------------- |
| `empty` (C++98) | 检查队列是否为空 |
| `size` (C++98)  | 返回当前元素数量 |

### 修改器

| 函数              | 描述                     |
| ----------------- | ------------------------ |
| `push` (C++98)    | 插入元素到队列后端       |
| `emplace` (C++11) | 构造并插入元素到队列后端 |
| `pop` (C++98)     | 移除队列前端元素         |
| `swap` (C++11)    | 交换内容                 |

```c++
// push 示例
std::queue<int> q;
q.push(1); // 队列包含{1}
q.push(2); // 队列包含{1, 2}

// emplace 示例
q.emplace(3); // 队列包含{1, 2, 3}

// pop 示例
q.pop(); // 队列包含{2, 3}

// swap 示例
std::queue<int> q1;
q1.push(1); q1.push(2);
std::queue<int> q2;
q2.push(3);
q1.swap(q2); // q1包含{3}，q2包含{1, 2}
```

*未定义行为：对空队列调用 `pop` 是未定义行为。*

### 底层容器访问

| 函数        | 描述                                             |
| ----------- | ------------------------------------------------ |
| `c` (C++98) | 访问底层容器（受保护成员，需通过继承或友元访问） |

*注意：`std::queue` 不直接公开底层容器，需通过自定义方式访问（如继承）。*

### 非成员函数

| 函数                            | 描述                |
| ------------------------------- | ------------------- |
| `operator==`                    | 比较 queue 中的元素 |
| `operator!= < <= > >=`          | (C++20 中移除)      |
| `operator<=>`                   | C++20               |
| `std::swap`(std::queue) (C++11) | 特化 std::swap 算法 |

```c++
// operator== 示例
std::queue<int> q1;
q1.push(1); q1.push(2);
std::queue<int> q2;
q2.push(1); q2.push(2);
bool equal = (q1 == q2); // true

// std::swap 示例
std::queue<int> q3;
q3.push(3);
std::swap(q1, q3); // q1包含{3}，q3包含{1, 2}
```