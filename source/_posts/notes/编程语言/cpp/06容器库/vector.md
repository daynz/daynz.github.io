---
title: "vector"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/cpp/06容器库/vector.html
tags: [编程语言]
---

# C++ STL vector
## 一、核心


## 二、核心操作分类及使用示例
### 1. 构造函数（9种重载）
| 构造方式         | 语法示例                                                     | 使用场景                                     |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 无参构造         | `std::vector<int> vec;`                                      | 创建空vector，后续动态添加元素               |
| 填充构造         | `std::vector<int> vec(5, 10);`                               | 创建包含5个10的vector                        |
| 范围构造         | `std::vector<int> vec(source.begin(), source.end());`        | 从其他容器（如另一个vector）的迭代器范围创建 |
| 拷贝构造         | `std::vector<int> vec(vec);`                                 | 复制另一个vector的所有元素                   |
| 移动构造         | `std::vector<int> vec = createVec();`（createVec返回临时vector） | 接管临时对象的资源，避免拷贝，提升性能       |
| 列表构造         | `std::vector<int> vec{1,2,3,4,5};`                           | C++11+，直接用列表初始化元素                 |
| 带分配器空构造   | `std::vector<int> vec(alloc);`                               | 自定义内存分配器时使用                       |
| 带分配器拷贝构造 | `std::vector<int> vec(source, alloc);`                       | 拷贝元素+指定自定义分配器                    |
| 带分配器移动构造 | `std::vector<int> vec(std::move(vec), alloc);`               | 移动元素+指定自定义分配器                    |

**使用注意**：日常开发中最常用的是「无参构造」「填充构造」「列表构造」，分配器相关构造仅在定制内存管理时使用。

```c++
// 1. 无参构造函数：创建空vector
std::vector<int> vec;

// 2. 填充构造函数（count + value）：创建n个相同值的vector
std::vector<int> vec(5, 10);

// 3. 范围构造函数（迭代器范围）
std::vector<int> source{ 1, 2, 3, 4, 5 };
std::vector<int> vec(source.begin(), source.end());

// 4. 拷贝构造函数（拷贝其他vector）
std::vector<int> vec(vec);

// 5. 移动构造函数（接管临时对象）
auto createVec = []() {
	return std::vector<int>(5, 20); // 返回临时对象
	};
std::vector<int> vec = createVec();

// 6. 列表初始化构造（C++11）
std::vector<int> vec{ 1, 2, 3, 4, 5 };

// 7. 带分配器的空容器构造
std::allocator<int> alloc;
std::vector<int> vec(alloc);

// 8. 带分配器的拷贝构造（拷贝other内容 + 指定分配器）
std::vector<int> vec(source, alloc);

// 9. 带分配器的移动构造（移动other内容 + 指定分配器）
std::vector<int> vec(std::move(vec), alloc);
```

### 2. 赋值操作（7种重载）
| 赋值方式            | 语法示例                                  | 说明                           |
| ------------------- | ----------------------------------------- | ------------------------------ |
| 拷贝赋值            | `std::vector<int> vec = vec;`             | 深拷贝vec的所有元素到vec       |
| 移动赋值            | `std::vector<int> vec = std::move(vec0);` | 转移vec0的资源，vec0变为空     |
| 列表赋值            | `std::vector<int> vec = {1,2,3,4,5};`     | 直接用列表赋值                 |
| assign(count+value) | `vec.assign(10, 0);`                      | 清空原有元素，填充10个0        |
| assign(迭代器范围)  | `vec.assign(vec.begin(), vec.end());`     | 清空原有元素，从迭代器范围赋值 |
| assign(初始化列表)  | `vec.assign({1,2,3,4,5});`                | 清空原有元素，用列表赋值       |
| 获取分配器          | `auto alloc = vec.get_allocator();`       | 获取vector使用的内存分配器     |

**使用技巧**：`assign` 适合批量替换vector元素，比先clear再push_back更高效。

```c++
// 2.1 拷贝赋值
std::vector<int> vec = vec;

// 2.2 移动赋值
std::vector<int> vec = std::move(vec);

// 2.3 列表赋值
std::vector<int> vec = { 1, 2, 3, 4, 5 };

// 2.4 assign重载1：count + value
std::vector<int> vec;
vec.assign(10, 0);

// 2.5 assign重载2：迭代器范围
vec.assign(vec.begin(), vec.end());

// 2.6 assign重载3：初始化列表
vec.assign({ 1,2,3,4,5 });

// 2.7 获取分配器（兼容C++11/C++17的写法）
auto vectorAllocator = vec.get_allocator();
// 用分配器分配/构造/销毁/释放内存示例
using alloc_traits = std::allocator_traits<decltype(vectorAllocator)>;
int* alloc_ptr = vectorAllocator.allocate(1); // 分配1个int空间
alloc_traits::construct(vectorAllocator, alloc_ptr, 99); // 构造值为99的元素
alloc_traits::destroy(vectorAllocator, alloc_ptr); // 销毁元素
vectorAllocator.deallocate(alloc_ptr, 1); // 释放内存
```

