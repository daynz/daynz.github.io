---
title: "forward_list"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/cpp/06容器库/forward_list.html
tags: [编程语言]
---

# C++ STL forward_list
## 一、核心特性
`std::forward_list` 是 C++11 引入的**单向链表**容器，核心特点：
- 仅支持**单向正向遍历**，无反向迭代器；
- 无 `size()` 成员（极致轻量化，需手动计算元素个数）；
- 仅支持**头部元素直接访问/操作**（`front()`/`push_front()`/`pop_front()`），其他位置需通过迭代器；
- 特有链表操作（`sort()`/`reverse()`/`remove()`/`unique()` 等），适配单向链表特性；
- 无连续内存布局，不支持随机访问（无 `operator[]`/`at()`/`data()`）。

## 二、核心操作分类及使用示例
### 1. 构造函数（9种重载）
| 构造方式         | 语法示例                                                     | 使用场景                                     |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 无参构造         | `std::forward_list<int> flst;`                               | 创建空单向链表，后续动态添加元素             |
| 填充构造         | `std::forward_list<int> flst(5, 10);`                        | 创建包含5个10的forward_list                  |
| 范围构造         | `std::forward_list<int> flst(src.begin(), src.end());`       | 从其他容器迭代器范围创建                     |
| 拷贝构造         | `std::forward_list<int> flst(flst2);`                        | 复制另一个forward_list的所有元素             |
| 移动构造         | `std::forward_list<int> flst = createFlst();`（返回临时对象） | 接管临时对象资源，避免拷贝，提升性能         |
| 列表构造         | `std::forward_list<int> flst{1,2,3,4,5};`                    | C++11+，直接用列表初始化元素                 |
| 带分配器空构造   | `std::forward_list<int> flst(alloc);`                        | 自定义内存分配器时使用                       |
| 带分配器拷贝构造 | `std::forward_list<int> flst(src, alloc);`                   | 拷贝元素+指定自定义分配器                    |
| 带分配器移动构造 | `std::forward_list<int> flst(std::move(flst2), alloc);`      | 移动元素+指定自定义分配器                    |

**使用注意**：日常开发中最常用「无参构造」「填充构造」「列表构造」，分配器相关仅在定制内存管理时使用。

```c++
// 1. 无参构造函数：创建空forward_list
std::forward_list<int> flst;

// 2. 填充构造函数（count + value）
std::forward_list<int> flst2(5, 10);

// 3. 范围构造函数（迭代器范围）
std::forward_list<int> src{1,2,3,4,5};
std::forward_list<int> flst3(src.begin(), src.end());

// 4. 拷贝构造函数
std::forward_list<int> flst4(flst2);

// 5. 移动构造函数（接管临时对象）
auto createFlst = []() {
    return std::forward_list<int>(5, 20); // 返回临时对象
};
std::forward_list<int> flst5 = std::move(createFlst());

// 6. 列表初始化构造（C++11）
std::forward_list<int> flst6{1,2,3,4,5};

// 7. 带分配器的空容器构造
std::allocator<int> alloc;
std::forward_list<int> flst7(alloc);

// 8. 带分配器的拷贝构造
std::forward_list<int> flst8(src, alloc);

// 9. 带分配器的移动构造
std::forward_list<int> flst9(std::move(flst8), alloc);
```

### 2. 赋值操作（7种重载）
| 赋值方式            | 语法示例                                      | 说明                           |
| ------------------- | --------------------------------------------- | ------------------------------ |
| 拷贝赋值            | `std::forward_list<int> flst = flst2;`        | 深拷贝flst2的所有元素到flst    |
| 移动赋值            | `std::forward_list<int> flst = std::move(flst2);` | 转移flst2的资源，flst2变为空  |
| 列表赋值            | `std::forward_list<int> flst = {1,2,3,4,5};`  | 直接用列表赋值                 |
| assign(count+value) | `flst.assign(10, 0);`                         | 清空原有元素，填充10个0        |
| assign(迭代器范围)  | `flst.assign(src.begin(), src.end());`        | 清空原有元素，从迭代器范围赋值 |
| assign(初始化列表)  | `flst.assign({1,2,3,4,5});`                   | 清空原有元素，用列表赋值       |
| 获取分配器          | `auto alloc = flst.get_allocator();`          | 获取forward_list使用的内存分配器 |

