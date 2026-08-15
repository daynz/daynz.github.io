---
title: "02Csharp基础下"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/02Csharp基础下.html
tags: [编程语言]
---

# C# 基础

[toc]

## 复合数据类型

### 数组

#### 核心定义

- **原生数组**：C# 内置的固定长度、同类型数据集合，属于**引用类型**
- 声明后**长度不可修改**，元素通过索引访问，索引从 `0` 开始

#### 数组分类

| 数组类型 | 语法    | 说明                       |
| -------- | ------- | -------------------------- |
| 一维数组 | `T[]`   | 最常用，线性存储           |
| 二维数组 | `T[,]`  | 矩形数组，行列固定         |
| 交错数组 | `T[][]` | 数组的数组，每行长度可不同 |

#### 核心特性

- 属于 `System.Array` 类，拥有 `Length`、`Rank` 等属性
- 所有元素**必须是同一类型**
- 数组创建后**长度固定**，不能动态增删
- 默认初始化：值类型为 `0`/`false`，引用类型为 `null`
- 支持 `foreach` 遍历

#### 声明与初始化

```csharp
// 1. 一维数组
int[] arr1 = new int[3]; // 定义长度，默认值 {0,0,0}
int[] arr2 = new int[] { 1, 2, 3 }; // 定义+初始化
int[] arr3 = { 1, 2, 3 }; // 简写

// 2. 二维数组（矩形数组）
int[,] twoD = new int[2, 3]; // 2行3列
int[,] twoD2 = { {1,2}, {3,4} };

// 3. 交错数组（数组的数组）
int[][] jagged = new int[2][];
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5 };
```

#### 常用操作

```csharp
// 访问元素
int first = arr2[0]; // 索引0开始
arr2[1] = 20;        // 修改元素

// 获取长度
int len = arr2.Length;       // 一维长度
int row = twoD2.GetLength(0); // 二维行数
int col = twoD2.GetLength(1); // 二维列数

// 遍历
foreach (int num in arr2) { }

// System.Array 常用方法
Array.Sort(arr2);      // 排序
Array.Reverse(arr2);   // 反转
Array.IndexOf(arr2, 3);// 查找索引
Array.Copy(arr1, arr2, 3); // 复制
```

#### 注意事项

- 数组是**引用类型**，赋值时复制引用，修改会影响原数组
- 索引越界会抛出 `IndexOutOfRangeException`
- 数组长度固定，需要动态长度使用 `List<T>`
- 二维数组是**矩形结构**，交错数组每行长度可自由定义
- 数组遍历：`for` 比 `foreach` 性能更高（Unity 高频场景推荐）

### 字符串

#### 核心定义

- **string**：C# 中表示文本的**引用类型**，本质是 `char` 类型的只读序列
- 底层对应 `System.String`，是不可变类型：**一旦创建，内容无法修改**

#### 核心特性

- **不可变性**：字符串一旦创建，**内容不可修改**，任何修改、拼接、替换、截取，都不会改原字符串，而是新建一个字符串对象。
  - 线程安全，多线程并发访问无需加锁
  - 支持**字符串常量池**，节约内存
  - 避免多处引用同一字符串被意外篡改
  - **问题**：频繁拼接 / 修改字符串，会产生大量**临时字符串垃圾对象**，造成内存浪费、GC 压力。

- **引用类型**：存储在堆上，但 `==` 比较的是**内容**而非引用地址
- **空字符串**：`""` / `string.Empty`（有对象，长度为0）
- **null**：无对象，调用方法会报空引用异常
- **字符串池**：相同内容的字符串可能复用内存，优化性能

#### 常用字段/属性

| 名称              | 说明                         |
| ----------------- | ---------------------------- |
| `Length`          | 获取字符串字符数量           |
| `string.Empty`    | 空字符串常量（推荐使用）     |
| `this[int index]` | 通过索引访问单个字符（只读） |

#### 常用方法

| 方法                                   | 说明                     |
| -------------------------------------- | ------------------------ |
| `Equals()` / `==`                      | 比较字符串内容是否相等   |
| `CompareTo()`                          | 比较字符串大小（字典序） |
| `ToUpper()` / `ToLower()`              | 转大写/小写              |
| `Contains(string)`                     | 判断是否包含指定子串     |
| `StartsWith()` / `EndsWith()`          | 判断开头/结尾            |
| `IndexOf()` / `LastIndexOf()`          | 查找子串索引             |
| `Substring(int start, int length)`     | 截取子串                 |
| `Replace(oldStr, newStr)`              | 替换字符串               |
| `Split(params char[])`                 | 按分隔符拆分字符串       |
| `Trim()` / `TrimStart()` / `TrimEnd()` | 去除空白字符             |
| `string.Join(separator, array)`        | 拼接数组为字符串         |
| `string.Concat()`                      | 高效拼接多个字符串       |

