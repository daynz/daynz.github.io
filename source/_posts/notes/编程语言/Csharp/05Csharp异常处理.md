---
title: "05Csharp异常处理"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/05Csharp异常处理.html
tags: [编程语言]
---

# 异常处理
[toc]

## try-catch-finally 异常捕获与处理
### 核心定义
- **异常**：程序运行时发生的错误或意外情况（如除零、空引用、文件不存在），会中断正常执行流程
- **`try-catch-finally`**：C# 官方标准异常处理语法结构，用于捕获、处理异常，并保证资源释放
- **作用**：避免程序直接崩溃，优雅处理错误，记录日志，保证关键代码必定执行

### 语法结构
```csharp
try
{
    // 可能抛出异常的业务代码
}
catch (异常类型 ex)
{
    // 捕获并处理对应类型的异常
}
finally
{
    // 无论是否异常，始终执行的代码（释放资源）
}
```

### 组成部分
### try 块
- 包裹**可能发生异常**的代码片段
- 一旦内部出现异常，立即跳出当前执行位置，进入匹配的`catch`块
- 不能单独存在，必须配合`catch`或`finally`

### catch 块
- 捕获并处理指定类型的异常
- 可写多个`catch`处理**不同类型异常**（按从小到大顺序捕获）
- 可省略异常变量（仅捕获，不使用异常信息）

### finally 块
- **无论是否发生异常、是否捕获、是否 return 跳出**，始终执行
- 主要用于**释放资源**（关闭文件、数据库连接、释放流）
- 可选，但处理资源时必须使用

### 执行流程
1. 正常执行`try`块代码，无异常 → 跳过所有`catch` → 执行`finally`
2. `try`块发生异常 → 匹配对应`catch`处理 → 执行`finally`
3. `catch`中抛出新异常 → 仍会先执行`finally`，再向外抛出

### 基础使用示例
```csharp
try
{
    int a = 10;
    int b = 0;
    int result = a / b;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("除零错误：" + ex.Message);
}
catch (Exception ex)
{
    Console.WriteLine("未知错误：" + ex.Message);
}
finally
{
    Console.WriteLine("执行结束，资源释放");
}
```

### 多异常捕获规则
- 顺序：**先捕获具体异常 → 最后捕获基类 Exception**
- 基类异常`catch`写在前面会导致后续子类型无法生效
- 一个异常最多被**一个`catch`块**捕获

```csharp
try { }
catch (NullReferenceException ex) { }
catch (IOException ex) { }
catch (Exception ex) { }
```

### 异常常用属性
- **`Message`**：异常描述信息
- **`StackTrace`**：异常调用堆栈，定位错误代码位置
- **`InnerException`**：内部异常，用于排查嵌套错误
- **`GetType()`**：获取异常具体类型

```csharp
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
    Console.WriteLine(ex.StackTrace);
}
```

### 特殊场景
### 无 catch，只有 try-finally
- 不处理异常，仅保证资源释放
- 异常会继续向上层抛出

```csharp
try
{}
finally
{}
```

### catch 省略异常变量
```csharp
catch (IOException)
{
    Console.WriteLine("文件操作失败");
}
```

### try 中包含 return
- `return` 会暂存结果，**先执行 finally，再返回值**

```csharp
int Test()
{
    try
    {
        return 10;
    }
    finally
    {
    }
}
```

### 常用异常类型
- **`Exception`**：所有异常的基类
- **`NullReferenceException`**：空引用异常
- **`DivideByZeroException`**：除零异常
- **`IndexOutOfRangeException`**：索引越界
- **`FileNotFoundException`**：文件不存在
- **`ArgumentException`**：参数错误
- **`InvalidCastException`**：类型转换失败

### 最佳实践
1. **精准捕获**：优先捕获具体异常，少用`Exception`兜底
2. **不要空 catch**：禁止只捕获不处理
3. **finally 释放资源**：文件、数据库、网络流必须释放
4. **throw 保留堆栈**：重新抛出用`throw;`
5. **异常用于意外**：不用异常处理正常业务逻辑
6. **记录日志**：捕获后记录异常信息

### 注意事项
1. **性能损耗**：异常抛出与捕获开销较大
2. **finally 优先执行**：`try`/`catch`中的`return`不会跳过`finally`
3. **异步方法**：`try-catch`可直接捕获异步方法异常
4. **嵌套异常**：内层异常未捕获时向外层传递
5. **不可捕获**：栈溢出、系统崩溃无法被普通`catch`捕获

### 使用场景
1. 文件读写、网络请求、数据库操作
2. 类型转换、数值计算、索引访问
3. 调用外部接口、第三方库
4. 需要保证资源释放的核心逻辑
5. 必须记录日志、提示用户的流程

## throw 异常抛出
### 核心定义
- **`throw`**：用于**主动抛出异常**，中断当前代码，将异常传递给上层调用者
- 作用：业务违规、参数非法、状态错误时主动通知调用方

### 语法格式
```csharp
throw new 异常类型("异常提示信息");
throw;
```

### 核心特性
1. **中断执行**：抛出后立即停止后续代码
2. **异常传递**：向上查找`catch`，直到被捕获或程序崩溃
3. **自定义消息**：传入文本便于定位问题
4. **支持嵌套**：包装内部异常，传递完整错误
5. **强制处理**：未捕获会直接导致程序终止

