---
title: "03-2Csharp3.0下"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/03-2Csharp3.0下.html
tags: [编程语言]
---

# C# 3.0

[toc]

## 对象与集合初始化器
### 对象初始化器
#### 核心定义
- **对象初始化器**：C# 中在`new`对象时，通过`{}`语法**直接为属性或字段赋值**的语法糖，可在一行内完成对象创建与初始化，无需调用多个构造函数
- 本质：编译时语法，最终仍会调用构造函数，再对属性逐一赋值，不改变运行时逻辑

#### 核心特性
| 特性 | 说明 |
|------|------|
| 简化赋值 | 无需编写多个重载构造函数即可灵活赋值 |
| 可读性强 | 属性名与值一一对应，代码直观 |
| 支持任意属性 | 可只赋值需要的成员，不必全量赋值 |
| 可嵌套使用 | 支持内部对象、集合、匿名类型嵌套 |

#### 基础语法
```csharp
类名 对象名 = new 类名
{
    属性1 = 值1,
    属性2 = 值2,
    属性3 = 值3
};
```

#### 代码示例
```csharp
class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}

// 使用对象初始化器
var student = new Student
{
    Id = 1001,
    Name = "小李",
    Age = 20
};
```

#### 赋值规则
- 赋值顺序不影响结果，编译器按属性逐一赋值
- 可只给部分属性赋值
- 必须使用可访问的属性或字段（public 或同访问级别）
- 初始化器执行在**构造函数之后**

#### 与构造函数配合使用
- 先执行构造函数，再执行初始化器赋值
- 可搭配无参构造函数使用，实现灵活初始化
```csharp
var stu = new Student { Name = "小张" };
```

#### 嵌套对象初始化
```csharp
var order = new Order
{
    OrderId = 1,
    Customer = new Customer
    {
        Name = "小明",
        Phone = "123456"
    }
};
```

#### 与匿名类型的关系
- 匿名类型**只能通过对象初始化器创建**
- 匿名类型初始化器同时定义属性结构并赋值
```csharp
var obj = new { Name = "test", Value = 123 };
```

#### 适用场景
- 快速创建并初始化对象
- DTO、模型、数据载体对象赋值
- 配合 LINQ 投影、匿名类型使用
- 避免编写大量重载构造函数

#### 约束限制
- 不能为只读属性（只有`get`）赋值（init 除外）
- 不能赋值私有成员
- 初始化逻辑不能包含复杂语句，只能简单赋值
- 执行顺序固定：构造函数先于初始化器

### 集合初始化器
#### 核心定义
- **集合初始化器**：C# 提供的简化语法，允许在创建**集合对象**时，通过 `{ }` 语法**直接批量添加元素**，无需手动调用 `Add` 方法
- 本质：**编译时语法糖**，编译器自动将元素转换为对应的 `Add` 方法调用，不改变运行时逻辑

#### 核心特性
| 特性 | 说明 |
|------|------|
| 简化代码 | 一行代码完成集合创建 + 元素添加 |
| 自动调用 Add | 编译器隐式生成 `Add()` 方法调用 |
| 支持多种集合 | 实现了 `IEnumerable` 且拥有 `Add` 方法的类型 |
| 嵌套支持 | 可嵌套对象初始化器、集合初始化器 |
| 语法简洁 | 直观展示集合内容，可读性高 |

#### 基础语法
```csharp
// 标准集合初始化器
List<int> 列表名 = new List<int> { 元素1, 元素2, 元素3 };

// 字典集合初始化器（键值对）
Dictionary<TKey, TValue> 字典名 = new Dictionary<TKey, TValue>
{
    { 键1, 值1 },
    { 键2, 值2 }
};
```

#### 完整代码示例
```csharp
void CollectionInitializerDemo()
{
    // 1. List 初始化器
    var numbers = new List<int> { 1, 2, 3, 4, 5 };

    // 2. 数组本质也是集合初始化
    int[] arr = { 1, 2, 3 };

    // 3. 字典初始化器（特殊格式）
    var dict = new Dictionary<int, string>
    {
        { 1, "张三" },
        { 2, "李四" }
    };

    // 4. 混合对象初始化器（嵌套使用）
    var students = new List<Student>
    {
        new Student { Id = 1, Name = "小明" },
        new Student { Id = 2, Name = "小红" }
    };
}

class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

#### 编译等效逻辑
```csharp
// 初始化器语法
var list = new List<int> { 10, 20 };

