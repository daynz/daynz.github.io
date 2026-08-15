---
title: "array"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/cpp/06容器库/array.html
tags: [编程语言]
---

# C++ STL array
## 一、核心
`std::array` 是C++11引入的固定大小数组容器，替代原生数组，兼具原生数组的高效性和STL容器的易用性，大小编译期确定，无动态扩容，内存分配在栈（或静态/全局区），而非堆。

## 二、核心操作分类及使用示例
### 1. 构造函数（6种常用形式）
| 构造方式         | 语法示例                                                     | 使用场景                                     |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 默认构造         | `std::array<int, 5> arr;`                                    | 创建固定大小array，元素值初始化（int默认0）  |
| 列表构造（全量） | `std::array<int, 5> arr{10,10,10,10,10};`                    | C++11+，显式初始化所有元素                   |
| 列表构造（部分） | `std::array<int, 5> arr{1,2,3};`                             | 前N个元素初始化，剩余元素值初始化            |
| 拷贝构造         | `std::array<int, 5> arr(arr2);`                              | 复制另一个同大小array的所有元素              |
| 移动构造         | `std::array<int, 5> arr = std::move(createArr());`（createArr返回临时array） | 接管临时对象资源，array移动成本低（无堆内存）|
| 赋值构造         | `std::array<int, 5> arr = {1,2,3,4,5};`                      | 结合列表初始化的赋值形式                     |

**使用注意**：`std::array` 必须指定大小（模板参数），无“空构造”概念，大小不匹配会编译报错。

```c++
// 1.1 默认构造（大小固定为5，int默认初始化为0）
std::array<int, 5> arr;
std::cout << "默认构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：0 0 0 0 0

// 1.2 全量列表构造
std::array<int, 5> arr{10,10,10,10,10};
std::cout << "\n全量列表构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：10 10 10 10 10

// 1.3 部分列表构造（后2个元素默认0）
std::array<int, 5> arr{1,2,3};
std::cout << "\n部分列表构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 2 3 0 0

// 1.4 拷贝构造
std::array<int, 5> arr2{10,10,10,10,10};
std::array<int, 5> arr(arr2);
std::cout << "\n拷贝构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：10 10 10 10 10

// 1.5 移动构造
auto createArr = []() {
    return std::array<int, 5>{20,20,20,20,20}; // 返回临时array
};
std::array<int, 5> arr = std::move(createArr());
std::cout << "\n移动构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：20 20 20 20 20

// 1.6 赋值构造
std::array<int, 5> arr = {1,2,3,4,5};
std::cout << "\n赋值构造 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 2 3 4 5
```

### 2. 赋值操作（4种核心重载）
| 赋值方式         | 语法示例                                  | 说明                                       |
| ---------------- | ----------------------------------------- | ------------------------------------------ |
| 拷贝赋值         | `std::array<int,5> arr = arr6;`           | 深拷贝同大小array的所有元素                |
| 移动赋值         | `std::array<int,5> arr = std::move(arr7);`| 转移临时array资源，原array值未定义（无堆内存） |
| 列表赋值         | `std::array<int,5> arr = {1,2,3,4,5};`    | C++11+，列表赋值（大小必须匹配）           |
| fill() 填充      | `arr.fill(88);`                           | 批量设置所有元素为指定值（array核心赋值方法） |

**使用技巧**：`fill()` 是array批量赋值的最优方式，比逐个赋值更高效且代码简洁。

```c++
// 2.1 拷贝赋值
std::array<int,5> arr6{1,2,3,4,5};
std::array<int,5> arr = arr6;
std::cout << "拷贝赋值 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 2 3 4 5

// 2.2 移动赋值
std::array<int,5> arr7{1,2,3,4,5};
std::array<int,5> arr = std::move(arr7);
std::cout << "\n移动赋值 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 2 3 4 5

// 2.3 列表赋值
std::array<int,5> arr = {1,2,3,4,5};
std::cout << "\n列表赋值 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 2 3 4 5

// 2.4 fill()填充
std::array<int,5> arr;
arr.fill(0);
std::cout << "\nfill(0) arr：";
for (int num : arr) std::cout << num << " "; // 输出：0 0 0 0 0
arr.fill(88);
std::cout << "\nfill(88) arr：";
for (int num : arr) std::cout << num << " "; // 输出：88 88 88 88 88
```

