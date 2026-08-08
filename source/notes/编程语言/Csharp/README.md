# 一、C# 基础

## 1.1 开发环境与基础语法

- C# 与 Unity 关系、.NET 基础
- 变量、常量
- `const` / `readonly` / `static readonly` 区别
- 数据类型：`值类型` / `引用类型`
- 装箱与拆箱
- 常用类型：`int` / `float` / `bool` / `string` / `Vector3`
- 类型转换：隐式、显式、`Parse()` / `TryParse()`
- 算术、比较、逻辑、赋值运算符
- 可空类型 `?` / `Nullable<T>`

## 1.2 程序流程控制

- 条件语句：`if-else`、`switch`
- 循环语句：`for`、`while`、`foreach`
- 跳转语句：`break`、`continue`、`return`、`goto`

## 1.3 函数（方法）

- 函数定义、调用、返回值
- 形参、实参、`ref` / `out` / `in`
- `params` 可变参数
- 可选参数、命名参数
- 函数重载
- 作用域、变量生命周期

## 1.4 复合数据类型

- 一维数组、二维数组
- 字符串操作、字符串不可变性、`StringBuilder`
- 枚举 `enum`
- 结构体 `struct`
- 浅拷贝 / 深拷贝与实现方式

## 1.5 集合

- 非泛型：`ArrayList`、`Hashtable`
- `List<T>`
- `Dictionary<TKey, TValue>`
- `HashSet<T>`、`Queue<T>`、`Stack<T>`
- `SortedList`、`SortedDictionary`
- `foreach` 与迭代器
- 线程安全集合 `ConcurrentCollection`

## 1.6 委托与事件

- 委托 `Delegate`
- 匿名委托、`Lambda` 表达式
- 事件 `Event`
- 泛型委托：`Action`、`Func`、`Predicate`

## 1.7 泛型

- 泛型类、泛型方法
- 泛型约束
- 泛型应用

## 1.8 异常处理

- `try-catch-finally`
- `throw` 异常抛出
- 异常过滤器 `when`

## 1.9 特性与反射

- 常用特性 `Attribute`
- 反射基础
- 扩展方法

## 1.10 LINQ

- LINQ 查询语法 & 方法语法
- 常用：`Where()` / `Select()` / `Any()` / `First()` / `OrderBy()` / `ToList()` / `ToDictionary()`

# 二、C# 面向对象

## 2.1 类与对象

- 类定义、对象实例化 `new`
- 字段、方法、属性 `get/set`
- 构造函数、静态构造函数、析构函数
- `this` / `base` 关键字

## 2.2 三大特性

- 封装：访问修饰符 `public`/`private`/`protected`/`internal`
- 继承：基类、派生类
- 多态：`virtual`、`override`、`abstract`
- `new` 关键字（成员隐藏）

## 2.3 SOLID 设计原则

- 单一职责原则
- 开放封闭原则
- 里氏替换原则
- 接口隔离原则
- 依赖倒置原则

## 2.4 高级面向对象

- 接口 `interface`
- 抽象类 vs 接口
- 密封类 `sealed`、静态类 `static`
- 匿名类、分部类 `partial`

# 三、C# 内存管理

## 3.1 内存机制

- 栈内存、堆内存
- 值类型、引用类型底层原理

## 3.2 垃圾回收 GC

- GC 工作原理
- GC 优化

## 3.3 资源管理

- `IDisposable` 接口
- `using` 语句
- 对象池

# 四、C# 多线程与异步

## 4.1 线程与异步

- 多线程基础
- `lock` 线程锁
- `volatile`
- 线程池 `ThreadPool`
- `async` / `await` 异步编程
- 异步流 `IAsyncEnumerable`

# 五、C# 版本特性

## 5.1 C# 2.0

泛型、匿名方法、可空类型、迭代器、分部类

## 5.2 C# 3.0

`var`、自动属性、初始化器、匿名类型、`Lambda`、LINQ

## 5.3 C# 4.0

可选/命名参数、`dynamic`、泛型协变逆变

## 5.4 C# 5.0

`async`/`await`、调用者信息

## 5.5 C# 6.0

字符串插值、空条件、空合并、`nameof`、异常过滤器

## 5.6 C# 7.0

元组、解构、模式匹配、局部函数、`ref return`

## 5.7 C# 8.0

可空引用类型、`switch` 表达式、`using` 声明、异步流

## 5.8 C# 9.0

`record`、顶级语句、`init`、目标类型 `new()`

# 六、Unity 专用 C#

  - `MonoBehaviour` 生命周期
  - 协程 `Coroutine` & `yield`
  - Unity 主线程
  - `ScriptableObject`
  - Unity 常见 API 与 C# 结合使用