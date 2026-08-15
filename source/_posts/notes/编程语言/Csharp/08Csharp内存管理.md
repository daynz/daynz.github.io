---
title: "08Csharp内存管理"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/08Csharp内存管理.html
tags: [编程语言]
---

# 内存管理
[toc]

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

object ，接口引用强制转换为对应值类型

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

## 内存基础概念

### 托管内存与原生内存
- **托管内存**
  - C# 层面内存，包含**栈**与**托管堆**
  - 由 **CLR GC** 全权管理分配与回收
  - 对应 C# 实例对象、string、数组、自定义 class 等
- **原生内存（Native Memory）**
  - Unity 引擎底层 **C++ 堆** 分配
  - 不受 C# GC 管理，需手动/引擎规则释放
  - 典型对象：**Texture、Mesh、Material、AssetBundle、Audio Clip、Render Texture** 等所有 `UnityEngine.Object` 子类

### 栈内存 Stack
- **存储内容**
  - **值类型**实例（int、float、bool、struct、Vector3 等）
  - 引用类型变量**引用地址**（指针）
  - 函数参数、局部变量、调用栈帧
- **特性**
  - 后进先出，编译期确定大小
  - **自动分配 & 自动释放**，无需 GC
  - 访问速度极快，无碎片、无开销
- **注意**
  - 高频数学计算（坐标、向量）尽量用 struct 减少堆分配
  - 结构体嵌套过深仍会占用栈空间，过大可能栈溢出

### 托管堆 Heap
- **存储内容**
  - **引用类型**实例（class、string、数组、委托、装箱值类型）
  - 运行时动态分配，大小不固定
- **管理机制**
  - 由 **GC 垃圾回收** 负责追踪与释放
  - 分配与回收均有性能开销，回收会触发**主线程卡顿**
- **Unity 特性**
  - Unity 为单线程渲染，**GC 只能在主线程执行**
  - 堆内存只会增长不会自动缩减（除非主动调用收缩 API）

### 内存泄漏
#### 托管内存泄漏
- 原因：对象被**长期有效引用**持有，GC 判定为存活无法回收
- 典型场景
  - 静态集合（static List/Dictionary）持续添加对象
  - 单例、静态类持有场景对象引用
  - 委托/事件未注销，造成隐式引用
  - 闭包捕获外部变量延长生命周期
- 危害：堆持续膨胀，GC 越来越频繁

#### 原生内存泄漏
- 原因：`UnityEngine.Object` 未调用 `Destroy`，资源未卸载
- 典型场景
  - 动态创建 `GameObject`/`Texture` 未 `Destroy`
  - AssetBundle 加载后未 `Unload`
  - `Resources.Load` 重复加载且无释放
  - 场景切换后残留原生资源
- 危害：**内存占用持续上升，最终 OOM 崩溃**

### 内存碎片
- 形成原因
  - 频繁分配与释放**小对象**，堆中产生大量不连续空闲块
  - 大对象无法找到连续空间，触发 GC 或堆扩容
- 性能影响：降低内存分配速度，触发更频繁、更耗时的 GC
- **Unity 优化要点**
  - 避免帧循环内 string 拼接、装箱、临时数组
  - 使用**对象池**复用频繁创建销毁对象
  - 采用 `NativeArray`/`MemoryPool` 减少托管堆分配

### Unity 内存管理最佳实践
- 原生资源：动态创建必 `Destroy`，AB 包及时 `Unload`
- 托管堆：减少帧级堆分配，使用对象池、结构体
- 避免装箱：用泛型替代非泛型集合，少用 `object` 传值
- 字符串：使用 `StringBuilder`，避免频繁拼接
- 内存碎片：大对象预分配，小对象复用，禁止帧内临时分配
- 线程安全：**原生资源与 Unity API 只能在主线程访问**

## 结构体 struct 优化
### 核心定义与特性
- **值类型**，分配于**栈**或**内联于引用类型**，无托管堆分配
- **无GC开销**，实例化、销毁、复制均不触发垃圾回收
- 内存**连续紧凑**，CPU缓存命中率极高，访问速度快
- 默认**不可为null**，无引用开销

