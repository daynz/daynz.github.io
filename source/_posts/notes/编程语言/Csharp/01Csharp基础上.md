---
title: "01Csharp基础上"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/01Csharp基础上.html
tags: [编程语言]
---

# C# 基础

[toc]

## 开发环境与基础语法

### C# 与 Unity 关系 与 .NET 基础

#### 核心定义
- **C#**：微软推出的强类型、面向对象的编程语言，基于 .NET 平台运行
- **Unity**：由 Unity Technologies 开发的跨平台游戏引擎，用于开发 2D/3D 游戏、AR/VR 应用等
- **.NET**：微软提供的软件开发平台，包含运行时（CLR）、基础类库（BCL）和语言编译器（C#、F# 等）

#### C# 与 Unity 的关系
- **脚本语言**：C# 是 Unity 的**主要官方脚本语言**（替代了早期的 UnityScript），用于编写游戏逻辑、交互系统、数据管理等
- **引擎集成**：Unity 引擎核心（C++ 编写）通过 .NET 运行时暴露 API 给 C#，开发者通过 C# 调用引擎功能（如渲染、物理、输入）
- **性能平衡**：C# 兼具类型安全、开发效率与运行性能，配合 Unity 的 IL2CPP 技术可进一步优化性能
- **生态支持**：C# 的 .NET 生态（NuGet 包、第三方库）可部分用于 Unity 开发（需符合 Unity 的 .NET 配置）

#### .NET 基础架构
- **.NET 平台演变**
  - .NET Framework：早期 Windows 专属平台（Unity 旧版本使用）
  - .NET Core：跨平台开源重构版本（Unity 2018+ 逐步支持）
  - .NET 5+：统一的跨平台 .NET（Unity 2022 LTS+ 默认使用 .NET 6）
- **核心组件**
  - **CLR（Common Language Runtime）**：公共语言运行时，负责代码执行（内存管理、垃圾回收、JIT 编译）
  - **BCL（Base Class Library）**：基础类库，提供常用功能（集合、IO、网络、数学等）
  - **C# 编译器**：将 C# 代码编译为 IL（Intermediate Language，中间语言）
- **编译与执行流程**
  1. C# 代码 → C# 编译器 → IL 代码（托管代码）
  2. IL 代码 → CLR（JIT 编译）→ 机器码（运行时执行）
  3. 或通过 AOT（Ahead-of-Time）编译直接生成机器码（如 Unity IL2CPP）

#### Unity 中的 .NET 配置
- **脚本运行时**
  - **Mono**：开源 .NET 运行时，支持 JIT 编译（Unity 旧版本默认，用于快速开发）
  - **IL2CPP**：Unity 自研技术，将 IL 代码转换为 C++ 代码，再编译为平台原生机器码（AOT 编译，性能更高，支持更多平台）
- **.NET 版本配置**
  - Unity 2022 LTS+：默认 .NET 6（兼容 C# 10）
  - Unity 2021 LTS：默认 .NET Standard 2.1（兼容 C# 8.0）
  - 可在 `Player Settings` → `Other Settings` → `Configuration` 中调整
- **API 限制**
  - Unity 裁剪了部分 .NET BCL（如 Windows 专属 API），避免包体积过大
  - 部分 .NET 库需适配 Unity（如使用 NuGet 包时需确认兼容性）

#### 示例代码
```csharp
public class ExampleScript : MonoBehaviour
{
    // 调用 Unity 引擎 API（C++ 核心通过 .NET 暴露）
    void Start()
    {
        Debug.Log("Hello Unity + C#"); // 输出日志
        transform.position = new Vector3(0, 1, 0); // 修改物体位置
    }

    // 使用 .NET BCL（基础类库）
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // 使用 .NET 的 System.DateTime 类
            System.DateTime now = System.DateTime.Now;
            Debug.Log("当前时间：" + now.ToString("HH:mm:ss"));
        }
    }
}
```

#### 注意事项
- Unity 中 C# 脚本需继承 `MonoBehaviour` 才能挂载到 `GameObject` 并接收引擎生命周期事件（`Start`、`Update` 等）
- IL2CPP 模式下需注意 AOT 限制（如泛型类型的动态创建可能失败，需提前在代码中显式使用）
- 避免在 Unity 中使用 Windows 专属 .NET API（如 `System.Windows.Forms`），否则跨平台发布时会报错
- .NET 的垃圾回收（GC）会影响 Unity 性能，需避免频繁分配临时对象（如在 `Update` 中大量 `new` 对象）

### 变量与常量

#### 核心定义
- **变量**：存储可变数据的容器，声明后可多次修改值
- **常量**：存储不可变数据的容器，声明后值不可修改

#### 核心区别
- **可变性**
  - 变量：值可随时修改
  - 常量：值一旦确定不可修改
- **赋值时机**
  - 变量：可在声明时或之后任意时机赋值
  - 常量：`const` 需在声明时赋值；`readonly`/`static readonly` 可在声明时或构造函数中赋值
- **存储位置**
  - 变量：局部变量存储在栈，实例/静态变量随对象/类存储在托管堆
  - 常量：`const` 直接嵌入调用代码；`readonly`/`static readonly` 存储在托管堆

#### 变量分类
- **局部变量**：声明在方法/代码块内，作用域限于当前块，需手动初始化
- **实例变量**：声明在类内、方法外（非 `static`），作用域限于当前实例，随对象创建而存在
- **静态变量**：声明在类内、方法外（带 `static`），作用域限于当前类，随类加载而存在

#### 常量分类
- **`const`**：编译时常量，仅支持基元类型，值需为编译时常量表达式
- **`readonly`**：实例运行时常量，支持所有类型，可在实例构造函数中赋值
- **`static readonly`**：静态运行时常量，支持所有类型，可在静态构造函数中赋值
（详见 `const`/`readonly`/`static readonly` 笔记）

