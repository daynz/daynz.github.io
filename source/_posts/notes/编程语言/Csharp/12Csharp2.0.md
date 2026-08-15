---
title: "12Csharp2.0"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/12Csharp2.0.html
tags: [编程语言]
---

# C# 2.0

[toc]

## 匿名方法

### 基础语法

#### 核心定义
- **匿名方法**：无名称的方法块，通过 `delegate` 关键字直接创建，用于快速实例化委托，替代仅需单次使用的短逻辑命名方法
- 核心作用：简化委托实例化代码，避免为短逻辑单独定义命名方法

#### 核心特性
| 特性 | 说明 |
|------|------|
| 无名称 | 无需定义方法名，直接绑定到委托 |
| 关键字 | 使用 `delegate` 关键字声明 |
| 变量捕获 | 可捕获并访问外部作用域的变量 |
| 适用场景 | 适合逻辑简短、仅需单次使用的委托绑定 |

#### 语法结构
1. 定义委托类型（或使用内置委托 `Action`/`Func`）
2. 用 `delegate` 关键字创建匿名方法并绑定到委托实例
3. 通过委托实例调用匿名方法

#### 示例代码
```csharp
// 1. 使用内置 Action 委托（无返回值）
Action greet = delegate
{
    Console.WriteLine("Hello, World!");
};
greet(); // 输出：Hello, World!

// 2. 使用内置 Func 委托（有返回值）
Func<int, int, int> add = delegate(int a, int b)
{
    return a + b;
};
int result = add(10, 20); // 30

// 3. 捕获外部变量
int external = 5;
Action printExternal = delegate
{
    Console.WriteLine(external); // 可访问外部变量
};
external = 10;
printExternal(); // 输出：10（捕获变量的最新值）
```

#### 注意事项
- **变量生命周期**：被捕获的外部变量生命周期会延长至委托实例被回收
- **跳转限制**：匿名方法内不能使用 `goto`、`break`、`continue` 跳转到外部作用域
- **替代方案**：C# 3.0 及以后，推荐使用 Lambda 表达式替代匿名方法（更简洁）
- **参数匹配**：匿名方法的参数列表需与委托类型的签名一致（参数类型、数量、返回值）

### 外部变量捕获

#### 核心定义
- **外部变量捕获**：匿名方法、Lambda 表达式或局部函数能够访问并绑定其外部作用域（如方法、循环块）中变量的机制
- 核心作用：扩展代码块的上下文访问能力，无需通过参数传递即可使用外部变量

#### 核心特性
| 特性 | 说明 |
|------|------|
| 变量绑定 | 捕获的是变量本身，而非变量的当前值 |
| 生命周期延长 | 被捕获变量的生命周期会延长至委托/表达式实例被回收 |
| 作用域限制 | 可捕获同一方法内的局部变量、参数（不含 ref/out）、类成员 |
| 共享状态 | 多个委托/表达式捕获同一变量时，共享该变量的状态 |

#### 示例代码
```csharp
// 1. 捕获局部变量（捕获变量本身，非值）
int count = 0;
Action increment = delegate
{
    count++; // 捕获外部 count 变量
};
increment();
increment();
Console.WriteLine(count); // 输出：2（变量被修改）

// 2. 循环中捕获变量（经典陷阱）
List<Action> actions = new List<Action>();
for (int i = 0; i < 3; i++)
{
    int temp = i; // 需创建临时变量避免共享
    actions.Add(delegate { Console.WriteLine(temp); });
}
foreach (var action in actions)
{
    action(); // 输出：0 1 2（若用 i 则输出 3 3 3）
}

// 3. 捕获类成员
public class MyClass
{
    private int _value = 10;
    public Action GetAction()
    {
        return delegate { Console.WriteLine(_value); }; // 捕获类成员 _value
    }
}
MyClass obj = new MyClass();
Action printValue = obj.GetAction();
printValue(); // 输出：10
```

#### 注意事项
- **捕获的是变量，不是值**：修改捕获变量会影响外部，外部修改也会影响内部
- **循环变量陷阱**：直接捕获循环变量（如 for 循环的 i）会导致所有委托共享同一变量，需用临时变量复制
- **ref/out 参数不可捕获**：匿名方法/Lambda 不能捕获 ref 或 out 修饰的参数
- **生命周期延长**：即使外部方法执行完毕，被捕获的局部变量也不会被回收，直到委托实例被垃圾回收
- **类成员捕获**：捕获类成员时，实际捕获的是类实例的引用（this），需注意实例生命周期

### 参数列表省略语法

#### 核心定义
- **参数列表省略语法**：在匿名方法、Lambda表达式中，当参数类型可由编译器推断或无需使用参数时，可省略参数类型、甚至整个参数列表的简化写法
- 核心作用：减少冗余代码，提升可读性

#### 核心特性
| 特性 | 说明 |
|------|------|
| 适用场景 | 仅适用于匿名方法、Lambda表达式 |
| 推断依赖 | 需编译器能从委托签名推断参数类型 |
| 省略范围 | 可省略参数类型、单个参数的括号、匿名方法的整个参数列表 |
| 限制条件 | 含ref/out、参数类型不可推断时不可省略 |

#### 语法分类
1. **匿名方法的参数省略**
   - 条件：匿名方法内部不使用委托的任何参数
   - 写法：省略delegate后的整个参数列表（含括号）

2. **Lambda表达式的参数省略**
   - 单个参数且类型可推断：省略参数类型和括号
   - 多个参数且类型可推断：省略参数类型，保留括号
   - 无参数：保留空括号，不可省略

#### 示例代码
```csharp
// 1. 匿名方法参数省略
// 原写法（有参数但不用）
Action<int> print1 = delegate(int x) { Console.WriteLine("Hello"); };
// 省略写法（不用参数，直接省略参数列表）
Action<int> print2 = delegate { Console.WriteLine("Hello"); };

// 2. Lambda表达式参数省略
// 单个参数，类型可推断
// 原写法
Func<int, int> square1 = (int x) => x * x;
// 省略写法（省类型和括号）
Func<int, int> square2 = x => x * x;

// 多个参数，类型可推断
// 原写法
Func<int, int, int> add1 = (int a, int b) => a + b;
// 省略写法（省类型，留括号）
Func<int, int, int> add2 = (a, b) => a + b;

// 无参数，不可省略括号
Action greet = () => Console.WriteLine("Hi");
```

#### 注意事项
- 匿名方法仅当**不使用任何参数**时可省略整个参数列表，若使用参数则必须完整声明参数类型
- Lambda单个参数省略括号的前提是**类型可推断且无ref/out**，否则需保留括号或类型
- Lambda多个参数时，**要么都省略类型，要么都不省略**，不能部分省略
- 含ref/out修饰的参数，**必须完整声明类型和修饰符**，不可省略
- 参数类型无法由委托签名推断时，**必须显式声明参数类型**

## 迭代器
### 核心定义
- **yield**：C# 中专门用于创建**迭代器**的关键字，用于简化可枚举集合的遍历实现，无需手动编写完整的枚举器类
- **迭代器**：能够按需逐个返回元素的方法，支持 `foreach` 遍历，核心特征为**延迟执行**
- 核心作用：简化迭代器实现、按需生成元素、降低内存占用、实现自定义遍历逻辑

### 核心特性
| 特性 | 说明 |
|------|------|
| 延迟执行 | 调用迭代器方法不执行逻辑，遍历触发时才生成元素 |
| 暂停恢复 | `yield return` 返回元素后暂停方法，下次遍历从暂停处继续执行 |
| 语法简化 | 编译器自动生成枚举器代码，无需手动实现 `IEnumerator` 接口 |
| 迭代终止 | `yield break` 可直接终止迭代，不再返回后续元素 |
| 类型安全 | 配合 `IEnumerable<T>` 使用，无装箱拆箱，编译时类型检查 |

### 语法规范
- 迭代器方法的返回值类型必须为 `IEnumerable`、`IEnumerable<T>`、`IEnumerator`、`IEnumerator<T>`
- 使用 `yield return` 语句返回单个迭代元素
- 使用 `yield break` 语句终止迭代流程
- 不支持 `ref`/`out` 参数、匿名方法、异步 `async` 方法及不安全代码
- 迭代器方法中不可同时使用普通 `return` 和 `yield return`