### 适用场景
- 纯数据载体：**Vector3、Color、坐标、伤害信息、路径点、网格顶点**
- 生命周期短、创建销毁极频繁的小数据对象
- 大量批量数据（十万/百万级数组），追求内存紧凑与速度
- 配合Job System、Burst使用的**原生兼容结构体**

### 不适用场景
- 结构体**体积过大**（经验值>**128字节**），拷贝成本急剧上升
- 需要频繁传递、修改、作为方法参数大量调用
- 需要继承、多态、为null的场景
- 生命周期长、单例化的数据管理类

### 优化技巧
#### readonly struct（C# 7.2+）
- 声明为**不可变结构体**，禁止修改字段
- 编译器自动优化，杜绝意外拷贝，性能最优
```csharp
// 最优实践：只读结构体
public readonly struct DamageInfo
{
    public float Value { get; }
    public bool IsCritical { get; }
    public DamageInfo(float value, bool isCritical) => (Value, IsCritical) = (value, isCritical);
}
```

#### in / ref 关键字避免拷贝
- `in`：只读引用传递，**零拷贝**，最常用
- `ref`：可修改引用传递
- 大结构体必须用此方式传递
```csharp
// 无拷贝，性能最高
void TakeDamage(in DamageInfo info) { }
```

#### 结构体数组优化
- 结构体数组内存**完全连续**，遍历速度远超类数组
- 无引用跳转，CPU缓存效率提升数倍
- 百万级数据无GC压力
```csharp
// 高性能连续内存，无任何GC
Vector3[] positions = new Vector3[10000];
```

#### 字段布局优化
- 字段按**类型大小排序**（float→int→bool），减少内存填充
- 可使用`[StructLayout]`精准控制内存

### struct与class 性能对比
- **内存分配**
  - struct：栈/内联，**无堆分配，无GC**
  - class：托管堆分配，**GC回收开销**
- **内存布局**
  - struct：**连续紧凑**，CPU缓存友好
  - class：离散内存，引用跳转，缓存不友好
- **传递方式**
  - struct：默认**值拷贝**，大体积拷贝开销高
  - class：**引用拷贝**，无实例复制开销
- **特殊支持**
  - struct：完美支持**Job System、Burst、NativeArray**
  - class：不支持多线程高性能组件

### Unity中Struct
- Unity 内置类型（Vector3、Color、Quaternion）均为**struct**，天然高性能
- 结构体**不能继承**`MonoBehaviour`，不可挂载到`GameObject`
- 结构体作为**public字段**暴露在Inspector中，序列化正常
- 大结构体（>128B）**禁止频繁传递**，必须用`in`/`ref`
- 结构体数组赋值是**整体拷贝**，避免直接赋值

### 高性能代码示例
```csharp
// 1. 高性能只读结构体
public readonly struct UnitData
{
    public int Hp { get; }
    public float Speed { get; }
    public UnitData(int hp, float speed) => (Hp, Speed) = (hp, speed);
}

// 2. 零拷贝传递
public void SetData(in UnitData data) { }

// 3. 百万级高性能数组
UnitData[] dataArray = new UnitData[1000000];

// 4. 高性能遍历（无GC，缓存最优）
void Update()
{
    for (int i = 0; i < dataArray.Length; i++)
    {
        var data = dataArray[i];
    }
}
```

### 最佳实践
- 小数据（<64B）优先用**readonly struct**，零GC最优
- 方法参数一律用`in`关键字，杜绝拷贝
- 批量数据优先用**结构体数组**，替代类列表
- 配合Job System使用结构体，实现多线程无GC计算
- 超过128B的大数据拆分为多个小结构体，或改用class+对象池

## 对象池 Object Pool
### 核心作用
- 替代 Unity 频繁 **Instantiate / Destroy** 操作
- 消除原生对象创建销毁的 CPU 峰值与**GC 开销**
- 解决大量临时对象（子弹、特效）造成的卡顿、内存碎片

### 适用场景
- 高频创建销毁的游戏对象：**子弹、特效、怪物、碎片、UI 格子、 projectile**
- 同模板预制体批量生成的实体
- 生命周期短、复用性高的物体

### 不适用场景
- 单次使用、长期驻留的对象
- 场景唯一、极少切换的物体