// 编译器实际生成的代码
var list = new List<int>();
list.Add(10);
list.Add(20);
```

#### 核心规则
- 集合必须实现 `IEnumerable` 接口
- 集合必须包含**可访问的 `Add` 方法**（实例/扩展方法均可）
- 元素数量、类型无限制，只需匹配 `Add` 方法参数
- 字典初始化器使用 `{ key, value }` 格式映射到 `Add(key, value)`
- 可与对象初始化器**混合嵌套**使用

#### 空集合初始化
```csharp
// 空集合（合法）
var emptyList = new List<int> { };
```

#### 与对象初始化器区别
- **对象初始化器**：为**单个对象的属性/字段**赋值
- **集合初始化器**：为**集合添加多个元素**
- 可同时使用：`new List<Student>() { new Student { Name = "test" } }`

#### 适用场景
- 静态数据、配置项、测试数据批量初始化
- 简化集合创建与元素添加代码
- 配合 LINQ、DTO、数据模型使用
- 字典、列表、哈希集等常用集合初始化

#### 约束限制
- 仅适用于实现 `IEnumerable` 且有 `Add` 方法的类型
- 无 `Add` 方法的集合无法使用
- 元素类型必须与集合泛型类型匹配
- 编译期展开，无运行时性能损耗

### 索引初始化器
#### 核心定义
- **索引初始化器**：C# 6.0 及以上版本为**字典/索引器对象**提供的简化初始化语法，使用**`[键] = 值`**的形式直接赋值，替代传统字典初始化的`{ key, value }`格式，更直观、更接近字典读写习惯
- 本质：编译时语法糖，编译器自动转换为**索引器赋值**，而非调用`Add`方法
- 核心作用：简化字典、自定义索引器对象的初始化，语法更符合直觉

#### 核心特性
| 特性 | 说明 |
|------|------|
| 直观赋值 | 使用`[键] = 值`格式，与字典取值/赋值语法一致 |
| 索引器映射 | 直接对应类型的**索引器**（`this[索引]`）赋值 |
| C# 6.0+ | 仅支持 C# 6.0 及以上版本 |
| 兼容字典 | 完美支持`Dictionary`、`SortedDictionary`等键值对集合 |
| 支持自定义 | 只要实现索引器的类型都可使用 |

#### 基础语法
```csharp
// 索引初始化器标准语法
var 字典名 = new 字典类型
{
    [键1] = 值1,
    [键2] = 值2,
    [键3] = 值3
};
```

#### 完整代码示例
```csharp
void IndexInitializerDemo()
{
    // 传统字典初始化器（C# 6.0 之前）
    var oldDict = new Dictionary<int, string>
    {
        { 1, "苹果" },
        { 2, "香蕉" }
    };

    // 索引初始化器（C# 6.0+ 推荐写法）
    var newDict = new Dictionary<int, string>
    {
        [1] = "苹果",
        [2] = "香蕉",
        [3] = "橙子"
    };

    // 取值语法与初始化语法完全一致
    string value = newDict[1];
}
```

#### 与传统字典初始化器对比
- **传统初始化**：`{ key, value }` → 编译为`Add(key, value)`
- **索引初始化**：`[key] = value` → 编译为`dict[key] = value`
- **行为差异**：索引初始化重复键会**覆盖值**，传统初始化重复键会**报错**

#### 适用类型
- 标准字典：`Dictionary<TKey, TValue>`
- 排序字典：`SortedDictionary<TKey, TValue>`
- 自定义**实现索引器**的类（`public 类型 this[键类型] { get; set; }`）
- 任意带索引器的对象

#### 自定义索引器类型示例
```csharp
// 自定义带索引器的类
class CustomIndexer
{
    public string this[int index]
    {
        get => index.ToString();
        set { /* 赋值逻辑 */ }
    }
}