#### 声明与初始化

```csharp
// 基础声明
string str1 = "Hello Unity";
string str2 = string.Empty; // 空字符串
string str3 = null; // 空引用
// 字符访问
char first = str1[0]; // 'H'
```

#### 示例代码

```csharp
string text = "  Hello C#  ";

// 常用操作
int len = text.Length; // 10
string upper = text.ToUpper(); // "  HELLO C#  "
string trim = text.Trim(); // "Hello C#"
bool has = text.Contains("C#"); // true

// 截取
string sub = text.Substring(2, 5); // "Hello"

// 替换
string replace = text.Replace("C#", "Unity"); // "  Hello Unity  "

// 拆分
string str = "a,b,c";
string[] arr = str.Split(','); // ["a","b","c"]

// 拼接
string join = string.Join("-", arr); // "a-b-c"
```

#### 注意事项

- **不可变**：字符串无法直接修改，修改=创建新对象
- **`null` 与 `""` 区别**：`""` 是有效对象可调用方法；`null` 会报错
- **`==` 与 `Equals`**：都比较内容，效果一致
- **拼接优化**：大量拼接优先用 `StringBuilder`，避免频繁创建字符串
- **转义字符**：`\n` 换行、`\t` 制表符、`\\` 表示\
- **逐字字符串**：`@"C:\Unity\Project"` 不转义，直接书写

### StringBuilder

#### 核心定义

- **StringBuilder**：C# 中用于**高效字符串操作**的可变字符序列，属于 `System.Text` 命名空间
- 核心特性：**可变类型**，拼接/修改时不会创建新对象，大幅提升大量字符串操作性能

#### 核心特性

- **可变性**：直接修改原有字符序列，不产生临时字符串对象
- **性能优势**：循环/高频拼接时，性能远优于 string 拼接
- **需手动转换**：最终结果需调用 `ToString()` 转为 string 类型
- **容量自动扩展**：字符超出初始容量时，自动扩容不报错

#### 常用字段/属性

| 名称              | 说明                      |
| ----------------- | ------------------------- |
| `Length`          | 获取当前字符序列长度      |
| `Capacity`        | 获取/设置分配的内存容量   |
| `this[int index]` | 通过索引修改/访问单个字符 |

#### 常用方法

| 方法                            | 说明                     |
| ------------------------------- | ------------------------ |
| `Append(object)`                | 追加内容到末尾（最常用） |
| `AppendLine()`                  | 追加内容并换行           |
| `Insert(int index, string)`     | 指定索引位置插入内容     |
| `Remove(int start, int length)` | 移除指定范围字符         |
| `Replace(oldChar, newChar)`     | 替换字符                 |
| `ToString()`                    | 转换为 string 类型       |
| `Clear()`                       | 清空所有字符             |

#### 声明与初始化

```csharp
// 必须引入命名空间
using System.Text;

// 基础声明
StringBuilder sb = new StringBuilder(); // 无初始值
StringBuilder sb2 = new StringBuilder("Hello"); // 带初始字符串
StringBuilder sb3 = new StringBuilder(50); // 指定初始容量
```

#### 字符串拼接

TODO：

#### 示例代码

```csharp
// 创建对象
StringBuilder sb = new StringBuilder();

// 追加内容
sb.Append("Hello");
sb.Append(" ");
sb.Append("Unity");
sb.AppendLine("！"); // 追加并换行
sb.Append("学习C#");

// 插入/删除/替换
sb.Insert(0, "提示："); // 开头插入
sb.Remove(0, 3); // 移除前3个字符
sb.Replace("Unity", "C#"); // 替换内容

// 最终转为字符串
string result = sb.ToString();
```

#### 注意事项

- **使用场景**：**循环拼接、大量字符串操作**必须用 StringBuilder
- **命名空间**：使用前需添加 `using System.Text;`
- **与 string 区别**：StringBuilder 可变，string 不可变
- **清空方式**：`sb.Clear()` 或 `sb.Length = 0`
- **不支持字符串池**：每次创建都是独立对象，不享受字符串池优化