#### 示例代码
```csharp
class Program{
    // 实例变量
    private int instanceVar = 10;
    // 静态变量
    private static int staticVar = 20;
    // const 常量
    private const int ConstVar = 30;
    // readonly 常量
    private readonly int ReadonlyVar = 40;
    static void Main()
    {
        // 局部变量
        int localVar = 50;
        localVar = 60; // 变量可修改

        Program p = new Program();
        Console.WriteLine(p.instanceVar); // 10
        Console.WriteLine(staticVar);     // 20
        Console.WriteLine(ConstVar);      // 30
        Console.WriteLine(p.ReadonlyVar); // 40
        Console.WriteLine(localVar);      // 60
    }
}
```

#### 注意事项
- 局部变量使用前必须初始化，否则编译报错
- 变量命名遵循驼峰命名法（如 `localVar`），常量遵循帕斯卡命名法（如 `ConstVar`）
- 避免在 `Update` 等高频调用方法中频繁声明局部变量（减少 GC 压力）
- `const` 常量跨程序集使用时，若原值改变需重新编译引用程序集；`readonly`/`static readonly` 无需重新编译

### `const` / `readonly` / `static readonly`

#### 核心定义
- **const**：编译时常量，声明时必须初始化，值不可改变
- **readonly**：运行时常量，可在声明时或实例构造函数中初始化，值不可改变
- **static readonly**：静态运行时常量，可在声明时或静态构造函数中初始化，值不可改变

#### 核心区别
- **赋值时机**
  - const：编译时赋值（值必须为编译时常量表达式）
  - readonly：实例构造函数中赋值（实例级）或声明时
  - static readonly：静态构造函数中赋值（类级）或声明时
- **存储位置**
  - const：直接嵌入调用代码（编译时替换）
  - readonly：实例字段存储在堆内存，静态字段存储在高频堆
  - static readonly：存储在高频堆（类级静态字段）
- **适用类型**
  - const：仅基元类型（int、double、string等）和枚举
  - readonly：所有值类型和引用类型
  - static readonly：所有值类型和引用类型
- **跨程序集行为**
  - const：引用程序集直接复制值（原值改变需重新编译引用程序集）
  - readonly/static readonly：运行时读取原程序集值（原值改变无需重新编译引用程序集）

#### 使用场景
- **const**：绝对不变的常量（如数学常数π、固定配置值）
- **readonly**：实例级常量（如对象创建时间、固定初始值）
- **static readonly**：类级常量（如数据库连接字符串、全局配置值）

#### 注意事项
- const无需static修饰（本身为静态）
- readonly仅能在构造函数中赋值（类方法不可修改）
- static readonly仅能在静态构造函数中赋值
- const的引用类型仅支持string（不可变且为编译时常量）
- readonly的引用类型，引用不可变但对象内容可修改（如readonly List<int>可Add/Remove元素）

#### 示例代码
```csharp
// const示例
public const int ConstValue = 10; // 声明时必须初始化
// readonly示例
public readonly int ReadonlyValue = 20; // 声明时初始化
public readonly int ReadonlyValue2; // 构造函数中初始化
// static readonly示例
public static readonly int StaticReadonlyValue = 30; // 声明时初始化
public static readonly int StaticReadonlyValue2; // 静态构造函数中初始化
// 实例构造函数
public Program()
{
    ReadonlyValue2 = 25; // 正确：构造函数中赋值readonly
}
// 静态构造函数
static Program()
{
    StaticReadonlyValue2 = 35; // 正确：静态构造函数中赋值static readonly
}
static void Main()
{
    Program p = new Program();
    Console.WriteLine(ConstValue); // 10
    Console.WriteLine(p.ReadonlyValue); // 20
    Console.WriteLine(p.ReadonlyValue2); // 25
    Console.WriteLine(StaticReadonlyValue); // 30
    Console.WriteLine(StaticReadonlyValue2); // 35
}
```

### 值类型与引用类型

#### 核心定义
- **值类型**：直接存储数据本身，变量持有数据的副本
- **引用类型**：存储数据的引用（内存地址），变量持有指向堆内存中实际数据的指针

#### 核心区别
- **存储位置**
  - 值类型：局部变量**存储在栈**，实例字段**随对象存储在托管堆**
  - 引用类型：**引用存储在栈**，**实际数据存储在托管堆**
- **赋值行为**
  - 值类型：赋值时复制数据副本，修改新变量不影响原变量
  - 引用类型：赋值时复制引用，修改新变量指向的对象会影响原变量
- **继承关系**
  - 值类型：隐式继承自 `System.ValueType`（间接继承自 `System.Object`）
  - 引用类型：直接或间接继承自 `System.Object`
- **null 支持**
  - 值类型：默认不可为 `null`（可空值类型 `Nullable<T>` 除外）
  - 引用类型：默认可为 `null`
- **内存管理**
  - 值类型：自动释放（栈空间自动回收，实例字段随对象回收）
  - 引用类型：由垃圾回收器（GC）管理堆内存的释放

#### 类型分类
- **值类型**
  - 结构体（`struct`）：如 `int`、`double`、`bool`、`DateTime`、自定义 `struct`
  - 枚举（`enum`）
- **引用类型**
  - 类（`class`）：如 `string`、`object`、自定义 `class`
  - 接口（`interface`）
  - 委托（`delegate`）
  - 数组（`array`）

#### 注意事项
- `string` 是特殊的引用类型：不可变（immutable），每次修改都会创建新对象
- 值类型默认值为 `0`/`false`/`default(T)`，引用类型默认值为 `null`
- 值类型作为方法参数时，默认按值传递（复制副本）；引用类型默认按引用传递（复制引用）
- 装箱/拆箱是值类型与引用类型之间的转换操作（详见装箱与拆箱笔记）
- 可空值类型 `Nullable<T>`（如 `int?`）是值类型，但支持 `null`（内部通过结构体实现）

### 装箱与拆箱

#### 核心定义
- **装箱**：将**值类型**隐式转换为**引用类型**（`object` 或接口类型）的过程。
  - 本质：在**托管堆**中开辟内存，新建一个引用类型包装对象，把栈上的值类型数据**复制**到堆中，栈上变量保存堆对象的引用地址。