### 3. 元素访问（5种方式）
| 访问方式 | 语法示例       | 特点                                         |
| -------- | -------------- | -------------------------------------------- |
| [] 运算符 | `arr[2]`      | 无越界检查，速度快，越界行为未定义           |
| at() 方法 | `arr.at(3)`   | 有越界检查，越界抛`out_of_range`异常         |
| front()  | `arr.front()` | 获取第一个元素（等价于arr[0]）              |
| back()   | `arr.back()`  | 获取最后一个元素（等价于arr[arr.size()-1]） |
| data()   | `arr.data()` | 获取底层数组指针，可直接操作内存（兼容C风格） |

**使用建议**：
- 性能优先用`[]`，安全优先用`at()`；
- 访问首尾元素优先用`front()`/`back()`，代码可读性更高。

```c++
std::array<int,5> arr{1,2,3,4,5};

// 3.1 operator[]：无越界检查
int val1 = arr[2];
std::cout << "arr[2] = " << val1 << std::endl; // 输出：3

// 3.2 at()：有越界检查
int val2 = arr.at(3);
std::cout << "arr.at(3) = " << val2 << std::endl; // 输出：4
// arr.at(10); // 越界，抛出std::out_of_range异常

// 3.3 front()：第一个元素
int val3 = arr.front();
std::cout << "arr.front() = " << val3 << std::endl; // 输出：1

// 3.4 back()：最后一个元素
int val4 = arr.back();
std::cout << "arr.back() = " << val4 << std::endl; // 输出：5

// 3.5 data()：底层数组指针
int* ptr = arr.data();
int val5 = ptr[1];
std::cout << "arr.data()[1] = " << val5 << std::endl; // 输出：2
```

### 4. 容量操作（3种，无扩容相关）
| 操作方式      | 语法示例           | 作用                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| size()        | `arr.size()`      | 获取元素个数（编译期固定，等于模板参数N）      |
| max_size()    | `arr.max_size()`  | 获取最大元素个数（等于size()，array大小固定）  |
| empty()       | `arr.empty()`     | 判断是否为空（仅当size=0时返回true）           |

**核心原理**：`std::array` 大小编译期确定，无`reserve()`/`resize()`/`capacity()`，容量操作仅用于判断基础属性。

```c++
std::array<int,5> arr{1,2,3,4,5};
std::array<int,0> arr_empty; // 空array（size=0）

// 4.1 size()：元素个数
size_t size1 = arr.size();
std::cout << "arr.size() = " << size1 << std::endl; // 输出：5

// 4.2 max_size()：最大元素个数（等于size）
size_t max_size1 = arr.max_size();
std::cout << "arr.max_size() = " << max_size1 << std::endl; // 输出：5

// 4.3 empty()：判断是否为空
bool isEmpty = arr.empty();
std::cout << "arr.empty() = " << (isEmpty ? "true" : "false") << std::endl; // 输出：false
bool isEmptyEmpty = arr_empty.empty();
std::cout << "arr_empty.empty() = " << (isEmptyEmpty ? "true" : "false") << std::endl; // 输出：true
```

### 5. 修改操作（4种核心形式）
| 操作方式                | 语法示例                                           | 作用                                        |
| ----------------------- | -------------------------------------------------- | ------------------------------------------- |
| 直接修改元素            | `arr[1] = 99;`/`arr.at(1) = 99;`                   | 通过访问接口修改单个元素                    |
| swap() 成员函数         | `arr_swap1.swap(arr_swap2);`                       | 交换两个同大小array的所有元素（O(N)复杂度） |
| std::swap 非成员函数    | `std::swap(arr_swap1, arr_swap2);`                 | 等价于成员函数swap，更通用                  |
| 比较运算符              | `arr_cmp1 == arr_cmp2`/`arr_cmp1 < arr_cmp3`       | 逐元素比较（==/!=/</<=/>>/>=均支持）        |