// 使用索引初始化器
var obj = new CustomIndexer
{
    [10] = "测试",
    [20] = "数据"
};
```

#### 核心规则
- 初始化时直接使用**索引器赋值**，而非调用`Add`方法
- 重复使用同一个键，**后赋值覆盖先赋值**，不会抛出重复键异常
- 键的类型必须严格匹配索引器的键类型
- 可与对象初始化器混合使用

#### 适用场景
- 字典/哈希表数据的清晰初始化
- 自定义索引器对象快速赋值
- 需要**覆盖重复键**而非抛出异常的场景
- 提升集合初始化代码的可读性与一致性

#### 约束限制
- 仅支持**带有索引器**的类型
- 必须 C# 6.0 及以上版本才能使用
- 无索引器的普通集合（List）无法使用
- 初始化逻辑为赋值，而非添加元素

### 嵌套对象初始化
#### 核心定义
- **嵌套对象初始化**：在C#的对象初始化器中，**直接为内部成员对象（子对象）的属性赋值**，无需单独创建子对象实例，实现多层级对象的一次性初始化
- 核心作用：简化多层对象结构的赋值代码，无需分步创建子对象，代码更紧凑、可读性更强
- 本质：编译时语法糖，自动完成内部对象的实例化与属性赋值

#### 核心特性
| 特性 | 说明 |
|------|------|
| 层级嵌套 | 支持多层级对象嵌套赋值（父→子→孙） |
| 自动实例化 | 编译器自动创建内部成员对象，无需手动new |
| 语法统一 | 全程使用`{}`初始化器，风格一致 |
| 无性能损耗 | 编译后与手动分步赋值逻辑完全相同 |
| 混合支持 | 可与集合、索引初始化器混用 |

#### 基础语法
```csharp
var 父对象 = new 父类
{
    父属性 = 值,
    子对象 = new 子类
    {
        子属性 = 值,
        孙对象 = new 孙类
        {
            孙属性 = 值
        }
    }
};
```

#### 完整代码示例
```csharp
// 嵌套类定义
class Address
{
    public string City { get; set; }
    public string Street { get; set; }
}

class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    // 嵌套对象
    public Address Address { get; set; }
}

// 嵌套对象初始化（一次性完成）
var user = new User
{
    Id = 1,
    Name = "小明",
    // 嵌套初始化子对象
    Address = new Address
    {
        City = "上海",
        Street = "南京路123号"
    }
};
```

#### 赋值执行规则
- 从外层对象开始，**由外到内**依次初始化
- 先执行内部对象的构造函数，再赋值其属性
- 必须保证**内部成员属性可写**（支持`set`）
- 未赋值的属性保留默认值，不影响整体初始化

#### 多层深度嵌套
```csharp
// 三层嵌套初始化
var order = new Order
{
    OrderId = 1001,
    // 第一层嵌套
    Customer = new Customer
    {
        Name = "小红",
        // 第二层嵌套
        Contact = new Contact
        {
            Phone = "13800138000"
        }
    }
};
```

#### 与匿名类型嵌套
- 匿名类型**天然支持嵌套初始化**，无需定义子类
- 嵌套匿名对象是LINQ投影的常用写法
```csharp
var student = new
{
    Name = "小刚",
    // 嵌套匿名对象
    Score = new
    {
        Math = 95,
        English = 90
    }
};
```

#### 嵌套+集合混合初始化
- 可在对象初始化器中嵌套**集合/字典初始化**
```csharp
var classInfo = new ClassInfo
{
    ClassName = "高三1班",
    // 嵌套集合初始化
    Students = new List<Student>
    {
        new Student { Id = 1 },
        new Student { Id = 2 }
    }
};
```

#### 与手动分步赋值对比
```csharp
// 传统分步赋值（冗余繁琐）
var user = new User();
user.Id = 1;
user.Address = new Address();
user.Address.City = "北京";

// 嵌套初始化（简洁优雅）
var user = new User { Id = 1, Address = new Address { City = "北京" } };
```

#### 约束限制
- 内部对象必须支持**实例化**（不能是抽象类、静态类）
- 嵌套属性必须具备`set`访问器（只读属性无法赋值）
- 不能为`null`的对象必须正确初始化，避免空引用
- 嵌套层级不宜过深，防止代码可读性下降

#### 适用场景
- DTO、数据模型、实体类的多层级赋值
- API接口返回的复杂嵌套对象构造
- LINQ查询投影多层级匿名类型
- 测试数据、配置对象快速初始化

## Lambda表达式
### 匿名函数简化写法
#### 核心定义
- **Lambda表达式**：C# 中用于**简化匿名函数**的轻量级语法，无需指定委托类型、无需编写`delegate`关键字，以**参数=>表达式/语句块**的形式快速定义内联方法
- 核心作用：大幅简化委托、事件、LINQ查询的代码书写，是匿名函数的现代化简化方案
- 本质：**编译器语法糖**，自动推断参数类型、返回值，兼容所有委托类型

#### 核心特性
| 特性 | 说明 |
|------|------|
| 极简语法 | 省略 delegate、访问修饰符、返回值、参数类型 |
| 类型推断 | 自动推断参数类型、返回值类型，无需显式声明 |
| 内联使用 | 可直接作为方法参数，无需单独定义方法 |
| 闭包支持 | 可捕获外部作用域变量，保持上下文状态 |
| 两种格式 | 表达式Lambda、语句Lambda，按需使用 |

#### 基础语法
```csharp
// 表达式Lambda（单行，自动返回值）
(参数列表) => 表达式