- **拆箱**：将**已装箱的引用类型对象**，显式转换回**值类型**的过程。
  - 本质：检测堆中包装对象的类型合法性，再把堆内的数据**复制**回栈内存。


#### 实现原理
- **装箱**
  1. 在托管堆分配内存（值类型大小 + 对象头）
  2. 将值类型数据复制到堆内存
  3. 返回堆内存的引用（存储到栈上的引用类型变量）

- **拆箱**
  1. 检查引用类型变量是否为 `null`（是则抛 `NullReferenceException`）
  2. 检查引用类型的实际类型是否与目标值类型严格匹配（不匹配则抛 `InvalidCastException`）
  3. 将堆内存中的值类型数据复制到栈上的目标值类型变量

#### 装箱时机

1. 值类型赋值给 object 变量、接口变量
2. 调用值类型未重写的 `object` 虚方法，且结构体未重写（`ToString`、`Equals`、`GetHashCode`）
3. 传入非泛型方法 / 集合（参数为 object）
4. 值类型作为参数传入可变参数 `params object[]`
5. 值类型赋值给其实现的接口类型变量
6. 装箱为委托、事件捕获值类型变量

#### 拆箱时机

1. object ，接口引用强制转换为对应值类型

#### 性能影响
- **内存分配与拷贝**
  - 装箱需要在**堆**上分配新对象，把栈上数据**拷贝**到堆。
  - 拆箱需要检查类型 + 把堆数据**拷贝**回栈。
  - 比直接值类型操作多了**内存分配 + 两次拷贝**。
- **GC 压力增大**
  - 装箱产生的临时对象会留在堆里，用完后需要**GC 垃圾回收**。
  - 频繁装箱产生了大量临时小对象导致 **GC 频繁触发**
- **CPU 额外开销**
  - 类型检查、内存操作、对象头分配、寻址操作都比直接值操作更耗 CPU。


#### 注意事项
- 拆箱类型必须与装箱时的**原始值类型**完全一致（不允许隐式转换，如 `int` 装箱后不能直接拆箱为 `long`）
- 可空值类型（`Nullable<T>`）装箱：若有值则装箱为 `T`，若无值则装箱为 `null`
- 拆箱 `null` 引用会抛 `NullReferenceException`

#### 装箱与拆箱示例

```c#
int num = 100;
object obj = num;// 装箱：值类型 → 引用类型
int num2 = (int)obj;// 拆箱：引用类型 → 值类型
```

#### 减少装箱拆箱的方法

**使用泛型**

```csharp
// 避免：ArrayList（object存储）
// 推荐：List<T>
List<int> list = new List<int>();
list.Add(123); // 无装箱
```

**重写值类型的 `object` 虚方法**

```csharp
struct MyStruct
{
    public int Value;
    // 重写 ToString 避免调用基类时装箱
    public override string ToString() => Value.ToString();
}
```

**避免值类型向 object、接口隐式转换**

```csharp
interface IMyInterface { void Method(); }
struct MyStruct : IMyInterface { public void Method() { } }

// 避免：直接将 struct 赋值给接口（装箱）
// IMyInterface iface = new MyStruct();

// 推荐：直接使用 struct 实例
MyStruct s = new MyStruct();
s.Method();
```

**使用 `Enum.TryParse` 替代 `Enum.Parse`**

```csharp
// 避免：Enum.Parse（返回 object，需拆箱）
// int val = (int)Enum.Parse(typeof(MyEnum), "Value");
// 推荐：Enum.TryParse（无拆箱）
if (Enum.TryParse<MyEnum>("Value", out var result))
{
    int val = (int)result;
}
```

### 常用类型

#### 核心定义
C# 常用类型涵盖值类型与引用类型，包括基础数据类型、字符串、数组、集合等，是开发中最常用的数据载体。

#### 类型分类
| 类型类别       | 具体类型                          | 说明                                  | 示例                          |
|----------------|-----------------------------------|---------------------------------------|-------------------------------|
| 值类型-基元    | `int`、`double`、`bool`、`char`  | 基础数值/布尔/字符类型                | `int age = 18;`              |
| 值类型-结构体  | `DateTime`、`TimeSpan`、`Guid`    | 复合值类型（日期、时间差、唯一标识）  | `DateTime now = DateTime.Now;`|
| 值类型-枚举    | `enum`                            | 一组命名常量的集合                    | `enum Day { Monday, Tuesday }`|
| 引用类型-字符串| `string`                          | 不可变的字符序列                      | `string name = "Unity";`     |
| 引用类型-数组  | `T[]`                             | 固定长度的同类型元素集合              | `int[] nums = {1, 2, 3};`    |
| 引用类型-集合  | `List<T>`、`Dictionary<TKey,TValue>` | 动态长度的泛型集合（列表、键值对）    | `List<int> list = new List<int>();` |
| 引用类型-类    | `class`                           | 自定义引用类型（封装数据与行为）      | `class Player { }`           |
| 引用类型-接口  | `interface`                       | 行为契约（定义方法签名）              | `interface IUpdate { }`      |
| 引用类型-委托  | `Action`、`Func`                  | 类型安全的函数指针                    | `Action log = () => { };`    |

#### 示例代码
```csharp
// 1. 基元类型
int age = 18;
double price = 99.99;
bool isActive = true;
char grade = 'A';

// 2. 结构体
DateTime now = DateTime.Now;
TimeSpan duration = TimeSpan.FromHours(2);
Guid id = Guid.NewGuid();

// 3. 枚举
Day today = Day.Monday;

// 4. 字符串
string name = "Unity Developer";
string upperName = name.ToUpper(); // 生成新字符串（不可变）

// 5. 数组
int[] nums = { 1, 2, 3 };
int firstNum = nums[0];

// 6. 泛型集合
List<int> list = new List<int> { 10, 20, 30 };
list.Add(40); // 动态添加元素

Dictionary<string, int> dict = new Dictionary<string, int>
{
    { "Alice", 25 },
    { "Bob", 30 }
};
int aliceAge = dict["Alice"];

// 输出示例
Console.WriteLine(now.ToString("yyyy-MM-dd"));
Console.WriteLine(upperName);
Console.WriteLine(list.Count);
// 自定义枚举
enum Day { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday }
```