### 3. 元素访问（5种方式）
| 访问方式 | 语法示例       | 特点                                         |
| -------- | -------------- | -------------------------------------------- |
| [] 运算符 | `vec[2]`      | 无越界检查，速度快，越界会崩溃               |
| at() 方法 | `vec.at(3)`   | 有越界检查，越界抛`out_of_range`异常         |
| front()  | `vec.front()` | 获取第一个元素（等价于vec[0]）              |
| back()   | `vec.back()`  | 获取最后一个元素（等价于vec[vec.size()-1]） |
| data()   | `vec.data()` | 获取底层数组指针，可直接操作内存             |

**使用建议**：
- 普通场景用`[]`，追求安全用`at()`；
- 频繁访问首尾元素优先用`front()`/`back()`，代码更易读。

```c++
// 准备测试数据
std::vector<int> vec{1,2,3,4,5};

// 3.1 operator[]：无越界检查
int val1 = vec[2]; // 结果：3

// 3.2 at()：有越界检查
int val2 = vec.at(3); // 结果：4
// vec.at(10); // 越界，抛出std::out_of_range异常

// 3.3 front()：第一个元素
int val3 = vec.front(); // 结果：1

// 3.4 back()：最后一个元素
int val4 = vec.back(); // 结果：5

// 3.5 data()：底层数组指针
int* ptr = vec.data();
int val5 = ptr[1]; // 结果：2
```

### 4. 容量操作（7种）
| 操作方式      | 语法示例           | 作用                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| size()        | `vec.size()`      | 获取当前元素个数                               |
| empty()       | `vec.empty()`     | 判断是否为空（返回bool）                       |
| capacity()    | `vec.capacity()`  | 获取当前容量（已分配的内存能容纳的元素数）     |
| reserve(n)    | `vec.reserve(10)` | 预留容量为10，避免频繁扩容（仅扩容，不添加元素） |
| resize(n)     | `vec.resize(8)`   | 调整size为8，新增元素用默认值（int默认0）      |
| resize(n, val)| `vec.resize(10,10)` | 调整size为10，新增元素赋值为10                |
| shrink_to_fit()| `vec.shrink_to_fit()` | 释放多余容量，使capacity=size                 |

**核心原理**：vector扩容时会重新分配内存并拷贝元素，提前`reserve`可减少扩容次数，提升性能。

```c++
// 4.1 size()：元素个数
size_t size1 = vec.size(); // 结果：5

// 4.2 empty()：是否为空
bool isEmpty = vec.empty(); // 结果：true

// 4.3 capacity()：当前容量
size_t cap1 = vec.capacity(); // 初始容量通常≥5

// 4.4 reserve()：预留容量
vec.reserve(10);
size_t cap2 = vec.capacity(); // 结果：10

// 4.5 resize() 重载1：仅指定count（补默认值）
vec.resize(8);
size_t size2 = vec.size(); // 结果：8
int back1 = vec.back(); // 结果：0（int默认值）

// 4.6 resize() 重载2：count + value（补指定值）
vec.resize(10, 10);
size_t size3 = vec.size(); // 结果：10
int back2 = vec.back(); // 结果：10

// 4.7 shrink_to_fit()：释放多余容量
vec.shrink_to_fit();
size_t cap3 = vec.capacity(); // 结果：10（size=10，容量匹配）
```