// 语句Lambda（多行，需大括号+return）
(参数列表) => { 语句块; return 值; }
```

#### 完整代码示例
```csharp
void LambdaDemo()
{
    // 1. 无参数 Lambda
    Action sayHello = () => Console.WriteLine("Hello");

    // 2. 单参数（可省略小括号）
    Func<int, int> square = x => x * x;

    // 3. 多参数
    Func<int, int, int> add = (a, b) => a + b;

    // 4. 多行语句 Lambda
    Func<int, string> format = n =>
    {
        var str = "数值：" + n;
        return str;
    };
}
```

#### 简化演进对比
```csharp
// 1. 原始匿名方法（繁琐）
Func<int, int> old = delegate(int x) { return x + 1; };

// 2. Lambda 简化写法（极简）
Func<int, int> simple = x => x + 1;
```

#### 参数简化规则
- 无参数：必须写`()`
- 单参数：**可省略`()`**，直接写参数名
- 多参数：必须用`()`包裹，逗号分隔
- 参数类型：**可自动推断**，无需显式声明
- 可显式指定类型：`(int x) => x*2`

#### 表达式Lambda（最常用）
- 单行代码，**无需大括号、无需return**
- 表达式结果自动作为返回值
- 适合简单计算、取值、快速逻辑
```csharp
var list = new List<int> { 1,2,3 };
var even = list.Where(n => n % 2 == 0);
```

#### 语句Lambda
- 多行逻辑必须用`{ }`包裹
- 需要`return`显式返回值
- 适合复杂处理、多步操作
```csharp
Func<int, bool> check = n =>
{
    var flag = n > 0;
    return flag;
};
```

#### 核心使用场景
- LINQ 查询：`Where/Select/OrderBy` 条件
- 委托赋值、事件注册
- 异步任务、回调函数
- 临时内联方法，避免定义冗余方法

#### 与匿名方法对比
| 写法 | 关键字 | 大括号 | return | 参数类型 |
|------|--------|--------|--------|----------|
| 匿名方法 | delegate | 必须 | 必须 | 必须 |
| Lambda | 无 | 可选 | 可选 | 自动推断 |

#### 约束限制
- 不能用于重载决议，无法指定特性
- 无法定义泛型参数（需委托支持）
- 无法访问`unsafe`上下文指针
- 闭包捕获变量会延长变量生命周期

#### 最佳实践
- 简单逻辑优先使用**表达式Lambda**
- 多行逻辑使用**语句Lambda**
- 参数名简洁见名知意（n、s、item）
- 配合LINQ实现声明式数据查询

### 表达式树Lambda
#### 核心定义
- **表达式树Lambda**：C# 中一种**可被解析为数据结构**的特殊Lambda表达式，不会直接编译为IL指令，而是被编译器转换为**内存中的表达式树对象**（`Expression<TDelegate>`）
- 核心作用：将代码作为**数据**处理，用于动态解析、翻译、生成执行逻辑（如EF Core将Lambda翻译为SQL）
- 本质：**代码即数据**，是动态操作代码逻辑的基础结构

#### 核心特性
| 特性 | 说明 |
|------|------|
| 数据结构 | 以对象树形式表示代码逻辑，可遍历/修改 |
| 非直接执行 | 不能直接调用，必须编译后才能执行 |
| 强类型 | 基于`Expression<TDelegate>`泛型类 |
| 动态解析 | 可被第三方库解析为SQL、远程调用等 |
| 仅限表达式 | 仅支持**表达式Lambda**，不支持语句块Lambda |

#### 基础语法
```csharp
// 表达式树 = 赋值表达式Lambda给Expression<TDelegate>类型
Expression<委托类型> 变量名 = Lambda表达式;
```

#### 完整代码示例
```csharp
using System.Linq.Expressions;