### 核心结构
- 容器：**Queue<T>**（先进先出，符合对象复用逻辑）/ Stack<T>
- 核心方法
  - **Get()**：无闲置对象则创建，有则直接取出
  - **Release()**：回收对象，隐藏并重置状态
- 预制体 + 父节点管理，统一层级

### 基础对象池实现
```csharp
using System.Collections.Generic;
using UnityEngine;

// 通用泛型对象池
public class ObjectPool<T> where T : Component
{
    private readonly Queue<T> _pool = new Queue<T>();
    private readonly T _prefab;
    private readonly Transform _parent;

    public ObjectPool(T prefab, int initCount = 0)
    {
        _prefab = prefab;
        _parent = new GameObject($"Pool_{typeof(T).Name}").transform;
        // 预加载
        for (int i = 0; i < initCount; i++)
        {
            T obj = CreateNew();
            obj.gameObject.SetActive(false);
            _pool.Enqueue(obj);
        }
    }

    // 获取对象
    public T Get()
    {
        if (_pool.Count == 0) CreateNew();
        T obj = _pool.Dequeue();
        obj.gameObject.SetActive(true);
        return obj;
    }

    // 回收对象
    public void Release(T obj)
    {
        if (obj == null) return;
        obj.gameObject.SetActive(false);
        _pool.Enqueue(obj);
    }

    // 创建新实例
    private T CreateNew()
    {
        T obj = Object.Instantiate(_prefab, _parent);
        return obj;
    }
}
```

### 业务使用示例（子弹/特效）
```csharp
public class Bullet : MonoBehaviour
{
    public ObjectPool<Bullet> Pool;
    private void OnDisable() => ResetState();

    // 必须重置状态（关键）
    private void ResetState()
    {
        transform.position = Vector3.zero;
        transform.rotation = Quaternion.identity;
        GetComponent<Rigidbody>().velocity = Vector3.zero;
    }

    private void OnCollisionEnter(Collision other)
    {
        Pool.Release(this); // 命中后回收
    }
}

// 调用方
public class Gun : MonoBehaviour
{
    public Bullet bulletPrefab;
    private ObjectPool<Bullet> _bulletPool;

    private void Start()
    {
        _bulletPool = new ObjectPool<Bullet>(bulletPrefab, 20); // 预加载20发
    }

    private void Fire()
    {
        Bullet bullet = _bulletPool.Get();
        bullet.Pool = _bulletPool;
        bullet.transform.SetPositionAndRotation(transform.position, transform.rotation);
    }
}
```

### Unity 官方对象池
- 命名空间：**UnityEngine.Pool**
- 无需自己实现，开箱即用，性能更优
```csharp
using UnityEngine.Pool;

IObjectPool<Bullet> _pool = new ObjectPool<Bullet>(
    createFunc: () => Instantiate(bulletPrefab),
    actionOnGet: obj => obj.gameObject.SetActive(true),
    actionOnRelease: obj => obj.gameObject.SetActive(false),
    actionOnDestroy: obj => Destroy(obj.gameObject),
    defaultCapacity: 20, maxSize: 100
);
```

### 核心注意事项
#### 必须重置对象状态
- 位置、旋转、速度、开关、计时器必须**清空/还原**
- 防止脏数据造成逻辑错误

#### 限制最大容量
- 必须设置 **maxSize**，防止无限扩容导致内存溢出
- 超出容量的对象直接 Destroy，不回收

#### 生命周期管理
- 场景切换时**清空池**，避免跨场景引用
- 切换场景调用 `Pool.Clear()` 销毁所有对象

#### 性能与GC
- 对象池**完全消除实例化GC与Destroy开销**
- 初始化预加载，避免战斗中突然创建对象

### Unity 最佳实践
- 池化对象统一挂在空节点下，保持层级整洁
- 战斗/特效密集场景**预加载池对象**，避免运行时卡顿
- 动态物体（带`Rigidbody`）必须重置物理状态
- 禁止在对象池内存活的对象上使用 `Destroy`
- UI 元素（Item、Tips）优先使用对象池，GC 收益极高

### 优势总结
- 大幅降低 **Instantiate/Destroy** CPU 开销
- 完全消除临时对象产生的 **`GC Alloc`**
- 减少内存碎片，稳定运行帧率
- 百万级子弹/特效场景必备优化方案