### 5. 修改操作（15种重载）
| 操作方式                | 语法示例                                           | 作用                                        |
| ----------------------- | -------------------------------------------------- | ------------------------------------------- |
| push_back(val)          | `vec.push_back(100);`                              | 尾部添加元素（拷贝/移动）                   |
| emplace_back(val)       | `vec.emplace_back(300);`                           | 尾部直接构造元素（比push_back更高效）       |
| emplace(pos, val)       | `vec.emplace(vec.begin(), 999);`                   | 在指定位置构造元素                          |
| pop_back()              | `vec.pop_back();`                                  | 删除尾部元素（不返回值）                    |
| insert(pos, val)        | `vec.insert(vec.begin()+1, 99);`                   | 在指定位置插入单个元素                      |
| insert(pos, 函数返回值) | `vec.insert(vec.begin(), func());`                 | 在指定位置插入函数返回的元素                |
| insert(pos, n, val)     | `vec.insert(vec.begin(), 10, 10);`                 | 在指定位置插入n个相同元素                   |
| insert(pos, 迭代器范围) | `vec.insert(vec.begin(), vec.begin(), vec.end());` | 在指定位置插入另一个容器的元素范围          |
| insert(pos, 列表)       | `vec.insert(vec.begin(), {1,2,3});`                | 在指定位置插入列表元素                      |
| erase(pos)              | `vec.erase(vec.begin()+1);`                        | 删除指定位置的单个元素                      |
| erase(范围)             | `vec.erase(vec.begin(), vec.begin()+1);`           | 删除迭代器范围内的元素                      |
| assign(count+value)     | `vec.assign(3, 88);`                               | 批量替换元素（复用，此处验证）              |
| clear()                 | `vec.clear();`                                     | 清空所有元素（size=0，capacity不变）        |
| swap(vec)               | `vec.swap(vec);`                                   | 交换两个vector的所有资源（高效）            |
| 比较运算符              | `vec == vec`                                       | 比较两个vector是否相等（元素顺序+值都相同） |

**使用技巧**：
- 优先用`emplace_back`替代`push_back`，减少拷贝；
- `erase`会使迭代器失效，遍历删除时需注意；
- `swap`仅交换内部指针，时间复杂度O(1)。

```c++
auto func = []() {return int(1); };

// 5.1 push_back()：尾部添加元素
vec.push_back(100);
vec.push_back(200);
vec.push_back(func()); // 插入函数返回值

// 5.2 emplace_back()：尾部构造元素
vec.emplace_back(300);

// 5.3 emplace()：指定位置构造元素
vec.emplace(vec.begin(), 999); // 在开头构造999

// 5.4 pop_back()：删除尾部元素
vec.pop_back();

// 5.5 insert() 重载1：单个元素
auto it = vec.insert(vec.begin() + 1, 99);

// 5.6 insert() 重载2：插入函数返回值
vec.insert(vec.begin(), func());

// 5.7 insert() 重载3：n个相同元素
vec.insert(vec.begin(), 10, 10);

// 5.8 insert() 重载4：迭代器范围
vec.insert(vec.begin(), vec.begin(), vec.end());

// 5.9 insert() 重载5：初始化列表
vec.insert(vec.begin(), { 1,2,3 });

// 5.10 erase() 重载1：单个元素
vec.erase(vec.begin() + 1);

// 5.11 erase() 重载2：迭代器范围
vec.erase(vec.begin(), vec.begin() + 1);

// 5.12 assign() 重载（复用验证）
vec.assign(3, 88);

// 5.13 clear()：清空元素
vec.clear();

// 5.14 swap()：交换两个vector
vec.swap(vec);

// 5.15 比较运算符（==）
bool isEqual = (vec == vec); // 结果：false
```

### 6. 迭代器操作（4类）
| 迭代器类型       | 语法示例                                                     | 用途                                         |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 正向迭代器       | `for (auto it = vec.begin(); it != vec.end(); ++it)`         | 从前往后遍历元素（可修改）                   |
| 反向迭代器       | `for (auto it = vec.rbegin(); it != vec.rend(); ++it)`       | 从后往前遍历元素（可修改）                   |
| const正向迭代器  | `for (auto it = vec.cbegin(); it != vec.cend(); ++it)`       | 只读遍历，不可修改元素                       |
| const反向迭代器  | `for (auto it = vec.crbegin(); it != vec.crend(); ++it)`     | 只读反向遍历，不可修改元素                   |

**使用场景**：遍历vector时优先用迭代器（或范围for），const迭代器用于保护数据不被修改。

```c++
// 6.1 begin()/end()：正向迭代器
std::cout << "正向遍历：";
for (auto it = iter_vec.begin(); it != iter_vec.end(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
}

// 6.2 rbegin()/rend()：反向迭代器
std::cout << "\n反向遍历：";
for (auto it = iter_vec.rbegin(); it != iter_vec.rend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
}

// 6.3 cbegin()/cend()：const正向迭代器（只读）
std::cout << "\nconst正向遍历：";
for (auto it = iter_vec.cbegin(); it != iter_vec.cend(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
    // *it = 99; // 错误：const迭代器不可修改元素
}

// 6.4 crbegin()/crend()：const反向迭代器（只读）
std::cout << "\nconst反向遍历：";
for (auto it = iter_vec.crbegin(); it != iter_vec.crend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
    // *it = 99; // 错误：const迭代器不可修改元素
}
```