### 枚举 `enum`

#### 核心定义

- **枚举（`enum`）**：一组**命名常量的集合**，用于表示固定的状态、类型、选项
- 本质是**值类型**，继承自 `System.Enum`，默认底层类型为 `int`
- 作用：提高代码可读性，避免使用魔法数字（硬编码数字）

#### 核心特性

- 是**值类型**，存储在栈上
- 成员默认从 `0` 开始自动递增赋值
- 可指定底层类型：`sbyte / byte / short / ushort / int / uint / long / ulong`
- 可与整数**互相转换**
- 支持 `Flags` 特性：表示位标记（组合多选）

#### 声明语法

```csharp
访问修饰符 enum 枚举名
{
    常量1,
    常量2,
    常量3 = 10, // 手动赋值
}
```

#### 常用方法

| 方法               | 说明                           |
| ------------------ | ------------------------------ |
| `Enum.Parse()`     | 字符串转枚举                   |
| `Enum.TryParse()`  | 安全转换，不抛异常（推荐）     |
| `Enum.GetNames()`  | 获取所有成员名称               |
| `Enum.GetValues()` | 获取所有成员值                 |
| `enum.HasFlag()`   | 判断是否包含标记（Flags 专用） |

#### 示例代码

```csharp
// 1. 基础枚举
public enum PlayerState
{
    Idle,    // 0
    Walk,    // 1
    Run,     // 2
    Jump = 5 // 手动赋值
}

// 2. 位标记枚举（可组合）
[Flags]
public enum AttackType
{
    None = 0,
    Fire = 1,
    Ice = 2,
    Thunder = 4,
    Poison = 8
}

// 使用
PlayerState state = PlayerState.Run;
int value = (int)state; // 2

// 组合标记
AttackType attack = AttackType.Fire | AttackType.Ice;
bool hasIce = attack.HasFlag(AttackType.Ice); // true
```

#### 枚举转换

```csharp
// 字符串 → 枚举
PlayerState s = (PlayerState)Enum.Parse(typeof(PlayerState), "Run");

// 安全转换（推荐）
if (Enum.TryParse("Jump", out PlayerState result))
{
    // 转换成功
}

// 整数 → 枚举
PlayerState state2 = (PlayerState)5; // Jump
```

#### 注意事项

- 枚举是**值类型**，不会为 `null`，可使用 `枚举?` 表示可空
- 默认从 `0` 开始，建议始终定义一个 `None = 0`
- `[Flags]` 枚举的值必须是 **2的幂（1、2、4、8…）**
- 枚举不能定义方法、字段（需用扩展方法/静态类辅助）
- 非法整数也能强转成枚举，不会报错，需用 `Enum.IsDefined` 判断合法性

### 结构体 `struct`

#### 核心定义

- **结构体（`struct`）**：值类型的数据结构，用于封装小型相关变量组
- 本质是**值类型**，继承自 `System.ValueType`
- 适合存储轻量级数据（坐标、颜色、尺寸等）

#### 核心特性

- **值类型**：赋值时复制整个数据，修改副本不影响原数据
- 存储在**栈**（局部变量）或**堆**（作为引用类型成员）
- 可包含**字段、属性、方法、构造函数、索引器**
- 不能定义**无参构造函数**
- 不能继承其他结构体/类，但可以实现接口
- 不支持析构函数

#### 与类的区别

| 特性     | `struct` 结构体      | `class` 类     |
| -------- | -------------------- | -------------- |
| 类型     | **值类型**           | **引用类型**   |
| 继承     | 不可继承，可实现接口 | 可继承         |
| 构造函数 | 不能有无参构造       | 可以有无参构造 |
| 内存     | 栈/嵌入堆            | 堆             |
| 性能     | 轻量，访问快         | 相对开销大     |
| Null     | 默认不可空           | 默认为 null    |

#### 声明语法

```csharp
访问修饰符 struct 结构体名
{
    // 字段
    // 属性
    // 方法
    // 构造函数
}
```

#### 示例代码

```csharp
// 定义结构体
public struct Vector2
{
    public float x;
    public float y;

    // 有参构造函数
    public Vector2(float x, float y)
    {
        this.x = x;
        this.y = y;
    }

    // 结构体方法
    public float Magnitude()
    {
        return (float)Math.Sqrt(x * x + y * y);
    }
}

// 使用
Vector2 v1 = new Vector2(3, 4);
Vector2 v2 = v1; // 复制整个结构体
v2.x = 10;       // 不影响 v1

float length = v1.Magnitude(); // 5
```

