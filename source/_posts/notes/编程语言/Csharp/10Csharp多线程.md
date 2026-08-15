---
title: "10Csharp多线程"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/10Csharp多线程.html
tags: [编程语言]
---

# 多线程

[toc]

## 线程基础（Thread）

### 线程核心概念

#### 核心定义
- **线程**：进程内部独立的执行流程单元，是操作系统调度的最小单位，同一进程内的线程共享内存空间与系统资源
- **主线程**：程序启动时自动创建的执行流，负责主逻辑、事件处理与界面更新；在 Unity 中，**只有主线程可以操作 GameObject、Component 等引擎对象**
- **工作线程**：由开发者手动创建的后台执行流，用于处理计算、网络、文件读写等耗时操作，**严禁直接访问或修改 Unity 对象**
- **多线程**：多个线程在 CPU 时间片调度下并发执行，提升程序响应速度与执行效率

#### 线程类型
- **前台线程**：线程默认类型，进程会等待所有前台线程执行完成后才退出
- **后台线程**：通过 `IsBackground = true` 设置，主进程退出时后台线程会被直接终止，无需等待执行完毕

#### 核心特性
1. **资源共享**：同一进程下所有线程共享堆内存、全局变量、静态变量
2. **独立调度**：每个线程拥有独立的调用栈与寄存器状态，独立执行
3. **并发执行**：CPU 时间片轮转切换线程，宏观并行、微观交替执行
4. **安全风险**：多线程同时访问共享资源会导致数据错乱，必须同步处理

### Thread 类使用
#### 基础说明
- 所在命名空间：`System.Threading`
- 线程必须绑定执行方法，支持无参、有参、Lambda 表达式、匿名委托

#### 创建与启动线程
```csharp
// 无参数线程
Thread thread = new Thread(ThreadRun);
thread.Start();

// Lambda 简化写法
Thread thread = new Thread(() =>
{
    // 线程执行逻辑
});
thread.Start();
```

#### 带参数的线程
```csharp
void ThreadRun(object param)
{
    string message = param.ToString();
}

Thread thread = new Thread(ThreadRun);
thread.Start("传递给线程的参数");
```

### 常用方法与属性
#### 后台线程设置
```csharp
thread.IsBackground = true;
```

#### 线程等待

阻塞当前线程，直到目标线程执行完毕
```csharp
thread.Join();
```

#### 线程休眠
让当前线程暂停指定时间，释放 CPU 资源
```csharp
Thread.Sleep(1000);
```

#### 线程优先级
```csharp
thread.Priority = ThreadPriority.Normal;
```

#### 中止线程
不推荐使用，易造成资源泄漏、数据异常
```csharp
thread.Abort();
```

#### 线程执行流程
1. 创建 `Thread` 对象并绑定执行方法
2. 调用 `Start()` 进入就绪状态，等待系统调度
3. CPU 分配时间片，线程执行方法逻辑
4. 方法执行完成，线程自动释放资源

### 线程同步
#### 核心问题
- **临界区**：多个线程同时访问的共享资源代码区域
- **竞态条件**：多线程并发读写共享数据，导致结果不可预期
- **线程安全**：多线程环境下代码执行结果保持正确，数据不混乱

#### lock 关键字
- `Monitor` 的简化语法，保证同一时间只有一个线程进入临界区
- 必须使用独立的只读对象作为锁标记，不可使用 `this`、字符串等

```csharp
private readonly object lockObj = new object();

void UpdateData()
{
    lock (lockObj)
    {
        // 临界区代码，操作共享资源
    }
}
```

#### Monitor 类
手动控制锁的进入与退出，功能更灵活，必须搭配 `try-finally`

```csharp
Monitor.Enter(lockObj);
try
{
    // 临界区逻辑
}
finally
{
    Monitor.Exit(lockObj);
}
```

#### Mutex 互斥体
功能与 `lock` 类似，**支持跨进程同步**，性能较低，适用于进程间资源互斥

#### Semaphore 信号量
计数型信号量，限制同时访问资源的最大线程数，适用于连接池、资源池等场景