#### 注意事项
- `string` 是引用类型但**不可变**，每次修改（如 `ToUpper`、`Substring`）都会创建新对象
- 数组长度固定，泛型集合（`List<T>`、`Dictionary<TKey,TValue>`）长度动态可变
- 选择集合的原则：有序列表用 `List<T>`，键值对用 `Dictionary<TKey,TValue>`，去重用 `HashSet<T>`
- 值类型默认值为 `0`/`false`/`default(T)`，引用类型默认值为 `null`
- 枚举底层默认是 `int`，可通过 `enum Day : byte { ... }` 指定底层类型

### 类型转换

#### 核心定义
- **类型转换**：将一个类型的值转换为另一个类型的过程
- **隐式转换**：编译器自动完成的转换，无数据丢失，无需显式语法
- **显式转换**：需手动指定的强制转换，可能丢失数据或抛出异常，需使用 `(T)` 语法

#### 核心区别
- **安全性**
  - 隐式转换：类型安全，无数据丢失（如 `int` → `long`）
  - 显式转换：非类型安全，可能丢失精度或数据（如 `long` → `int`）
- **语法要求**
  - 隐式转换：无需额外语法
  - 显式转换：需使用 `(目标类型)源变量` 语法

#### 转换分类
- **隐式转换规则**
  1. 值类型：小范围类型 → 大范围类型（如 `sbyte`→`short`→`int`→`long`，`float`→`double`）
  2. 引用类型：派生类 → 基类（如 `string`→`object`）
  3. 值类型 → 其实现的接口类型（会发生装箱）
- **显式转换规则**
  1. 值类型：大范围类型 → 小范围类型（需强制转换，可能抛 `OverflowException`）
  2. 引用类型：基类 → 派生类（需强制转换，可能抛 `InvalidCastException`）
- **用户自定义转换**
  - 使用 `implicit operator` 定义隐式转换
  - 使用 `explicit operator` 定义显式转换
  - 仅适用于自定义 struct/class，不能转换继承关系的类型
- **辅助类转换**
  - `Convert` 类：提供多种类型的通用转换方法（如 `Convert.ToInt32()`、`Convert.ToString()`），支持 `null` 处理
  - `Parse` 方法：将字符串转换为值类型（如 `int.Parse()`），格式错误时抛 `FormatException`
  - `TryParse` 方法：安全的字符串转值类型（如 `int.TryParse()`），返回 `bool` 表示是否成功，不抛异常

#### 示例代码
```csharp
// 1. 隐式转换
int intVal = 100;
long longVal = intVal; // int → long（隐式，无数据丢失）
object objVal = "hello"; // string → object（隐式，派生类转基类）

// 2. 显式转换
long longVal2 = 999999999;
int intVal2 = (int)longVal2; // long → int（显式，需强制转换）
object objVal3 = "world";
string strVal3 = (string)objVal3; // object → string（显式，基类转派生类）

// 3. 用户自定义转换示例
Celsius c = new Celsius(25);
Fahrenheit f = c; // 隐式转换（Celsius → Fahrenheit）
Celsius c2 = (Celsius)f; // 显式转换（Fahrenheit → Celsius）

// 4. 辅助类转换
// Convert 类
string numStr = "123";
int num = Convert.ToInt32(numStr); // string → int
int? nullableInt = null;
int num2 = Convert.ToInt32(nullableInt); // 处理 null，返回 0

// Parse 方法
string doubleStr = "3.14";
double pi = double.Parse(doubleStr); // string → double

// TryParse 方法（推荐，安全）
string badStr = "abc";
if (int.TryParse(badStr, out int result))
{
    Console.WriteLine("转换成功：" + result);
}
else
{
    Console.WriteLine("转换失败");
}
// 用户自定义类型：摄氏度
struct Celsius
{
    public double Temperature;
    public Celsius(double temp) { Temperature = temp; }

    // 隐式转换：Celsius → Fahrenheit
    public static implicit operator Fahrenheit(Celsius c)
    {
        return new Fahrenheit(c.Temperature * 9 / 5 + 32);
    }
}
// 用户自定义类型：华氏度
struct Fahrenheit
{
    public double Temperature;
    public Fahrenheit(double temp) { Temperature = temp; }

    // 显式转换：Fahrenheit → Celsius
    public static explicit operator Celsius(Fahrenheit f)
    {
        return new Celsius((f.Temperature - 32) * 5 / 9);
    }
}
```

#### 注意事项
- 显式转换可能导致**精度丢失**（如 `double`→`int` 会截断小数）或**溢出异常**（可通过 `checked` 关键字启用溢出检查：`checked { int i = (int)longVal; }`）
- 引用类型显式转换前，建议使用 `is` 或 `as` 关键字检查类型兼容性：
  - `is`：返回 `bool` 表示是否匹配（`if (obj is string str) { ... }`）
  - `as`：转换失败时返回 `null`（`string str = obj as string; if (str != null) { ... }`）
- `Parse` 方法仅适用于字符串转值类型，格式错误时抛异常；**优先使用 `TryParse`** 避免异常
- `Convert` 类处理 `null` 时返回目标类型的默认值（如 `Convert.ToInt32(null)` 返回 `0`），而 `Parse(null)` 会抛 `ArgumentNullException`
- 用户自定义转换不能处理继承关系的类型转换（如基类与派生类之间的转换），那是系统默认的引用类型转换

### 运算符

#### 核心定义
- **算术运算符**：用于数值计算（加、减、乘、除、取模、自增、自减等）
- **比较运算符**：用于比较两个值的大小或相等关系，返回布尔值
- **逻辑运算符**：用于布尔值的逻辑运算（与、或、非、异或等），支持短路特性
- **赋值运算符**：用于给变量赋值，包括简单赋值和复合赋值（结合算术运算）