**使用技巧**：`assign` 适合批量替换元素，比手动遍历插入更高效。

```c++
// 2.1 拷贝赋值
std::forward_list<int> flst10 = flst6;

// 2.2 移动赋值
std::forward_list<int> flst11 = std::move(flst10);

// 2.3 列表赋值
std::forward_list<int> flst12 = {1,2,3,4,5};

// 2.4 assign重载1：count + value
std::forward_list<int> flst13;
flst13.assign(10, 0);

// 2.5 assign重载2：迭代器范围
flst13.assign(flst9.begin(), flst9.end());

// 2.6 assign重载3：初始化列表
flst13.assign({1,2,3,4,5});

// 2.7 获取分配器（兼容C++11/C++17）
auto flstAlloc = flst13.get_allocator();
// 分配器使用示例
using alloc_traits = std::allocator_traits<decltype(flstAlloc)>;
int* ptr = flstAlloc.allocate(1);
alloc_traits::construct(flstAlloc, ptr, 99); // 构造值99
std::cout << *ptr << std::endl; // 输出99
alloc_traits::destroy(flstAlloc, ptr);
flstAlloc.deallocate(ptr, 1);
```

### 2. 元素访问（仅3种方式）
| 访问方式 | 语法示例        | 特点                                         |
| -------- | --------------- | -------------------------------------------- |
| front()  | `flst.front()`  | 唯一直接访问的元素（链表头部），无越界检查   |
| 正向迭代器 | `flst.begin()`  | 单向遍历/修改元素（仅支持++，不支持--/+-）   |
| const正向迭代器 | `flst.cbegin()` | 只读遍历，不可修改元素                       |

**使用限制**：
- 无 `operator[]`/`at()`/`back()`（单向链表无法随机/尾部访问）；
- 无 `data()`（非连续内存，无底层数组指针）。

```c++
// 准备测试数据
std::forward_list<int> flst{1,2,3,4,5};

// 2.1 front()：访问头部元素
int val1 = flst.front(); // 结果：1

// 2.2 正向迭代器遍历（可修改）
std::cout << "正向遍历：";
for (auto it = flst.begin(); it != flst.end(); ++it) {
    std::cout << *it << " "; // 输出：1 2 3 4 5
    // *it = 99; // 支持修改元素
}

// 2.3 const正向迭代器遍历（只读）
std::cout << "\nconst正向遍历：";
for (auto it = flst.cbegin(); it != flst.cend(); ++it) {
    std::cout << *it << " ";
    // *it = 99; // 错误：const迭代器不可修改
}
```

### 3. 容量操作（仅4种）
| 操作方式      | 语法示例                | 作用                                           |
| ------------- | ----------------------- | ---------------------------------------------- |
| empty()       | `flst.empty()`          | 判断是否为空（返回bool，唯一直接容量判断方式） |
| max_size()    | `flst.max_size()`       | 获取最大可容纳元素数（系统限制）               |
| 手动计算size  | `std::distance(flst.begin(), flst.end())` | 无size()成员，需手动遍历计算元素个数       |
| 无resize/ shrink_to_fit | - | 单向链表按需分配节点，无扩容/缩容概念         |

```c++
std::forward_list<int> flst{1,2,3,4,5};

// 3.1 empty()：判断是否为空
bool isEmpty = flst.empty(); // 结果：false

// 3.2 max_size()：最大容量
size_t maxSize = flst.max_size();

// 3.3 手动计算元素个数
size_t flstSize = std::distance(flst.begin(), flst.end()); // 结果：5

// 3.4 无resize()/shrink_to_fit()，编译报错
// flst.resize(10); // 错误
// flst.shrink_to_fit(); // 错误
```

