# C++ STL deque
## 一、核心
deque（双端队列）是STL中支持**双端高效插入/删除**的动态序列容器，底层为分段连续内存（非单一连续数组），兼顾随机访问与双端操作效率，无固定容量限制，扩容成本低于deqtor。

## 二、核心操作分类及使用示例
### 1. 构造函数（9种重载）
| 构造方式         | 语法示例                                                     | 使用场景                               |
| ---------------- | ------------------------------------------------------------ | -------------------------------------- |
| 无参构造         | `std::deque<int> deq;`                                       | 创建空deque，后续动态添加元素          |
| 填充构造         | `std::deque<int> deq(5, 10);`                                | 创建包含5个10的deque                   |
| 范围构造         | `std::deque<int> deq(source.begin(), source.end());`         | 从其他容器的迭代器范围创建             |
| 拷贝构造         | `std::deque<int> deq(deq);`                                  | 复制另一个deque的所有元素              |
| 移动构造         | `std::deque<int> deq = createDeq();`（createDeq返回临时deque） | 接管临时对象的资源，避免拷贝，提升性能 |
| 列表构造         | `std::deque<int> deq{1,2,3,4,5};`                            | C++11+，直接用列表初始化元素           |
| 带分配器空构造   | `std::deque<int> deq(alloc);`                                | 自定义内存分配器时使用                 |
| 带分配器拷贝构造 | `std::deque<int> deq(source, alloc);`                        | 拷贝元素+指定自定义分配器              |
| 带分配器移动构造 | `std::deque<int> deq(std::move(deq), alloc);`                | 移动元素+指定自定义分配器              |

**使用注意**：日常开发中最常用的是「无参构造」「填充构造」「列表构造」，分配器相关构造仅在定制内存管理时使用。

```c++
// 1. 无参构造函数：创建空deque
std::deque<int> deq;

// 2. 填充构造函数（count + value）：创建n个相同值的deque
std::deque<int> deq(5, 10);

// 3. 范围构造函数（迭代器范围）
std::deque<int> source{ 1, 2, 3, 4, 5 };
std::deque<int> deq(source.begin(), source.end());

// 4. 拷贝构造函数（拷贝其他deque）
std::deque<int> deq(source);

// 5. 移动构造函数（接管临时对象）
auto createDeq = []() {
    return std::deque<int>(5, 20); // 返回临时对象
};
std::deque<int> deq = createDeq();

// 6. 列表初始化构造（C++11）
std::deque<int> deq{ 1, 2, 3, 4, 5 };

// 7. 带分配器的空容器构造
std::allocator<int> alloc;
std::deque<int> deq(alloc);

// 8. 带分配器的拷贝构造（拷贝other内容 + 指定分配器）
std::deque<int> deq(source, alloc);

// 9. 带分配器的移动构造（移动other内容 + 指定分配器）
std::deque<int> deq(std::move(source), alloc);
```

### 2. 赋值操作（7种重载）
| 赋值方式            | 语法示例                                 | 说明                           |
| ------------------- | ---------------------------------------- | ------------------------------ |
| 拷贝赋值            | `std::deque<int> deq = deq;`             | 深拷贝deq的所有元素到deq       |
| 移动赋值            | `std::deque<int> deq = std::move(deq0);` | 转移deq0的资源，deq0变为空     |
| 列表赋值            | `std::deque<int> deq = {1,2,3,4,5};`     | 直接用列表赋值                 |
| assign(count+value) | `deq.assign(10, 0);`                     | 清空原有元素，填充10个0        |
| assign(迭代器范围)  | `deq.assign(deq.begin(), deq.end());`    | 清空原有元素，从迭代器范围赋值 |
| assign(初始化列表)  | `deq.assign({1,2,3,4,5});`               | 清空原有元素，用列表赋值       |
| 获取分配器          | `auto alloc = deq.get_allocator();`      | 获取deque使用的内存分配器      |

**使用技巧**：`assign` 适合批量替换deque元素，比先clear再push_back/push_front更高效。

```c++
// 2.1 拷贝赋值
std::deque<int> deq = source;

// 2.2 移动赋值
std::deque<int> deq = std::move(source);

// 2.3 列表赋值
std::deque<int> deq = { 1, 2, 3, 4, 5 };

// 2.4 assign重载1：count + value
std::deque<int> deq;
deq.assign(10, 0);

// 2.5 assign重载2：迭代器范围
deq.assign(source.begin(), source.end());

// 2.6 assign重载3：初始化列表
deq.assign({ 1,2,3,4,5 });

// 2.7 获取分配器（兼容C++11/C++17的写法）
auto deqAllocator = deq.get_allocator();
// 用分配器分配/构造/销毁/释放内存示例
using alloc_traits = std::allocator_traits<decltype(deqAllocator)>;
int* alloc_ptr = deqAllocator.allocate(1); // 分配1个int空间
alloc_traits::construct(deqAllocator, alloc_ptr, 99); // 构造值为99的元素
alloc_traits::destroy(deqAllocator, alloc_ptr); // 销毁元素
deqAllocator.deallocate(alloc_ptr, 1); // 释放内存
```

