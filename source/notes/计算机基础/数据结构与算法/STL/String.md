# `STL-string`

定义于头文件 `<string>` (C++98起)

```c++
template<
    class CharT,
    class Traits = std::char_traits<CharT>,
    class Allocator = std::allocator<CharT>
> class basic_string;
using string = basic_string<char>;
```

`std::string` 是一个动态大小的字符序列容器，基于 `std::basic_string` 特化为 `char` 类型，支持字符串操作。

*未定义行为：访问超出字符串范围的元素或使用无效迭代器会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::string` 支持多种构造方式，初始化字符串或配置分配器。

```c++
// 1. 默认构造（空字符串）
std::string s1;

// 2. 指定分配器
std::string s2(std::allocator<char>{});

// 3. 从C字符串构造
std::string s3("hello");

// 4. 从C字符串指定长度构造
std::string s4("hello world", 5); // s4 = "hello"

// 5. 填充构造（指定数量的字符）
std::string s5(5, 'a'); // s5 = "aaaaa"

// 6. 拷贝构造
std::string s6(s3); // s6 = "hello"

// 7. 移动构造 (C++11起)
std::string s7 = std::move(s6); // s6变为空

// 8. 范围构造
std::string s8(s3.begin(), s3.end()); // s8 = "hello"

// 9. 初始化列表构造 (C++11起)
std::string s9 = {'h', 'e', 'l', 'l', 'o'};

// 10. 从子字符串构造
std::string s10("hello world", 6, 5); // s10 = "world"

// 11. 范围构造并指定分配器
std::string s11(s3.begin(), s3.end(), std::allocator<char>{});

// 12. 从C字符串并指定分配器
std::string s12("hello", std::allocator<char>{});
```

#### 析构函数

销毁 string 的所有字符并释放内存。

#### operator=

以来自另一 string 或其他来源的内容重写 string 的内容。

```c++
// 1. 拷贝赋值
std::string s1 = "hello";
std::string s2;
s2 = s1; // s2 = "hello"

// 2. 移动赋值 (C++11起)
std::string s3;
s3 = std::move(s1); // s1变为空

// 3. 从C字符串赋值
s3 = "world"; // s3 = "world"

// 4. 从字符赋值
s3 = 'a'; // s3 = "a"

// 5. 初始化列表赋值 (C++11起)
s3 = {'h', 'i'}; // s3 = "hi"
```

### 元素访问

#### `at`

访问指定位置的字符，进行越界检查。

```c++
std::string s = "hello";
const std::string cs = "world";

try {
    std::cout << "s.at(1): " << s.at(1) << "\n"; // 输出 'e'
    std::cout << "cs.at(2): " << cs.at(2) << "\n"; // 输出 'r'
    s.at(10) = 'x'; // 越界访问
}
catch (const std::out_of_range& e) {
    std::cout << "Exception: " << e.what() << "\n";
}
```

若 `!(pos < size())` 则抛出 `std::out_of_range`。

#### `operator[]`

访问指定位置的字符，无越界检查。

```c++
std::string s = "hello";
const std::string cs = "world";