#### 算术运算符
| 运算符 | 说明               | 示例          | 结果（假设初始值） |
|--------|--------------------|---------------|--------------------|
| `+`    | 加法               | `5 + 3`       | `8`                |
| `-`    | 减法               | `5 - 3`       | `2`                |
| `*`    | 乘法               | `5 * 3`       | `15`               |
| `/`    | 除法（整数）       | `5 / 2`       | `2`（截断小数）    |
| `/`    | 除法（浮点数）     | `5.0 / 2.0`   | `2.5`              |
| `%`    | 取模（求余数）     | `5 % 2`       | `1`                |
| `++`   | 自增（前缀）       | `++a`         | `a = a + 1`（先增后用） |
| `++`   | 自增（后缀）       | `a++`         | `a = a + 1`（先用后增） |
| `--`   | 自减（前缀）       | `--a`         | `a = a - 1`（先减后用） |
| `--`   | 自减（后缀）       | `a--`         | `a = a - 1`（先用后减） |

#### 比较运算符
| 运算符 | 说明               | 示例          | 结果               |
|--------|--------------------|---------------|--------------------|
| `==`   | 等于               | `5 == 3`      | `false`            |
| `!=`   | 不等于             | `5 != 3`      | `true`             |
| `>`    | 大于               | `5 > 3`       | `true`             |
| `<`    | 小于               | `5 < 3`       | `false`            |
| `>=`   | 大于等于           | `5 >= 3`      | `true`             |
| `<=`   | 小于等于           | `5 <= 3`      | `false`            |

#### 逻辑运算符
| 运算符 | 说明               | 示例                  | 结果               |
|--------|--------------------|-----------------------|--------------------|
| `!`    | 逻辑非（取反）     | `!true`               | `false`            |
| `&&`   | 逻辑与（短路）     | `true && false`       | `false`            |
| `||`   | 逻辑或（短路）     | `true || false`       | `true`             |
| `&`    | 逻辑与（非短路）   | `true & false`        | `false`            |
| `|`    | 逻辑或（非短路）   | `true | false`        | `true`             |
| `^`    | 逻辑异或           | `true ^ false`        | `true`             |

#### 赋值运算符
| 运算符 | 说明               | 示例          | 等价于            |
|--------|--------------------|---------------|-------------------|
| `=`    | 简单赋值           | `a = 5`       | -                 |
| `+=`   | 加等于             | `a += 3`      | `a = a + 3`       |
| `-=`   | 减等于             | `a -= 3`      | `a = a - 3`       |
| `*=`   | 乘等于             | `a *= 3`      | `a = a * 3`       |
| `/=`   | 除等于             | `a /= 3`      | `a = a / 3`       |
| `%=`   | 取模等于           | `a %= 3`      | `a = a % 3`       |

#### 示例代码
```csharp
// 1. 算术运算符
int a = 5, b = 2;
Console.WriteLine(a + b); // 7
Console.WriteLine(a / b); // 2（整数除法，截断小数）
Console.WriteLine(5.0 / 2.0); // 2.5（浮点数除法）
Console.WriteLine(a % b); // 1
int c = 10;
Console.WriteLine(++c); // 11（先增后用）
Console.WriteLine(c++); // 11（先用后增）
Console.WriteLine(c); // 12
// 2. 比较运算符
Console.WriteLine(a == b); // false
Console.WriteLine(a > b); // true
Console.WriteLine(a <= b); // false
// 3. 逻辑运算符
bool x = true, y = false;
Console.WriteLine(!x); // false
Console.WriteLine(x && y); // false（短路：左为false直接返回）
Console.WriteLine(x || y); // true（短路：左为true直接返回）
Console.WriteLine(x ^ y); // true
// 4. 赋值运算符
int d = 5;
d += 3; // d = 8
d *= 2; // d = 16
Console.WriteLine(d); // 16
```

#### 注意事项
- **整数除法**：`int` 类型相除结果仍为 `int`，小数部分直接截断；若需浮点数结果，至少一个操作数为浮点数（如 `5.0 / 2`）
- **自增/自减**：前缀（`++a`）先修改变量值再使用，后缀（`a++`）先使用变量值再修改
- **逻辑短路**：`&&` 左为 `false` 或 `||` 左为 `true` 时，直接返回结果，不执行右操作数（可避免空引用异常）
- **复合赋值**：`+=` 等会自动进行类型转换（如 `byte b = 1; b += 2;` 合法，而 `b = b + 2` 需显式转换为 `byte`）
- **字符串比较**：`string` 用 `==` 比较的是内容（C# 重载了运算符），其他引用类型默认比较引用地址

## 程序流程控制

### 条件语句

### 循环语句

### 跳转语句

## 函数

### 函数基础

#### 核心定义
- **函数（方法）**：封装可重用代码的独立模块，接收输入参数，执行特定逻辑，返回输出结果（或无返回值）
- **作用**：提高代码复用性、可读性和可维护性，将复杂任务拆分为多个小模块

#### 语法结构
```csharp
[访问修饰符] [返回类型] [函数名]([参数列表])
{
    // 方法体：执行逻辑
    [return 返回值;] // 无返回值时省略
}
```
- **访问修饰符**：控制函数的可访问性（如 `public`、`private`、`protected`、`internal`）
- **返回类型**：函数返回值的类型；无返回值时用 `void`
- **函数名**：遵循帕斯卡命名法（如 `CalculateSum`）
- **参数列表**：可选，由零个或多个参数组成，每个参数包含类型和名称，用逗号分隔

#### 参数类型
| 参数类型       | 关键字 | 说明                                  | 示例                          |
|----------------|--------|---------------------------------------|-------------------------------|
| 值参数         | 无     | 默认传递方式，传递参数的副本，修改不影响原变量 | `void Func(int a)`           |
| 引用参数       | `ref`  | 传递参数的引用，修改会影响原变量，参数需先初始化 | `void Func(ref int a)`       |
| 输出参数       | `out`  | 用于返回多个结果，参数无需初始化，但函数内必须赋值 | `void Func(out int a)`       |
| 参数数组       | `params` | 允许传递可变数量的同类型参数，必须是最后一个参数 | `void Func(params int[] arr)`|