void ExpressionTreeDemo()
{
    // 1. 定义表达式树（Lambda会被转为数据结构）
    Expression<Func<int, int>> exp = x => x * 2;

    // 2. 编译表达式树为可执行委托
    Func<int, int> func = exp.Compile();

    // 3. 执行
    int result = func(5); // 10
}
```

#### 与普通Lambda的核心区别
- **普通Lambda**：编译为IL方法，**直接执行**，用于本地逻辑
- **表达式树Lambda**：编译为**对象数据结构**，**先解析后执行**，用于动态逻辑翻译
- 语法完全一致，**由变量类型决定**生成哪种结构

#### 适用判定规则
- 赋值给**`Func/Action`** → 普通Lambda（执行代码）
- 赋值给**`Expression<Func/Action>`** → 表达式树Lambda（代码数据）

#### 支持限制
- 仅支持**表达式Lambda**：`x => x+1`
- **不支持语句块Lambda**：`x => { return x; }`
- 不支持赋值、循环、异常处理等复杂语句
- 仅包含可被解析为节点的运算、调用、成员访问

#### 核心使用场景
- **EF Core / LINQ to SQL**：将Lambda表达式**翻译为SQL查询**
- 动态构建查询条件、动态拼接逻辑
- 动态代理、AOP、代码生成
- 序列化远程逻辑调用

#### 结构组成
- **ParameterExpression**：参数节点
- **ConstantExpression**：常量节点
- **BinaryExpression**：二元运算节点（+ - * /）
- **MemberExpression**：成员访问节点
- **MethodCallExpression**：方法调用节点

#### 编译与执行流程
1. 编写Lambda表达式
2. 编译器生成表达式树对象
3. 调用`Compile()`方法编译为委托
4. 执行委托得到结果

#### 约束限制
- 不支持多行语句、复杂逻辑
- 不能直接执行，必须编译
- 解析库（如EF）仅支持特定语法子集
- 无法使用`ref`/`out`、指针等特殊语法

### 语句Lambda
#### 核心定义
- **语句Lambda**：Lambda表达式的一种完整形态，使用**大括号`{}`**包裹**多行代码语句**，支持编写复杂逻辑、流程控制、多步执行
- 本质：支持**语句块**的匿名函数，必须显式使用`return`返回值（有返回值时）
- 与表达式Lambda对应：表达式Lambda只能写单行，语句Lambda支持多行逻辑

#### 核心特性
| 特性 | 说明 |
|------|------|
| 多行代码 | 用`{ }`包裹，可写任意多行逻辑 |
| 显式返回 | 必须写`return`关键字才能返回值 |
| 流程控制 | 支持`if/else/for/foreach/switch`等语句 |
| 变量声明 | 可在块内定义临时局部变量 |
| 无表达式树 | **不能用于表达式树**，仅能作为委托执行 |

#### 基础语法
```csharp
(参数列表) => {
    // 一行或多行代码语句
    语句1;
    语句2;
    return 返回值; // 有返回值时必须写
};
```

#### 完整代码示例
```csharp
void StatementLambdaDemo()
{
    // 语句Lambda：多行逻辑 + 临时变量 + return
    Func<int, string> check = n =>
    {
        string result;
        if (n > 0)
            result = "正数";
        else
            result = "非正数";
        
        result += "，数值：" + n;
        return result;
    };

    string output = check(10); 
    Console.WriteLine(output);
}
```

#### 与表达式Lambda对比
| 类型 | 语法 | 代码行数 | 返回值 | 支持表达式树 |
|------|------|----------|--------|--------------|
| **表达式Lambda** | `x => x*2` | 单行 | 自动返回 | ✅ 支持 |
| **语句Lambda** | `x => { ... }` | 多行 | 必须`return` | ❌ 不支持 |

#### 适用规则
- 逻辑超过**一行**时必须使用语句Lambda
- 需要**定义临时变量**时必须使用
- 需要**if/for/switch**等流程控制时必须使用
- 有返回值的委托，**必须写`return`**

#### 支持语法
- 变量声明
- 赋值操作
- 条件判断 `if/else`
- 循环 `for/foreach/while`
- 方法调用
- `return` 返回
- `try/catch` 异常处理

#### 不支持场景
- **不能用于表达式树**（`Expression<Func<>>`）
- 不能省略大括号`{}`
- 不能省略`return`（有返回值委托）

#### 典型使用场景
- 复杂逻辑的委托/回调
- 任务`Task`的执行体
- 事件处理程序
- 需要多步计算、判断、日志输出的内联方法

#### 约束限制
- 必须用大括号包裹语句
- 有返回值必须显式`return`
- 无法转换为表达式树（EF Core不支持）
- 闭包捕获外部变量规则与普通Lambda一致

### 闭包支持
#### 核心定义
- **闭包**：Lambda 表达式/匿名函数**捕获并持有外部作用域变量**的能力，让匿名函数可以访问、修改定义它的外部变量，且变量生命周期会被自动延长
- 核心作用：让匿名函数携带上下文状态，无需通过参数传递外部数据
- 本质：编译器自动生成隐藏类，将捕获的变量包装为类的字段，实现跨作用域共享

#### 核心特性
| 特性 | 说明 |
|------|------|
| 变量捕获 | 可直接访问外部方法/代码块的局部变量 |
| 变量共享 | 多个 Lambda 可共享同一个捕获变量 |
| 生命周期延长 | 变量不会随方法结束销毁，直到委托不再被引用 |
| 读写权限 | 不仅可读，**还可修改**外部变量 |
| 无缝使用 | 无需额外配置，直接使用外部变量即可 |

#### 基础语法示例
```csharp
void ClosureDemo()
{
    // 外部变量
    int outsideNum = 100;

    // Lambda 捕获外部变量（闭包）
    Func<int> lambda = () =>
    {
        // 直接访问并修改 outsideNum
        outsideNum++;
        return outsideNum;
    };

    // 调用后外部变量被改变
    lambda(); // 101
    Console.WriteLine(outsideNum); // 101
}
```

#### 变量捕获规则
- 捕获的是**变量本身**，不是变量的当前值
- 变量在外部被修改 → Lambda 内读到最新值
- Lambda 内修改 → 外部变量同步变化
- 循环中捕获变量**需注意延迟执行**陷阱

#### 循环中的闭包（经典陷阱）
```csharp
void LoopClosureDemo()
{
    var actions = new List<Action>();

    // 错误：所有 lambda 共享同一个 i
    for (int i = 0; i < 3; i++)
    {
        actions.Add(() => Console.WriteLine(i));
    }

    // 执行时全部输出 3（循环已结束）
    actions.ForEach(a => a());

    // 正确：每次循环创建独立局部变量
    for (int i = 0; i < 3; i++)
    {
        int temp = i;
        actions.Add(() => Console.WriteLine(temp));
    }
}
```

#### 闭包生命周期机制
- 外部方法执行完毕后，**被捕获的变量不会被释放**
- 只要委托/Lambda 还在被使用，变量就会一直存活
- 编译器生成隐藏辅助类存储捕获变量

#### 与普通变量区别
- 普通局部变量：方法结束立即销毁
- 闭包变量：委托生命周期结束后才销毁

#### 支持范围
- ✅ 局部变量
- ✅ 方法参数
- ✅ 循环变量（需注意独立复制）
- ✅ 类成员字段/属性

#### 典型使用场景
- 事件处理携带上下文数据
- 回调函数保存状态
- LINQ 延迟查询使用外部参数
- 临时计数、开关、缓存状态

#### 约束与注意事项
- 闭包会**轻微增加内存开销**
- 循环捕获必须使用**独立临时变量**避免意外
- 多线程下共享闭包变量需要线程安全处理
- 无法捕获 `ref`/`out` 变量、`in` 参数

## 扩展方法
### 静态类中定义
#### 核心定义
- **扩展方法必须定义在静态类中**：C# 语法规定，扩展方法是**静态方法**，其所属的类也**必须是静态类**
- 作用：为**已存在的类型（系统类、自定义类）** 动态添加新方法，无需继承、无需修改源代码
- 本质：编译器语法糖，调用时看似实例方法，实际编译为静态方法调用

#### 核心特性
| 特性 | 说明 |
|------|------|
| 必须静态类 | 容器类必须用 `static` 修饰 |
| 必须静态方法 | 扩展方法自身必须是 `static` |
| 第一个参数特殊 | 以 `this 类型` 指定要扩展的目标类型 |
| 无侵入性 | 不改动原类型代码，不破坏封装 |
| 如同实例方法 | 调用时和普通成员方法写法一致 |

#### 基础语法
```csharp
// 1. 必须是静态类
public static class 扩展类名
{
    // 2. 必须是静态方法
    // 3. 第一个参数必须加 this + 目标类型
    public static 返回类型 方法名(this 目标类型 参数, 其他参数)
    {
        // 方法逻辑
    }
}
```

#### 完整代码示例
```csharp
// 静态类 —— 扩展方法的载体
public static class StringExtensions
{
    // 为 string 类型扩展一个 ToInt() 方法
    public static int ToInt(this string str)
    {
        return int.Parse(str);
    }