#### Interlocked 原子操作
轻量级无锁同步，对数值变量提供原子性操作，性能远高于 `lock`

```csharp
Interlocked.Increment(ref count);
Interlocked.Exchange(ref value, 100);
```

### 线程池 ThreadPool
#### 核心定义
- **线程池**：系统预先创建的可复用线程集合，避免频繁创建/销毁线程带来的性能损耗
- 统一管理线程数量、调度与生命周期，自动优化并发性能

#### 核心作用
1. 减少线程创建销毁的开销
2. 控制最大并发线程数，防止资源耗尽
3. 简化多线程开发，无需手动管理线程

#### 使用方式
```csharp
ThreadPool.QueueUserWorkItem((state) =>
{
    // 线程池执行逻辑
});
```

#### 适用场景
大量短时任务、异步计算、网络请求、文件处理、日志写入等非阻塞任务

#### 使用限制
1. 无法设置线程名称、优先级
2. 不适合长时间阻塞的任务
3. 无法手动暂停、恢复、中止线程
4. 不保证任务执行顺序

### 多线程注意事项
- 共享变量必须使用 `lock` 或 `Interlocked` 保证线程安全
- 工作线程中**不能操作任何 Unity 对象**，只能在主线程访问
- 禁止使用 `Thread.Abort()` 强制终止线程
- 大量短时任务优先使用线程池，避免手动创建线程
- 线程内部异常不会传递到主线程，必须自行捕获处理
- 线程数量并非越多越好，过多会导致 CPU 调度繁忙

### 常用使用场景

- 耗时计算：路径寻找、数据解析、复杂逻辑运算
- IO 操作：文件读写、网络请求、数据库访问
- 后台任务：日志写入、数据同步、消息处理
- Unity 适配：后台计算完成后，通过主线程调度操作游戏对象与 UI

## 基于任务的异步模式 TAP（`Task` 核心）
### `Task`与`Task<T>`
#### 核心定义

- **`Task`**：表示一个**无返回值**的异步操作，是TAP异步编程模式的核心类型，基于线程池实现
- **`Task<T>`**：表示一个**带返回值**的异步操作，继承自Task，用于获取异步执行结果
- 本质：对线程池的高级封装，比Thread、ThreadPool更简洁、功能更强

#### 任务状态
- `Created`：已创建但未安排运行
- `WaitingToRun`：已调度，等待线程池执行
- `RanToCompletion`：成功执行完成
- `Faulted`：执行过程中发生异常
- `Canceled`：任务被取消

#### 核心成员
##### 任务等待
```csharp
// 阻塞当前线程，等待任务完成
task.Wait();
```

##### 获取结果（`Task<T>`）
```csharp
// 阻塞等待并获取返回值
int result = task.Result;
```

#### 异步等待器

```csharp
var awaiter = task.GetAwaiter();
awaiter.OnCompleted(() => { /* 完成后执行 */ });
```

#### 任务创建与运行
```csharp
// 无返回值任务
Task task = Task.Run(() =>
{
    // 异步逻辑
});

// 带返回值任务
Task<int> task = Task.Run(() =>
{
    return 100;
});
```

### Task基础API
#### `Task.Run`
将同步方法扔到**线程池**执行，快速创建异步任务
```csharp
Task.Run(() => { });
```

#### `Task.Delay`
**异步延时**，不阻塞线程，替代Thread.Sleep

```csharp
await Task.Delay(1000);
```

#### `Task.WhenAll`
等待**一组任务全部完成**后再继续
```csharp
await Task.WhenAll(task1, task2, task3);
```

#### `Task.WhenAny`
等待**任一任务完成**就继续执行
```csharp
var finishedTask = await Task.WhenAny(task1, task2);
```

#### 快速完成任务
```csharp
// 直接返回已完成的任务
Task completed = Task.CompletedTask;

// 直接返回带结果的任务
Task<int> resultTask = Task.FromResult(10);
```