### 3. 元素访问
| 访问方式 | 语法示例       | 特点                                         |
| -------- | -------------- | -------------------------------------------- |
| [] 运算符 | `deq[2]`      | 无越界检查，支持随机访问（效率略低于deqtor） |
| at() 方法 | `deq.at(3)`   | 有越界检查，越界抛`out_of_range`异常         |
| front()  | `deq.front()` | 获取第一个元素（deque双端操作核心）          |
| back()   | `deq.back()`  | 获取最后一个元素（deque双端操作核心）        |

**使用建议**：
- 普通场景用`[]`，追求安全用`at()`；
- 频繁访问首尾元素优先用`front()`/`back()`，代码更易读且适配deque特性。

```c++
// 准备测试数据
std::deque<int> deq{1,2,3,4,5};

// 3.1 operator[]：无越界检查
int val1 = deq[2]; // 结果：3

// 3.2 at()：有越界检查
int val2 = deq.at(3); // 结果：4
// deq.at(10); // 越界，抛出std::out_of_range异常

// 3.3 front()：第一个元素
int val3 = deq.front(); // 结果：1

// 3.4 back()：最后一个元素
int val4 = deq.back(); // 结果：5

// 3.5 无data()方法：deque底层非连续内存，无单一数组指针
```

### 4. 容量操作（6种）
| 操作方式      | 语法示例           | 作用                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| size()        | `deq.size()`      | 获取当前元素个数                               |
| empty()       | `deq.empty()`     | 判断是否为空（返回bool）                       |
| max_size()    | `deq.max_size()`  | 获取最大可容纳元素数（系统/内存限制）          |
| resize(n)     | `deq.resize(8)`   | 调整size为8，新增元素用默认值（int默认0）      |
| resize(n, val)| `deq.resize(10,10)` | 调整size为10，新增元素赋值为10                |
| shrink_to_fit()| `deq.shrink_to_fit()` | 释放多余容量（分段内存，效果弱于deqtor）     |

**核心原理**：deque无`capacity()`/`reserve()`（底层分段内存无统一容量概念），`shrink_to_fit()`仅尝试释放分段冗余内存。

```c++
// 4.1 size()：元素个数
size_t size1 = deq.size(); // 结果：5

// 4.2 empty()：是否为空
bool isEmpty = deq.empty(); // 结果：false

// 4.3 max_size()：最大可容纳元素数
size_t maxSize = deq.max_size(); // 系统相关值

// 4.4 resize() 重载1：仅指定count（补默认值）
deq.resize(8);
size_t size2 = deq.size(); // 结果：8
int back1 = deq.back(); // 结果：0（int默认值）

// 4.5 resize() 重载2：count + value（补指定值）
deq.resize(10, 10);
size_t size3 = deq.size(); // 结果：10
int back2 = deq.back(); // 结果：10

// 4.6 shrink_to_fit()：释放多余容量
deq.shrink_to_fit();
size_t size4 = deq.size(); // 结果：10（仅释放冗余分段）
```

### 5. 修改操作（17种重载，双端操作为核心）
| 操作方式                | 语法示例                                           | 作用                                       |
| ----------------------- | -------------------------------------------------- | ------------------------------------------ |
| push_back(val)          | `deq.push_back(100);`                              | 尾部添加元素（拷贝/移动）                  |
| push_front(val)         | `deq.push_front(999);`                             | 头部添加元素（deque特有，高效）            |
| emplace_back(val)       | `deq.emplace_back(300);`                           | 尾部直接构造元素（比push_back更高效）      |
| emplace_front(val)      | `deq.emplace_front(888);`                          | 头部直接构造元素（deque特有，高效）        |
| emplace(pos, val)       | `deq.emplace(deq.begin(), 777);`                   | 在指定位置构造元素                         |
| pop_back()              | `deq.pop_back();`                                  | 删除尾部元素（不返回值）                   |
| pop_front()             | `deq.pop_front();`                                 | 删除头部元素（deque特有，高效）            |
| insert(pos, val)        | `deq.insert(deq.begin()+1, 99);`                   | 在指定位置插入单个元素                     |
| insert(pos, 函数返回值) | `deq.insert(deq.begin(), func());`                 | 在指定位置插入函数返回的元素               |
| insert(pos, n, val)     | `deq.insert(deq.begin(), 10, 10);`                 | 在指定位置插入n个相同元素                  |
| insert(pos, 迭代器范围) | `deq.insert(deq.begin(), deq.begin(), deq.end());` | 在指定位置插入另一个容器的元素范围         |
| insert(pos, 列表)       | `deq.insert(deq.begin(), {1,2,3});`                | 在指定位置插入列表元素                     |
| erase(pos)              | `deq.erase(deq.begin()+1);`                        | 删除指定位置的单个元素                     |
| erase(范围)             | `deq.erase(deq.begin(), deq.begin()+1);`           | 删除迭代器范围内的元素                     |
| clear()                 | `deq.clear();`                                     | 清空所有元素（size=0，保留分段内存）       |
| swap(deq)               | `deq.swap(deq);`                                   | 交换两个deque的所有资源（高效，O(1)）      |
| 比较运算符              | `deq == deq`                                       | 比较两个deque是否相等（元素顺序+值都相同） |