### 基础语法实现
#### 非泛型迭代器
```csharp
public IEnumerable GetNumbers()
{
    yield return 1;
    yield return 2;
    yield return 3;
}
```

#### 泛型迭代器
```csharp
public IEnumerable<int> GetIntegerList()
{
    yield return 10;
    yield return 20;
    yield return 30;
}
```

#### 带终止指令的迭代器
```csharp
public IEnumerable<string> GetUserNames()
{
    yield return "小明";
    yield return "小红";
    
    // 终止迭代，后续代码不执行
    yield break;
    
    yield return "小刚";
}
```

### 实用场景示例
#### 自定义范围序列迭代器
```csharp
public IEnumerable<int> CreateRange(int start, int end)
{
    for (int i = start; i <= end; i++)
    {
        yield return i;
    }
}

// 调用遍历
foreach (var number in CreateRange(1, 5))
{
    Console.WriteLine(number);
}
```

#### 泛型集合自定义迭代器
```csharp
public class CustomStack<T>
{
    private T[] _items;
    private int _count;

    // 封装迭代器，支持foreach遍历集合
    public IEnumerable<T> GetItems()
    {
        for (int i = 0; i < _count; i++)
        {
            yield return _items[i];
        }
    }
}
```

#### 无限序列迭代器
```csharp
public IEnumerable<int> GetInfiniteSequence()
{
    int value = 1;
    while (true)
    {
        yield return value++;
    }
}
```

### 执行机制
- 调用迭代器方法时，仅返回迭代器对象，不执行方法内部逻辑
- 首次遍历触发时，执行方法至 `yield return` 语句，返回元素并暂停
- 后续遍历从暂停位置继续执行，直至下一个 `yield return`
- 方法执行完毕或执行 `yield break` 时，迭代流程终止

### 注意事项
- 迭代器具备延迟执行特性，多次遍历会重复执行方法逻辑
- 适合大数据集合、无限序列场景，逐个生成元素，无需加载全部数据
- Unity 引擎中协程的 `yield return` 基于迭代器语法实现
- `yield return` 语句不能直接包裹在 `try-catch` 代码块中

## 迭代器状态机
### 核心定义
- **迭代器状态机**：C# 编译器为包含 `yield` 关键字的迭代器方法自动生成的**嵌套私有类**，是实现迭代器暂停、恢复、终止的底层核心机制
- 本质是**状态模式**的实现，用于记录迭代器方法的执行位置、局部变量、参数等运行时状态
- 核心作用：实现 `yield return` 暂停恢复、延迟执行、状态持久化，无需手动编写复杂迭代器逻辑

### 核心特性
| 特性 | 说明 |
|------|------|
| 自动生成 | 编译器编译时自动创建，开发者无需手动实现 |
| 状态记录 | 精准保存迭代器暂停时的执行位置、局部变量、参数值 |
| 按需执行 | 仅在调用 `MoveNext()` 时切换状态并执行对应代码 |
| 状态可控 | 包含初始、运行中、暂停、终止等完整生命周期状态 |
| 无缝兼容 | 自动实现 `IEnumerable<T>`/`IEnumerator<T>` 接口 |

### 核心状态（生命周期）
- **初始状态**：迭代器对象刚创建，未执行任何代码
- **运行状态**：执行迭代器方法体，向下执行代码逻辑
- **暂停状态**：执行到 `yield return`，返回元素并暂停，保存当前状态
- **终止状态**：方法执行完毕或执行 `yield break`，迭代结束

### 编译器生成结构
迭代器状态机类默认实现的核心接口与成员：
1. 接口：`IEnumerator<T>`、`IDisposable`
2. 核心字段：
   - `state`：记录当前执行状态（枚举值）
   - `current`：保存当前 `yield return` 返回的元素
   - 局部变量/参数副本：保存迭代器暂停时的上下文数据
3. 核心方法：
   - `MoveNext()`：状态切换核心方法，执行迭代逻辑并返回元素
   - `Reset()`：重置迭代器到初始状态
   - `Dispose()`：释放迭代器资源

### 底层执行流程
1. 调用迭代器方法 → 编译器创建**状态机对象**，初始化状态为初始态
2. 执行 `foreach`/`MoveNext()` → 进入状态机，根据 `state` 跳转到上次暂停位置
3. 执行代码至 `yield return` → 将值赋值给 `current`，切换为暂停状态，返回 `true`
4. 下次调用 `MoveNext()` → 从暂停位置**恢复执行**，重复上述流程
5. 执行完毕/`yield break` → 切换为终止状态，返回 `false`，迭代结束

### 代码映射示例
#### 原始迭代器代码

```csharp
public IEnumerable<int> TestIterator()
{
    int a = 1;
    yield return a;
    a++;
    yield return a;
}
```
#### 编译器生成状态机伪代码

```csharp
private class TestIteratorStateMachine : IEnumerator<int>
{
    // 核心状态：0-初始 1-运行中 2-暂停 -1-终止
    private int _state;
    private int _current;
    private int _a; // 局部变量副本

    public int Current => _current;
    public bool MoveNext()
    {
        switch (_state)
        {
            case 0:
                _state = 1;
                _a = 1; // 执行初始逻辑
                _current = _a;
                _state = 2; // 暂停
                return true;
            case 2:
                _state = 1;
                _a++; // 从暂停处恢复
                _current = _a;
                _state = 2;
                return true;
            default:
                _state = -1; // 终止
                return false;
        }
    }
}
```

### 关键作用

- 实现**暂停/恢复**：依靠状态记录，精准定位代码执行位置
- 保留**上下文数据**：局部变量、参数在迭代过程中不会丢失
- 简化迭代器：屏蔽底层状态管理，开发者仅需关注业务逻辑
- 支持**延迟执行**：状态机仅在 `MoveNext()` 调用时执行，无遍历则不运行代码

### 注意事项
- 状态机为**编译器自动生成**，无需手动修改或编写
- 迭代器的**局部变量会被提升**为状态机字段，生命周期与迭代器一致
- 多次遍历迭代器会创建**多个独立状态机**，互不干扰
- 值类型/引用类型参数在状态机中以副本形式存储
- 异常会中断状态机，直接切换为终止状态

## 可空值类型
### 可空类型声明语法

#### 核心定义
- **可空类型**：能够表示**基础类型的正常值 + null值**的类型，专门解决值类型不能赋值为null的问题
- 本质是`Nullable<T>`泛型结构体的语法简化形式，仅支持**值类型**（int、bool、double、struct、enum等）
- 核心作用：表示值类型的**空状态**、适配数据库可空字段、处理缺失/未初始化的数据

#### 核心特性
| 特性 | 说明 |
|------|------|
| 值类型扩展 | 让int、bool等值类型支持赋值为null |
| 语法简化 | 支持`类型?`简写，无需写完整`Nullable<T>` |
| 编译期安全 | 编译时检查空值，避免空引用异常 |
| 双状态判断 | 包含HasValue（是否有值）和Value（实际值）属性 |
| 无额外开销 | 基于结构体实现，性能接近原生值类型 |

#### 基础声明语法
##### 简写语法
```csharp
// 可空整型
int? age = null;
// 可空布尔型
bool? isActive = null;
// 可空浮点型
double? score = null;
// 可空日期类型
DateTime? createTime = null;
```

##### 完整泛型语法
```csharp
Nullable<int> age = new Nullable<int>();
Nullable<bool> isActive = new Nullable<bool>(true);
Nullable<DateTime> createTime = null;
```

#### 声明与赋值
```csharp
// 1. 声明并赋值为null
int? num1 = null;

// 2. 声明并赋值为正常值
int? num2 = 100;

// 3. 先声明后赋值
int? num3;
num3 = 200;

// 4. 结构体/枚举可空类型
public struct MyStruct { }
MyStruct? customStruct = null;

public enum MyEnum { A, B }
MyEnum? customEnum = null;
```

#### 核心成员使用
```csharp
int? value = 10;

// 判断是否包含有效值
if (value.HasValue)
{
    // 获取实际值（必须确保HasValue为true）
    int result = value.Value;
}

// 空合并运算符：为空则返回默认值
int finalValue = value ?? 0;
```