**使用技巧**：
- array大小固定，无`push_back`/`insert`/`erase`/`clear`等修改长度的操作；
- 交换操作仅拷贝元素（无堆内存），复杂度O(N)，与vector的O(1) swap不同。

```c++
// 5.1 直接修改元素
std::array<int,5> arr{1,2,3,4,5};
arr[1] = 99;
std::cout << "修改后 arr：";
for (int num : arr) std::cout << num << " "; // 输出：1 99 3 4 5

// 5.2 swap()成员函数
std::array<int,5> arr_swap1{1,1,1,1,1};
std::array<int,5> arr_swap2{2,2,2,2,2};
arr_swap1.swap(arr_swap2);
std::cout << "\nswap后 arr_swap1：";
for (int num : arr_swap1) std::cout << num << " "; // 输出：2 2 2 2 2
std::cout << " | arr_swap2：";
for (int num : arr_swap2) std::cout << num << " "; // 输出：1 1 1 1 1

// 5.3 std::swap非成员函数
std::swap(arr_swap1, arr_swap2);
std::cout << "\nstd::swap后 arr_swap1：";
for (int num : arr_swap1) std::cout << num << " "; // 输出：1 1 1 1 1

// 5.4 比较运算符
std::array<int,5> arr_cmp1{1,2,3,4,5};
std::array<int,5> arr_cmp2{1,2,3,4,5};
std::array<int,5> arr_cmp3{1,2,3,4,6};
std::cout << "\narr_cmp1 == arr_cmp2：" << (arr_cmp1 == arr_cmp2 ? "true" : "false") << std::endl; // true
std::cout << "arr_cmp1 == arr_cmp3：" << (arr_cmp1 == arr_cmp3 ? "true" : "false") << std::endl; // false
std::cout << "arr_cmp1 < arr_cmp3：" << (arr_cmp1 < arr_cmp3 ? "true" : "false") << std::endl;   // true
```

### 6. 迭代器操作（5类）
| 迭代器类型       | 语法示例                                                     | 用途                                         |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 正向迭代器       | `for (auto it = arr.begin(); it != arr.end(); ++it)`         | 从前往后遍历元素（可修改）                   |
| 反向迭代器       | `for (auto it = arr.rbegin(); it != arr.rend(); ++it)`       | 从后往前遍历元素（可修改）                   |
| const正向迭代器  | `for (auto it = arr.cbegin(); it != arr.cend(); ++it)`       | 只读遍历，不可修改元素                       |
| const反向迭代器  | `for (auto it = arr.crbegin(); it != arr.crend(); ++it)`     | 只读反向遍历，不可修改元素                   |
| 迭代器修改元素   | `*it_mod = 200;`（非const迭代器）                            | 通过迭代器修改指定位置元素                   |

**使用场景**：遍历array优先用迭代器或范围for，const迭代器用于保护数据不被意外修改。

```c++
std::array<int,4> arr{10,20,30,40};

// 6.1 begin()/end()：正向迭代器
std::cout << "正向遍历 arr：";
for (auto it = arr.begin(); it != arr.end(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
}

// 6.2 rbegin()/rend()：反向迭代器
std::cout << "\n反向遍历 arr：";
for (auto it = arr.rbegin(); it != arr.rend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
}

// 6.3 cbegin()/cend()：const正向迭代器
std::cout << "\nconst正向遍历 arr：";
for (auto it = arr.cbegin(); it != arr.cend(); ++it) {
    std::cout << *it << " "; // 输出：10 20 30 40
    // *it = 99; // 错误：const迭代器不可修改
}

// 6.4 crbegin()/crend()：const反向迭代器
std::cout << "\nconst反向遍历 arr：";
for (auto it = arr.crbegin(); it != arr.crend(); ++it) {
    std::cout << *it << " "; // 输出：40 30 20 10
    // *it = 99; // 错误：const迭代器不可修改
}

// 6.5 迭代器修改元素
auto it_mod = arr.begin() + 1;
*it_mod = 200;
std::cout << "\n迭代器修改后 arr：";
for (int num : arr) std::cout << num << " "; // 输出：10 200 30 40
```