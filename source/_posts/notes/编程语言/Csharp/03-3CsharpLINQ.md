---
title: "03-3CsharpLINQ"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/03-3CsharpLINQ.html
tags: [编程语言]
---

# LINQ

[toc]

## LINQ基础

### 核心概念

LINQ（Language Integrated Query，语言集成查询）将统一、类型安全、声明式的查询能力直接嵌入 C# 语言，可对内存集合、数据库、XML、JSON 等多种数据源执行筛选、排序、分组、投影、聚合等操作。

### 核心接口
- **`IEnumerable<T>`**
  对应内存数据源（LINQ to Objects），查询在本地内存迭代执行。

- **`IQueryable<T>`**
  对应远程数据源（EF Core、LINQ to SQL），构建表达式树，翻译为 SQL/其他指令在数据源端执行。

### 查询执行流程
1. 准备数据源：实现 `IEnumerable<T>` 或 `IQueryable<T>` 的集合或数据源
2. 定义查询：使用查询语法或方法语法构建表达式
3. 触发执行：通过 `foreach`、`ToList()`、`Count()`、`First()` 等枚举操作执行

### 两种查询语法
#### 查询语法
```csharp
from 变量 in 数据源
where 条件
orderby 字段
select 投影
```

#### 方法语法
```csharp
数据源.Where(条件).OrderBy(字段).Select(投影)
```

**基础查询**

```csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 查询语法
var query1 = from num in numbers
             where num % 2 == 0
             orderby num descending
             select num;

// 方法语法
var query2 = numbers.Where(num => num % 2 == 0)
                    .OrderByDescending(num => num)
                    .Select(num => num);

foreach (var num in query1)
{
    Console.WriteLine(num);
}
```

## LINQ查询子句
### from子句
LINQ查询的起始子句，用于指定数据源和范围变量，支持多from子句展开嵌套集合
```csharp
from 范围变量 in 数据源
```

### where子句
用于筛选数据，返回满足条件表达式的元素，支持多条件组合与多个where子句叠加使用
```csharp
where 条件表达式
```

### select子句
查询的结束子句，用于投影查询结果，可投影原元素、属性、匿名类型或自定义对象
```csharp
select 投影内容
```

### orderby子句
对查询结果进行排序，默认升序(ascending)，支持descending降序与多字段联合排序
```csharp
orderby 字段 [ascending/descending]
```

### group子句
按照指定键对元素进行分组，返回IGrouping<TKey, TElement>类型的分组集合，可作为查询结束子句
```csharp
group 元素 by 分组键
```

### join子句
实现两个数据源的内连接，通过equals关键字匹配关联键，适用于一对多、多对多数据关联
```csharp
join 关联变量 in 关联数据源 on 主键 equals 关联键
```

### into查询延续
用于分组或连接操作后，将前序查询结果作为新的数据源，实现后续筛选、排序、投影等延续查询
```csharp
group/join ... into 延续变量
```

### let子句
在查询中定义中间变量，存储复杂表达式计算结果，简化查询语法，提升代码可读性
```csharp
let 中间变量 = 表达式
```

**复杂查询组合**

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public string CategoryName { get; set; }
}

List<Product> products = new List<Product>
{
    new Product { Id=1, Name="iPhone", Price=7999, CategoryId=1 },
    new Product { Id=2, Name="MacBook", Price=12999, CategoryId=1 },
    new Product { Id=3, Name="T-Shirt", Price=99, CategoryId=2 },
    new Product { Id=4, Name="Shoes", Price=299, CategoryId=2 },
    new Product { Id=5, Name="Watch", Price=1999, CategoryId=1 }
};

List<Category> categories = new List<Category>
{
    new Category { Id=1, CategoryName="Electronics" },
    new Category { Id=2, CategoryName="Clothing" }
};