    // 带参数的扩展方法
    public static bool IsLengthGreaterThan(this string str, int length)
    {
        return str.Length > length;
    }
}
```

#### 使用方式（像实例方法一样调用）
```csharp
string numStr = "123";

// 调用扩展方法，和调用原生方法一样
int number = numStr.ToInt();

bool isLong = numStr.IsLengthGreaterThan(5);
```

#### 定义规则（必须遵守）
- 扩展类必须是 **静态类（static class）**
- 扩展方法必须是 **静态方法（static method）**
- 第一个参数必须以 **this 关键字** 开头，指定扩展类型
- 静态类不能是嵌套类
- 无 `this` 当前实例引用（除了第一个参数）

#### 访问规则
- 可访问目标类型的 **public 成员**
- 不可访问 private/protected 成员
- 可使用静态类中的其他静态成员
- 支持引用命名空间后直接使用

#### 与普通静态方法的区别
- 普通静态方法：`类名.方法名(参数)`
- 扩展方法：`实例.方法名()`（语法更优雅）

#### 适用场景
- 为无法修改的系统类型（string、int、DateTime）添加方法
- 为第三方库类型扩展功能
- 统一通用工具逻辑（判空、转换、验证、格式化）
- LINQ 标准查询运算符（全部是扩展方法）

#### 约束限制
- 不能重写已存在的实例方法
- 不能访问私有成员
- 必须引用命名空间才能使用
- 无法作为扩展属性、字段，仅支持方法
- 静态类无法被实例化、继承

### this关键字修饰第一个参数
#### 核心定义
- **`this` 关键字修饰第一个参数** 是扩展方法的**核心语法标记**，用于告诉编译器：该静态方法是为**指定类型**扩展的实例方法
- 作用：将静态方法与目标类型绑定，让编译器支持**实例.方法名()** 的调用形式
- 本质：语法标记，仅用于定义扩展方法，不代表类的实例引用

#### 核心特性
| 特性 | 说明 |
|------|------|
| 必须放在第一个参数 | 扩展方法的**第一个参数**必须以 `this` 开头 |
| 指定扩展类型 | `this` 后紧跟要扩展的目标类型（如 `this string`） |
| 代表调用实例 | 该参数表示调用扩展方法的**实例对象本身** |
| 仅用于扩展方法 | 普通静态方法**禁止**使用 `this` 修饰参数 |

#### 基础语法
```csharp
// 标准扩展方法定义
public static 返回类型 方法名(this 扩展类型 实例名, 其他参数...)
{
    // 方法体中可直接使用 实例名 访问对象成员
}
```

#### 完整代码示例
```csharp
public static class IntExtensions
{
    // this int 表示：为 int 类型扩展方法
    public static bool IsEven(this int number)
    {
        // number 代表调用该方法的 int 实例
        return number % 2 == 0;
    }
}
```

#### 使用方式
```csharp
int num = 6;