#### 返回值
- **无返回值**：返回类型为 `void`，无需 `return` 语句（或用 `return;` 提前退出）
- **有返回值**：返回类型为具体类型，必须用 `return` 语句返回匹配类型的值
- **多个返回值**：可通过 `out` 参数、元组（`Tuple` 或 `ValueTuple`）或自定义类/结构体实现

#### 函数重载
- **定义**：同一个类中可以有多个同名函数，但**参数列表必须不同**（参数类型、数量、顺序不同）
- **规则**：与返回类型无关，仅通过参数列表区分
- **作用**：提供功能相似但输入不同的函数，提高易用性

#### 递归
- **定义**：函数直接或间接调用自身
- **要素**：
  1. **终止条件**：避免无限递归（否则会导致栈溢出）
  2. **递归调用**：逐步逼近终止条件

#### 示例代码
```csharp
class Program
{
    static void Main()
    {
        // 1. 调用无参数无返回值函数
        PrintHello();

        // 2. 调用有参数有返回值函数
        int sum = CalculateSum(5, 3);
        Console.WriteLine("Sum: " + sum); // 8

        // 3. 调用引用参数函数
        int a = 10;
        ModifyValue(ref a);
        Console.WriteLine("Modified a: " + a); // 20

        // 4. 调用输出参数函数
        int result;
        bool success = TryDivide(10, 2, out result);
        if (success) Console.WriteLine("Divide Result: " + result); // 5

        // 5. 调用参数数组函数
        int total = SumParams(1, 2, 3, 4, 5);
        Console.WriteLine("Params Sum: " + total); // 15

        // 6. 调用重载函数
        Console.WriteLine(Add(5, 3)); // 8（int版本）
        Console.WriteLine(Add(5.5, 3.3)); // 8.8（double版本）

        // 7. 调用递归函数
        Console.WriteLine(Factorial(5)); // 120（5! = 5×4×3×2×1）
    }

    // 无参数无返回值函数
    static void PrintHello()
    {
        Console.WriteLine("Hello World!");
    }

    // 有参数有返回值函数
    static int CalculateSum(int x, int y)
    {
        return x + y;
    }

    // 引用参数函数
    static void ModifyValue(ref int num)
    {
        num *= 2;
    }

    // 输出参数函数
    static bool TryDivide(int dividend, int divisor, out int quotient)
    {
        quotient = 0;
        if (divisor == 0) return false;
        quotient = dividend / divisor;
        return true;
    }

    // 参数数组函数
    static int SumParams(params int[] numbers)
    {
        int sum = 0;
        foreach (int num in numbers) sum += num;
        return sum;
    }

    // 重载函数1：int版本
    static int Add(int x, int y)
    {
        return x + y;
    }

    // 重载函数2：double版本
    static double Add(double x, double y)
    {
        return x + y;
    }

    // 递归函数：计算阶乘
    static int Factorial(int n)
    {
        if (n <= 1) return 1; // 终止条件
        return n * Factorial(n - 1); // 递归调用
    }
}
```

#### 注意事项
- **参数传递默认是值传递**：值类型传递副本，引用类型传递引用的副本（修改引用指向的对象会影响原对象，但修改引用本身不会）
- **`ref` 与 `out` 的区别**：
  - `ref`：参数必须在调用前初始化，函数内可读取或修改
  - `out`：参数无需在调用前初始化，但函数内必须赋值
- **`params` 限制**：必须是参数列表的最后一个参数，且只能是一维数组
- **函数重载规则**：仅通过参数列表区分，与返回类型、访问修饰符无关
- **递归风险**：无终止条件或终止条件不当会导致 `StackOverflowException`（栈溢出）
- **函数命名**：遵循帕斯卡命名法，使用动词或动词短语（如 `Calculate`、`GetData`、`PrintResult`）

### 形参/实参/`ref` / `out` / `in`

#### 核心定义
- **形参（形式参数）**：函数定义时声明的参数，用于接收调用者传递的数据，仅在函数内部有效
- **实参（实际参数）**：调用函数时传递给形参的具体值或变量，必须与形参类型匹配
- **`ref`**：引用参数修饰符，传递参数的引用（内存地址），函数内修改会影响原变量，参数需先初始化
- **`out`**：输出参数修饰符，用于从函数返回多个结果，参数无需初始化，但函数内必须赋值
- **`in`**：只读引用参数修饰符，传递参数的引用但禁止修改，用于大值类型的性能优化（避免复制）

#### 核心区别
| 修饰符 | 参数初始化要求 | 函数内是否可修改 | 主要用途                  |
|--------|----------------|------------------|---------------------------|
| 无（值参数） | 调用前需初始化 | 仅修改副本       | 传递普通数据              |
| `ref`  | 调用前需初始化 | 可修改原变量     | 需要修改原变量的场景      |
| `out`  | 调用前无需初始化 | 必须赋值         | 从函数返回多个结果        |
| `in`   | 调用前需初始化 | 不可修改         | 大值类型的只读传递（性能优化） |

#### 详细说明
- **形参与实参的关系**：
  - 形参是函数定义时的“占位符”，实参是调用时的“实际数据”
  - 值参数传递时，实参的值复制给形参，两者独立；引用参数传递时，形参指向实参的内存地址
- **`ref` 关键字**：
  - 传递参数的引用，函数内对形参的修改直接作用于原变量
  - 适用于需要修改原变量的场景（如交换两个变量的值）
- **`out` 关键字**：
  - 专门用于从函数输出数据，函数内必须给 `out` 参数赋值
  - 适用于需要返回多个结果的场景（如 `TryParse` 方法）
- **`in` 关键字**：
  - 传递只读引用，函数内无法修改参数，避免大值类型的复制开销
  - 适用于大结构体（如 `Matrix4x4`）的只读传递，提升性能

