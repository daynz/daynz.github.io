---
title: "list"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/cpp/06容器库/list.html
tags: [编程语言]
---

# C++ STL list
## 一、核心
list 是 STL 中的双向链表容器，不支持随机访问，任意位置增删元素效率高（O(1)），但遍历效率低于 vector（非连续内存）。

## 二、核心操作分类及使用示例
### 1. 构造函数（9种重载）
| 构造方式         | 语法示例                                                     | 使用场景                                     |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 无参构造         | `std::list<int> lst;`                                        | 创建空list，后续动态添加元素                 |
| 填充构造         | `std::list<int> lst(5, 10);`                                 | 创建包含5个10的list                          |
| 范围构造         | `std::list<int> lst(source.begin(), source.end());`          | 从其他容器（如另一个list）的迭代器范围创建   |
| 拷贝构造         | `std::list<int> lst(lst);`                                   | 复制另一个list的所有元素                     |
| 移动构造         | `std::list<int> lst = createLst();`（createLst返回临时list） | 接管临时对象的资源，避免拷贝，提升性能       |
| 列表构造         | `std::list<int> lst{1,2,3,4,5};`                             | C++11+，直接用列表初始化元素                 |
| 带分配器空构造   | `std::list<int> lst(alloc);`                                 | 自定义内存分配器时使用                       |
| 带分配器拷贝构造 | `std::list<int> lst(source, alloc);`                         | 拷贝元素+指定自定义分配器                    |
| 带分配器移动构造 | `std::list<int> lst(std::move(lst), alloc);`                 | 移动元素+指定自定义分配器                    |

**使用注意**：日常开发中最常用的是「无参构造」「填充构造」「列表构造」，分配器相关构造仅在定制内存管理时使用。

```c++
// 1. 无参构造函数：创建空list
std::list<int> lst1;

// 2. 填充构造函数（count + value）：创建n个相同值的list
std::list<int> lst2(5, 10);

// 3. 范围构造函数（迭代器范围）
std::list<int> source{ 1, 2, 3, 4, 5 };
std::list<int> lst3(source.begin(), source.end());

// 4. 拷贝构造函数（拷贝其他list）
std::list<int> lst4(lst2);

// 5. 移动构造函数（接管临时对象）
auto createLst = []() {
	return std::list<int>(5, 20); // 返回临时对象
	};
std::list<int> lst5 = std::move(createLst());

// 6. 列表初始化构造（C++11）
std::list<int> lst6{ 1, 2, 3, 4, 5 };

// 7. 带分配器的空容器构造
std::allocator<int> alloc;
std::list<int> lst7(alloc);

// 8. 带分配器的拷贝构造（拷贝other内容 + 指定分配器）
std::list<int> lst8(source, alloc);

// 9. 带分配器的移动构造（移动other内容 + 指定分配器）
std::list<int> lst9(std::move(lst8), alloc);
```

### 2. 赋值操作（7种重载）
| 赋值方式            | 语法示例                                  | 说明                           |
| ------------------- | ----------------------------------------- | ------------------------------ |
| 拷贝赋值            | `std::list<int> lst = lst;`               | 深拷贝lst的所有元素到lst       |
| 移动赋值            | `std::list<int> lst = std::move(lst0);`   | 转移lst0的资源，lst0变为空     |
| 列表赋值            | `std::list<int> lst = {1,2,3,4,5};`       | 直接用列表赋值                 |
| assign(count+value) | `lst.assign(10, 0);`                      | 清空原有元素，填充10个0        |
| assign(迭代器范围)  | `lst.assign(lst.begin(), lst.end());`     | 清空原有元素，从迭代器范围赋值 |
| assign(初始化列表)  | `lst.assign({1,2,3,4,5});`                | 清空原有元素，用列表赋值       |
| 获取分配器          | `auto alloc = lst.get_allocator();`       | 获取list使用的内存分配器       |

**使用技巧**：`assign` 适合批量替换list元素，比先clear再push_back/push_front更高效。