### 异常处理
#### 异常类型
- 任务中抛出的异常会被包装为 **`AggregateException`**（可包含多个内部异常）

#### 同步等待捕获异常
```csharp
try
{
    task.Wait();
}
catch (AggregateException ex)
{
    // 处理任务异常
}
```

#### `async`/`await`中捕获异常

可**直接使用try-catch**，自动解包异常，无需处理`AggregateException`
```csharp
try
{
    await task;
}
catch (Exception ex)
{
    // 直接捕获原始异常
}
```

#### 任务异常状态
```csharp
// 判断是否执行失败
bool isFaulted = task.IsFaulted;

// 获取异常对象
Exception ex = task.Exception;
```

#### 未观察任务异常
未被捕获/观察的任务异常会触发`UnobservedTaskException`事件，可能导致程序崩溃
```csharp
TaskScheduler.UnobservedTaskException += (sender, e) =>
{
    e.SetObserved(); // 标记异常已处理
};
```

### 取消机制`CancellationToken`
#### 核心组件
- **`CancellationTokenSource`**：创建取消令牌、发起取消请求
- **`CancellationToken`**：传递给任务，监听取消信号

#### 基础使用
```csharp
// 创建取消源
CancellationTokenSource cts = new CancellationTokenSource();

// 获取令牌
CancellationToken token = cts.Token;

// 启动任务并传入令牌
Task.Run(() =>
{
    // 判断是否取消
    if (token.IsCancellationRequested)
        return;
}, token);
```

#### 主动抛出取消异常
```csharp
// 已取消则直接抛出OperationCanceledException
token.ThrowIfCancellationRequested();
```

#### 发起取消
```csharp
// 取消关联的所有任务
cts.Cancel();
```

#### 超时自动取消
```csharp
// 5秒后自动取消
CancellationTokenSource cts = new CancellationTokenSource(5000);
```

#### 任务取消配合
```csharp
Task.Run(async () =>
{
    while (!token.IsCancellationRequested)
    {
        // 执行循环逻辑
        await Task.Delay(100);
    }
}, token);
```

### 异步注意事项
- Task默认使用**线程池**，适合短时、高效异步操作
- 避免使用`Task.Wait()`、`Task.Result`阻塞主线程，易造成死锁
- async/await是最推荐的Task使用方式，代码简洁且非阻塞
- 取消机制必须配合`CancellationToken`使用，禁止手动终止任务
- 所有任务异常必须处理，避免未观察异常导致程序崩溃

### 常用使用场景
- 异步IO：文件读写、网络请求、数据库操作
- 延时操作：技能冷却、动画等待、定时逻辑
- 并行任务：批量数据处理、多接口同时请求
- 可取消操作：下载、上传、后台计算可中途取消
- Unity适配：异步操作完成后通过主线程调度操作游戏对象

## async / await 核心语法（C# 5.0）

### 语法规则
#### 核心定义
- **async / await**：C# 5.0 提供的语法糖，用于简化 Task 异步编程，让异步代码写法与同步代码一致
- **async**：方法修饰符，标记该方法为异步方法，可配合 await 使用
- **await**：等待可等待对象完成，**不阻塞当前线程**，等待期间线程可被复用

#### 方法返回值类型
- `Task`：无返回值的异步方法（推荐）
- `Task<T>`：带返回值的异步方法（推荐）
- `void`：仅用于**UI事件处理**，普通方法禁止使用，异常无法被捕获

#### 基础语法
```csharp
// 无返回值异步方法
async Task MethodAsync()
{
    await Task.Delay(100);
}

// 带返回值异步方法
async Task<int> CalcAsync()
{
    await Task.Delay(100);
    return 10;
}
```

#### 可等待对象
- `Task` / `Task<T>`（最常用）
- Unity 环境：`YieldInstruction`、`CustomYieldInstruction`
- 自定义实现 `INotifyCompletion` 的对象

#### async void 使用限制
- **仅用于事件处理器**（按钮点击、系统事件）
- 异常无法被外部捕获，会直接抛出到同步上下文
- 无法等待完成，无法取消，无法获取异常
```csharp
// 正确：UI事件
async void Button_Click(object sender, EventArgs e)
{ }
```