#### 示例代码
```csharp
class Program
{
    static void Main()
    {
        // 1. 形参与实参（值参数）
        int x = 10;
        ValueParameter(x);
        Console.WriteLine("ValueParameter后x: " + x); // 10（原变量未修改）

        // 2. ref 参数
        int a = 10, b = 20;
        Swap(ref a, ref b);
        Console.WriteLine("Swap后a: " + a + ", b: " + b); // 20, 10（原变量已交换）

        // 3. out 参数
        int result;
        bool success = TryDivide(10, 3, out result);
        if (success) Console.WriteLine("TryDivide结果: " + result); // 3

        // 4. in 参数
        LargeStruct large = new LargeStruct { Value = 100 };
        ReadOnlyPass(in large);
    }

    // 值参数：传递副本
    static void ValueParameter(int num)
    {
        num = 20; // 仅修改副本
    }

    // ref 参数：交换两个变量
    static void Swap(ref int x, ref int y)
    {
        int temp = x;
        x = y;
        y = temp;
    }

    // out 参数：尝试除法，返回是否成功及结果
    static bool TryDivide(int dividend, int divisor, out int quotient)
    {
        quotient = 0; // out 参数必须赋值
        if (divisor == 0) return false;
        quotient = dividend / divisor;
        return true;
    }

    // 大值类型（用于演示 in 参数）
    struct LargeStruct
    {
        public int Value;
        // 假设还有很多其他字段，总大小较大
    }

    // in 参数：只读传递，避免复制大结构体
    static void ReadOnlyPass(in LargeStruct ls)
    {
        Console.WriteLine("LargeStruct.Value: " + ls.Value);
        // ls.Value = 200; // 编译错误：in 参数不可修改
    }
}
```

#### 注意事项
- **`ref` 与 `out` 的重载限制**：不能仅通过 `ref` 和 `out` 区分函数重载（如 `void Func(ref int a)` 和 `void Func(out int a)` 视为同一签名）
- **`in` 的性能优化场景**：仅对大值类型（如超过 16 字节的结构体）有明显性能提升，小值类型反而可能增加开销
- **`out` 参数的赋值要求**：函数内所有代码路径都必须给 `out` 参数赋值，否则编译报错
- **引用类型的 `ref` 传递**：引用类型本身传递的是引用的副本，使用 `ref` 可修改引用本身（如让原变量指向新对象）
- **`in` 的隐式转换**：`in` 参数可接受值类型的临时变量（如 `ReadOnlyPass(new LargeStruct())`），编译器会自动创建临时变量

### `params` 可变参数

#### 核心定义
- **`params`**：参数数组修饰符，允许函数接收**可变数量的同类型参数**，参数类型必须为一维数组，且必须是参数列表的最后一个参数

#### 核心特性
| 特性项           | 说明                                  |
|------------------|---------------------------------------|
| 参数位置         | 必须是参数列表的**最后一个参数**      |
| 参数类型         | 必须是**一维数组**（不能是多维数组）  |
| 调用方式         | 可传递多个同类型参数、一个一维数组、或不传参数 |
| 编译器处理       | 自动将多个参数打包成数组              |

#### 详细说明
- **参数位置限制**：`params` 必须放在参数列表的最后，后面不能再跟其他参数
- **数组类型限制**：仅支持一维数组，如 `int[]`、`string[]`，不支持 `int[,]` 等多维数组
- **灵活的调用方式**：
  1. 传递多个同类型参数：`Func(1, 2, 3)`
  2. 传递一个一维数组：`Func(new int[] {1, 2, 3})`
  3. 不传参数：`Func()`（此时数组为空，不是 `null`）
- **重载优先级**：如果存在与调用参数完全匹配的非 `params` 函数，编译器优先调用非 `params` 版本

#### 示例代码
```csharp
class Program
{
    static void Main()
    {
        // 1. 传递多个同类型参数
        int sum1 = Sum(1, 2, 3, 4, 5);
        Console.WriteLine("Sum1: " + sum1); // 15

        // 2. 传递一个一维数组
        int[] arr = { 10, 20, 30 };
        int sum2 = Sum(arr);
        Console.WriteLine("Sum2: " + sum2); // 60

        // 3. 不传参数（数组为空）
        int sum3 = Sum();
        Console.WriteLine("Sum3: " + sum3); // 0

        // 4. 重载优先级：优先调用非 params 版本
        Print(1, 2); // 调用 Print(int a, int b)
        Print(1, 2, 3); // 调用 Print(params int[] arr)
    }

    // params 可变参数函数：计算总和
    static int Sum(params int[] numbers)
    {
        int sum = 0;
        // numbers 不为 null，不传参数时为空数组
        foreach (int num in numbers)
        {
            sum += num;
        }
        return sum;
    }

    // 非 params 重载函数
    static void Print(int a, int b)
    {
        Console.WriteLine("非 params 版本：" + a + ", " + b);
    }

    // params 重载函数
    static void Print(params int[] arr)
    {
        Console.WriteLine("params 版本：" + string.Join(", ", arr));
    }
}
```

#### 注意事项
- **参数位置必须最后**：`void Func(int a, params int[] b)` 合法，`void Func(params int[] a, int b)` 编译错误
- **仅支持一维数组**：`params int[,] arr` 编译错误
- **不能与 `ref`/`out`/`in` 同时使用**：`params ref int[] arr` 编译错误
- **数组不为 null**：不传参数时，`params` 数组为空数组（`Length == 0`），不是 `null`，无需 null 检查
- **重载优先级**：匹配的非 `params` 函数优先，避免意外调用 `params` 版本
- **性能考虑**：频繁调用 `params` 函数会产生临时数组，高频场景（如游戏循环）建议直接传递数组或使用重载

### 可选参数/命名参数

#### 核心定义
- **可选参数**：函数定义时为参数指定默认值，调用时可省略该参数（自动使用默认值）
- **命名参数**：函数调用时通过参数名指定值，不依赖参数的声明顺序