var query = from p in products
            join c in categories on p.CategoryId equals c.Id
            let fullName = $"{c.CategoryName}-{p.Name}"
            where p.Price > 100
            group p by c.CategoryName into g
            where g.Count() > 1
            select new
            {
                Category = g.Key,
                ProductCount = g.Count(),
                AvgPrice = g.Average(p => p.Price)
            };

foreach (var item in query)
{
    Console.WriteLine($"{item.Category}: {item.ProductCount}件, 均价{item.AvgPrice:F2}");
}
```

## 表达式树

### 核心概念

表达式树是将**代码逻辑（Lambda 表达式）存储为树形数据结构**的对象，树中每个节点代表一段代码元素（参数、常量、运算、方法调用、条件判断），本质是**代码 = 可被解析 / 翻译 / 修改的数据**，而非直接执行的指令。

表达式树不能直接运行，必须编译为委托才能执行，是 **IQueryable、EF Core、LINQ to SQL** 的底层核心技术。

## 表达式树基础结构

- 根节点：`Expression<TDelegate>`（Lambda 表达式树）
- 主体节点：`BinaryExpression`（二元运算）、`ConstantExpression`（常量）、`ParameterExpression`（参数）、`MethodCallExpression`（方法调用）
- 核心类型：`Expression`、`Expression<TDelegate>`

### 基础定义

表达式树以树形数据结构表示代码逻辑，将Lambda表达式存储为可解析、可翻译的数据对象
```csharp
Expression<Func<int, bool>> exp = x => x > 10;
```

### 创建表达式树
#### 隐式创建（由 Lambda 自动转换）
```csharp
// 编译器自动将 Lambda 编译为表达式树
Expression<Func<int, bool>> exp = x => x > 10;
```

#### 手动创建（动态构建）
```csharp
// 1. 创建参数 x
ParameterExpression param = Expression.Parameter(typeof(int), "x");

// 2. 创建常量 10
ConstantExpression constant = Expression.Constant(10);

// 3. 创建运算 x > 10
BinaryExpression body = Expression.GreaterThan(param, constant);

// 4. 构建完整表达式树
Expression<Func<int, bool>> exp = Expression.Lambda<Func<int, bool>>(body, param);
```

### 表达式树编译与执行
表达式树**不能直接执行**，必须调用 `Compile()` 转为委托后运行：
```csharp
// 编译为可执行委托
Func<int, bool> func = exp.Compile();

// 执行委托
bool result1 = func(15); // true
bool result2 = func(5);  // false
```

### 表达式树解析
可遍历、拆解表达式树，提取参数、运算符、常量、方法：
```csharp
Expression<Func<int, bool>> exp = x => x > 10;

// 获取主体运算
BinaryExpression binary = exp.Body as BinaryExpression;

// 获取参数 x
ParameterExpression param = exp.Parameters[0];

// 获取运算符（>）
ExpressionType op = binary.NodeType;

// 获取右侧常量值 10
ConstantExpression constant = binary.Right as ConstantExpression;
object value = constant.Value; // 10
```

### 表达式树常见节点类型
- `ParameterExpression`：参数（如 x）
- `ConstantExpression`：常量（如 10、"张三"）
- `BinaryExpression`：二元运算（> < >= <= == != && ||）
- `MemberExpression`：成员访问（x.Age、x.Name）
- `MethodCallExpression`：方法调用（x.Contains("abc")）
- `LambdaExpression`：Lambda 根表达式

### 表达式树与 IQueryable
- `IEnumerable<T>`：执行本地委托，内存查询
- **`IQueryable<T>`**：存储表达式树，可翻译为远程查询（SQL）

EF Core 工作流程：
```
LINQ 查询 → 表达式树 → 翻译为 SQL → 数据库执行
```

示例：
```csharp
var query = dbContext.Products
             .Where(p => p.Price > 100)
             .OrderBy(p =>p.Id);
```
生成 SQL：
```sql
SELECT * FROM Products WHERE Price > 100 ORDER BY Id
```

### 动态多条件查询
```csharp
// 动态构建：p => p.Price > 100 && p.Category == "Electronics"
ParameterExpression param = Expression.Parameter(typeof(Product), "p");