#### 类型转换语法
```csharp
int? a = 10;
// 可空类型 -> 基础类型（强制转换）
int b = (int)a;

int c = 20;
// 基础类型 -> 可空类型（隐式转换）
int? d = c;
```

#### C# 8.0 可空引用类型
```csharp
#nullable enable
// 引用类型声明为可空（字符串可赋值为null）
string? name = null;
// 非空引用类型（禁止赋值为null，编译警告）
string notNullName = "test";
```

#### 注意事项
- 可空类型仅适用于**值类型**，引用类型本身支持null
- 直接访问`Value`属性前必须判断`HasValue`，否则触发异常
- 空合并运算符`??`是可空类型取值的最优实践
- 可空类型与基础类型之间支持隐式/显式转换
- C# 8.0后引用类型可通过`?`声明为可空，属于编译期检查

## `Nullable<T>` 底层结构

### 核心定义
- **`Nullable<T>`**：.NET 基础库定义的**泛型结构体**，是可空值类型的底层实现，`T?` 语法本质是它的简写
- 属于**值类型**，无堆分配、无垃圾回收开销，仅在原有值类型基础上增加空状态标记
- 约束：`where T : struct`，仅支持**值类型**作为泛型参数

### 核心特性
| 特性 | 说明 |
|------|------|
| 结构体实现 | 属于值类型，内存分配高效，无引用类型开销 |
| 双字段存储 | 仅包含值字段 + 空标记字段，内存占用极小 |
| 运行时支持 | CLR 内置特殊处理，支持装箱、拆箱、类型转换优化 |
| 不变性 | 实例创建后值不可修改，保证线程安全 |
| 语法映射 | `T?` 完全等价于 `Nullable<T>`，编译后一致 |

### 底层源码结构
```csharp
public struct Nullable<T> where T : struct
{
    // 核心字段1：标记是否有有效值（true=有值 false=null）
    private readonly bool hasValue;
    
    // 核心字段2：存储实际的 T 类型值
    private readonly T value;

    // 构造函数：传入非空值初始化
    public Nullable(T value)
    {
        this.value = value;
        hasValue = true;
    }

    // 只读属性：判断是否包含有效值
    public bool HasValue => hasValue;

    // 只读属性：获取实际值，无值时抛出异常
    public T Value
    {
        get
        {
            if (!hasValue)
                ThrowHelper.ThrowInvalidOperationException();
            return value;
        }
    }

    // 方法：获取值，为空则返回默认值
    public T GetValueOrDefault() => hasValue ? value : default;
    
    // 方法：获取值，为空则返回指定默认值
    public T GetValueOrDefault(T defaultValue) => hasValue ? value : defaultValue;
}
```

### 核心成员说明
- **`hasValue`**：私有布尔字段，标记当前实例是否为非空状态
- **`value`**：私有泛型字段，存储实际的 `T` 类型数据
- **`HasValue`**：公共只读属性，对外暴露空状态判断
- **`Value`**：公共只读属性，获取实际值，无值时抛异常
- **`GetValueOrDefault()`**：安全取值方法，为空返回类型默认值

### 内存布局
- 无装箱状态下，`Nullable<T>` 内存 = `T` 内存 + `bool` 内存
- 示例：`int?` 内存布局
  - `int value`：4 字节
  - `bool hasValue`：1 字节
  - 总占用：**5 字节**（对齐后 8 字节），远小于引用类型内存消耗

### CLR 特殊优化机制
- **装箱优化**：`Nullable<T>` 为 `null` 时装箱为 `null`；有值时仅对内部 `value` 装箱
- **拆箱优化**：可直接将引用类型拆箱为 `Nullable<T>`，CLR 自动处理空值匹配
- **GetType()**：调用 `GetType()` 会返回 `typeof(T)`，隐藏 `Nullable` 包装类型
- **相等性比较**：`null` 与 `null` 判定相等，符合开发使用习惯

### 与 `T?` 语法映射
- 编译前：`int? age = null;`
- 编译后：`Nullable<int> age = null;`
- 语法糖仅存在于编译期，运行时底层类型完全一致

### 关键注意事项
- `Nullable<T>` 是**结构体**，永远不会为 `null`，`null` 只是 `hasValue=false` 的语法表现
- 无额外性能损耗，读写速度接近原生值类型
- 不支持嵌套：`Nullable<Nullable<int>>` 编译报错，泛型约束禁止值类型嵌套
- 所有可空值类型的运算、转换、判空，均基于该结构体实现

## 空合并运算符
### 核心定义
- **空合并运算符**：C# 中用于快速处理**null 值**的二元运算符，语法为 `??`
- 作用：判断左侧操作数是否为 `null`，为 `null` 则返回右侧默认值，不为 `null` 则返回左侧本身
- 适用类型：**可空值类型**、**引用类型**、**可空引用类型**
- 核心价值：简化空值判断逻辑，替代冗余的 `if-else` 空值检查，代码更简洁

### 核心特性
| 特性 | 说明 |
|------|------|
| 空值兜底 | 左侧为 null 时自动返回右侧默认值 |
| 非空保留 | 左侧不为 null 时直接返回原值，不执行右侧逻辑 |
| 短路特性 | 左侧非空时，右侧表达式**不会执行** |
| 类型兼容 | 左右两侧操作数必须类型相同或可隐式转换 |
| 链式使用 | 支持多级 null 检查，简化多层空值判断 |

### 基础语法
```csharp
// 基础语法
结果 = 可空对象 ?? 默认值;
```

### 基础使用示例
#### 可空值类型使用
```csharp
// 可空整型
int? num = null;
// 为 null，返回 0
int result1 = num ?? 0;

// 赋值有效值
int? validNum = 100;
// 非 null，返回本身 100
int result2 = validNum ?? 0;
```

#### 引用类型使用
```csharp
string name = null;
// 为 null，返回默认字符串
string userName = name ?? "未知用户";

string realName = "张三";
// 非 null，返回本身
string finalName = realName ?? "未知用户";
```

### 空合并赋值运算符（??=）
- C# 8.0 新增语法，作用：**仅当左侧为 null 时，才将右侧值赋值给左侧**
```csharp
// 语法
变量 ??= 默认值;

// 示例
int? age = null;
// 左侧为 null，赋值 18
age ??= 18;

string address = null;
// 左侧为 null，赋值默认地址
address ??= "暂无地址";
```

### 链式使用语法
支持多级空合并，从左到右依次判断，返回第一个非 null 值
```csharp
int? a = null;
int? b = null;
int c = 50;
// 依次判断 a→b→c，最终返回 50
int result = a ?? b ?? c;
```

### 等价逻辑对比
```csharp
// 原始 if-else 写法
int? score = null;
int finalScore;
if (score.HasValue)
{
    finalScore = score.Value;
}
else
{
    finalScore = 0;
}

// 空合并运算符简化写法
int finalScore = score ?? 0;
```

### 结合可空类型使用
```csharp
// 可空布尔类型
bool? isChecked = null;
// 空值时默认返回 false
bool checkResult = isChecked ?? false;

// 可空日期类型
DateTime? time = null;
DateTime defaultTime = time ?? DateTime.Now;
```

### 执行机制
1. 检查左侧操作数是否为 `null`
2. 左侧**非 null**：直接返回左侧值，右侧逻辑不执行
3. 左侧**为 null**：执行并返回右侧默认值
4. 链式调用：按顺序执行，直到找到第一个非 null 值

### 注意事项
- 右侧默认值**不能为 null**（无实际意义）
- 具备**短路运算**特性，左侧非空时右侧不执行
- `??` 优先级较低，复杂表达式建议使用括号包裹
- 与空条件运算符 `?.` 搭配使用，可实现完整空值安全逻辑
- 不可重载，语法规则由编译器固定实现

## 分部类型
### 分部类

#### 核心定义
- **分部类**：使用 `partial` 关键字修饰，将**同一个类、结构体、接口、委托**拆分到多个代码文件中实现的语法
- 所有分部部分编译时会被**编译器自动合并**为一个完整类型，运行时无任何区别
- 核心作用：拆分大型类代码、多人协同开发、分离自动生成代码与手写代码

