---
title: "04Csharp泛型"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/04Csharp泛型.html
tags: [编程语言]
---

# 泛型
[toc]

## 泛型基础
### 核心定义
- **泛型**：通过**参数化类型**（用`<T>`表示）将数据类型作为参数传递，实现代码复用与类型安全
- 泛型允许将类、接口、方法、委托设计为**延迟声明类型**，在使用时指定具体数据类型
- 核心优势：类型安全、无装箱拆箱、代码高度复用

### 核心特性
1. **代码复用**：一套逻辑支持所有数据类型，避免重复编写功能相同、类型不同的代码
2. **类型安全**：编译时严格校验类型，杜绝类型转换异常
3. **无装箱拆箱**：值类型直接存储，性能远高于`object`实现
4. **代码简洁**：无需强制类型转换，可读性、可维护性更强
5. **独立泛型**：泛型方法可定义在普通类、泛型类中，泛型参数独立生效

### 执行原理
1. 编译时生成**泛型定义元数据**，不针对具体类型
2. 运行时JIT编译：
   - 引用类型共享同一套运行时代码
   - 值类型独立生成代码，无装箱拆箱
3. 泛型约束在编译时校验，保证类型合法性
4. 泛型信息保留到运行时，支持反射获取类型

### 性能影响
1. **高性能**：值类型无装箱拆箱，内存占用低
2. **JIT优化**：运行时编译为本地代码，执行效率接近硬编码类型
3. **内存高效**：引用类型共享代码，减少内存占用
4. **无额外开销**：泛型调用与普通方法性能基本一致

### 注意事项
1. **泛型不能直接实例化**：无`new()`约束时，不能`new T()`
2. **不能使用运算符**：不能直接用`+`、`-`等运算，需通过接口/委托实现
3. **静态成员独立**：不同闭合类型（`A<int>`、`A<string>`）静态成员不共享
4. **协变抗变**：泛型接口/委托可使用`in`/`out`实现类型变体
5. **约束必要性**：合理使用约束，避免类型不安全操作

## 泛型类
### 声明语法
```csharp
访问修饰符 class 类名<T>
{
    // 类内部可使用 T 作为类型
    public T Field;
    public T Method(T param) { }
}
```

### 多泛型参数
- 泛型类可同时定义多个泛型参数，用逗号分隔
```csharp
// 多参数泛型类
public class Pair<TKey, TValue>
{
    public TKey Key { get; set; }
    public TValue Value { get; set; }
}
```

### 使用示例
```csharp
// 1. 定义泛型类
public class GenericCache<T>
{
    private T _data;

    public void SetData(T data) => _data = data;
    public T GetData() => _data;
}

// 2. 使用泛型类（指定具体类型）
GenericCache<int> intCache = new GenericCache<int>();
intCache.SetData(100);
int value = intCache.GetData();

GenericCache<string> strCache = new GenericCache<string>();
strCache.SetData("测试");
string text = strCache.GetData();
```

### 泛型类 vs 普通类
1. **复用性**：泛型类一套代码适配所有类型；普通类仅支持固定类型
2. **性能**：泛型类无装箱拆箱；普通类用`object`接收会产生装箱拆箱
3. **安全性**：泛型类编译时类型校验；普通类运行时转换易报错
4. **灵活性**：泛型类可通过约束扩展功能；普通类固定逻辑

### 使用场景
- 通用数据结构：缓存、工具类、集合基类
- 业务无关的通用逻辑：数据库操作、序列化、接口封装
- 需要一套代码支持多种类型的模块

## 泛型方法
### 声明语法
```csharp
访问修饰符 返回值类型 方法名<T>(T param)
{
    // 方法内部使用 T 作为类型
}
```

### 类型推断
- 调用泛型方法时，编译器可根据传入参数**自动推断泛型类型**，无需显式写`<T>`
```csharp
// 自动推断 T 为 int
int max = GetMax(5, 10);
```

### 使用示例
```csharp
public class Utility
{
    // 泛型方法
    public T GetMax<T>(T a, T b) where T : IComparable<T>
    {
        return a.CompareTo(b) > 0 ? a : b;
    }
}

// 调用
Utility util = new Utility();
int maxInt = util.GetMax<int>(10, 20); // 显式指定
string maxStr = util.GetMax("A", "B"); // 隐式推断
```

### 泛型方法 vs 普通方法
1. **独立灵活**：泛型方法泛型参数独立，不受类是否泛型影响
2. **局部通用**：仅需要单个方法通用时，用泛型方法更轻量
3. **类型推断**：调用简洁，编译器自动推断类型
4. **约束独立**：可单独定义方法级别的泛型约束

### 使用场景
- 独立通用功能：比较、转换、查找、打印
- 工具类方法：无需定义泛型类，轻量通用
- 方法级别的类型复用，类本身不需要泛型

## 泛型约束
### 核心定义
- **泛型约束**：使用`where`关键字限制泛型参数`<T>`的类型范围，规定`T`必须具备的特征
- 作用：让泛型从“无限制通用”变为“可控通用”，允许调用约束类型成员，保证类型安全

### 约束语法
```csharp
// 单个约束
泛型定义<T> where T : 约束条件

// 多个约束
泛型定义<T> where T : 约束1, 约束2, 约束3

// 多参数分别约束
泛型定义<T1, T2> where T1 : 约束 where T2 : 约束
```

### 常用约束类型
1. **引用类型约束** `where T : class`
   限制T必须是类、接口、数组、委托、string
```csharp
public void Test<T>(T obj) where T : class { }
```

2. **值类型约束** `where T : struct`
   限制T必须是int、double、struct、enum等值类型
```csharp
public void Test<T>(T obj) where T : struct { }
```

3. **无参构造函数约束** `where T : new()`
   允许`new T()`创建实例，必须放在约束最后
```csharp
public T CreateInstance<T>() where T : new()
{
    return new T();
}
```

4. **基类约束** `where T : 基类名`
   限制T必须是指定基类/子类，可直接调用基类成员
```csharp
public class Animal { }
public void Feed<T>(T animal) where T : Animal { }
```

5. **接口约束** `where T : 接口名`
   限制T必须实现指定接口，可直接调用接口成员
```csharp
public int Compare<T>(T a, T b) where T : IComparable { }
```

6. **基类型约束** `where T : U`
   限制T必须是另一个泛型参数U的子类/实现类
```csharp
public void Copy<T, U>(T target, U source) where T : U { }
```

### 多重约束
- 一个T可同时指定多个约束，**必须同时满足**
- 固定顺序：基类/接口 → `class`/`struct` → `new()`
```csharp
public T Create<T>() where T : class, ICloneable, new()
{
    return new T();
}
```

### 约束作用
1. **类型安全**：编译期校验，杜绝非法类型传入
2. **调用成员**：可直接调用约束类型的方法、属性
3. **避免装箱**：约束值类型/引用类型，优化性能
4. **明确语义**：让泛型用途更清晰

### 约束注意事项
1. **约束顺序**：基类/接口 → 引用/值类型 → 构造函数约束
2. **互斥约束**：`class`与`struct`不能同时使用
3. **构造函数位置**：`new()`必须放在最后
4. **静态成员**：不能通过`T`直接调用静态成员
5. **继承传递**：子类重写泛型时，约束不能冲突

### 使用场景
1. 需要在泛型中**调用特定方法/属性**
2. 需要**创建泛型实例**
3. 区分**值类型与引用类型**逻辑
4. 多泛型参数需要**类型关联**
5. 严格限制传入参数类型，保证业务安全