## Unity 资源内存管理
### 核心概念
- 所有继承自 **UnityEngine.Object** 的资源均为**原生内存资源**
- 存储在 **C++ 堆**，不受 C# GC 管理，必须手动管理生命周期
- 内存占用远大于托管内存，泄漏直接导致 **OOM 崩溃**

### 资源泄漏常见原因
#### AB 包未卸载
- 加载后忘记调用 `Unload`，包体与资源常驻内存
#### 强引用残留
- 静态变量、单例持有原生资源引用
- 场景销毁后资源未释放
#### 动态对象未销毁
- 特效、粒子、RenderTexture 未调用 `Destroy`
- 持续渲染导致资源无法释放
#### 重复加载
- 同一资源多次加载，产生多份内存拷贝

### 纹理资源优化
- **压缩格式**：移动端优先 **ASTC/ETC2**，PC 用 BC7
- **关闭 Read/Write**：开启会导致内存翻倍（CPU+GPU双份）
- **Mipmap**：3D场景开启提升性能，2D/UI关闭
- **`SpriteAtlas`**：UI 图片合图，减少 `DrawCall` 与内存碎片
- **尺寸限制**：最大 2048/1024，按需调整

### 音频资源优化
- 压缩格式：语音用 **`Vorbis`**，音效用 ADPCM
- 强制 **单声道**，立体声仅用于背景音乐
- 加载方式：流式加载（背景音乐）、预加载（短音效）
- 禁止超长音效无压缩加载

### Mesh 资源优化
- 关闭 **Read/Write** 减少内存占用
- 合并小网格，减少顶点数量
- 压缩顶点信息，优化精度

### Unity 关键规则
- `Destroy(obj)` 仅释放**原生资源**，C# 引用还在
- `obj = null` 仅清空引用，**不释放原生内存**
- 资源卸载必须遵循：销毁实例 → 释放资源 → 卸载包体
- 原生资源只能在**主线程**创建与销毁
- 引用计数为 0 时资源才会真正释放

### 内存管理最佳实践
- 动态资源必须 **按需加载、用完即卸载**
- 使用 Addressable 替代 AB/Resources，自动管理引用
- 所有资源关闭 Read/Write，按需开启 Mipmap
- 场景切换时强制卸载无用资源与 AB 包
- 用 Profiler → Memory 排查原生内存占用
- 禁止静态变量引用原生资源

### 核心API示例
```csharp
// AB 安全卸载
IEnumerator UnloadAssetBundle(AssetBundle bundle)
{
    bundle.Unload(false); // 卸载包体
    yield return Resources.UnloadUnusedAssets(); // 释放无用资源
}

// 销毁原生对象
void DestroyNativeObject(UnityEngine.Object obj)
{
    if (obj != null) Destroy(obj);
}
```

## `IDisposable` 与非托管资源释放
### 核心作用
- 用于**手动释放非托管资源**，不受 GC 控制
- 释放时机可控，避免资源泄漏、句柄占用
- 解决 GC 无法感知的原生资源残留问题
- 遵循 **RAII**（资源获取即初始化）机制

### 适用资源类型
- 文件/网络流：FileStream、MemoryStream、NetworkStream
- 连接对象：数据库连接、Socket
- Unity 原生对象：**UnityWebRequest、WWW、NativeArray、NativeList、RenderTexture**
- 系统句柄、画笔、纹理句柄

### 基础语法
#### `IDisposable` 接口实现
```csharp
public class CustomResource : IDisposable
{
    // 标记是否已释放
    private bool _disposed = false;

    // 公共释放方法
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    // 释放逻辑
    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        if (disposing) { /* 释放托管资源 */ }
        /* 释放非托管资源 */
        _disposed = true;
    }

    // 析构函数兜底
    ~CustomResource() => Dispose(false);
}
```

#### using 语句
- **自动调用 Dispose**，离开作用域立即释放
- 即使发生异常也能保证释放，最安全简洁
```csharp
// 自动释放，无需手动调用
using (var resource = new CustomResource())
{
    // 使用资源
}
```

