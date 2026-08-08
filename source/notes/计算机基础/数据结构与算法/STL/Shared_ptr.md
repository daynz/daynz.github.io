# `STL-shared_ptr`

定义于头文件 `<memory>` (C++11起)

```c++
template<class T> class shared_ptr;
```

`std::shared_ptr` 是一个智能指针，支持共享所有权，管理动态分配的对象，通过引用计数跟踪所有共享指针，资源在最后一个 `shared_ptr` 销毁时释放，支持自定义删除器。

*未定义行为：解引用空或无效的 `shared_ptr`、多次删除同一对象或在对象释放后访问会导致未定义行为。*

## 成员函数

### 隐式定义的成员函数

#### 构造函数

`std::shared_ptr` 支持多种构造方式，初始化指针或配置删除器。

```c++
// 1. 默认构造（空shared_ptr）
std::shared_ptr<int> sp1;

// 2. 从原始指针构造
int* raw = new int(42);
std::shared_ptr<int> sp2(raw);

// 3. 从原始指针和自定义删除器构造
auto deleter = [](int* p) { delete p; };
std::shared_ptr<int> sp3(new int(42), deleter);

// 4. 从原始指针、自定义删除器和分配器构造
std::shared_ptr<int> sp4(new int(42), deleter, std::allocator<int>{});

// 5. 拷贝构造
std::shared_ptr<int> sp5(sp2); // 共享所有权，引用计数增加

// 6. 移动构造 (C++11起)
std::shared_ptr<int> sp6 = std::move(sp5); // sp5变为空，引用计数不变

// 7. 从nullptr构造
std::shared_ptr<int> sp7(nullptr);

// 8. 从nullptr和自定义删除器构造
std::shared_ptr<int> sp8(nullptr, deleter);

// 9. 从unique_ptr构造 (C++11起)
std::unique_ptr<int> up(new int(42));
std::shared_ptr<int> sp9(std::move(up)); // up变为空

// 10. 从unique_ptr和自定义删除器构造
std::shared_ptr<int> sp10(std::move(up), deleter);

// 11. 从std::weak_ptr构造 (C++11起)
std::shared_ptr<int> sp11(new int(42));
std::weak_ptr<int> wp = sp11;
std::shared_ptr<int> sp12(wp); // 若wp已过期，抛出std::bad_weak_ptr

// 12. 数组特化构造（C++17起不推荐）
std::shared_ptr<int[]> sp13(new int[5]);

// 13. 从另一shared_ptr构造别名 (C++11起)
std::shared_ptr<int> sp14(new int(42));
void* alias_ptr = sp14.get();
std::shared_ptr<void> sp15(sp14, alias_ptr); // 别名构造，共享sp14的控制块
```

#### 析构函数

减少引用计数，若计数为零则销毁管理的对象（通过删除器）。

#### operator=

以来自另一 `shared_ptr` 或其他来源的资源重写 `shared_ptr` 的内容。

```c++
// 1. 拷贝赋值
std::shared_ptr<int> sp1(new int(10));
std::shared_ptr<int> sp2;
sp2 = sp1; // 共享所有权，引用计数增加

// 2. 移动赋值 (C++11起)
std::shared_ptr<int> sp3;
sp3 = std::move(sp1); // sp1变为空，引用计数不变

// 3. 从unique_ptr赋值 (C++11起)
std::unique_ptr<int> up(new int(20));
sp3 = std::move(up); // up变为空

// 4. 从nullptr赋值
sp3 = nullptr; // 释放当前资源，sp3变为空
```

### 元素访问

#### `operator*`

解引用获取管理的对象（仅非数组特化）。

```c++
std::shared_ptr<int> sp(new int(42));
std::cout << "*sp: " << *sp << "\n"; // 输出 42
*sp = 100; // 修改对象
std::cout << "After *sp=100: " << *sp << "\n"; // 输出 100
```

#### `operator->`