std::cout << "s[0]: " << s[0] << "\n"; // 输出 'h'
s[1] = 'a';
std::cout << "After s[1]='a': " << s[1] << "\n"; // 输出 'a'
```

*未定义行为：通过此运算符访问超出范围的元素（除 `size()` 外）是未定义行为；`s[size()]` 返回引用到空字符。*

#### `front` (C++11)

访问第一个字符。

```c++
std::string s = "hello";
std::cout << "s.front(): " << s.front() << "\n"; // 输出 'h'
s.front() = 'j';
std::cout << "After s.front()='j': " << s.front() << "\n"; // 输出 'j'
```

#### `back` (C++11)

访问最后一个字符。

```c++
std::string s = "hello";
std::cout << "s.back(): " << s.back() << "\n"; // 输出 'o'
s.back() = 'w';
std::cout << "After s.back()='w': " << s.back() << "\n"; // 输出 'w'
```

*未定义行为：对空字符串调用 `front` 或 `back` 是未定义行为。*

#### `data` (C++11)

返回指向底层字符数组的指针。

```c++
std::string s = "hello";
const char* ptr = s.data(); // 指向"hello\0"
```

#### `c_str` (C++98)

返回以空字符终止的C字符串指针。

```c++
std::string s = "hello";
const char* cstr = s.c_str(); // 指向"hello\0"
```

*注意：`data` 和 `c_str` 返回的指针在字符串修改后可能失效。*

### 迭代器

| 迭代器                     | 描述                               |
| -------------------------- | ---------------------------------- |
| `begin` `cbegin` (C++11)   | 返回指向首字符的迭代器             |
| `end` `cend` (C++11)       | 返回指向末尾的迭代器               |
| `rbegin` `crbegin` (C++11) | 返回指向最后一个字符的逆向迭代器   |
| `rend` `crend` (C++11)     | 返回指向首字符之前位置的逆向迭代器 |

### 容量

| 函数                    | 描述                           |
| ----------------------- | ------------------------------ |
| `empty` (C++98)         | 检查字符串是否为空             |
| `size` (C++98)          | 返回字符数量                   |
| `length` (C++98)        | 返回字符数量（与 `size` 等价） |
| `max_size` (C++98)      | 返回可容纳的最大字符数量       |
| `reserve` (C++98)       | 预分配存储空间                 |
| `capacity` (C++98)      | 返回当前分配的存储空间大小     |
| `shrink_to_fit` (C++11) | 请求释放未使用的内存           |

### 修改器

| 函数                | 描述                       |
| ------------------- | -------------------------- |
| `clear` (C++98)     | 移除所有字符               |
| `insert` (C++98)    | 在指定位置插入字符或字符串 |
| `erase` (C++98)     | 移除指定位置的字符或范围   |
| `push_back` (C++98) | 在末尾添加字符             |
| `pop_back` (C++11)  | 移除末尾字符               |
| `append` (C++98)    | 在末尾追加字符或字符串     |
| `assign` (C++98)    | 替换字符串内容             |
| `replace` (C++98)   | 替换指定部分的字符         |
| `swap` (C++98)      | 交换内容                   |

```c++
// append 示例
std::string s = "hello";
s.append(" world"); // s = "hello world"

// replace 示例
s.replace(6, 5, "there"); // s = "hello there"
```

### 字符串操作

| 函数                        | 描述                               |
| --------------------------- | ---------------------------------- |
| `substr` (C++98)            | 返回子字符串                       |
| `copy` (C++98)              | 复制字符到C字符串                  |
| `resize` (C++98)            | 更改字符串大小                     |
| `find` (C++98)              | 查找子字符串或字符                 |
| `rfind` (C++98)             | 反向查找子字符串或字符             |
| `find_first_of` (C++98)     | 查找第一个匹配指定字符集的字符     |
| `find_first_not_of` (C++98) | 查找第一个不匹配指定字符集的字符   |
| `find_last_of` (C++98)      | 查找最后一个匹配指定字符集的字符   |
| `find_last_not_of` (C++98)  | 查找最后一个不匹配指定字符集的字符 |
| `starts_with` (C++20)       | 检查字符串是否以指定前缀开头       |
| `ends_with` (C++20)         | 检查字符串是否以指定后缀结尾       |
| `contains` (C++23)          | 检查是否包含指定子字符串或字符     |
| `compare` (C++98)           | 比较字符串                         |

```c++
// find 示例
std::string s = "hello world";
auto pos = s.find("world"); // pos = 6

// starts_with 示例
bool starts = s.starts_with("hell"); // true
```

### 非成员函数

| 函数                                   | 描述                     |
| -------------------------------------- | ------------------------ |
| `operator+`                            | 连接字符串               |
| `operator==`                           | 比较字符串               |
| `operator!= < <= > >=`                 | (C++20 中移除)           |
| `operator<=>`                          | C++20                    |
| `std::swap`(std::string) (C++98)       | 特化 std::swap 算法      |
| `std::getline` (C++98)                 | 从输入流读取一行到字符串 |
| `std::to_string` (C++11)               | 将数值转换为字符串       |
| `std::stoi`, `std::stol`, etc. (C++11) | 将字符串转换为整数       |
| `std::stof`, `std::stod`, etc. (C++11) | 将字符串转换为浮点数     |

```c++
// operator+ 示例
std::string s1 = "hello";
std::string s2 = " world";
std::string s3 = s1 + s2; // s3 = "hello world"

// getline 示例
std::string line;
std::getline(std::cin, line); // 从输入读取一行
```

### 其他

| 函数                    | 描述       |
| ----------------------- | ---------- |
| `get_allocator` (C++98) | 返回分配器 |