### Unity 高频释放对象
- **UnityWebRequest**：必须释放，否则句柄泄漏
- **`AsyncOperation`** 相关原生句柄
- **NativeArray/NativeList/NativeQueue**（Job 专用）
- **RenderTexture**：用完需释放或销毁
- **AssetBundle**：原生资源，需手动卸载
- **Coroutine 停止句柄**（非托管）

### Unity 实用代码示例
#### UnityWebRequest 释放（必用 using）
```csharp
IEnumerator DownloadTexture(string url)
{
    // 自动释放，杜绝泄漏
    using (var request = UnityWebRequestTexture.GetTexture(url))
    {
        yield return request.SendWebRequest();
        if (!request.isHttpError && !request.isNetworkError)
        {
            Texture2D tex = DownloadHandlerTexture.GetContent(request);
        }
    }
}
```

#### NativeArray 释放
```csharp
// 必须手动释放，否则内存泄漏
using (var nativeArray = new NativeArray<int>(100, Allocator.TempJob))
{
    // 多线程运算
}
```

### 正确释放规则
#### 谁创建谁释放
- 资源创建方负责释放，禁止外部越权释放
- 避免传递后无人管理导致泄漏

#### 禁止重复释放
- 释放后标记状态，重复调用会崩溃
- 用 `_disposed` 布尔值做防护

#### using 优先原则
- 能用 using 绝对不手动写 Dispose
- 异常安全、代码简洁、无遗漏

#### 主线程安全
- Unity 原生资源**必须在主线程释放**
- 子线程调用 Dispose 直接报错

### 常见陷阱
- 忘记释放 UnityWebRequest，造成**句柄泄漏**
- 手动调用 Dispose 后未置空，二次调用崩溃
- Native 容器未释放，造成**引擎层内存泄漏**
- using 语句内部分线程/异步，提前释放资源
- 析构函数中访问 Unity 对象，导致不可预知错误

### 托管 vs 非托管释放区别
- 托管资源：GC 自动回收，无需手动处理
- 非托管资源：**必须手动 Dispose**，GC 无法释放
- IDisposable 核心价值：**主动释放非托管资源**

### Unity 最佳实践
- 所有 UnityWebRequest 必须包裹 **using**
- Native 容器必须用 using 或手动 Dispose
- 自定义原生资源类，必须实现完整 Dispose 模式
- 禁止在析构函数中访问任何 Unity 对象
- 异步任务中确保资源释放，避免任务中断泄漏
- 释放前判断空值与释放状态，提升稳定性

## 内存泄漏定位与常见场景
### 核心定义
- **内存泄漏**：已不再使用的内存资源**无法被回收**，导致内存持续增长、最终OOM崩溃
- **托管泄漏**：C#堆对象被无效引用，GC无法回收
- **原生泄漏**：Unity C++资源未卸载、无引用计数释放，常驻内存

### 托管内存泄漏（面试高频）
#### 静态集合引用
- 场景：`static List<GameObject>`、`static Dictionary` 持续添加对象
- 原因：静态对象生命周期贯穿整个程序，持有引用永不释放
- 特征：堆内存只增不减，切换场景无法回收

#### 事件/委托未注销
- 场景：`button.onClick.AddListener`、自定义事件`+=`，未执行`-=`
- 原因：发布者（事件对象）持有订阅者（方法所属对象）强引用
- 特征：对象被销毁但仍常驻内存，无法GC

#### 闭包与匿名函数捕获
- 场景：协程、异步中使用闭包捕获外部变量
- 原因：闭包生成隐藏类，延长变量生命周期
- 特征：局部变量被长期持有，造成意外泄漏

#### MonoBehaviour 假存活
- 场景：物体`SetActive(false)`但未`Destroy`
- 原因：组件仍存在于场景中，引用全部有效
- 特征：以为已销毁，实际持续占用内存

#### 单例滥用
- 场景：单例类持有场景对象、UI、资源引用
- 原因：单例不销毁，所有引用对象均无法GC
- 特征：跨场景引用残留，资源永久常驻

### 原生内存泄漏
#### 原生资源未销毁
- 对象：`Texture、Mesh、AudioClip、RenderTexture、Material`
- 操作：动态创建后仅赋值`null`，未调用`Destroy`
- 后果：C++内存永久占用，Profiler显示原生内存暴涨