### 4. 修改操作（18种重载/特有操作）
| 操作方式                | 语法示例                                                     | 作用                                        |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| push_front(val)         | `flst.push_front(100);`                                      | 头部添加元素（核心高效操作）                |
| emplace_front(val)      | `flst.emplace_front(999);`                                   | 头部直接构造元素（比push_front更高效）      |
| pop_front()             | `flst.pop_front();`                                          | 删除头部元素（唯一直接删除操作）            |
| emplace_after(pos, val) | `flst.emplace_after(it, 777);`                               | 在指定迭代器后构造元素（特有）              |
| insert_after(pos, val)  | `flst.insert_after(flst.before_begin(), 888);`               | 在指定迭代器后插入单个元素                  |
| insert_after(pos, n, val)| `flst.insert_after(flst.before_begin(), 3, 666);`            | 在指定迭代器后插入n个相同元素               |
| insert_after(pos, 迭代器范围) | `flst.insert_after(flst.before_begin(), src.begin(), src.end());` | 插入迭代器范围元素               |
| insert_after(pos, 列表) | `flst.insert_after(flst.before_begin(), {999,888});`         | 在指定迭代器后插入列表元素                  |
| erase_after(pos)        | `flst.erase_after(it);`                                      | 删除指定迭代器后的单个元素                  |
| erase_after(范围)       | `flst.erase_after(it_start, it_end);`                        | 删除迭代器范围后的元素                      |
| clear()                 | `flst.clear();`                                              | 清空所有元素（size=0）                      |
| swap(flst)              | `flst.swap(flst2);`                                          | 交换两个forward_list的所有资源（高效）      |
| remove(val)             | `flst.remove(2);`                                            | 删除所有值为val的元素（特有）               |
| remove_if(条件)         | `flst.remove_if([](int n){return n%2==0;});`                 | 按条件删除元素（特有）                      |
| unique()                | `flst.unique();`                                             | 删除连续重复元素（特有）                    |
| sort()                  | `flst.sort();`/`flst.sort(std::greater<int>());`             | 内置排序（升序/降序，特有）                 |
| reverse()               | `flst.reverse();`                                            | 反转链表（特有）                            |
| 比较运算符              | `flst == flst2`                                              | 比较元素顺序+值是否完全相同                 |

**使用技巧**：
- `before_begin()` 是特有哨兵迭代器（指向头部前），用于头部插入/删除；
- 迭代器仅支持 `++`，移动位置需用 `std::advance(it, n)`；
- `sort()`/`reverse()` 是链表优化操作，比通用算法更高效。