#### 核心区别
| 特性项           | 可选参数                          | 命名参数                          |
|------------------|-----------------------------------|-----------------------------------|
| 作用位置         | 函数定义时                        | 函数调用时                        |
| 核心功能         | 允许省略参数（使用默认值）        | 允许通过参数名指定值（不依赖顺序）|
| 语法要求         | 定义时给参数赋值（默认值）        | 调用时使用 `参数名:值` 格式       |

#### 详细说明
- **可选参数规则**：
  1. 默认值必须是**编译时常量**（如字面量、`const` 常量、`enum` 值）
  2. 必须放在参数列表的**最后**（在 `params` 之前，如果有 `params`）
  3. 不能与 `ref`/`out` 同时使用（`in` 可以，但不常见）
- **命名参数规则**：
  1. 调用时使用 `参数名:值` 格式
  2. 命名参数必须放在**位置参数之后**（先写位置参数，再写命名参数）
  3. 可跳过中间可选参数，直接指定后续参数的值
- **两者结合**：命名参数常与可选参数配合使用，提高代码可读性，灵活选择要传递的参数

#### 示例代码
```csharp
class Program
{
    static void Main()
    {
        // 1. 可选参数调用：省略部分参数
        PrintInfo("Alice"); // 使用默认年龄 18，默认城市 "北京"
        PrintInfo("Bob", 25); // 使用默认城市 "北京"
        PrintInfo("Charlie", 30, "上海"); // 传递所有参数

        // 2. 命名参数调用：指定参数名，改变顺序
        PrintInfo(city: "广州", name: "David", age: 22); // 不依赖声明顺序

        // 3. 结合使用：跳过中间可选参数
        PrintInfo("Eve", city: "深圳"); // 省略年龄，使用默认值 18
    }

    // 可选参数函数：name 是必选参数，age 和 city 是可选参数
    static void PrintInfo(string name, int age = 18, string city = "北京")
    {
        Console.WriteLine($"姓名：{name}，年龄：{age}，城市：{city}");
    }
}
```

#### 注意事项
- **可选参数默认值限制**：不能是变量、对象实例（如 `new object()`）或非编译时常量表达式，必须是编译时能确定的值
- **可选参数位置**：必须放在必选参数之后，`params` 之前（如 `void Func(string a, int b = 1, params int[] c)` 合法）
- **命名参数位置**：调用时命名参数必须在位置参数之后（如 `Func("a", b: 1)` 合法，`Func(b: 1, "a")` 编译错误）
- **避免重载歧义**：如果存在与可选参数函数参数数量匹配的重载函数，编译器可能无法确定调用哪个（如 `void Func(int a)` 和 `void Func(int a, int b = 1)`，调用 `Func(1)` 会有歧义）
- **COM 互操作场景**：可选参数最初是为 COM 互操作设计的（如 Office 自动化），可简化 COM 方法的调用（无需传递大量 `Missing.Value`）

### 函数重载

#### 核心定义
- **函数重载**：在同一个类中定义多个**同名函数**，但它们的**参数列表必须不同**（参数类型、数量、顺序不同），与返回类型、访问修饰符无关，用于为功能相似的操作提供不同的输入方式。

#### 详细说明
- **重载的判断依据**：仅通过**参数列表**区分，需满足以下任一条件：
  1. **参数数量不同**：如 `Func(int a)` 和 `Func(int a, int b)`
  2. **参数类型不同**：如 `Func(int a)` 和 `Func(double a)`
  3. **参数顺序不同**：如 `Func(int a, double b)` 和 `Func(double a, int b)`
- **与返回类型无关**：仅返回类型不同的函数不能构成重载（如 `int Func()` 和 `void Func()` 编译报错）
- **编译器的重载解析**：调用时编译器根据实参的类型、数量、顺序选择**最佳匹配**的重载版本，优先选择无需隐式转换的版本。

#### 示例代码
```csharp
class Program
{
    static void Main()
    {
        // 1. 参数数量不同的重载
        Print(10); // 调用 Print(int a)
        Print(10, 20); // 调用 Print(int a, int b)

        // 2. 参数类型不同的重载
        Add(5, 3); // 调用 Add(int a, int b)
        Add(5.5, 3.3); // 调用 Add(double a, double b)

        // 3. 参数顺序不同的重载
        Display(10, "Hello"); // 调用 Display(int a, string b)
        Display("World", 20); // 调用 Display(string a, int b)
    }

    // 参数数量不同的重载1
    static void Print(int a)
    {
        Console.WriteLine("单参数：" + a);
    }

    // 参数数量不同的重载2
    static void Print(int a, int b)
    {
        Console.WriteLine("双参数：" + a + ", " + b);
    }

    // 参数类型不同的重载1
    static int Add(int a, int b)
    {
        return a + b;
    }

    // 参数类型不同的重载2
    static double Add(double a, double b)
    {
        return a + b;
    }

    // 参数顺序不同的重载1
    static void Display(int a, string b)
    {
        Console.WriteLine("int: " + a + ", string: " + b);
    }

    // 参数顺序不同的重载2
    static void Display(string a, int b)
    {
        Console.WriteLine("string: " + a + ", int: " + b);
    }

    // 错误示例：仅返回类型不同，不能构成重载
    // static void Func() { }
    // static int Func() { return 0; } // 编译报错
}
```

#### 注意事项
- **仅参数列表区分重载**：返回类型、访问修饰符、`params` 修饰符（仅 `params` 不同时）不能作为重载依据
- **`ref`/`out` 不能单独区分重载**：如 `void Func(ref int a)` 和 `void Func(out int a)` 视为同一签名，编译报错
- **避免可选参数与重载的歧义**：如 `void Func(int a)` 和 `void Func(int a, int b = 1)`，调用 `Func(1)` 时编译器无法确定选择哪个版本，产生歧义
- **隐式转换的优先级**：重载解析时优先选择无需隐式转换的版本，如 `Print(10)` 优先选择 `Print(int)` 而非 `Print(double)`
- **运算符重载**：运算符重载是函数重载的特殊形式（如 `operator+`），用于自定义类型的运算符行为