// 调用时：无需传递 this 参数，编译器自动传入实例
bool result = num.IsEven();
```

#### 参数规则
- **第一个参数**：`this 类型 变量名` → 表示扩展的类型与实例
- **后续参数**：正常定义，调用时需要手动传入
- `this` 参数**不能**有默认值、`ref`、`out` 修饰
- 方法体内通过该参数访问实例的 `public` 成员

#### 带普通参数的扩展方法
```csharp
public static class StringExtensions
{
    // this string：扩展类型
    // int length：普通参数
    public static bool HasLength(this string str, int length)
    {
        return str.Length == length;
    }
}

// 调用
bool flag = "test".HasLength(4);
```

#### 关键注意点
- `this` 仅用于**定义**扩展方法，调用时**不需要传入**
- 一个方法**只能有一个** `this` 参数（必须是第一个）
- 不能为 `null` 类型、`static` 类型、枚举、指针类型扩展
- 实例为 `null` 时，扩展方法仍可调用（不会自动抛空引用）

#### 与普通 `this` 的区别
- 类内实例方法的 `this`：代表**当前对象**
- 扩展方法的 `this`：**语法标记**，用于绑定扩展类型

#### 适用场景
- 为系统类型、第三方类型、自定义类型添加实例方法
- 实现 LINQ 查询、工具类、通用逻辑封装
- 无侵入式增强现有类型功能

### 无侵入式扩展现有类型
#### 核心定义
- **无侵入式扩展**：使用扩展方法，在**不修改、不继承、不重构**原有类型源代码的前提下，为其新增实例方法调用能力
- 对原始类型完全无影响，不破坏封装、不改变原有逻辑、不重新编译源码
- 属于**外部增强**，而非内部修改

#### 核心特性
| 特性 | 说明 |
|------|------|
| 不修改源码 | 无需改动系统类、第三方库、现有实体代码 |
| 不继承类型 | 不需要创建子类，无继承层级污染 |
| 不破坏封装 | 只能访问 public 成员，不触碰私有数据 |
| 不影响原有功能 | 原有方法、属性、逻辑完全保持不变 |
| 可随时移除 | 删除扩展类即可取消扩展，无副作用 |

#### 基础语法
```csharp
// 独立静态类，与原类型完全分离
public static class 扩展类
{
    // 为目标类型添加新方法
    public static 返回类型 新方法(this 目标类型 参数)
    {
        // 增强逻辑
    }
}
```

#### 完整代码示例
```csharp
// 原有类型（系统类型，无法修改源码）
// string 类源码由微软定义，我们无权修改

// 无侵入式扩展 string
public static class StringExtensions
{
    // 新增方法，不影响 string 本身任何代码
    public static bool IsEmail(this string str)
    {
        return str.Contains("@");
    }
}
```

#### 使用方式
```csharp
string email = "test@xxx.com";