Expression left = Expression.GreaterThan(
    Expression.Property(param, "Price"),
    Expression.Constant(100)
);

Expression right = Expression.Equal(
    Expression.Property(param, "Category"),
    Expression.Constant("Electronics")
);

Expression and = Expression.AndAlso(left, right);

Expression<Func<Product, bool>> dynamicExp =
    Expression.Lambda<Func<Product, bool>>(and, param);

// 使用动态条件查询
var result = dbContext.Products.Where(dynamicExp).ToList();
```

### 表达式树 vs 普通委托
| 特性 | 表达式树 | 委托（Func/Action） |
|------|----------|---------------------|
| 存储形式 | 树形数据结构 | 可执行IL指令 |
| 可解析 | 可遍历、读取、修改 | 不可解析 |
| 可翻译 | 可转 SQL/JS | 不可翻译 |
| 执行方式 | 必须 Compile() | 直接调用 |
| 主要场景 | ORM、动态查询、跨平台 | 本地逻辑、回调 |

## 标准查询运算符
### 筛选
根据条件过滤集合元素，仅保留符合要求的数据
```csharp
list.Where(x => x.Age > 18);
list.OfType<string>();
```

### 投影
将元素转换为新的数据形式，提取所需字段或展开嵌套集合
```csharp
list.Select(x => x.Name);
list.SelectMany(x => x.Orders);
```

### 排序
对数据进行升序、降序排列，支持多级排序与序列反转
```csharp
list.OrderBy(x => x.Age);
list.OrderByDescending(x => x.Age);
list.OrderBy(x => x.Age).ThenBy(x => x.Name);
list.Reverse();
```

### 分组
按照指定键对数据分组，返回可遍历的分组集合
```csharp
list.GroupBy(x => x.Category);
```

### 连接
关联两个独立数据源，支持内连接与分组关联查询
```csharp
listA.Join(listB, a => a.Id, b => b.AId, (a, b) => new { a, b });
listA.GroupJoin(listB, a => a.Id, b => b.AId, (a, bList) => new { a, bList });
```

### 聚合
对集合执行统计计算，返回单个数值结果
```csharp
list.Count();
list.LongCount();
list.Sum(x => x.Price);
list.Average(x => x.Price);
list.Min(x => x.Price);
list.Max(x => x.Price);
list.Aggregate("", (current, next) => current + next.Name + ",");
```

### 分区
对数据分页截取，跳过指定条数或获取指定条数
```csharp
list.Skip(10);
list.Take(5);
list.SkipWhile(x => x.Age < 18);
list.TakeWhile(x => x.Age < 60);
```

### 元素操作
获取集合中指定位置的单个元素，带默认值防止空异常
```csharp
list.First();
list.FirstOrDefault(x => x.Age > 18);
list.Single();
list.SingleOrDefault(x => x.Id == 1);
list.Last();
list.LastOrDefault();
list.ElementAt(2);
list.ElementAtOrDefault(2);
```

### 集合操作
对多个集合执行去重、并集、交集、差集运算
```csharp
list.Distinct();
list1.Union(list2);
list1.Intersect(list2);
list1.Except(list2);
```

### 量词
判断集合是否满足指定条件，返回布尔值
```csharp
list.Any(x => x.Age > 18);
list.All(x => x.Score > 60);
list.Contains(item);
```

**综合运算符应用**

```csharp
List<int> list1 = new List<int> { 1, 2, 3, 4, 5 };
List<int> list2 = new List<int> { 3, 4, 5, 6, 7 };

var union = list1.Union(list2);
var intersect = list1.Intersect(list2);
var except = list1.Except(list2);
var aggregate = list1.Aggregate(1, (acc, x) => acc * x);