### 执行机制
#### 完整执行流程（面试高频）
1. 调用异步方法，**同步执行**方法内代码，直到遇到第一个 await
2. 遇到 await，立即**挂起当前方法**，将控制权返回给调用方
3. 等待的异步操作在后台执行（线程池/IO完成端口）
4. 异步操作完成后，**恢复执行** await 后续代码
5. 自动根据同步上下文切回原线程（Unity 主线程）

#### 同步上下文捕获
- 默认情况下，await 会捕获当前 `SynchronizationContext`
- 完成后自动切回捕获的上下文（UI线程/Unity主线程）
- 作用：允许直接操作UI、GameObject 等线程敏感对象

#### 关闭上下文捕获
- 使用 `ConfigureAwait(false)` 关闭上下文捕获，提升性能
- 无需访问主线程资源时必须使用
```csharp
await Task.Delay(100).ConfigureAwait(false);
```

### 关键特性
#### 非阻塞等待
- await 不会阻塞调用线程，线程可被系统复用
- 对比 `Thread.Sleep()` / `Wait()` 不会造成线程卡死

#### 代码线性化
- 异步代码结构与同步代码一致，无嵌套回调
- 可读性、可维护性远高于 Thread、ThreadPool

#### 自动线程切换
- 无需手动管理线程，系统自动调度
- 可在异步逻辑中安全切回主线程操作UI/Unity对象

#### 异常处理一致
- 可直接使用 `try-catch` 捕获异步异常
- 无需处理 `AggregateException`，自动解包异常
```csharp
async Task TestAsync()
{
    try
    {
        await Task.Run(() => { });
    }
    catch (Exception ex)
    {
        // 直接捕获异常
    }
}
```

### 常见陷阱
#### async void 异常丢失
- 普通方法使用 async void，异常无法被捕获，直接崩溃
- 禁止在非事件方法中使用

#### 过度 await 导致性能下降
- 无意义的 await 会增加线程调度开销
- 同步逻辑无需添加 await

#### 阻塞调用造成死锁
- 在异步代码中使用 `Wait()`、`Result`、`Sleep()` 会阻塞线程
- 结合上下文捕获极易产生死锁
```csharp
// 死锁代码（禁止）
task.Wait();
int result = task.Result;
```

#### 上下文捕获导致主线程卡顿
- 大量异步操作捕获主线程上下文会造成排队卡顿
- 后台计算任务必须使用 `ConfigureAwait(false)`

#### 忘记释放取消源导致内存泄漏
- `CancellationTokenSource` 用完未释放会造成对象无法回收
- 必须使用 `using` 或手动调用 `Dispose()`
```csharp
using var cts = new CancellationTokenSource();
```

### 异步最佳实践
- 异步方法命名以 **Async** 结尾
- 优先返回 `Task / Task<T>`，禁止滥用 async void
- 后台任务一律使用 `ConfigureAwait(false)`
- 异常必须捕获，禁止未观察异常
- 配合 CancellationToken 实现任务可取消
- Unity 中仅在主线程操作 GameObject，异步仅用于计算与IO

## 高级异步知识点

### `ValueTask<T>`（C# 7.2）
#### 核心定义
- **`ValueTask<T>`**：值类型异步操作对象，用来替代引用类型 `Task<T>`，大幅减少堆内存分配与GC压力
- 区别：`Task` 是类（分配堆内存），`ValueTask` 是结构体（无GC或低GC）

#### 使用场景
- 异步方法**大部分情况下会同步完成**（缓存命中、快速判断）
- 游戏热路径、高频调用接口、每帧执行的异步逻辑
- 追求极致性能、降低GC频率的场景

#### 基础语法
```csharp
// 低GC异步方法
async ValueTask<int> GetValueAsync()
{
    await Task.Delay(10);
    return 10;
}
```