#### AssetBundle 未卸载
- 操作：加载AB后未调用`Unload()`，或仅调用`Unload(false)`
- 后果：AB包体、依赖资源全部常驻，无法释放
- 高频陷阱：依赖包未卸载导致主资源泄漏

#### 动态GameObject未销毁
- 场景：特效、子弹、怪物仅隐藏未销毁
- 操作：`SetActive(false)`替代`Destroy`
- 后果：GameObject、Mesh、材质等原生资源全部常驻

#### 资源拖拽引用残留
- 场景：预制体、材质、脚本拖拽赋值形成强引用链
- 后果：资源被静态引用，切换场景、卸载AB均无法释放

#### 渲染目标未释放
- 对象：`RenderTexture、ComputeBuffer`
- 操作：创建后未`Release`/`Destroy`
- 后果：GPU内存泄漏，显存持续增长

### 内存泄漏定位工具与流程
#### Memory Profiler
- 窗口路径：Window → Analysis → Memory Profiler
- 核心操作：**Take Snapshot** 捕获内存快照
- 核心功能：查看托管堆+原生内存全貌，定位泄漏对象

#### 引用链分析
- 功能：**Find References By** 查看对象被谁持有
- 目标：找到**GC Root**（静态对象、系统对象、单例）
- 操作：点击泄漏对象 → 查看引用路径 → 定位泄漏根源

#### Profiler 内存模块
- 查看：Total Memory、GC Allocation、Native Memory
- 特征：内存持续上升、无下降趋势 → 确认泄漏
- 区分：GC触发不回落=托管泄漏；原生内存持续上涨=原生泄漏

#### Deep Profiler
- 功能：深度追踪函数调用，定位泄漏代码位置
- 用法：开启后运行场景，捕获分配与引用逻辑

### 快速定位步骤
1. 进入场景→执行操作→退出场景→触发`UnloadUnusedAssets`
2. 捕获内存快照，对比场景进入前内存
3. 筛选残留对象：按类型、名称过滤
4. 查看引用链，找到**根引用**（static、事件、单例、AB包）
5. 定位代码：注销事件、清空集合、销毁原生资源、卸载AB

### 泄漏判定标准
- 退出场景后，**GameObject、组件、资源**应接近归零
- 托管堆内存应明显回落，原生内存同步释放
- 多次进出场景，内存无明显增长为正常

### 常见陷阱
- 以为`obj = null`就能释放资源：**仅清空引用，不释放原生内存**
- 以为`SetActive(false)`等于销毁：**完全错误，所有资源仍存在**
- 以为场景切换自动释放：**静态引用、AB包、单例不会释放**
- 忘记事件注销：**最常见托管泄漏原因**
- 只加载AB不卸载：**最常见原生泄漏原因**

### 修复方案速查
- 静态集合：场景退出时**Clear()**
- 事件：`OnDestroy`中执行`-=`注销
- 动态对象：用完立即`Destroy`
- 原生资源：不用则`Destroy`
- AB包：卸载调用`Unload(true)`
- 闭包：避免长生命周期捕获临时对象

### Unity 最佳实践
- 遵循**谁创建谁销毁、谁订阅谁注销**原则
- 场景退出统一执行：销毁对象→清空集合→注销事件→卸载AB
- 禁用非必要静态引用，使用弱引用替代强引用
- 定时捕获内存快照，提前排查泄漏
- 原生资源必须配对：`Create` ↔ `Destroy`，`Load` ↔ `Unload`

## 高级性能优化
### 无GC编程
#### 核心原则
- 运行时（Update/战斗/物理）**0 GC Alloc**
- 杜绝堆内存分配，避免GC触发卡顿
- 全程栈分配、复用内存、原生容器

#### 结构体优先
- 所有纯数据使用**readonly struct**
- 配合`in`参数零拷贝传递
- 无堆分配、无GC、CPU缓存友好

#### 数组复用与池化
- 禁止帧内`new T[]`分配
- 预分配数组，**复用长度**
- 使用**ArrayPool**数组池，运行时零分配
```csharp
// 数组池（无GC）
using System.Buffers;
int[] buffer = ArrayPool<int>.Shared.Rent(1024);
ArrayPool<int>.Shared.Return(buffer);
```