#### 核心特性
| 特性 | 说明 |
|------|------|
| 编译合并 | 所有分部部分最终编译为单一类型，无运行时损耗 |
| 共享成员 | 所有部分共享字段、属性、方法、访问修饰符 |
| 修饰符一致 | 所有分部部分的访问修饰符、基类、接口必须统一 |
| 任意拆分 | 可拆分为 2 个及以上文件，不受数量限制 |
| 支持多种类型 | 可用于类、结构体、接口、委托 |

#### 基础语法
```csharp
// 文件1：Person.Part1.cs
public partial class Person
{
    // 字段、方法1
    private string _name;
    public void SayHello() { }
}

// 文件2：Person.Part2.cs
public partial class Person
{
    // 属性、方法2
    public int Age { get; set; }
    public void Work() { }
}
```

#### 声明规则
- 必须使用 **`partial`** 关键字修饰
- 所有部分必须拥有**相同的类名、命名空间、访问修饰符**
- 所有部分指定的**基类、实现接口**必须完全一致
- 实例化时直接使用类名，与普通类无区别
- 分部部分可以分布在不同代码文件，也可在同一文件

#### 常用使用场景
##### 分离自动生成代码与手写代码
```csharp
// 系统/工具自动生成代码：Person.Designer.cs
public partial class Person
{
    // 自动生成的字段、属性
    public int Id { get; set; }
}

// 手写业务代码：Person.cs
public partial class Person
{
    // 手写业务方法
    public void GetInfo() { }
}
```

##### 大型类拆分（多人协同）
```csharp
// User.Data.cs：数据字段、属性
public partial class User { }

// User.Method.cs：业务方法
public partial class User { }

// User.Event.cs：事件、委托
public partial class User { }
```

#### 分部方法
- 分部类中可定义**分部方法**，分为定义部分和实现部分
- 无实现部分时，编译器会自动移除所有调用，无性能损耗
```csharp
// 定义部分
partial class Sample
{
    // 分部方法声明（无方法体）
    partial void Test();
}

// 实现部分
partial class Sample
{
    // 分部方法实现
    partial void Test()
    {
        // 方法逻辑
    }
}
```

#### 实例化与使用
```csharp
// 直接使用类名实例化，与普通类完全一致
Person person = new Person();
person.SayHello();
person.Work();
```

#### 约束限制
- 不能用于拆分枚举、泛型参数
- 所有分部部分必须在**同一程序集、同一命名空间**内
- 密封、抽象等修饰符必须在所有部分保持一致
- 分部方法必须是**私有**、无返回值、无输出参数
- 不支持嵌套类型的跨文件拆分

### 分部结构

#### 核心定义
- **分部结构**：使用 `partial` 关键字修饰的**结构体**，允许将同一个结构体的定义拆分到多个代码文件或代码块中
- 编译时编译器会自动合并所有分部部分，生成**单一结构体**，运行时与普通结构体无差异
- 本质是值类型的分部语法，遵循结构体所有特性，仅用于代码组织优化

#### 核心特性
| 特性 | 说明 |
|------|------|
| 值类型 | 保留结构体值类型特性，栈分配，无引用开销 |
| 编译合并 | 所有分部部分最终合并为一个完整结构体 |
| 成员共享 | 所有分部可访问彼此的字段、方法、属性 |
| 约束一致 | 访问修饰符、特性、接口实现必须全部统一 |
| 代码分离 | 适合拆分自动生成代码与手动业务代码 |

#### 基础语法
```csharp
// 文件1：Point.Data.cs
public partial struct Point
{
    // 数据成员部分
    public int X;
    public int Y;
}

// 文件2：Point.Method.cs
public partial struct Point
{
    // 方法成员部分
    public void Move(int offsetX, int offsetY)
    {
        X += offsetX;
        Y += offsetY;
    }
}
```

#### 声明规则
- 必须使用 **`partial struct`** 组合关键字声明
- 所有分部部分必须拥有**相同结构体名称、命名空间、访问修饰符**
- 可在**同一文件**或**多个文件**中拆分定义
- 所有部分的接口实现、特性标记最终会合并
- 实例化方式与普通结构体完全一致

#### 分部方法（结构体内支持）
- 分部结构体中可声明**分部方法**，分为定义与实现两部分
- 无实现时编译器自动移除调用，无性能损耗
- 必须为私有、无返回值、无输出参数

```csharp
// 分部方法定义
partial struct MyStruct
{
    partial void Init();
}

// 分部方法实现
partial struct MyStruct
{
    partial void Init()
    {
        // 初始化逻辑
    }
}
```

#### 典型使用场景
##### 自动生成代码分离
```csharp
// 代码生成器生成：Entity.Generated.cs
public partial struct Entity
{
    public Guid Id;
    public string Name;
}

// 手动扩展：Entity.cs
public partial struct Entity
{
    public bool IsValid()
    {
        return Id != Guid.Empty;
    }
}
```

##### 大型结构体拆分
```csharp
// 数据成员部分
partial struct GameData
{
    public int Hp;
    public int Mp;
}

// 功能方法部分
partial struct GameData
{
    public void Reset()
    {
        Hp = 0;
        Mp = 0;
    }
}
```

#### 使用方式
```csharp
// 直接实例化，调用所有成员
Point point = new Point();
point.X = 10;
point.Y = 20;
point.Move(5, 5);
```

#### 约束限制
- 分部结构是**值类型**，遵循结构体所有规则（不可继承）
- 所有分部必须在**同一程序集、同一命名空间**
- 不可嵌套跨文件拆分，不可修改为类/枚举
- 分部方法不支持公开访问、返回值、out/ref 参数
- 所有部分的访问修饰符必须保持统一

### 分部接口

#### 核心定义
- **分部接口**：使用 `partial` 关键字修饰的接口类型，允许将**同一个接口**的定义拆分到多个代码文件中
- 编译时编译器自动合并所有分部接口成员，最终生成**单一完整接口**，运行时与普通接口无差异
- 核心作用：拆分大型接口定义、分离自动生成接口与手动扩展接口、多人协同开发接口

#### 核心特性
| 特性 | 说明 |
|------|------|
| 编译合并 | 所有分部接口在编译期合并为一个接口，运行时无区别 |
| 成员合并 | 所有分部的方法、属性、事件、索引器会合并到同一接口中 |
| 约束统一 | 所有分部的访问修饰符、命名空间、继承接口必须一致 |
| 无实现代码 | 接口仅包含声明，分部接口同样不允许编写方法实现 |
| 多文件拆分 | 可将接口成员分散到多个文件中维护 |

#### 基础语法
```csharp
// 文件1：IUser.Base.cs
public partial interface IUser
{
    // 基础成员声明
    int Id { get; set; }
    string Name { get; set; }
}

// 文件2：IUser.Action.cs
public partial interface IUser
{
    // 功能成员声明
    void Login();
    void Logout();
}
```

#### 声明规则
- 必须使用 `partial interface` 关键字组合声明
- 所有分部接口必须拥有**相同接口名、命名空间、访问修饰符**
- 所有分部指定的**继承接口**必须完全一致
- 仅包含接口成员（方法、属性、事件、索引器），无实现体
- 可在同一文件或多个文件中拆分

#### 典型使用场景
##### 代码生成器分离
```csharp
// 工具自动生成：IOrder.Generated.cs
public partial interface IOrder
{
    int OrderId { get; set; }
    decimal Price { get; set; }
}

// 手动扩展：IOrder.cs
public partial interface IOrder
{
    void CreateOrder();
    void CancelOrder();
}
```

##### 大型接口拆分
```csharp
// 数据属性分部
partial interface IProduct
{
    int Id { get; set; }
    string Title { get; set; }
}

// 操作方法分部
partial interface IProduct
{
    void AddStock();
    void RemoveStock();
}
```

#### 接口实现与使用
```csharp
// 实现合并后的完整接口
public class UserImpl : IUser
{
    public int Id { get; set; }
    public string Name { get; set; }
    public void Login() { }
    public void Logout() { }
}

// 使用方式与普通接口一致
IUser user = new UserImpl();
user.Login();
```

#### 约束限制
- 分部接口**不能包含方法实现**，仅能声明成员
- 所有分部必须在**同一程序集、同一命名空间**
- 访问修饰符、继承的接口必须全部统一
- 不支持分部方法（接口方法默认为抽象，无需分部定义）
- 不影响接口的继承、实现规则，与普通接口完全兼容

## 静态类
### 静态类声明规则