#### 常用场景

- 数学向量：`Vector2`、`Vector3`、`Quaternion`
- 颜色：`Color`
- 矩形、尺寸：`Rect`、`Size`
- 轻量级数据对象，无需继承、无需多态

#### 注意事项

- 结构体是**值类型**，大量传递会产生复制开销
- 不适合存储大量数据或复杂对象
- 可使用 `ref` 关键字避免复制（`ref struct`、`in` 参数）
- 默认值：所有字段为 0 / false / null
- 可空结构体：`Vector2?`（可表示 null）
- Unity 大量内置类型都是结构体（`Vector3`、`Color`、`Quaternion`）

### 浅拷贝 / 深拷贝与实现方式

#### 核心定义

- **浅拷贝（影子拷贝）**：只复制对象本身，**不复制引用类型成员**，只复制引用地址。
- **深拷贝（完全拷贝）**：复制对象本身，**同时复制所有引用类型成员**，创建独立副本。
- **值类型**：默认都是浅拷贝（直接复制值）。
- **引用类型**：浅拷贝共享引用，深拷贝完全独立。

#### 核心区别

| 特性     | 浅拷贝                         | 深拷贝                     |
| -------- | ------------------------------ | -------------------------- |
| 复制范围 | 仅复制顶层对象                 | 复制对象及所有嵌套引用对象 |
| 引用成员 | 共享同一个对象                 | 完全独立，互不影响         |
| 修改影响 | 修改拷贝的引用成员会影响原对象 | 修改拷贝不影响原对象       |
| 性能     | 快                             | 慢（层级越深越明显）       |

#### 实现方式

##### 浅拷贝实现

1. **`MemberwiseClone()`**：C# 内置浅拷贝方法（`protected` 方法）
2. 直接赋值、结构体赋值

##### 深拷贝实现

1. **手动赋值**：逐个给引用成员创建新对象
2. **序列化反序列化**（最通用）：二进制/Json/XML 序列化后还原
3. **递归拷贝**：递归复制所有引用成员

#### 示例代码

```csharp
using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

// 引用类型成员
public class Skill
{
    public string Name;
}

// 主对象
public class Player
{
    public int Level;          // 值类型
    public Skill Skill;        // 引用类型

    // 浅拷贝
    public Player ShallowCopy()
    {
        return (Player)this.MemberwiseClone();
    }

    // 深拷贝（手动实现）
    public Player DeepCopy()
    {
        Player copy = (Player)this.MemberwiseClone();
        copy.Skill = new Skill();
        copy.Skill.Name = this.Skill.Name;
        return copy;
    }

    // 深拷贝（序列化实现，通用）
    public Player DeepClone()
    {
        if (!this.GetType().IsSerializable)
            throw new Exception("必须标记 [Serializable]");

        BinaryFormatter formatter = new BinaryFormatter();
        MemoryStream stream = new MemoryStream();
        formatter.Serialize(stream, this);
        stream.Seek(0, SeekOrigin.Begin);
        return (Player)formatter.Deserialize(stream);
    }
}
```

#### 测试代码

```csharp
// 原对象
Player p1 = new Player();
p1.Level = 10;
p1.Skill = new Skill { Name = "Fireball" };

// 浅拷贝
Player p2 = p1.ShallowCopy();
p2.Skill.Name = "Iceball"; // 修改会影响 p1

// 深拷贝
Player p3 = p1.DeepCopy();
p3.Skill.Name = "Thunder"; // 不影响 p1
```

#### 注意事项

- **结构体默认浅拷贝**，赋值即复制全部值类型字段。
- **浅拷贝危险点**：引用类型成员共用，容易误改原数据。
- **深拷贝适用场景**：需要完全独立、互不影响的副本。
- **序列化深拷贝**：最简单通用，但需要给类加 `[Serializable]`。
- Unity 开发中：大量深拷贝会影响性能，谨慎使用。

### 扩展方法

#### 核心定义

- **扩展方法**：在**不修改、不继承、不重构**原有类的前提下，为该类**动态添加新方法**的语法特性
- 本质是**静态方法**，通过语法糖让调用形式等同于实例方法
- 作用：为无法修改源码的系统类、第三方类、自定义类扩展功能，实现无侵入增强