### 基础抛出示例
```csharp
public void SetAge(int age)
{
    if (age < 0 || age > 150)
    {
        throw new ArgumentOutOfRangeException(nameof(age), "年龄必须在0-150之间");
    }
}
```

### 常见内置异常抛出
```csharp
throw new ArgumentNullException(nameof(param),"参数不能为空");
throw new ArgumentOutOfRangeException(nameof(age));
throw new NullReferenceException("对象未初始化");
throw new FormatException("字符串格式不正确");
throw new InvalidOperationException("当前状态不允许执行此操作");
throw new IndexOutOfRangeException("索引超出集合范围");
```

### 捕获后重新抛出
- **`throw`**：保留原始异常堆栈（推荐）
- **`throw ex`**：重置堆栈，丢失原始位置（禁止使用）

```csharp
try
{
}
catch (Exception ex)
{
    LogHelper.WriteError(ex);
    throw;
}
```

### 包装内部异常
```csharp
try
{
    File.ReadAllText("test.txt");
}
catch (IOException ex)
{
    throw new InvalidOperationException("读取文件失败", ex);
}
```

### 自定义异常抛出
```csharp
public class BusinessException : Exception
{
    public BusinessException(string message) : base(message) { }
}

throw new BusinessException("订单状态不允许取消");
```

### 执行流程
1. 执行`throw` → 终止后续代码
2. 向上查找最近的`try-catch`
3. 匹配则处理，不匹配则程序崩溃

### 使用规范
1. **只抛预期内异常**：用于业务校验、参数检查
2. **描述清晰**：消息明确，方便定位
3. **不滥用**：不控制正常业务流程
4. **保留堆栈**：重新抛出用`throw;`
5. **精准类型**：优先使用系统内置异常

### 注意事项
1. **无处理会崩溃**：必须被上层捕获
2. **性能成本**：不可频繁使用
3. **不可恢复**：抛出后无法回到抛出点
4. **finally 优先执行**
5. **异步方法**：`throw`可直接用于`async`方法

### 使用场景
1. **参数校验**：方法入口检查合法性
2. **业务校验**：违反业务规则
3. **错误封装**：包装底层异常
4. **非法状态**：对象状态错误
5. **系统校验**：配置缺失、依赖未初始化

## 异常过滤器 when
### 核心定义
- **异常过滤器**：C# 6.0 引入，`catch` + `when` 实现**条件化捕获**
- 作用：精细化分流，不破坏异常堆栈

### 语法格式
```csharp
try{}
catch (异常类型 ex) when (筛选条件){}
```

### 核心特性
1. **条件捕获**：满足条件才捕获
2. **不重置堆栈**：不匹配则继续向上传递
3. **同一类型分流**：按错误码/消息分多个`catch`
4. **条件灵活**：支持异常属性、外部变量、方法
5. **顺序匹配**：从上到下，满足即捕获

### 基础使用示例
```csharp
try
{
    int.Parse("abc");
}
catch (FormatException ex) when (ex.Message.Contains("Int32"))
{
    Console.WriteLine("数字格式异常");
}
catch (FormatException ex)
{
    Console.WriteLine("通用格式异常");
}
```

### 常用筛选条件
### 根据异常信息筛选
```csharp
catch (IOException ex) when (ex.Message.Contains("文件被占用"))
{
}
```

### 根据状态码筛选
```csharp
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
}
```

### 根据外部变量筛选
```csharp
bool isDebug = true;
catch (Exception ex) when (isDebug)
{
}
```

### 根据自定义异常属性筛选
```csharp
public class BusinessException : Exception
{
    public int Code { get; set; }
}

catch (BusinessException ex) when (ex.Code == 1001)
{
}
```

### 高级用法：条件方法
```csharp
bool IsNeedCatch(Exception ex) => ex is IOException || ex is FormatException;

try { }
catch (Exception ex) when (IsNeedCatch(ex))
{
}
```

### 执行流程
1. 异常抛出 → 匹配类型
2. 执行`when`条件
3. 条件为`true` → 捕获
4. 条件为`false` → 继续匹配/向上抛出
5. **全程保留堆栈**

### 优势对比
### 传统 if 判断
```csharp
catch (Exception ex)
{
    if(ex.Message != "xxx") throw;
}
```

### 异常过滤器 when
```csharp
catch (Exception ex) when (ex.Message == "xxx")
{
}
```
**核心优势**：不捕获则不中断传播，**保留完整堆栈**

### 与多 catch 配合
```csharp
try { }
catch (HttpRequestException ex) when (ex.StatusCode == 400) { }
catch (HttpRequestException ex) when (ex.StatusCode == 500) { }
catch (Exception ex) { }
```

### 注意事项
1. **条件不能抛异常**
2. **条件简单化**：避免复杂逻辑
3. **精准条件写前面**
4. **无副作用**：纯函数条件
5. **调试可见**

### 使用场景
1. **精细化异常处理**
2. **HTTP/数据库异常**：按状态码处理
3. **业务异常**：按错误码分类
4. **日志/调试**：特定条件捕获
5. **保留堆栈**：不破坏原始信息