#### 核心定义
- **静态类**：使用 `static` 关键字修饰的类，仅包含**静态成员**，无法实例化，无法被继承
- 本质是**密封抽象类**，CLR 特殊处理，生命周期与应用程序域一致
- 核心作用：封装工具方法、全局常量、全局状态、无状态通用逻辑

#### 核心特性
| 特性 | 说明 |
|------|------|
| 不可实例化 | 无法使用 `new` 创建对象，无构造函数执行 |
| 密封不可继承 | 无法作为基类，派生类会编译报错 |
| 仅含静态成员 | 只能声明静态字段、属性、方法、事件、常量 |
| 全局访问 | 通过**类名直接调用**成员，无需实例 |
| 自动初始化 | 首次使用时执行静态构造函数，仅执行一次 |

#### 声明语法
```csharp
// 标准静态类声明
public static class MathUtils
{
    // 静态成员
    public static int Add(int a, int b) => a + b;
    public static string Version => "1.0.0";
}
```

#### 声明强制规则
- 必须使用 **`static`** 关键字修饰类
- 无法声明**实例构造函数**，仅可声明静态构造函数
- 无法声明**实例成员**（非静态字段、方法、属性）
- 无法继承**任何类**，也无法被任何类继承
- 无法实现**接口**（接口成员默认实例访问）
- 无法声明**密封/抽象**关键字（静态类隐式密封抽象）
- 访问修饰符仅支持 `public`/`internal`（默认 internal）

#### 成员声明规则
- 仅允许声明**静态成员**：`static` 字段、属性、方法、事件、常量
- 常量（`const`）隐式静态，可直接声明
- 静态构造函数无访问修饰符、无参数、仅能有一个
- 成员访问必须通过**类名.成员**，不能使用实例访问

#### 静态构造函数语法
```csharp
public static class AppConfig
{
    // 静态构造函数：首次使用类时执行一次
    static AppConfig()
    {
        // 初始化静态资源
    }

    public static string ConnectionString { get; set; }
}
```

#### 调用方式
```csharp
// 直接通过类名调用静态成员
int result = MathUtils.Add(10, 20);
Console.WriteLine(MathUtils.Version);
```

#### 禁止行为
- 禁止实例化：`var utils = new MathUtils();` 报错
- 禁止继承：`class Child : MathUtils()` 报错
- 禁止实现接口：`static class A : IInterface` 报错
- 禁止声明实例成员、索引器、析构函数
- 禁止作为泛型类型参数、委托参数传递

#### 典型使用场景
- 工具类：`Math`、`Console`、`Convert`
- 全局配置类：`AppConfig`、`GlobalSettings`
- 扩展方法容器：必须定义在静态类中
- 常量/枚举封装：全局只读常量管理

### 静态成员约束

#### 核心定义
- **静态成员约束**：C# 中对**静态字段、静态属性、静态方法、静态构造函数、静态事件**等成员的使用限制与规范
- 静态成员属于**类本身**，不属于任何实例，遵循独立的生命周期与访问规则
- 核心作用：保证静态成员安全使用，避免线程安全问题、错误调用与内存异常

#### 核心特性
| 特性 | 说明 |
|------|------|
| 类级归属 | 静态成员属于类型，所有实例共享同一份数据 |
| 全局唯一性 | 应用程序生命周期内仅存在一份副本 |
| 优先加载 | 静态成员在类首次被访问时初始化，早于实例成员 |
| 无this指针 | 静态方法中无法使用`this`，无法直接访问实例成员 |
| 线程风险 | 多线程同时修改静态字段，存在线程安全问题 |

#### 基础访问约束
- 静态成员**只能通过类名访问**，不能通过实例对象访问
- 实例成员可以直接访问静态成员，静态成员**不能直接访问实例成员**
- 静态方法中无法使用`base`、`this`关键字

#### 调用语法约束
```csharp
public class TestClass
{
    public static int StaticValue;
    public int InstanceValue;

    public static void StaticMethod()
    {
        // 合法：访问静态成员
        StaticValue = 10;
        // 非法：无法访问实例成员
        // InstanceValue = 20;
    }

    public void InstanceMethod()
    {
        // 合法：实例可访问静态成员
        StaticValue = 10;
        // 合法：实例访问自身成员
        InstanceValue = 20;
    }
}
```

#### 继承与重写约束
- 静态成员**不能被重写、隐藏、实现接口**
- 子类可定义与父类同名的静态成员，属于独立成员，无多态性
- 静态方法**不能使用virtual、abstract、override关键字**
- 接口中**不能定义静态成员**（C# 8.0+静态虚拟方法除外，属特殊语法）

#### 初始化约束
- 静态成员支持**直接初始化**与**静态构造函数初始化**
- 静态构造函数**无访问修饰符、无参数、仅能有一个**
- 静态构造函数在**类首次使用前执行一次**，不可手动调用
- 静态成员初始化顺序：静态字段 → 静态构造函数

#### 线程安全约束
- 多线程环境下，**读写静态字段必须加锁**
- 静态成员无自动线程安全机制，频繁修改需手动同步
- 只读静态字段（`static readonly`）无线程安全风险

```csharp
private static readonly object _lock = new object();
private static int _count;

public static void AddCount()
{
    lock (_lock)
    {
        _count++;
    }
}
```

#### 内存与生命周期约束
- 静态成员存储在**高频堆（High Frequency Heap）**
- 生命周期与**应用程序域**一致，进程退出才会释放
- 静态成员持有大对象时**易造成内存泄漏**，需谨慎使用
- 静态集合不清理会持续占用内存

#### 泛型类静态成员约束
- 不同闭泛型类型（`A<int>`、`A<string>`）拥有**独立的静态成员副本**
- 静态成员与**构造封闭泛型类型**绑定，互不共享

#### 特殊语法禁止
- 禁止在静态方法中使用`ref`、`out`关联实例成员
- 禁止将静态成员作为实例对象的成员访问
- 禁止在静态构造函数中抛出未处理异常（会导致类型失效）
- 禁止在静态方法中使用迭代器`yield`以外的异步特殊语法

#### 扩展方法特殊约束
- 扩展方法**必须定义在静态类的静态方法中**
- 第一个参数必须以`this`关键字修饰目标类型
- 属于语法糖，本质仍是静态方法调用

## 委托协变与逆变
### 委托协变

#### 核心定义
- **委托协变**：C# 中委托的**返回值**支持**隐式向上转型**的类型兼容特性
- 使用 `out` 关键字标记委托的**返回值类型参数**，实现派生类 → 基类的兼容赋值
- 核心作用：提升委托类型灵活性，支持返回子类的委托赋值给返回基类的委托

#### 核心特性
| 特性 | 说明 |
|------|------|
| 方向规则 | 协变 = **输出（返回值）** 兼容，派生类 → 基类 |
| 关键字 | 泛型委托中使用 **`out`** 标记协变类型参数 |
| 隐式转换 | 无需强制转换，编译器自动支持兼容赋值 |
| 安全转换 | 属于引用类型安全转换，无类型异常 |
| 适用场景 | 委托返回值为派生类、接口实现类 |

#### 基础语法
```csharp
// 协变委托：out 标记返回值类型参数
public delegate T OutDelegate<out T>();

// 基类
public class Animal { }
// 派生类
public class Dog : Animal { }
```

#### 协变赋值示例
```csharp
// 定义返回派生类的委托
OutDelegate<Dog> dogDelegate = () => new Dog();

// 协变：赋值给返回基类的委托（兼容）
OutDelegate<Animal> animalDelegate = dogDelegate;

// 调用正常，返回 Dog 可隐式转为 Animal
Animal animal = animalDelegate();
```

#### 系统内置协变委托
C# 内置委托默认支持协变，无需手动声明：
```csharp
// Func<out TResult>：返回值协变
Func<Dog> dogFunc = () => new Dog();
Func<Animal> animalFunc = dogFunc;

// 协变赋值，完全兼容
Animal result = animalFunc();
```

#### 协变约束规则
- 仅支持**引用类型**，不支持值类型（int、bool 等）
- 仅作用于**返回值（输出位置）**，不能用于方法参数
- 类型参数必须使用 **`out`** 关键字显式标记
- 只能实现**派生类转基类**的向上兼容，不可反向
- 必须是**泛型委托**，非泛型委托无协变概念