```c++
// 2.1 拷贝赋值
std::list<int> lst10 = lst6;

// 2.2 移动赋值
std::list<int> lst11 = std::move(lst10);

// 2.3 列表赋值
std::list<int> lst12 = { 1, 2, 3, 4, 5 };

// 2.4 assign重载1：count + value
std::list<int> lst13;
lst13.assign(10, 0);

// 2.5 assign重载2：迭代器范围
lst13.assign(lst9.begin(), lst9.end());

// 2.6 assign重载3：初始化列表
lst13.assign({ 1,2,3,4,5 });

// 2.7 获取分配器（兼容C++11/C++17的写法）
auto lstAllocator = lst13.get_allocator();
// 用分配器分配/构造/销毁/释放内存示例
using alloc_traits = std::allocator_traits<decltype(lstAllocator)>;
int* alloc_ptr = lstAllocator.allocate(1); // 分配1个int空间
alloc_traits::construct(lstAllocator, alloc_ptr, 99); // 构造值为99的元素
alloc_traits::destroy(lstAllocator, alloc_ptr); // 销毁元素
lstAllocator.deallocate(alloc_ptr, 1); // 释放内存
```

### 3. 元素访问（list无随机访问，仅支持双端+迭代器访问）
| 访问方式 | 语法示例       | 特点                                         |
| -------- | -------------- | -------------------------------------------- |
| [] 运算符 | 不支持         | 双向链表无随机访问，无该重载                 |
| at() 方法 | 不支持         | 无随机访问，无该重载                         |
| front()  | `lst.front()` | 获取第一个元素（O(1)）                       |
| back()   | `lst.back()`  | 获取最后一个元素（O(1)）                     |
| data()   | 不支持         | 非连续内存，无底层数组指针                   |
| 迭代器访问 | `*it`（it为list迭代器） | 唯一的遍历/修改元素方式（双向迭代器仅支持++/--） |

**使用建议**：
- 访问首尾元素优先用`front()`/`back()`；
- 遍历元素必须用迭代器或范围for（无随机访问）。

```c++
// 准备测试数据
std::list<int> lst{1,2,3,4,5};

// 3.1 front()：第一个元素
int val1 = lst.front(); // 结果：1

// 3.2 back()：最后一个元素
int val2 = lst.back(); // 结果：5

// 3.3 迭代器访问（唯一的遍历方式）
std::cout << "迭代器遍历：";
for (auto it = lst.begin(); it != lst.end(); ++it) {
    std::cout << *it << " "; // 输出：1 2 3 4 5
}

// 3.4 范围for遍历（底层还是迭代器）
std::cout << "\n范围for遍历：";
for (int num : lst) {
    std::cout << num << " "; // 输出：1 2 3 4 5
}
```

### 4. 容量操作（6种）
| 操作方式      | 语法示例           | 作用                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| size()        | `lst.size()`      | 获取当前元素个数                               |
| empty()       | `lst.empty()`     | 判断是否为空（返回bool）                       |
| max_size()    | `lst.max_size()`  | 获取最大可容纳元素数（系统/内存限制）          |
| resize(n)     | `lst.resize(8)`   | 调整size为8，新增元素用默认值（int默认0）      |
| resize(n, val)| `lst.resize(10,10)` | 调整size为10，新增元素赋值为10                |
| shrink_to_fit()| 无实际效果        | list无冗余容量，调用后无变化                   |

**核心原理**：list每个节点独立分配内存，无“容量”概念，resize仅增删节点，无扩容拷贝开销。

```c++
// 准备测试数据
std::list<int> lst{1,2,3,4,5};

// 4.1 size()：元素个数
size_t size1 = lst.size(); // 结果：5

// 4.2 empty()：是否为空
bool isEmpty = lst.empty(); // 结果：false

// 4.3 max_size()：最大可容纳元素数
size_t maxSize = lst.max_size(); // 系统相关，通常极大

// 4.4 resize() 重载1：仅指定count（补默认值）
lst.resize(8);
size_t size2 = lst.size(); // 结果：8
int back1 = lst.back(); // 结果：0（int默认值）

// 4.5 resize() 重载2：count + value（补指定值）
lst.resize(10, 10);
size_t size3 = lst.size(); // 结果：10
int back2 = lst.back(); // 结果：10

// 4.6 shrink_to_fit()：list无冗余容量，调用无效果
lst.shrink_to_fit();
size_t size4 = lst.size(); // 结果：10（无变化）
```