#### 重要特性
- 支持 `await`，用法与 `Task` 完全一致
- 同步完成时**零堆分配**，性能远高于 `Task`
- 只能**等待一次**，不可复用、不可 `Wait()`、不可 `WhenAll`
- 适用高频、同步完成占比高的异步操作

### `IAsyncEnumerable`（C# 8.0）
#### 核心定义
- **`IAsyncEnumerable<T>`**：异步流式枚举接口，用于**分批、渐进式返回数据**
- 配合 `await foreach` 遍历，每一项数据都可异步获取

#### 核心语法
```csharp
// 异步迭代器
async IAsyncEnumerable<int> GetDataAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}

// 消费
await foreach (var item in GetDataAsync())
{
    // 处理每一项
}
```

#### 使用场景
- 网络分批下载、分页加载数据
- 数据库流式读取、日志流式读取
- 大量数据分批次返回，避免一次性加载

### 异步锁
#### 核心问题
- `lock` 不支持异步，不能在 `await` 前后使用，会直接编译报错/死锁
- 异步代码必须使用**异步可等待锁**

#### SemaphoreSlim（推荐）
- 轻量级异步信号量，可实现异步独占锁
- 支持 `WaitAsync()` 非阻塞等待

```csharp
private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1);

async Task UseResourceAsync()
{
    await _semaphore.WaitAsync();
    try
    {
        // 异步临界区
        await Task.Delay(100);
    }
    finally
    {
        _semaphore.Release();
    }
}
```

#### 自定义 `AsyncLock`
- 封装 `SemaphoreSlim` 实现简洁异步锁
- 支持 `using` 自动释放

#### 使用规范
- 异步方法**绝对禁止使用 `lock`**
- 临界区内尽量避免长时间阻塞
- 必须用 `finally` 保证释放锁，防止死锁

### `TaskCompletionSource`
#### 核心定义
- **`TaskCompletionSource`**：手动控制 Task 完成、失败、取消的工具
- 作用：将**回调式API** 转为 **Task/await 异步模式**

#### 基础用法
```csharp
TaskCompletionSource<int> tcs = new TaskCompletionSource<int>();

// 异步完成
tcs.SetResult(100);

// 异常
tcs.SetException(new Exception());

// 取消
tcs.SetCanceled();

// 外部等待
await tcs.Task;
```

#### 使用场景
- 封装 Unity 异步操作：`UnityWebRequest`、`AssetBundle`、`Addressables`
- 封装事件/回调型SDK为await风格
- 自定义异步流程控制

### 并行任务
#### 核心定义
- 并行任务：充分利用多核CPU，**同步执行多个CPU密集型计算**
- 区别于异步IO：并行 = 多核同时计算；异步 = 非阻塞等待

#### Parallel 类
- 并行循环，自动使用多核
```csharp
Parallel.For(0, 1000, i =>
{
    // CPU密集计算
});

Parallel.ForEach(list, item =>
{
    // 并行处理
});
```

#### PLINQ 并行LINQ
```csharp
var result = list.AsParallel()
                .Where(x => x > 0)
                .OrderBy(x => x)
                .ToList();
```

#### 使用场景
- 大量数据计算、物理模拟、路径预处理、图形处理
- **纯CPU密集型任务**
- 不适用于IO操作、不适用于Unity主线程操作

#### 注意事项
- 并行会占用大量CPU，游戏中谨慎使用
- 共享数据必须加锁，保证线程安全
- 避免小任务频繁调度，降低并行效率

## Unity 环境下异步
### Unity 主线程限制
#### 核心规则
- **Unity 引擎对象线程安全限制**：只有**主线程**可以创建、访问、修改 `GameObject`、`Transform`、`Component`、`MonoBehaviour` 等对象
- 工作线程/线程池/Task 后台线程**严禁执行**：
  - `new GameObject()`
  - `GetComponent`
  - `transform.position`
  - `Find`、`SetActive`
  - 任何引擎 API 调用
- 工作线程**仅允许**执行：纯数值计算、数据解析、文件 IO、网络请求、逻辑预处理