#### 协变与逆变核心区别
| 类型 | 关键字 | 位置 | 转换方向 |
|------|--------|------|----------|
| 协变 | out | 返回值 | 派生 → 基类 |
| 逆变 | in | 参数 | 基类 → 派生 |

#### 典型使用场景
- 统一处理不同子类返回值的委托集合
- 框架中抽象返回值类型，兼容具体实现类
- 配合多态，简化委托类型适配

#### 注意事项
- `out` 关键字仅表示**类型参数支持协变**，无其他语义
- 协变是**编译期类型安全检查**，无运行时性能损耗
- 禁止将协变类型参数用于委托的输入参数位置
- 值类型（int、enum）不支持协变转换

### 委托逆变

#### 核心定义
- **委托逆变**：C# 中针对委托**方法参数**的类型兼容特性，允许将参数为**基类**的委托，隐式转换为参数为**派生类**的委托
- 使用 **`in`** 关键字标记泛型委托的类型参数，支持**基类 → 派生类**的安全隐式转换
- 本质是方法参数类型的**逆方向兼容**，用于统一处理不同层级的入参类型

#### 核心特性
| 特性 | 说明 |
|------|------|
| 转换方向 | 基类委托 → 派生类委托，与继承方向相反 |
| 关键字 | 泛型类型参数用 **`in`** 修饰，表示输入类型 |
| 作用位置 | 仅作用于委托的**方法参数**（输入位置） |
| 类型安全 | 编译时检查，运行时不会出现类型转换异常 |
| 隐式赋值 | 无需强制类型转换，直接兼容赋值 |

#### 基础语法
```csharp
// 逆变委托：in 标记参数类型
public delegate void InDelegate<in T>(T arg);

// 基类
public class Animal { }
// 派生类
public class Dog : Animal { }
```

#### 赋值与使用示例
```csharp
// 方法参数是基类 Animal
void Feed(Animal animal) { }

// 委托参数是基类
InDelegate<Animal> animalDelegate = Feed;

// 逆变：可以赋值给参数为派生类 Dog 的委托
InDelegate<Dog> dogDelegate = animalDelegate;

// 调用时传入 Dog 完全安全
dogDelegate(new Dog());
```

#### 系统内置逆变委托
C# 内置委托已默认支持逆变：
```csharp
// Action<in T> 是典型逆变委托
Action<Animal> animalAction = a => { };

// 逆变赋值
Action<Dog> dogAction = animalAction;

dogAction(new Dog());
```

#### 逆变约束规则
- 类型参数必须用 **`in`** 显式标记
- 逆变类型参数**只能出现在方法参数位置**，不能作为返回值
- 仅支持**引用类型**，值类型不支持逆变
- 仅适用于**泛型委托**，非泛型委托无逆变概念
- 转换必须符合**里氏替换原则**，保证类型安全

#### 协变与逆变对比
| 类型 | 关键字 | 作用位置 | 转换方向 |
|------|--------|----------|----------|
| 协变 | out    | 返回值   | 派生 → 基类 |
| 逆变 | in     | 参数     | 基类 → 派生 |

#### 典型使用场景
- 统一处理一类子类对象的回调（如事件、处理器）
- 框架设计中抽象参数类型，提高接口通用性
- 配合多态，实现更灵活的委托赋值与调用

#### 注意事项
- `in` 仅表示类型参数支持逆变，无其他语义
- 逆变是**编译期语法检查**，不影响运行时性能
- 逆变类型参数不能用于返回值，否则编译报错
- 委托逆变与委托协变可同时存在于同一个泛型委托中

## 命名空间别名限定符
### 自定义命名空间别名
#### 核心定义
- **自定义命名空间别名**：使用 `using` 关键字为**长命名空间**或**重名类型**指定简化别名的语法
- 作用：缩短代码长度、解决不同命名空间下**类型同名冲突**、提升代码可读性
- 属于编译期语法，运行时无任何性能影响

#### 核心特性
| 特性 | 说明 |
|------|------|
| 简化调用 | 超长命名空间可用别名代替，减少代码冗余 |
| 解决冲突 | 同名不同命名空间类型，用别名区分 |
| 编译期生效 | 仅编译器识别，不生成额外IL代码 |
| 文件作用域 | 别名仅在当前代码文件内有效 |
| 支持嵌套 | 可为嵌套命名空间指定别名 |

#### 基础语法
```csharp
// 命名空间别名
using 别名 = 完整命名空间;

// 类型别名（直接给类型起别名）
using 别名 = 完整命名空间.类型名;
```

#### 命名空间别名使用
```csharp
// 给长命名空间定义别名
using Web = System.Web.Mvc;
using Data = Microsoft.EntityFrameworkCore;

// 使用别名代替完整命名空间
Web.Controller controller = new Web.Controller();
data.DbContext context = new Data.DbContext();
```

#### 类型别名使用（解决同名冲突）
```csharp
// 两个命名空间存在同名类 Student
using StudentA = MyProject.A.Student;
using StudentB = MyProject.B.Student;

// 使用别名区分，避免冲突
StudentA stu1 = new StudentA();
StudentB stu2 = new StudentB();
```

#### 声明规则
- 必须写在代码文件**最顶部**，位于命名空间声明之前
- 别名命名遵循标识符规范，不能使用关键字
- 别名仅当前文件有效，**不跨文件共享**
- 支持为**命名空间、类、结构体、委托、接口**指定别名
- 别名优先级高于默认命名空间，优先匹配

#### 典型使用场景
##### 简化超长命名空间
```csharp
// 原始写法
var service = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

// 别名简化
using DI = Microsoft.Extensions.DependencyInjection;
var service = new DI.ServiceCollection();
```

##### 解决类型同名冲突
```csharp
// 两个库都有 Logger 类
using Log4Net = log4net.Logger;
using NLog = NLog.Logger;

// 无歧义使用
Log4Net logger1 = new Log4Net();
NLog logger2 = new NLog();
```

#### 注意事项
- 别名**不能嵌套定义**，不能用别名定义别名
- 不影响程序集引用，仅简化代码书写
- 无法为**同一命名空间/类型**指定多个别名
- 不支持全局别名（C# 10+ 可使用全局命名空间）
- 泛型类型指定别名需携带完整泛型参数

#### 全局命名空间别名（C# 10+）
```csharp
// 全局生效，整个项目可用
global using DI = Microsoft.Extensions.DependencyInjection;
```

### global 全局命名空间别名
#### 核心定义
- **global 全局命名空间别名**：C# 10.0 引入，使用 `global using` 为命名空间/类型创建**全局生效**的别名
- 一次定义，**整个项目所有代码文件**均可直接使用，无需重复引入
- 核心作用：统一管理全局别名、消除重复代码、解决全项目类型同名冲突

#### 核心特性
| 特性 | 说明 |
|------|------|
| 全局生效 | 定义后整个项目所有文件均可使用，无需重复声明 |
| 编译期生效 | 仅编译器处理，不影响运行时性能 |
| 优先级更高 | 优先级高于文件级 using 别名 |
| 统一维护 | 集中管理项目通用别名，便于维护 |
| 支持任意别名 | 可命名命名空间、类型、泛型类型 |

#### 基础语法
```csharp
// 全局命名空间别名
global using 别名 = 完整命名空间;

// 全局类型别名
global using 别名 = 完整命名空间.类型名;
```

#### 标准声明位置
- 推荐创建**单独配置文件**（如 `GlobalUsings.cs`）统一管理
- 仅需声明一次，全项目生效

#### 代码示例
##### 全局别名定义（GlobalUsings.cs）
```csharp
// 全局命名空间别名
global using DI = Microsoft.Extensions.DependencyInjection;
global using EF = Microsoft.EntityFrameworkCore;

// 全局类型别名
global using StringList = System.Collections.Generic.List<string>;
global using IntDict = System.Collections.Generic.Dictionary<int, string>;
```

##### 全项目任意文件使用
```csharp
// 无需再次 using，直接使用别名
DI.ServiceCollection services = new DI.ServiceCollection();
EF.DbContext dbContext = new EF.DbContext();

StringList list = new StringList();
IntDict dict = new IntDict();
```