### 5. 修改操作（22种重载，含list特有高效操作）
| 操作方式                | 语法示例                                           | 作用                                        |
| ----------------------- | -------------------------------------------------- | ------------------------------------------- |
| push_back(val)          | `lst.push_back(100);`                              | 尾部添加元素（拷贝/移动）                   |
| push_front(val)         | `lst.push_front(999);`                             | 头部添加元素（list特有，O(1)）              |
| emplace_back(val)       | `lst.emplace_back(300);`                           | 尾部直接构造元素（比push_back更高效）       |
| emplace_front(val)      | `lst.emplace_front(888);`                          | 头部直接构造元素（list特有，O(1)）          |
| emplace(pos, val)       | `lst.emplace(std::next(lst.begin(),2), 777);`      | 在指定位置构造元素（O(1)，list核心优势）    |
| pop_back()              | `lst.pop_back();`                                  | 删除尾部元素（不返回值，O(1)）              |
| pop_front()             | `lst.pop_front();`                                 | 删除头部元素（list特有，O(1)）              |
| insert(pos, val)        | `lst.insert(std::next(lst.begin(),1), 99);`        | 在指定位置插入单个元素                      |
| insert(pos, 函数返回值) | `lst.insert(lst.begin(), func());`                 | 在指定位置插入函数返回的元素                |
| insert(pos, n, val)     | `lst.insert(lst.begin(), 10, 10);`                 | 在指定位置插入n个相同元素                   |
| insert(pos, 迭代器范围) | `lst.insert(lst.begin(), lst.begin(), lst.end());` | 在指定位置插入另一个容器的元素范围          |
| insert(pos, 列表)       | `lst.insert(lst.begin(), {1,2,3});`                | 在指定位置插入列表元素                      |
| erase(pos)              | `lst.erase(std::next(lst.begin(),1));`             | 删除指定位置的单个元素（O(1)）              |
| erase(范围)             | `lst.erase(lst.begin(), std::next(lst.begin(),1));`| 删除迭代器范围内的元素                      |
| clear()                 | `lst.clear();`                                     | 清空所有元素（size=0，节点全部释放）        |
| swap(lst)               | `lst.swap(lst);`                                   | 交换两个list的所有资源（高效，O(1)）        |
| remove(val)             | `lst.remove(2);`                                   | 删除所有值为val的元素（list特有）           |
| remove_if(条件)         | `lst.remove_if([](int n){return n%2==0;});`        | 按条件删除元素（list特有）                  |
| unique()                | `lst.unique();`                                    | 删除连续重复元素（list特有）                |
| sort()                  | `lst.sort();`/`lst.sort(std::greater<int>());`     | 内置排序（链表高效排序，O(nlogn)）          |
| reverse()               | `lst.reverse();`                                   | 反转链表（list特有，O(n)）                  |
| 比较运算符              | `lst == lst`                                       | 比较两个list是否相等（元素顺序+值都相同）   |

**使用技巧**：
- 优先用`emplace_back`/`emplace_front`替代`push_back`/`push_front`，减少拷贝；
- list任意位置增删效率远高于vector，适合频繁插入删除场景；
- `sort()`是list内置排序，比全局`std::sort`更高效（无需随机访问）。