### Unity 异步支持
#### 版本支持
- **async/await 在 Unity 2018.3 及以上版本完全稳定支持**
- 兼容 .NET 4.x / .NET Standard 2.1 运行时

#### Unity 原生可等待对象
可直接在 `await` 后使用，无需额外封装：
- `AsyncOperation`：场景加载、资源加载
- `ResourceRequest`：Resources 异步加载
- `AssetBundleRequest`：AB 包异步加载
- `UnityWebRequest`：网络请求、下载

```csharp
// 直接 await Unity 异步操作
async Task LoadSceneAsync()
{
    await SceneManager.LoadSceneAsync("Game");
}
```

### 线程切换回主线程
#### 自动切回主线程
- Unity 已实现 `SynchronizationContext`
- **await 完成后会自动切回主线程**
- 可直接在 await 后操作 `GameObject`、UI 等引擎对象

```csharp
async Task Test()
{
    await Task.Delay(1000);
    // 自动回到 Unity 主线程，可安全操作对象
    gameObject.SetActive(true);
}
```

#### 手动主线程调度（通用方案）
- 自定义主线程队列（适用于旧版本/封装库）
- 常用方案：`UnityMainThreadDispatcher`、`MonoBehaviour` 消息队列

```csharp
// 工作线程中调度到主线程
UnityMainThreadDispatcher.Instance.Enqueue(() =>
{
    // 主线程执行逻辑
});
```

### 协程 vs async/await
#### Coroutine（协程）
- 运行在**Unity 主线程**，基于迭代器实现
- 轻量、无 GC、无线程切换
- 无返回值、异常处理弱、不支持跨线程、无法组合复杂任务
- 适用：简单延时、简单帧等待

#### async/await
- 支持**跨线程异步**、强类型返回值、完整异常处理
- 支持 `WhenAll`、`WhenAny`、取消、异步流、并行
- 可封装所有 Unity 异步操作
- 适用：网络、加载、复杂异步流程、后台计算

#### 现代 Unity 最佳实践
- 简单帧等待：协程
- **复杂异步、网络、资源加载、后台任务：优先 async/await**

### IL2CPP 下注意事项
#### 兼容性
- async/await、Task、ValueTask 在 IL2CPP 下**完全支持**
- 异步功能可正常发布到 Android、iOS、PC

#### 性能与 GC 优化
- 避免大量**短生命周期 Task**，减少堆分配与 GC
- **高频异步方法必须使用 ValueTask<T>**
- 后台任务使用 `ConfigureAwait(false)` 提升性能
- 避免异步委托闭包造成额外 GC

#### 线程安全强制规范
- IL2CPP 下**线程检查更严格**
- 非主线程访问 Unity 对象会直接崩溃
- 必须严格遵守：**线程只做计算，主线程只操作引擎**

### Unity 异步最佳实践
- 资源加载、场景加载、网络请求全部使用 async/await
- 后台计算完成后通过 await 自动切回主线程更新 UI
- 高频调用异步方法使用 ValueTask 降低 GC
- 异步锁使用 SemaphoreSlim.WaitAsync()
- 所有异步任务搭配 `CancellationToken` 支持取消
- IL2CPP 打包前做全面 GC 与线程安全测试

## 协程
### 核心概念
#### 核心定义
**协程（Coroutine）**是 Unity **基于 C# 迭代器（`IEnumerator`）**实现的**主线程分段执行机制**，**并非多线程**。

所有逻辑始终运行在 Unity 主线程，依靠引擎每帧调度实现**分段执行、暂停等待**，是 Unity 开发中最常用的延时、分帧、异步等待工具。

#### 本质原理
- 基于 `yield return` 实现**暂停执行**，不阻塞主线程
- 由 Unity 引擎在特定时机（帧结束、物理帧、延时结束）**恢复执行**
- 属于协作式任务，主动让出执行权，而非操作系统抢占式调度
- 不创建线程、无线程切换开销、无 GC 压力（复用`yield`对象时）