#### 解决全局同名冲突
```csharp
// 全局区分两个同名 Student 类型
global using StudentA = Project.A.Student;
global using StudentB = Project.B.Student;

// 任意文件直接使用，无冲突
StudentA stu1 = new StudentA();
StudentB stu2 = new StudentB();
```

#### 与文件级别名对比
| 对比项 | global using 别名 | 文件级 using 别名 |
|--------|-------------------|--------------------|
| 作用域 | 整个项目 | 仅当前代码文件 |
| 声明次数 | 一次 | 每个文件需重复声明 |
| 优先级 | 更高 | 较低 |
| 维护成本 | 低，统一管理 | 高，分散维护 |

#### 声明规则
- 必须使用 `global using` 组合关键字
- 必须位于代码文件**最顶部**
- 别名遵循标识符命名规范，不可使用关键字
- 支持命名空间、类、接口、委托、泛型类型
- 一个项目可存在多个全局配置文件，自动合并

#### 适用场景
- 项目高频使用的**超长命名空间**简化
- 全项目范围内**解决类型同名冲突**
- 统一封装通用**泛型类型别名**
- 框架/库统一入口别名管理
- 多人协作项目规范统一引用

#### 注意事项
- 全局别名**不可重复定义**，否则编译报错
- 不影响程序集引用，仅为代码书写简化语法
- C# 10.0 及以上版本支持
- 全局配置文件建议单独存放，便于维护
- 别名修改后全项目生效，谨慎变更

## 固定大小缓冲区
### unsafe 上下文固定数组
#### 核心定义
- **unsafe 上下文固定数组**：在 C# 的`unsafe`非安全代码上下文中，使用**fixed 语句**将托管数组固定在内存中，**防止垃圾回收移动数组位置**，从而获取数组的**原生指针**直接操作内存
- 核心作用：实现托管数组与非托管代码/指针的兼容、高性能内存读写、避免GC压缩内存导致指针失效
- 依赖：必须开启**unsafe 编译选项**，代码需包裹在`unsafe`上下文中

#### 核心特性
| 特性 | 说明 |
|------|------|
| 内存固定 | fixed 语句执行期间，托管数组**不会被GC移动/回收**，内存地址稳定 |
| 指针访问 | 可获取数组首地址指针，直接通过指针读写元素 |
| 高性能 | 跳过托管类型安全检查，内存操作效率接近原生C++ |
| 自动释放 | fixed 语句块结束后，自动解除内存固定，恢复GC管理 |
| 仅限值类型 | 仅支持`int[]`/`byte[]`/`float[]`等**值类型数组** |

#### 基础语法
```csharp
// 1. 声明unsafe上下文
unsafe
{
    // 2. fixed固定数组 + 获取指针
    fixed (类型* 指针名 = 托管数组)
    {
        // 3. 使用指针直接操作数组内存
    }
}
```

#### 完整代码示例
```csharp
// 必须标记unsafe方法/上下文
unsafe static void FixedArrayDemo()
{
    // 托管数组
    int[] numbers = { 10, 20, 30, 40 };

    // fixed固定数组，获取首地址指针
    fixed (int* p = numbers)
    {
        // 指针直接访问元素
        Console.WriteLine(*p);       // 第一个元素：10
        Console.WriteLine(*(p + 1)); // 第二个元素：20

        // 指针直接修改元素
        *p = 999;
        *(p + 2) = 666;
    }

    // fixed结束后，数组恢复托管状态
    Console.WriteLine(numbers[0]); // 999
    Console.WriteLine(numbers[2]); // 666
}
```

#### 指针操作规则
- 数组指针默认指向**数组第一个元素**
- 指针偏移`p + n`自动按**类型大小**计算内存地址
- 支持取值`*p`、赋值`*p = 值`、偏移`p++`/`p--`
- 可转换为`void*`通用指针，用于非托管API交互

#### 字符串固定（特殊数组）
字符串本质是`char`数组，也可在`fixed`中固定获取指针：
```csharp
unsafe static void FixedString()
{
    string text = "hello";
    // 固定字符串，获取char*指针
    fixed (char* p = text)
    {
        Console.WriteLine(*p); // 'h'
    }
}
```

#### 约束限制
- 必须在`unsafe`上下文/方法中使用
- 仅能固定**托管数组、字符串、托管值类型变量**
- fixed 语句内**禁止重新赋值指针**
- 指针仅在 fixed 块内有效，离开后禁止使用
- 不可滥用，会**影响GC性能**（长时间固定内存会阻止内存压缩）

#### 适用场景
- 高性能数据计算（图像、音频、二进制流处理）
- 与C/C++非托管DLL交互，传递内存指针
- 零拷贝数组操作，避免内存复制
- Unity 引擎高性能内存读写

#### 注意事项
- fixed 语句**执行时间越短越好**，避免长期锁定内存
- 指针操作无类型安全检查，越界访问会导致程序崩溃
- 数组为空/长度为0时固定会产生空指针
- 嵌套 fixed 可同时固定多个数组，按顺序释放

### 结构体内联缓冲区规则
#### 核心定义
- **结构体内联缓冲区**：在C#结构体中，通过**fixed 固定大小缓冲区**语法，直接在结构体**值类型内存布局内联存储数组数据**，无需托管堆分配，实现结构体与原生内存布局的无缝匹配
- 核心作用：兼容C/C++原生结构体内存布局、实现无堆分配高性能数据存储、用于非托管互操作和高性能场景
- 依赖：必须开启**unsafe 编译选项**，仅能在**结构体**中定义，属于unsafe上下文功能

#### 核心特性
| 特性 | 说明 |
|------|------|
| 内联存储 | 缓冲区数据直接嵌入结构体内存中，无堆分配、无GC开销 |
| 固定长度 | 声明时指定缓冲区长度，运行时不可修改 |
| 值类型特性 | 结构体拷贝时，内联缓冲区数据会完整复制 |
| 原生兼容 | 内存布局与C/C++固定大小数组完全一致 |
| 指针访问 | 必须通过fixed语句获取指针操作，不支持直接托管数组访问 |

#### 基础语法
```csharp
// 必须在unsafe结构体中定义
unsafe struct 结构体名
{
    // 固定大小缓冲区声明
    public fixed 元素类型 缓冲区名[缓冲区长度];
}
```

#### 完整代码示例
```csharp
// 标记unsafe结构体
unsafe struct InlineBuffer
{
    // 定义内联缓冲区：8个int元素的固定数组
    public fixed int NumberBuffer[8];
}

unsafe static void InlineBufferDemo()
{
    // 创建结构体，内联缓冲区直接分配在栈/值内存中
    InlineBuffer buffer;

    // fixed获取缓冲区指针，操作内联数据
    fixed (int* p = buffer.NumberBuffer)
    {
        // 直接赋值
        p[0] = 10;
        p[5] = 100;
    }

    // 读取数据
    fixed (int* p = buffer.NumberBuffer)
    {
        Console.WriteLine(p[0]);  // 10
        Console.WriteLine(p[5]); // 100
    }
}
```

#### 内存布局规则
- 内联缓冲区严格按照**元素类型大小×长度**连续占用结构体内存
- 内存布局无托管数组的额外开销（长度、同步块索引）
- 结构体总内存大小=普通字段内存+内联缓冲区总内存
- 支持多缓冲区嵌套定义，按声明顺序连续排布

#### 支持元素类型
- 仅限**基元值类型**：`byte`、`sbyte`、`short`、`ushort`、`int`、`uint`、`long`、`ulong`、`float`、`double`
- 不支持自定义结构体、引用类型、可空值类型
- 不支持`char`之外的字符类型，仅原生数值类型可用

#### 操作使用规则
- 内联缓冲区**不能直接作为数组使用**，不支持`foreach`、`Length`属性
- 必须通过`fixed`语句获取指针后，用指针/索引操作
- 结构体赋值时，内联缓冲区会执行**值拷贝**，而非引用传递
- 可作为方法参数、返回值传递，保持值类型特性

#### 声明约束限制
- 仅能在**结构体**中定义，不支持类、局部变量
- 必须使用**unsafe**修饰结构体/声明上下文
- 缓冲区长度必须是**编译期常量**，不支持变量、动态值
- 不支持多维缓冲区，仅支持一维固定长度
- 禁止使用`ref`、`out`直接引用缓冲区，必须通过指针操作

