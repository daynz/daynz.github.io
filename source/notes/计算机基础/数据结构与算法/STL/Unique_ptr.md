# `unique_ptr`

定义于头文件 `<memory>` (C++11起)

```c++
template<
    class T,
    class Deleter = std::default_delete<T>
> class unique_ptr;

template<
    class T,
    class Deleter
> class unique_ptr<T[], Deleter>;
```

`std::unique_ptr` 是一个智能指针，独占拥有动态分配的对象，确保资源在作用域结束时自动释放，支持自定义删除器。`T[]` 特化用于管理动态数组。

*未定义行为：解引用空或无效的 `unique_ptr`、多次删除同一对象或在对象释放后访问会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::unique_ptr` 支持多种构造方式，初始化指针或配置删除器。

```c++
// 1. 默认构造（空unique_ptr）
std::unique_ptr<int> up1;

// 2. 从原始指针构造
int* raw = new int(42);
std::unique_ptr<int> up2(raw);

// 3. 从原始指针和自定义删除器构造
auto deleter = [](int* p) { delete p; };
std::unique_ptr<int, decltype(deleter)> up3(new int(42), deleter);

// 4. 拷贝构造（禁用）
std::unique_ptr<int> up4(up2); // 错误：拷贝构造被禁用

// 5. 移动构造 (C++11起)
std::unique_ptr<int> up5 = std::move(up2); // up2变为空

// 6. 数组特化默认构造
std::unique_ptr<int[]> up6;

// 7. 数组特化从原始数组指针构造
int* arr = new int[5];
std::unique_ptr<int[]> up7(arr);

// 8. 数组特化从原始数组和自定义删除器构造
auto array_deleter = [](int* p) { delete[] p; };
std::unique_ptr<int[], decltype(array_deleter)> up8(new int[5], array_deleter);

// 9. 从nullptr构造
std::unique_ptr<int> up9(nullptr);

// 10. 从nullptr和自定义删除器构造
std::unique_ptr<int, decltype(deleter)> up10(nullptr, deleter);
```

#### 析构函数

销毁 `unique_ptr` 管理的对象（通过删除器），若指针非空则调用删除器释放资源。

#### operator=

以来自另一 `unique_ptr` 的资源重写 `unique_ptr` 的内容。

```c++
// 1. 移动赋值 (C++11起)
std::unique_ptr<int> up1(new int(10));
std::unique_ptr<int> up2;
up2 = std::move(up1); // up1变为空，up2接管资源

// 2. 从nullptr赋值
up2 = nullptr; // 释放当前资源，up2变为空

// 3. 拷贝赋值（禁用）
up2 = up1; // 错误：拷贝赋值被禁用

// 4. 数组特化移动赋值
std::unique_ptr<int[]> up3(new int[5]);
std::unique_ptr<int[]> up4;
up4 = std::move(up3); // up3变为空，up4接管资源
```

### 元素访问

#### `operator*`

解引用获取管理的对象（仅非数组特化）。

```c++
std::unique_ptr<int> up(new int(42));
std::cout << "*up: " << *up << "\n"; // 输出 42
*up = 100; // 修改对象
std::cout << "After *up=100: " << *up << "\n"; // 输出 100
```

#### `operator->`

访问管理的对象的成员（仅非数组特化）。

```c++
struct S { int x; };
std::unique_ptr<S> up(new S{42});
std::cout << "up->x: " << up->x << "\n"; // 输出 42
up->x = 100;
std::cout << "After up->x=100: " << up->x << "\n"; // 输出 100
```

#### `operator[]` (数组特化)

访问数组中指定位置的元素（仅数组特化）。

```c++
std::unique_ptr<int[]> up(new int[3]{1, 2, 3});
std::cout << "up[1]: " << up[1] << "\n"; // 输出 2
up[1] = 200;
std::cout << "After up[1]=200: " << up[1] << "\n"; // 输出 200
```

*未定义行为：对空 `unique_ptr` 调用 `operator\*`, `operator->`, 或 `operator[]` 是未定义行为。*

#### `get`

返回管理的原始指针。

```c++
std::unique_ptr<int> up(new int(42));
int* raw = up.get(); // 获取原始指针
std::cout << "*raw: " << *raw << "\n"; // 输出 42
```

#### `get_deleter`

返回删除器。

```c++
auto deleter = [](int* p) { delete p; };
std::unique_ptr<int, decltype(deleter)> up(new int(42), deleter);
auto& del = up.get_deleter(); // 获取删除器
```

### 修改器

| 函数              | 描述                         |
| ----------------- | ---------------------------- |
| `release` (C++11) | 释放所有权并返回原始指针     |
| `reset` (C++11)   | 替换管理的对象               |
| `swap` (C++11)    | 交换两个 `unique_ptr` 的内容 |

```c++
// release 示例
std::unique_ptr<int> up1(new int(42));
int* raw = up1.release(); // up1变为空，raw接管资源
delete raw; // 需手动释放

// reset 示例
std::unique_ptr<int> up2(new int(10));
up2.reset(new int(20)); // 原对象被删除，up2管理新对象

// swap 示例
std::unique_ptr<int> up3(new int(30));
std::unique_ptr<int> up4(new int(40));
up3.swap(up4); // up3管理40，up4管理30
```

### 观察器

| 函数                    | 描述                     |
| ----------------------- | ------------------------ |
| `operator bool` (C++11) | 检查是否管理对象（非空） |

```c++
std::unique_ptr<int> up1;
std::unique_ptr<int> up2(new int(42));
if (up1) std::cout << "up1 is not null\n"; // 不执行
if (up2) std::cout << "up2 is not null\n"; // 输出
```

### 非成员函数

| 函数                                     | 描述                            |
| ---------------------------------------- | ------------------------------- |
| `operator==`                             | 比较 `unique_ptr`（比较指针值） |
| `operator!= < <= > >=`                   | (C++20 中移除)                  |
| `operator<=>`                            | C++20                           |
| `std::swap`(std::unique_ptr) (C++11)     | 特化 std::swap 算法             |
| `std::make_unique` (C++14)               | 创建 `unique_ptr`               |
| `std::make_unique_for_overwrite` (C++20) | 创建未初始化的 `unique_ptr`     |

```c++
// make_unique 示例
auto up = std::make_unique<int>(42); // 推荐方式创建unique_ptr
std::cout << "*up: " << *up << "\n"; // 输出 42

// make_unique_for_overwrite 示例
auto up_arr = std::make_unique_for_overwrite<int[]>(5); // 未初始化数组
```