#### 主要作用
- 延时执行逻辑（延迟调用、技能冷却、倒计时）
- 分帧执行大量计算（批量加载、数据处理），避免主线程卡顿
- 等待资源加载、场景加载、网络请求完成
- 执行序列逻辑（动画流程、对话系统、技能释放流程）
- 非阻塞等待，保持游戏运行流畅

#### 关键特性
- 全程运行在**主线程**，可安全访问 `GameObject`、`Transform`、组件等所有 Unity 对象
- 轻量级、无 GC、无多线程竞态/死锁问题
- 支持等待、嵌套、分帧，编写简单
- **无法并行计算**，不能利用多核 CPU，不能替代多线程

### 基础语法
#### 协程方法定义规则
- 返回值固定为 **`IEnumerator`**
- 方法内必须使用 **`yield return`** 定义暂停点
- 必须依托 `MonoBehaviour` 脚本启动与运行

```csharp
// 标准协程定义
IEnumerator BasicCoroutine()
{
    // 第一段逻辑：调用时立即执行
    Debug.Log("协程启动，立即执行");

    // 暂停：等待下一帧再继续
    yield return null;

    // 第二段逻辑：下一帧执行
    Debug.Log("下一帧恢复执行");
}
```

#### 启动协程
```csharp
// 方式1：直接启动（无法停止）
StartCoroutine(BasicCoroutine());

// 方式2：保存引用（推荐，可精准停止）
Coroutine m_MyCoroutine;
void Start()
{
    m_MyCoroutine = StartCoroutine(BasicCoroutine());
}
```

#### 停止协程
```csharp
// 停止指定协程（必须用引用）
StopCoroutine(m_MyCoroutine);

// 停止当前脚本所有协程
StopAllCoroutines();
```

### 常用 yield 指令
#### 帧相关等待
**等待下一帧（最常用）**

```csharp
yield return null;
```
适用：分帧执行、简单延迟一帧逻辑

**等待当前帧渲染完毕**

```csharp
yield return new WaitForEndOfFrame();
```
适用：截图、相机后处理、UI渲染完成后操作

**等待下一个物理帧（`FixedUpdate`）**

```csharp
yield return new WaitForFixedUpdate();
```
适用：物理相关逻辑、力、射线检测

#### 时间相关等待
**受时间缩放影响的延时**

```csharp
yield return new WaitForSeconds(2f);
```
适用：游戏内计时、技能冷却（受 `timeScale` 影响）

**真实时间延时（不受缩放影响）**

```csharp
yield return new WaitForSecondsRealtime(2f);
```
适用：游戏暂停、广告计时、真实时间倒计时

#### 条件等待
**等待条件为 true**

```csharp
yield return new WaitUntil(() => isReady == true);
```
适用：等待加载完成、等待玩家输入、等待条件达成

**等待条件为 false**

```csharp
yield return new WaitWhile(() => isPlaying == true);
```
适用：等待动画结束、等待状态关闭

#### 异步操作等待
**等待 Unity 异步操作完成**

```csharp
AsyncOperation loadOp = SceneManager.LoadSceneAsync("Battle");
yield return loadOp;
```
适用：场景加载、资源加载、`UnityWebRequest` 网络请求

### 高频实用示例
#### 延时执行一次
```csharp
IEnumerator DelayAction(float delay, Action action)
{
    yield return new WaitForSeconds(delay);
    action?.Invoke();
}

// 使用：2秒后销毁物体
StartCoroutine(DelayAction(2f, () => Destroy(gameObject)));
```

#### 分帧执行大量计算（防卡顿）
```csharp
IEnumerator CalculateInFrames(int count)
{
    for (int i = 0; i < count; i++)
    {
        // 每100次计算分一帧执行
        if (i % 100 == 0)
            yield return null;

        // 计算逻辑
    }
}
```

#### 循环延时（倒计时/循环任务）
```csharp
IEnumerator LoopCountdown(int seconds)
{
    while (seconds > 0)
    {
        Debug.Log(seconds);
        seconds--;
        yield return new WaitForSeconds(1f);
    }
    Debug.Log("时间到");
}
```