// 像内置方法一样使用
bool isValid = email.IsEmail();
```

#### 无侵入体现
- 不向原类型添加任何成员
- 不改变原类型内存结构、行为、性能
- 不影响其他调用方使用原类型
- 不产生依赖、不耦合业务代码
- 扩展方法只在**当前命名空间**生效

#### 与继承/修改源码对比
| 方式 | 侵入性 | 修改源码 | 需继承 | 适用系统类型 |
|------|--------|----------|--------|--------------|
| **扩展方法** | 无 | 否 | 否 | 可 |
| 继承子类 | 中 | 否 | 是 | 不可（sealed） |
| 直接修改源码 | 高 | 是 | 否 | 不可 |

#### 适用场景
- 扩展 **系统类型**（string、int、DateTime、List 等）
- 扩展 **第三方库** 中的类（无法修改源码）
- 为现有项目实体类添加工具方法
- 统一封装通用逻辑（判空、格式化、转换）
- LINQ 标准方法（无侵入扩展 IEnumerable）

#### 约束限制
- 只能访问原类型的 **public 成员**
- 无法重写原有实例方法
- 无法访问 private/protected 成员
- 不能添加字段、属性，仅能添加方法

### 支持扩展接口类型
#### 核心定义
- **扩展方法可以为接口扩展方法**，所有**实现了该接口的类型**，都会自动拥有这个扩展方法
- 无需修改接口定义、无需修改实现类，无侵入式为整个接口体系批量增加功能
- 这是 LINQ、EF Core、集合库的核心设计原理

#### 核心特性
| 特性 | 说明 |
|------|------|
| 接口扩展 | 直接给 `interface` 定义扩展方法 |
| 批量生效 | 所有实现该接口的类**自动获得方法** |
| 无侵入 | 不修改接口、不修改实现类 |
| 多态支持 | 不同实现类共用同一套扩展逻辑 |
| 静态实现 | 不污染接口声明，不强制子类重写 |

#### 基础语法
```csharp
// 给接口定义扩展方法
public static class 接口扩展类
{
    public static 返回类型 方法名(this 接口名 实例, 参数)
    {
        // 通用实现
    }
}
```

#### 完整代码示例
```csharp
// 1. 定义接口（无需改动）
public interface IAnimal
{
    void Sound();
}

// 2. 实现类1
public class Dog : IAnimal { public void Sound() => Console.WriteLine("汪汪"); }

// 3. 实现类2
public class Cat : IAnimal { public void Sound() => Console.WriteLine("喵喵"); }

// 4. 给 IAnimal 接口扩展方法（关键）
public static class AnimalExtensions
{
    // 扩展接口：所有实现类都会拥有
    public static void Run(this IAnimal animal)
    {
        Console.WriteLine("动物跑起来了");
    }
}
```

#### 使用方式
```csharp
IAnimal dog = new Dog();
IAnimal cat = new Cat();

// 两个类都自动拥有扩展方法 Run()
dog.Run();
cat.Run();
```

#### 工作机制
- 扩展方法绑定到**接口**
- 任何类只要**实现接口**，就自动拥有扩展方法
- 调用时以接口类型为准，实现类无需任何代码
- 编译器自动匹配接口扩展方法

#### 与接口原有方法对比
- 接口原有方法：**必须实现**，强制子类重写
- 接口扩展方法：**可选使用**，不强制、不污染

#### 经典应用场景
- **LINQ 全部方法**：扩展 `IEnumerable<T>` 接口
  - `Where`、`Select`、`OrderBy`、`ToList`
- 为所有集合、数组统一增加工具方法
- 为框架服务接口增加通用辅助功能
- 不破坏接口契约的前提下增强体系能力

#### 约束限制
- 只能访问接口中定义的 **public 成员**
- 不能给接口增加字段、属性、抽象方法
- 不能重写接口已存在的方法
- 接口为 `null` 时调用扩展方法会抛空引用异常

## 分部方法
### 定义与声明
```csharp
partial void 方法名(参数);
```

### 实现规则
```csharp
partial void 方法名(参数) { }
```

### 约束条件
- 必须返回 `void`
- 不能使用 `ref`/`out` 参数
- 默认为私有
- 不可为 `virtual`、`override`、`static`

### 分部方法应用
```csharp
// 文件1：自动生成
public partial class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    partial void OnCreated();

    public User()
    {
        OnCreated();
    }
}

// 文件2：手写实现
public partial class User
{
    partial void OnCreated()
    {
        Console.WriteLine($"用户 {Name} 已创建");
    }
}

// 使用
User user = new User { Id = 1, Name = "张三" };
```