```c++
// 准备基础数据
std::forward_list<int> flst{1,2,3,4,5};
std::forward_list<int> src{555,444};

// 4.1 push_front()：头部添加元素
flst.push_front(100); // flst: 100,1,2,3,4,5

// 4.2 emplace_front()：头部构造元素（无拷贝）
flst.emplace_front(999); // flst: 999,100,1,2,3,4,5

// 4.3 pop_front()：删除头部元素
flst.pop_front(); // flst: 100,1,2,3,4,5

// 4.4 emplace_after()：指定位置后构造元素
auto it = flst.begin();
std::advance(it, 1); // 移动到第二个元素
flst.emplace_after(it, 777); // flst: 100,1,777,2,3,4,5

// 4.5 insert_after() 重载1：单个元素（头部插入）
auto it_before = flst.before_begin(); // 头部前哨兵
flst.insert_after(it_before, 888); // flst: 888,100,1,777,2,3,4,5

// 4.6 insert_after() 重载2：n个相同元素
flst.insert_after(it_before, 3, 666); // flst: 666,666,666,888,100,1,777,2,3,4,5

// 4.7 insert_after() 重载3：迭代器范围
flst.insert_after(it_before, src.begin(), src.end()); // 插入555,444

// 4.8 insert_after() 重载4：初始化列表
flst.insert_after(it_before, {999,888});

// 4.9 erase_after() 重载1：删除单个元素
auto it_erase = flst.begin();
std::advance(it_erase, 1);
flst.erase_after(it_erase); // 删除第二个元素后的元素

// 4.10 erase_after() 重载2：删除范围元素
auto it_start = flst.before_begin();
auto it_end = flst.begin();
std::advance(it_end, 2);
flst.erase_after(it_start, it_end); // 删除头部前到第三个元素间的元素

// 4.11 clear()：清空所有元素
flst.clear();
std::cout << "清空后是否为空：" << flst.empty() << std::endl; // true

// 4.12 swap()：交换两个链表
std::forward_list<int> flst1{1,1,1}, flst2{2,2,2};
flst1.swap(flst2);

// 4.13 remove()：删除指定值所有元素
std::forward_list<int> flst_remove{1,2,3,2,4,2};
flst_remove.remove(2); // 结果：1,3,4

// 4.14 remove_if()：按条件删除（删除偶数）
std::forward_list<int> flst_rm_if{1,2,3,4,5,6};
flst_rm_if.remove_if([](int n){return n%2==0;}); // 结果：1,3,5

// 4.15 unique()：删除连续重复元素
std::forward_list<int> flst_unique{1,1,2,2,3,3};
flst_unique.unique(); // 结果：1,2,3

// 4.16 sort()：排序（升序/降序）
std::forward_list<int> flst_sort{5,3,1,4,2};
flst_sort.sort(); // 升序：1,2,3,4,5
flst_sort.sort(std::greater<int>()); // 降序：5,4,3,2,1

// 4.17 reverse()：反转链表
std::forward_list<int> flst_rev{1,2,3,4,5};
flst_rev.reverse(); // 结果：5,4,3,2,1

// 4.18 比较运算符
std::forward_list<int> flst_cmp1{1,2,3}, flst_cmp2{1,2,3};
bool isEqual = (flst_cmp1 == flst_cmp2); // true
```

### 5. 迭代器操作（仅4类，无反向迭代器）
| 迭代器类型       | 语法示例                                                     | 用途                                         |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 正向迭代器       | `for (auto it = flst.begin(); it != flst.end(); ++it)`        | 从前往后遍历/修改元素（仅支持++）            |
| const正向迭代器  | `for (auto it = flst.cbegin(); it != flst.cend(); ++it)`      | 只读遍历，不可修改元素                       |
| before_begin()   | `auto it = flst.before_begin();`                             | 特有哨兵迭代器（指向头部前），用于头部插入   |
| cbefore_begin()  | `auto it = flst.cbefore_begin();`                            | const版哨兵迭代器（只读）                    |

**核心限制**：无反向迭代器（`rbegin()`/`rend()`），单向链表无法反向遍历。

```c++
std::forward_list<int> flst{10,20,30,40};

// 5.1 begin()/end()：正向迭代器
std::cout << "正向遍历：";
for (auto it = flst.begin(); it != flst.end(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
}

// 5.2 cbegin()/cend()：const正向迭代器
std::cout << "\nconst正向遍历：";
for (auto it = flst.cbegin(); it != flst.cend(); ++it) {
    std::cout << *it << " ";
}

// 5.3 before_begin()：哨兵迭代器（头部插入）
auto it_before = flst.before_begin();
flst.insert_after(it_before, 5); // 头部插入5，flst:5,10,20,30,40
std::cout << "\n插入后：";
for (int num : flst) std::cout << num << " ";

// 5.4 cbefore_begin()：const哨兵迭代器
auto it_cbefore = flst.cbefore_begin();
// flst.insert_after(it_cbefore, 0); // 错误：const迭代器不可修改

// 5.5 无反向迭代器，编译报错
// for (auto it = flst.rbegin(); it != flst.rend(); ++it) {} // 错误
```