```c++
auto func = []() {return int(1); };
std::list<int> lst;

// 5.1 push_back()：尾部添加元素
lst.push_back(100);
lst.push_back(200);
lst.push_back(func());

// 5.2 push_front()：头部添加元素
lst.push_front(999);

// 5.3 emplace_back()：尾部构造元素
lst.emplace_back(300);

// 5.4 emplace_front()：头部构造元素
lst.emplace_front(888);

// 5.5 emplace()：指定位置构造元素
auto it_emplace = lst.emplace(std::next(lst.begin(), 2), 777);

// 5.6 pop_back()：删除尾部元素
lst.pop_back();

// 5.7 pop_front()：删除头部元素
lst.pop_front();

// 5.8 insert() 重载1：单个元素
auto it = lst.insert(std::next(lst.begin(), 1), 99);

// 5.9 insert() 重载2：插入函数返回值
lst.insert(lst.begin(), func());

// 5.10 insert() 重载3：n个相同元素
lst.insert(lst.begin(), 10, 10);

// 5.11 insert() 重载4：迭代器范围
lst.insert(lst.begin(), lst.begin(), lst.end());

// 5.12 insert() 重载5：初始化列表
lst.insert(lst.begin(), { 1,2,3 });

// 5.13 erase() 重载1：单个元素
lst.erase(std::next(lst.begin(), 1));

// 5.14 erase() 重载2：迭代器范围
lst.erase(lst.begin(), std::next(lst.begin(), 1));

// 5.15 clear()：清空元素
lst.clear();

// 5.16 swap()：交换两个list
std::list<int> lst2(5, 20);
lst.swap(lst2);

// 5.17 remove()：删除指定值所有元素
std::list<int> lst_remove{ 1,2,3,2,4,2 };
lst_remove.remove(2); // 结果：1 3 4

// 5.18 remove_if()：按条件删除
std::list<int> lst_remove_if{ 1,2,3,4,5,6 };
lst_remove_if.remove_if([](int n) { return n % 2 == 0; }); // 结果：1 3 5

// 5.19 unique()：删除连续重复元素
std::list<int> lst_unique{ 1,1,2,2,3,3 };
lst_unique.unique(); // 结果：1 2 3

// 5.20 sort()：排序
std::list<int> lst_sort{ 5,3,1,4,2 };
lst_sort.sort(); // 升序：1 2 3 4 5
lst_sort.sort(std::greater<int>()); // 降序：5 4 3 2 1

// 5.21 reverse()：反转链表
std::list<int> lst_rev{ 1,2,3,4,5 };
lst_rev.reverse(); // 结果：5 4 3 2 1

// 5.22 比较运算符（==）
bool isEqual = (lst == lst2);
```

### 6. 迭代器操作（4类）
| 迭代器类型       | 语法示例                                                     | 用途                                         |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 正向迭代器       | `for (auto it = lst.begin(); it != lst.end(); ++it)`         | 从前往后遍历元素（可修改，仅支持++/--）      |
| 反向迭代器       | `for (auto it = lst.rbegin(); it != lst.rend(); ++it)`       | 从后往前遍历元素（可修改，仅支持++/--）      |
| const正向迭代器  | `for (auto it = lst.cbegin(); it != lst.cend(); ++it)`       | 只读遍历，不可修改元素                       |
| const反向迭代器  | `for (auto it = lst.crbegin(); it != lst.crend(); ++it)`     | 只读反向遍历，不可修改元素                   |

**使用场景**：遍历list只能用迭代器/范围for，const迭代器用于保护数据不被修改；list迭代器是双向迭代器，不支持`it + n`/`it - n`，需用`std::next(it, n)`/`std::prev(it, n)`。

```c++
// 准备测试数据
std::list<int> iter_lst{ 10, 20, 30, 40 };

// 6.1 begin()/end()：正向迭代器
std::cout << "正向遍历：";
for (auto it = iter_lst.begin(); it != iter_lst.end(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
}

// 6.2 rbegin()/rend()：反向迭代器
std::cout << "\n反向遍历：";
for (auto it = iter_lst.rbegin(); it != iter_lst.rend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
}

// 6.3 cbegin()/cend()：const正向迭代器（只读）
std::cout << "\nconst正向遍历：";
for (auto it = iter_lst.cbegin(); it != iter_lst.cend(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
    // *it = 99; // 错误：const迭代器不可修改元素
}

// 6.4 crbegin()/crend()：const反向迭代器（只读）
std::cout << "\nconst反向遍历：";
for (auto it = iter_lst.crbegin(); it != iter_lst.crend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
    // *it = 99; // 错误：const迭代器不可修改元素
}
```