访问管理的对象的成员（仅非数组特化）。

```c++
struct S { int x; };
std::shared_ptr<S> sp(new S{42});
std::cout << "sp->x: " << sp->x << "\n"; // 输出 42
sp->x = 100;
std::cout << "After sp->x=100: " << sp->x << "\n"; // 输出 100
```

#### `operator[]` (数组特化，C++17起不推荐)

访问数组中指定位置的元素（仅数组特化）。

```c++
std::shared_ptr<int[]> sp(new int[3]{1, 2, 3});
std::cout << "sp[1]: " << sp[1] << "\n"; // 输出 2
sp[1] = 200;
std::cout << "After sp[1]=200: " << sp[1] << "\n"; // 输出 200
```

*未定义行为：对空 `shared_ptr` 调用 `operator\*`, `operator->`, 或 `operator[]` 是未定义行为。*

#### `get`

返回管理的原始指针。

```c++
std::shared_ptr<int> sp(new int(42));
int* raw = sp.get(); // 获取原始指针
std::cout << "*raw: " << *raw << "\n"; // 输出 42
```

### 修改器

| 函数            | 描述                         |
| --------------- | ---------------------------- |
| `reset` (C++11) | 替换管理的对象               |
| `swap` (C++11)  | 交换两个 `shared_ptr` 的内容 |

```c++
// reset 示例
std::shared_ptr<int> sp1(new int(10));
sp1.reset(new int(20)); // 原对象被删除，sp1管理新对象
sp1.reset(); // 释放资源，sp1变为空

// swap 示例
std::shared_ptr<int> sp2(new int(30));
std::shared_ptr<int> sp3(new int(40));
sp2.swap(sp3); // sp2管理40，sp3管理30
```

### 观察器

| 函数                    | 描述                     |
| ----------------------- | ------------------------ |
| `use_count` (C++11)     | 返回引用计数             |
| `operator bool` (C++11) | 检查是否管理对象（非空） |
| `owner_before` (C++11)  | 比较控制块的所有权       |
| `get_deleter` (C++11)   | 返回删除器               |

```c++
// use_count 示例
std::shared_ptr<int> sp1(new int(42));
std::shared_ptr<int> sp2 = sp1;
std::cout << "sp1.use_count(): " << sp1.use_count() << "\n"; // 输出 2

// operator bool 示例
std::shared_ptr<int> sp3;
if (!sp3) std::cout << "sp3 is null\n"; // 输出
if (sp1) std::cout << "sp1 is not null\n"; // 输出
```

### 非成员函数

| 函数                                    | 描述                            |
| --------------------------------------- | ------------------------------- |
| `operator==`                            | 比较 `shared_ptr`（比较指针值） |
| `operator!= < <= > >=`                  | (C++20 中移除)                  |
| `operator<=>`                           | C++20                           |
| `std::swap`(std::shared_ptr) (C++11)    | 特化 std::swap 算法             |
| `std::make_shared` (C++11)              | 创建 `shared_ptr`               |
| `std::allocate_shared` (C++11)          | 使用指定分配器创建 `shared_ptr` |
| `std::static_pointer_cast` (C++11)      | 静态类型转换                    |
| `std::dynamic_pointer_cast` (C++11)     | 动态类型转换                    |
| `std::const_pointer_cast` (C++11)       | const 类型转换                  |
| `std::reinterpret_pointer_cast` (C++17) | reinterpret 类型转换            |
| `std::get_deleter` (C++11)              | 获取删除器                      |

```c++
// make_shared 示例
auto sp = std::make_shared<int>(42); // 推荐方式创建shared_ptr
std::cout << "*sp: " << *sp << "\n"; // 输出 42

// static_pointer_cast 示例
struct Base { virtual ~Base() = default; };
struct Derived : Base {};
std::shared_ptr<Base> base_sp = std::make_shared<Derived>();
auto derived_sp = std::static_pointer_cast<Derived>(base_sp);
```