Console.WriteLine($"并集: {string.Join(",", union)}");
Console.WriteLine($"交集: {string.Join(",", intersect)}");
Console.WriteLine($"差集: {string.Join(",", except)}");
Console.WriteLine($"累积乘积: {aggregate}");
```

## 延迟执行与立即执行
### 延迟执行
查询定义时不执行，仅保存逻辑，首次枚举时才执行，数据源变更后结果会自动更新
```csharp
var query = numbers.Where(n => n > 5);
numbers.Add(11);
```

### 立即执行
调用转换方法时立刻执行查询并固化结果，数据源变更不会影响已查询出的数据
```csharp
var list = numbers.Where(n => n > 5).ToList();
numbers.Add(11);
```

### 执行时机对比
```csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

// 延迟执行
var deferredQuery = numbers.Where(n => n > 3);
numbers.Add(6);
Console.WriteLine("延迟执行结果:");
foreach (var n in deferredQuery) Console.WriteLine(n);

// 立即执行
var immediateResult = numbers.Where(n => n > 3).ToList();
numbers.Add(7);
Console.WriteLine("\n立即执行结果:");
foreach (var n in immediateResult) Console.WriteLine(n);
```

## LINQ高级特性
### 匿名类型
无需定义实体类，快速创建临时对象用于投影返回自定义结果
```csharp
select new { p.Name, p.Age, Level = p.Score > 60 ? "合格" : "不合格" };
```

## 动态查询
通过字符串动态拼接查询条件，适合运行时不确定条件的场景
```csharp
list.Where("Age > @0", 20).OrderBy("Name desc");
```

### PLINQ并行查询
利用多核CPU并行处理数据，大幅提升大数据量查询性能
```csharp
largeList.AsParallel().Where(x => x % 2 == 0).ToList();
```

**高级特性综合**

```csharp
List<Person> people = new List<Person>
{
    new Person { Name = "张三", Age = 25, Score = 85 },
    new Person { Name = "李四", Age = 30, Score = 55 },
    new Person { Name = "王五", Age = 28, Score = 90 }
};

// 匿名类型
var anonymousQuery = people.Select(p => new
{
    p.Name,
    p.Age,
    Level = p.Score > 60 ? "合格" : "不合格"
});

// PLINQ
var parallelResult = people.AsParallel()
                           .Where(p => p.Age > 20)
                           .OrderBy(p => p.Name)
                           .ToList();

foreach (var item in anonymousQuery)
{
    Console.WriteLine($"{item.Name}: {item.Level}");
}
```

## LINQ提供程序
### LINQ to Objects
直接查询内存中的集合对象，在本地执行查询逻辑
```csharp
List<int> numbers = new List<int> { 1, 2, 3 };
var query = numbers.Where(n => n > 1);
```

### LINQ to Entities
基于EF Core，将查询表达式翻译为SQL在数据库端执行
```csharp
var query = dbContext.Products
    .Where(p => p.Price > 100)
    .OrderBy(p => p.CreateTime);
```

### LINQ to XML
用于查询、创建、修改XML文档，替代XPath语法
```csharp
XDocument doc = XDocument.Load("data.xml");
var query = from p in doc.Descendants("Product")
            select p.Element("Name").Value;
```

### LINQ to JSON
基于Newtonsoft.Json库，使用LINQ语法操作JSON数据
```csharp
JArray jArray = JArray.Parse(jsonStr);
var query = jArray.Where(x => (int)x["Age"] > 18);
```

### LINQ to Excel
通过第三方库实现Excel表格数据的强类型查询
```csharp
var excelQuery = excelSheet.Where(x => x.Sales > 1000);
```

### LINQ to CSV
查询CSV格式文本数据，自动映射为强类型对象
```csharp
var csvQuery = csvRecords.Where(x => x.City == "Beijing");
```

### LINQ to JavaScript
前端场景中，将LINQ表达式转换为JavaScript可执行逻辑
```csharp
// 前端查询与后端语法保持一致
var jsQuery = jsArray.Where(x => x.Price < 500);
```