#### 声明语法

```csharp
// 必须在 静态类 中
public static class 扩展类名
{
    // 扩展方法：静态方法 + this关键字修饰第一个参数
    public static 返回值 方法名(this 目标类型 参数名, 其他参数)
    {
        // 方法逻辑
    }
}
```

#### 核心特性

1. **无侵入性**：不修改原类代码，不破坏封装
2. **静态实现，实例调用**：声明是静态方法，调用时像实例方法一样使用
3. **优先级低**：同名实例方法优先于扩展方法执行
4. **支持所有类型**：可给**类、结构体、接口、委托、枚举**扩展
5. **支持链式调用**：返回自身可实现连续调用
6. **静态类承载**：必须定义在**非泛型静态类**中

#### 声明与调用示例

```csharp
// 1. 定义静态类存放扩展方法
public static class StringExtensions
{
    // 2. 为 string 扩展方法：判断是否为空或空白
    public static bool IsNullOrEmpty(this string str)
    {
        return string.IsNullOrWhiteSpace(str);
    }
}

// 3. 调用（像实例方法一样使用）
string text = "";
bool result = text.IsNullOrEmpty();
```

#### 带参数的扩展方法

```csharp
public static class IntExtensions
{
    // 为 int 扩展：数字翻倍
    public static int Double(this int num)
    {
        return num * 2;
    }

    // 带参数扩展
    public static int Add(this int num, int value)
    {
        return num + value;
    }
}

// 调用
int a = 5;
int b = a.Double(); // 10
int c = a.Add(3);   // 8
```

#### 链式调用扩展

```csharp
public static class ListExtensions
{
    // 扩展方法返回自身，支持链式调用
    public static List<T> AddAndReturn<T>(this List<T> list, T item)
    {
        list.Add(item);
        return list;
    }
}

// 链式调用
var list = new List<int>();
list.AddAndReturn(1).AddAndReturn(2).AddAndReturn(3);
```

#### 为接口扩展方法

- 所有实现该接口的类都能使用扩展方法，实现通用功能

```csharp
public static class IEnumerableExtensions
{
    public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
    {
        foreach (var item in source) action(item);
    }
}

// 数组、List、集合均可使用
int[] arr = {1,2,3};
arr.ForEach(x => Console.WriteLine(x));
```

#### 为值类型扩展

```csharp
public static bool IsEven(this int num)
{
    return num % 2 == 0;
}

bool check = 6.IsEven(); // true
```

#### 调用规则

1. **实例优先**：原类有同名方法，**优先执行实例方法**，不执行扩展
2. **命名空间必须引用**：必须引用扩展方法所在的命名空间才能使用
3. **可空类型安全**：调用者为`null`时，扩展方法**仍可执行**（不会触发空异常）
4. **静态调用**：可像静态方法一样调用（不推荐）

#### 与普通静态方法对比

- 普通方法：`StringHelper.IsNullOrEmpty(str)`
- 扩展方法：`str.IsNullOrEmpty()`
- 优势：代码更简洁、更符合面向对象习惯、可读性更高

#### 注意事项

1. **必须在静态类中**：扩展方法的载体必须是静态类
2. **第一个参数必须带 this**：指定要扩展的目标类型
3. **不能访问私有成员**：仅能访问目标类型的公开成员
4. **避免滥用**：不要大量定义同名扩展，防止调用混乱
5. **null 调用不报错**：调用者为null时扩展方法依然执行，需手动判空
6. **不可重写**：扩展方法无法实现方法重写，优先级低于实例

#### 使用场景

1. **系统类型增强**：为`string`、`int`、`DateTime`、`IEnumerable`添加通用方法
2. **第三方库扩展**：为无法修改源码的外部组件添加功能
3. **通用工具封装**：判空、转换、验证、格式化等通用逻辑
4. **LINQ 基础**：LINQ 方法全部是基于`IEnumerable<T>`的扩展方法
5. **框架无侵入增强**：不修改业务代码，增强框架功能

## 文件操作

### Unity 核心路径

#### `Application.dataPath`（只读）

- 指向项目的 `Assets` 文件夹
- **编辑器有效**，打包后**只读不能写**
- 用途：读取预制件、配置表、编辑器工具

#### `Application.streamingAssetsPath`（只读，打包保留）