#### 等待资源加载完成
```csharp
IEnumerator LoadResource(string path)
{
    ResourceRequest request = Resources.LoadAsync<GameObject>(path);
    yield return request;

    GameObject prefab = request.asset as GameObject;
    Debug.Log("加载完成：" + prefab.name);
}
```

#### 技能序列执行
```csharp
IEnumerator SkillSequence()
{
    Debug.Log("释放前摇");
    yield return new WaitForSeconds(0.5f);

    Debug.Log("释放技能");
    yield return new WaitForSeconds(1f);

    Debug.Log("技能后摇");
}
```

### 嵌套协程（结构化异步）
#### 核心规则
- 父协程可通过 `yield return StartCoroutine()` 调用子协程
- **父协程会等待子协程完全执行完毕**再继续
- 支持多层嵌套，实现清晰的流程化逻辑

```csharp
IEnumerator SkillLogic()
{
    Debug.Log("开始技能");

    // 等待子协程执行完
    yield return StartCoroutine(PlayEffect());

    Debug.Log("技能结束");
}

IEnumerator PlayEffect()
{
    Debug.Log("播放特效");
    yield return new WaitForSeconds(1f);
    Debug.Log("特效结束");
}
```

### 协程生命周期
#### 生命周期规则
- 协程**完全依附于 MonoBehaviour 所在对象**
- `enabled = false` **不会停止**协程
- `gameObject.SetActive(false)` **立即终止协程**
- `Destroy(gameObject)` **立即终止协程**
- 场景切换时，所有协程自动清空停止
- 协程运行中对象被销毁，不会报错，但直接中断

#### 最佳实践
- 长期协程（如背景音乐、全局管理）放在**常驻不销毁对象**上
- 频繁开关的物体，协程要在 `OnDisable` 中手动停止

### 协程高级优化
#### 复用 yield 对象，减少 GC
```csharp
// 全局静态复用，避免重复new
private static readonly WaitForEndOfFrame WaitEndOfFrame = new WaitForEndOfFrame();
private static readonly WaitForFixedUpdate WaitFixedUpdate = new WaitForFixedUpdate();

// 使用
yield return WaitEndOfFrame;
```

#### 协程带参数
```csharp
IEnumerator MoveToTarget(Transform target, Vector3 endPos, float duration)
{
    float time = 0;
    Vector3 start = target.position;

    while (time < duration)
    {
        time += Time.deltaTime;
        target.position = Vector3.Lerp(start, endPos, time / duration);
        yield return null;
    }
}
```

#### 停止所有协程（清理用）
```csharp
void OnDisable()
{
    StopAllCoroutines();
}
```

### 协程 vs Thread 多线程
| 对比项        | 协程                          | 多线程 Thread                  |
|--------------|-------------------------------|---------------------------------|
| 运行线程      | 仅主线程                      | 多线程并行                      |
| Unity 对象访问 | 完全安全                      | 禁止访问，会直接崩溃            |
| 线程安全      | 无线程竞争、无死锁            | 必须加锁，存在竞态风险          |
| 性能开销      | 极低、无GC                    | 线程创建/切换开销大             |
| 适用场景      | 延时、分帧、加载、流程        | CPU密集计算、网络IO、文件处理   |

### 协程 vs async/await
| 对比项        | 协程                          | async/await                    |
|--------------|-------------------------------|---------------------------------|
| 跨线程支持    | 不支持                        | 支持                            |
| 异常处理      | 无法try-catch，报错直接中断    | 完整try-catch，异常安全可捕获   |
| 任务组合      | 无WhenAll/WhenAny              | 支持任务组合、取消、超时        |
| 语法复杂度    | 简单易学                      | 稍复杂，但功能极强              |
| 适用场景      | 简单延时、分帧、简单动画      | 网络、加载、复杂异步、后台计算  |

### Unity 现代开发规范
- **简单延时、分帧、简单动画、简单序列** → **协程**
- **网络请求、资源加载、场景管理、复杂异步流程、取消/超时** → **async/await**