#### 适用场景
- C/C++非托管代码互操作，匹配原生结构体内存布局
- 高性能无GC数据结构（网络协议、二进制报文封装）
- 栈分配高性能临时缓冲区，避免堆内存开销
- 游戏引擎（Unity）底层数据结构开发

#### 注意事项
- 操作无内存安全检查，指针越界会导致程序崩溃
- 结构体嵌套大量内联缓冲区会增大内存占用
- 禁止在fixed语句外使用过期指针操作缓冲区
- 与托管数组互操作时需手动拷贝数据，无隐式转换

## 友元程序集
### `InternalsVisibleTo` 特性
#### 核心定义
- **`InternalsVisibleTo`特性**：C#中用于**突破程序集访问权限限制**的程序集级特性，允许将当前程序集的`internal`成员（类、方法、字段、属性）**暴露给指定的其他关联程序集**访问
- 核心作用：解决程序集间`internal`成员无法访问的问题，无需将成员改为`public`破坏封装性
- 依赖：无需开启unsafe，属于.NET基础权限控制特性，直接在代码中声明即可

#### 核心特性
| 特性 | 说明 |
|------|------|
| 权限穿透 | 仅授权指定程序集访问`internal`成员，其他程序集仍无法访问 |
| 封装保留 | 无需修改成员访问修饰符，保持`internal`的程序集内封装性 |
| 双向可选 | 可单向授权，也可多个程序集互相授权 |
| 强签名支持 | 支持为**强名称签名程序集**配置安全的授权规则 |
| 程序集级别 | 属于程序集全局特性，仅需声明一次，对整个程序集生效 |

#### 基础语法
```csharp
// 程序集级别特性，通常放在 AssemblyInfo.cs 或 项目根目录单独文件中
using System.Runtime.CompilerServices;

// 授权给 无强签名 的目标程序集
[assembly: InternalsVisibleTo("目标程序集名称")]

// 授权给 强签名 的目标程序集（需完整公钥令牌）
[assembly: InternalsVisibleTo("目标程序集名称, PublicKey=目标程序集公钥")]
```

#### 完整代码示例
1. 主程序集（授权方）
```csharp
// 程序集特性声明文件 AssemblyInfo.cs
using System.Runtime.CompilerServices;

// 授权给名为 TestProject 的测试程序集
[assembly: InternalsVisibleTo("TestProject")]

// 主程序集中的 internal 类
internal class InternalService
{
    internal int Calc(int a, int b) => a + b;
}
```
2. 关联程序集（被授权方，TestProject）
```csharp
// 可直接访问授权程序集的 internal 成员
InternalService service = new InternalService();
int result = service.Calc(10, 20); // 正常调用，无编译错误
```

#### 权限生效规则
- 仅对`internal`访问级别成员生效，`private`成员**仍无法访问**
- 特性声明在**源程序集**，被授权程序集无需任何配置
- 可同时声明多个特性，授权多个不同程序集
- 程序集名称区分大小写，必须与目标程序集输出名称完全一致
- 嵌套的`internal`类型、成员同样遵循授权规则可被访问

#### 强签名程序集适配规则
- 若授权/被授权程序集使用**强名称签名**，必须在特性中指定完整公钥
- 公钥可通过`sn.exe`工具从程序集强名称文件中提取
- 无公钥的强签名程序集授权声明会直接失效，无法访问
- 强签名配置可防止未授权程序集伪造名称访问内部成员

#### 声明位置规范
- 推荐放在项目专属的`AssemblyInfo.cs`文件中
- 可放在任意代码文件顶部（命名空间外），作为程序集级特性
- 一个程序集可重复声明多个`InternalsVisibleTo`特性

#### 约束限制
- 无法暴露`private`成员，仅支持`internal`级别权限开放
- 动态生成的程序集、匿名程序集不支持该特性
- 目标程序集名称错误会导致授权失效，编译报错
- 滥用会降低代码安全性，仅推荐用于测试、关联模块互操作

#### 适用场景
- 单元测试项目：测试业务程序集的`internal`核心逻辑，不对外暴露实现
- 多模块项目：同一应用的不同程序集模块间共享内部实现
- 插件化开发：主程序集向官方插件开放内部服务接口
- 框架开发：框架核心程序集向官方扩展库开放内部功能

#### 注意事项
- 仅用于**信任的关联程序集**，避免向未知第三方程序集授权
- 生产环境谨慎使用，防止内部敏感逻辑被非法访问
- 程序集重命名时，必须同步更新特性中的程序集名称
- 强签名程序集更换签名后，需要重新配置公钥才能生效

### 内部成员访问授权
#### 核心定义
- **内部成员访问授权**：C# 中通过`InternalsVisibleTo`特性实现的**程序集级权限授权机制**，允许将标记为`internal`的内部类型/成员，**显式开放给指定的外部程序集访问**，是 .NET 官方的程序集间内部成员共享方案
- 核心作用：保留代码封装性，不将内部成员改为`public`暴露给所有程序集，仅授权信任程序集访问
- 本质：对`internal`访问修饰符的**定向扩展**，仅对配置的目标程序集生效

#### 核心特性
| 特性 | 说明 |
|------|------|
| 定向授权 | 仅允许明确指定的程序集访问，其他程序集无权访问 |
| 封装安全 | 不改变成员原有访问级别，不破坏面向对象封装原则 |
| 全局生效 | 一次声明，整个程序集的所有`internal`成员均对目标程序集开放 |
| 双向兼容 | 支持无签名程序集、强名称签名程序集两种授权模式 |
| 编译级控制 | 权限在编译期验证，无效授权会直接报编译错误 |

#### 基础语法
```csharp
// 必需命名空间
using System.Runtime.CompilerServices;

// 程序集级别特性（必须写在命名空间外部）
// 格式1：无强签名程序集授权
[assembly: InternalsVisibleTo("目标程序集名称")]

// 格式2：强签名程序集授权（必须携带公钥）
[assembly: InternalsVisibleTo("目标程序集名, PublicKey=完整公钥字符串")]
```

#### 声明位置规范
- 可放在项目任意代码文件**顶部**（命名空间外）
- 推荐统一放在`AssemblyInfo.cs`或`Global.cs`等全局配置文件
- 现代 .NET Core/.NET 5+ 项目可直接在**项目根目录新建代码文件**声明
- 一个程序集可添加多条特性，授权多个不同程序集

#### 访问生效规则
- 仅开放**`internal`级别成员**，`private`私有成员始终无法访问
- 被授权程序集可直接实例化、调用、继承授权程序集的`internal`类
- 授权程序集的`internal`属性、方法、字段、委托、接口全部生效
- 嵌套内部类、泛型内部类型的`internal`成员同样遵循授权规则
- 权限仅单向生效：A授权B ≠ B自动授权A，需双向配置

#### 强名称签名适配规则
- 若授权方/被授权方是**强签名程序集**，必须配置公钥，仅写程序集名称无效
- 公钥是程序集签名文件的唯一标识，可通过`sn.exe`工具提取
- 公钥配置错误会导致授权失效，无法访问内部成员
- 强签名授权安全性更高，可防止程序集名称伪造

#### 标准使用流程
1. 在需要开放内部成员的**源程序集**中添加`InternalsVisibleTo`特性
2. 填写目标**被授权程序集名称**（强签名程序集追加公钥）
3. 被授权程序集直接引用源程序集，即可正常访问`internal`成员
4. 无需修改被授权程序集的任何代码

#### 约束限制
- 不支持授权给**匿名程序集、动态程序集、未命名程序集**
- 不支持对单个类型/成员单独授权，只能全局授权
- 程序集名称必须完全匹配，区分大小写，不支持通配符
- 无法通过配置文件动态修改，必须重新编译生效

#### 适用场景
- 单元测试项目访问业务代码的内部实现，无需公开核心逻辑
- 同一产品的多个程序集模块共享内部工具类、服务
- 主程序与官方插件、扩展库共享内部接口
- 框架开发中，核心程序集向官方配套组件开放内部功能

#### 安全使用规范
- 仅授权给**内部信任程序集**，禁止向未知第三方程序集开放
- 强签名程序集优先使用带公钥的授权方式，提升安全性
- 生产环境减少不必要授权，避免内部敏感逻辑泄露
- 程序集重命名、更换签名后，必须同步更新授权配置