- 文件夹：`Assets/StreamingAssets`（自己建）
- 打包后**不会被压缩**，原文件保留
- **Android 只能用 WWW/UnityWebRequest 读取**
- 用途：内置配置表、视频、模型、大文件

#### `Application.persistentDataPath`（**唯一可写路径**）

- 游戏运行时**唯一安全可写入**的路径
- 各平台自动分配，系统不会随意删除
- **所有存档、截图、下载文件必须放这里**

## C# 文件操作核心库

### `System.IO`（原生文件操作，最常用）

文件/文件夹创建、删除、复制、移动、读写文本、字节。

### `UnityWebRequest`（Unity 推荐，跨平台安全）

专门用于读取 StreamingAssets、网络文件、安卓/iOS 特殊路径。

## 最常用文件操作

### 写入文本文件（存档必备）

```csharp
public void SaveText(string content)
{
    // 唯一可写路径
    string path = Path.Combine(Application.persistentDataPath, "save.txt");

    // 写入（覆盖）
    File.WriteAllText(path, content);

    Debug.Log("保存成功：" + path);
}
```

### 读取文本文件

```csharp
public string LoadText()
{
    string path = Path.Combine(Application.persistentDataPath, "save.txt");

    if (File.Exists(path))
    {
        string content = File.ReadAllText(path);
        return content;
    }
    else
    {
        Debug.Log("文件不存在");
        return null;
    }
}
```

### 读取 StreamingAssets 文件

安卓必须用 `UnityWebRequest`，不能直接用 `File.ReadAllText`

```csharp
IEnumerator ReadStreamingAssets()
{
    string path = Path.Combine(Application.streamingAssetsPath, "config.json");

    UnityWebRequest www = UnityWebRequest.Get(path);
    yield return www.SendWebRequest();

    if (www.result == UnityWebRequest.Result.Success)
    {
        Debug.Log("内容：" + www.downloadHandler.text);
    }
    else
    {
        Debug.Log("读取失败：" + www.error);
    }
}
```

### 写入/读取二进制文件（图片、存档、数据）

```csharp
// 写入字节
public void SaveBytes(byte[] data)
{
    string path = Path.Combine(Application.persistentDataPath, "data.bin");
    File.WriteAllBytes(path, data);
}

// 读取字节
public byte[] LoadBytes()
{
    string path = Path.Combine(Application.persistentDataPath, "data.bin");
    if (File.Exists(path))
        return File.ReadAllBytes(path);
    return null;
}
```

### 创建/删除/检查文件夹

```csharp
// 创建文件夹
string dir = Path.Combine(Application.persistentDataPath, "MyFolder");
Directory.CreateDirectory(dir);

// 判断是否存在
if (Directory.Exists(dir)) { }

// 删除文件夹
Directory.Delete(dir, true);
```

### 文件复制、移动、删除

```csharp
File.Copy(源路径, 目标路径);
File.Move(源路径, 目标路径);
File.Delete(路径);
```

### 获取文件列表

```csharp
// 获取文件夹下所有文件
string[] files = Directory.GetFiles(dir);

// 带过滤
string[] jsons = Directory.GetFiles(dir, "*.json");
```

### 文件信息（大小、修改时间）

```csharp
FileInfo info = new FileInfo(path);
long size = info.Length;         // 大小
DateTime time = info.LastWriteTime; // 修改时间
```

## Path 类 —— 路径工具

不要手动拼接路径

```csharp
// 正确
Path.Combine(Application.persistentDataPath, "save", "a.txt");

// 错误（会出现平台不兼容）
Application.persistentDataPath + "/save/a.txt"
```

常用：

- `Path.Combine()` 拼接路径
- `Path.GetFileName()` 文件名
- `Path.GetExtension()` 后缀（.json/.txt）
- `Path.GetDirectoryName()` 文件夹
- `Path.GetFileNameWithoutExtension()` 无后缀文件名

## 跨平台注意事项

### Windows

路径简单，随便读写 `persistentDataPath`

### Android

- StreamingAssets **不能用 System.IO** 读取
- 必须用 **`UnityWebRequest`**
- 只能写 `persistentDataPath`

### iOS

- 只能写 `persistentDataPath`
- 路径不可随意自定义
- 苹果会自动备份，大文件需标记不备份

### WebGL

- 只能用 **`PlayerPrefs`** 或 **`IndexedDB`**
- **不支持 System.IO**
- 无法创建本地文件