#### 无GC字符串处理
- 禁用`string.Format`、`+`拼接
- 使用`StringBuilder`缓存复用
- 采用**字符串池**避免重复分配
- Unity使用`UnityEngine.StringBuilder`减少装箱

#### NativeArray & Unity.Mathematics
- **NativeArray**：非托管数组，无GC、支持多线程
- **Unity.Mathematics**：SIMD数学库，float3/float4加速运算
- 完全无GC，配合Burst实现极致性能
```csharp
// 原生数组无GC运算
using NativeArray<int> data = new NativeArray<int>(1000, Allocator.TempJob);
```

#### 无GC高性能容器
- **NativeList/NativeQueue/NativeHashMap**
- 无GC、无装箱、支持多线程
- 替代`List/Dictionary`实现帧内无GC存储

### 对象池化扩展
#### 数组池
- 复用临时数组，避免频繁分配释放
- 适用：序列化、计算缓冲、图形处理

#### 字符串池
- 复用高频字符串（名称、Key、路径）
- 消除字符串重复分配与GC

#### 任务池
- 复用异步/协程任务对象
- 消除闭包、迭代器分配
- 适用：大量AI、逻辑定时任务

#### Unity 官方池化API
- `UnityEngine.Pool`：对象池/集合池全内置
- 开箱即用，无GC、线程安全
```csharp
List<Bullet> list = ListPool<Bullet>.Get();
ListPool<Bullet>.Release(list);
```

### 减少主线程开销
#### 计算逻辑移至子线程
- 寻路、A*、数据解析、网络消息处理**全异步**
- 禁止主线程处理耗时计算
- 严格遵循：**Unity API 只能在主线程调用**

#### Job System
- 自动管理线程池，并行执行任务
- 无GC、无线程创建开销
- 配合NativeContainer实现数据安全
```csharp
// 基础Job结构
public struct CalcJob : IJob { public void Execute() { } }
```

#### 分帧执行
- 大逻辑拆分为多帧运行，降低单帧CPU占用
- 适用：场景加载、AI寻路、批量实体更新
- 实现：协程分帧、时间片调度、计数器分步

#### 协程优化
- 缓存`YieldInstruction`（WaitForSeconds等）
- 禁用闭包，避免值类型捕获装箱
- 自定义`YieldInstruction`实现无GC等待

### Burst 编译器
#### 核心特性
- Unity官方**LLVM优化编译器**
- 自动向量化、SIMD指令优化
- 性能接近C++，远超普通C#

#### 编译优化点
- 数学运算、循环、数组访问极致加速
- 消除边界检查、虚方法调用
- 无GC、无托管开销

#### 最佳实践组合
- **Burst + Job System + NativeArray + Mathematics**
- 百万实体、物理模拟、粒子计算专用方案
- 移动端性能提升**5~10倍**

### ECS 架构
#### 核心设计
- **实体(Entity)+组件(Component)+系统(System)**
- 数据连续存储，无面向对象开销
- 纯数据驱动，无GC、无装箱

#### 性能优势
- 内存紧凑、缓存命中率100%
- 天然并行，支持千万级实体
- 无GC、无堆分配、无面向对象损耗

#### 适用场景
- 开放世界、大量怪物、弹幕游戏、粒子特效
- 性能瓶颈为CPU的重度逻辑项目

### 高级优化陷阱
- 子线程访问Unity API导致崩溃
- Native容器未释放造成原生泄漏
- 分帧逻辑时序错误导致逻辑异常
- 数组池复用未清空造成脏数据
- 无GC代码过度复杂，维护成本上升

### Unity 高性能最佳实践
- 运行时逻辑**全程无GC**，堆内存零增长
- 数学计算使用`Unity.Mathematics`替代System API
- 耗时任务一律使用**Job System**并行处理
- 临时内存使用`ArrayPool/NativeContainer`
- 海量实体采用**ECS+Burst**架构
- 数组、列表、字符串全维度池化复用
- 主线程只做渲染与逻辑调度，不做耗时计算
- 发布启用**IL2CPP**，禁用Mono，性能提升显著