**使用技巧**：
- 优先用`emplace_back`/`emplace_front`替代`push_back`/`push_front`，减少拷贝；
- 头部/尾部插入/删除优先用deque（O(1)），中间操作效率低（需移动分段元素）；
- `erase`会使迭代器失效，遍历删除时需注意；
- `swap`仅交换内部指针，时间复杂度O(1)。

```c++
auto func = []() {return int(1); };
std::deque<int> deq;

// 5.1 push_back()：尾部添加元素
deq.push_back(100);
deq.push_back(200);
deq.push_back(func()); // 插入函数返回值

// 5.2 push_front()：头部添加元素（deque核心特性）
deq.push_front(999);

// 5.3 emplace_back()：尾部构造元素
deq.emplace_back(300);

// 5.4 emplace_front()：头部构造元素（deque核心特性）
deq.emplace_front(888);

// 5.5 emplace()：指定位置构造元素
auto it_emplace = deq.emplace(deq.begin() + 2, 777);

// 5.6 pop_back()：删除尾部元素
deq.pop_back();

// 5.7 pop_front()：删除头部元素（deque核心特性）
deq.pop_front();

// 5.8 insert() 重载1：单个元素
auto it = deq.insert(deq.begin() + 1, 99);

// 5.9 insert() 重载2：插入函数返回值
deq.insert(deq.begin(), func());

// 5.10 insert() 重载3：n个相同元素
deq.insert(deq.begin(), 10, 10);

// 5.11 insert() 重载4：迭代器范围
deq.insert(deq.begin(), deq.begin(), deq.end());

// 5.12 insert() 重载5：初始化列表
deq.insert(deq.begin(), { 1,2,3 });

// 5.13 erase() 重载1：单个元素
deq.erase(deq.begin() + 1);

// 5.14 erase() 重载2：迭代器范围
deq.erase(deq.begin(), deq.begin() + 1);

// 5.15 clear()：清空元素
deq.clear();

// 5.16 swap()：交换两个deque
std::deque<int> deq2(5, 5);
deq.swap(deq2);

// 5.17 比较运算符（==）
bool isEqual = (deq == deq2); // 结果：false
```

### 6. 迭代器操作（4类）
| 迭代器类型      | 语法示例                                                 | 用途                       |
| --------------- | -------------------------------------------------------- | -------------------------- |
| 正向迭代器      | `for (auto it = deq.begin(); it != deq.end(); ++it)`     | 从前往后遍历元素（可修改） |
| 反向迭代器      | `for (auto it = deq.rbegin(); it != deq.rend(); ++it)`   | 从后往前遍历元素（可修改） |
| const正向迭代器 | `for (auto it = deq.cbegin(); it != deq.cend(); ++it)`   | 只读遍历，不可修改元素     |
| const反向迭代器 | `for (auto it = deq.crbegin(); it != deq.crend(); ++it)` | 只读反向遍历，不可修改元素 |

**使用场景**：遍历deque时优先用迭代器（或范围for），const迭代器用于保护数据不被修改；deque迭代器支持随机访问，但效率略低于deqtor。

```c++
std::deque<int> deq{ 10, 20, 30, 40 };

// 6.1 begin()/end()：正向迭代器
std::cout << "正向遍历：";
for (auto it = deq.begin(); it != deq.end(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
}

// 6.2 rbegin()/rend()：反向迭代器
std::cout << "\n反向遍历：";
for (auto it = deq.rbegin(); it != deq.rend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
}

// 6.3 cbegin()/cend()：const正向迭代器（只读）
std::cout << "\nconst正向遍历：";
for (auto it = deq.cbegin(); it != deq.cend(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
    // *it = 99; // 错误：const迭代器不可修改元素
}

// 6.4 crbegin()/crend()：const反向迭代器（只读）
std::cout << "\nconst反向遍历：";
for (auto it = deq.crbegin(); it != deq.crend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
    // *it = 99; // 错误：const迭代器不可修改元素
}
```