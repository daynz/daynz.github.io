---
title: "Unity委托与事件"
date: 2026-08-08 18:04:25
permalink: /notes/游戏引擎/Unity/Unity委托与事件.html
tags: [游戏引擎]
---

# Unity 委托与事件

[toc]

## 核心设计模式：观察者模式（发布-订阅模式）

### 模式定义
**观察者模式**：定义**一对多**的依赖关系，让 **一个目标对象（主题 / 发布者）** 状态变化时，**自动通知所有依赖它的观察者（订阅者）**，并自动触发更新。
- 主题（Subject）：被监听的对象
- 观察者（Observer）：监听别人的对象

核心：**发布 - 订阅思想、双向解耦、被动通知**

### 核心角色
1. **抽象观察者 `IObserver`**：统一更新接口，所有具体观察者必须实现，规范接收通知的行为。
2. **具体观察者 `ConcreteObserver`**：实现更新逻辑，收到通知后执行自身业务（UI 刷新、播放音效、逻辑判定）。
3. **抽象主题 `Subject`**：维护观察者容器，提供订阅、退订、广播通知抽象 / 基础方法。
4. **具体主题 `ConcreteSubject`**：继承抽象主题，实现广播逻辑；自身状态改变时，主动推送通知。

### 核心运行流程
1. 观察者主动订阅主题；
2. 主题内部存储所有已订阅观察者；
3. 主题自身状态 / 事件触发；
4. 主题遍历所有观察者，统一调用更新方法；
5. 观察者接收消息，执行各自独立逻辑；
6. 不需要时，观察者主动退订，解除依赖。

### 优缺点
| 维度 | 优点 | 缺点 |
|------|------|------|
| 解耦性 | 完全解耦：主题和观察者依赖抽象，发布者无需关心订阅者，订阅者无需关心发布者 | 消息默认广播：无差别通知所有观察者，存在无效回调 |
| 扩展性 | 1. 一对多自动联动，适配游戏事件、UI更新等场景；<br>2. 运行时动态订阅/退订；<br>3. 符合开闭原则，新增观察者无侵入 | 1. 易引发连锁调用，排查困难；<br>2. Unity中遗忘退订会导致内存泄漏；<br>3. 大型项目易出现事件泛滥、链路混乱 |

### 基础实现代码
```c#
// 抽象观察者
public interface IObserver
{
    void Update(string message);
}

// 抽象主题
public abstract class Subject
{
    protected List<IObserver> _observers = new List<IObserver>();

    public void AddObserver(IObserver observer)
    {
        if (!_observers.Contains(observer))
            _observers.Add(observer);
    }

    public void RemoveObserver(IObserver observer)
    {
        _observers.Remove(observer);
    }

    public virtual void Notify(string message)
    {
        foreach (var obs in _observers)
        {
            obs.Update(message);
        }
    }
}

// 具体主题
public class ConcreteSubject : Subject {}

// 具体观察者
public class ConcreteObserver : IObserver
{
    public void Update(string message)
    {
        Console.WriteLine($"观察者接收消息：{message}");
    }
}

// 测试调用
class Program
{
    static void Main()
    {
        Subject subject = new ConcreteSubject();
        IObserver observer = new ConcreteObserver();

        subject.AddObserver(observer);
        subject.Notify("玩家血量过低");
        subject.RemoveObserver(observer);
    }
}
```

## 委托（Delegate）
### 核心定义
`Delegate` 是 C# 提供的**类型安全的函数指针容器**，用于存储、传递、调用一个或多个方法的引用。它规定了方法的参数与返回值格式，不关心方法具体实现。

### 核心特性
- 可绑定：静态方法、实例方法、匿名函数、Lambda 表达式
- 多播能力：一次性调用多个绑定方法
- 解耦基础：是模块解耦、回调机制的核心单元
- 运行时管理：由 .NET 运行时管理，与 Unity 引擎底层无直接关联

### 底层原理
- 所有委托都继承自 `System.MulticastDelegate`
- 内部持有 `_target`（方法所属对象）、`_methodPtr`（函数指针）
- 多播委托维护 `InvocationList` 数组存储所有绑定委托
- 调用时 CLR 遍历列表执行，无反射开销

### 基础代码示例
```csharp
// 声明委托类型
public delegate void AttackDelegate(int damage);

public class Player : MonoBehaviour
{
    // 声明委托变量
    private AttackDelegate _onAttack;

    void Start()
    {
        // 绑定方法
        _onAttack = TakeDamage;
        _onAttack += ShowDamageText;
        
        // 调用委托
        _onAttack.Invoke(50);
    }

    void TakeDamage(int damage) { }
    void ShowDamageText(int value) { }
}
```

### 内置委托类型
#### Action（无返回值委托）
- **核心定义**：.NET 内置的无返回值泛型委托，无需手动声明，支持 0~16 个参数，Unity 开发最常用。

```csharp
// 无参数
Action onComplete;
// 带参数
Action<int, string> onDataReceived;

void Start()
{
    onDataReceived = (id, name) => Debug.Log(id + name);
    onDataReceived.Invoke(1, "Unity");
}
```

- 底层：sealed 委托类型，无 GC、高性能，适配高频逻辑。

#### `Func`（带返回值委托）
- **核心定义**：带返回值的系统内置泛型委托，**最后一个泛型参数为返回类型**；多播时仅返回最后一个方法的结果。

```csharp
Func<int, int> OnCalculate;

void Start()
{
    OnCalculate = x => x * 2;
    int result = OnCalculate.Invoke(10); // 20
}
```


## EventArgs
### 核心定义
`EventArgs` 是 C# 提供的**事件参数基类**，用于在事件触发时传递自定义数据。所有自定义事件参数类都应继承自它，是 .NET 事件系统中标准化传递数据的规范。

### 核心特性
- 无默认成员，仅作为基类标记
- 强类型数据传递，替代弱类型的 object 传参
- 可序列化，支持跨域/进程传递
- 遵循 .NET 命名规范：自定义参数类命名为 `XXXEventArgs`

### 底层原理
- 继承自 `System.Object`，是所有事件参数的根类型
- 编译器无特殊处理，仅作为约定俗成的编码规范
- 配合 `EventHandler<TEventArgs>` 使用时，提供类型安全的参数传递

### 代码示例
#### 自定义 `EventArgs`
```csharp
// 自定义事件参数（继承 EventArgs）
public class PlayerHpChangedEventArgs : EventArgs
{
    // 封装需要传递的数据
    public int CurrentHp { get; private set; }
    public int ChangeValue { get; private set; }
    public bool IsDead { get; private set; }

    // 构造函数初始化数据
    public PlayerHpChangedEventArgs(int currentHp, int changeValue, bool isDead)
    {
        CurrentHp = currentHp;
        ChangeValue = changeValue;
        IsDead = isDead;
    }
}
```

#### 结合 `EventHandler` 使用
```csharp
public class Player : MonoBehaviour
{
    // 声明带自定义参数的事件
    public event EventHandler<PlayerHpChangedEventArgs> OnHpChanged;

    private int _hp = 100;

    public void TakeDamage(int damage)
    {
        _hp -= damage;
        bool isDead = _hp <= 0;

        // 触发事件并传递参数
        OnHpChanged?.Invoke(this, new PlayerHpChangedEventArgs(_hp, -damage, isDead));
    }
}

// 外部订阅者
public class UIManager : MonoBehaviour
{
    void Start()
    {
        GetComponent<Player>().OnHpChanged += OnPlayerHpChanged;
    }

    // 事件处理方法（遵循 EventHandler 签名）
    private void OnPlayerHpChanged(object sender, PlayerHpChangedEventArgs e)
    {
        Debug.Log($"当前血量：{e.CurrentHp}");
        Debug.Log($"血量变化：{e.ChangeValue}");
        if (e.IsDead)
        {
            Debug.Log("玩家死亡，显示死亡UI");
        }
    }
}
```

#### 无参数 `EventArgs`（使用默认空实例）
```csharp
// 无自定义数据时，使用 EventArgs.Empty 静态实例
public event EventHandler OnPlayerBorn;

public void SpawnPlayer()
{
    // 无参数传递时的标准写法
    OnPlayerBorn?.Invoke(this, EventArgs.Empty);
}
```

### 核心规范与最佳实践
#### 命名规范
- 自定义参数类：`[业务场景] + EventArgs`（如 `EnemyDeathEventArgs`、`ItemPickupEventArgs`）
- 事件处理方法：`On + 触发者 + 事件名`（如 `OnEnemyDeath`、`OnItemPickup`）

#### 数据封装
- 所有传递数据使用只读属性（`get; private set;`），仅通过构造函数初始化
- 避免在 EventArgs 中包含复杂逻辑，仅做数据载体

#### 空值处理
- 无参数传递时，统一使用 `EventArgs.Empty`，避免创建空实例造成GC
- 事件触发时先判空：`OnHpChanged?.Invoke(...)`

#### Unity 特有注意事项
- 不要在 EventArgs 中存储 MonoBehaviour 引用，易造成内存泄漏
- 如需传递对象，优先使用接口或弱引用（`WeakReference`）
- 场景切换/物体销毁时，务必移除事件订阅，避免残留引用

### 与 UnityEvent 结合使用
```csharp
using UnityEngine;
using UnityEngine.Events;

// 自定义 UnityEvent（绑定带 EventArgs 的回调）
[System.Serializable]
public class PlayerHpChangedUnityEvent : UnityEvent<PlayerHpChangedEventArgs>
{
}

public class Player : MonoBehaviour
{
    // 可在 Inspector 面板绑定的可视化事件
    public PlayerHpChangedUnityEvent OnHpChanged;

    private int _hp = 100;

    public void TakeDamage(int damage)
    {
        _hp -= damage;
        var args = new PlayerHpChangedEventArgs(_hp, -damage, _hp <= 0);
        OnHpChanged?.Invoke(args);
    }
}
```

### 核心优势
1. **类型安全**：编译期检查参数类型，避免运行时类型转换错误
2. **代码规范**：统一事件参数传递方式，提升代码可读性和维护性
3. **扩展性强**：新增数据字段只需修改 EventArgs 类，无需改动事件声明
4. **兼容 .NET 生态**：符合官方事件设计规范，与第三方库/框架无缝兼容

### 常见误区
1. 直接使用 object 传参替代 EventArgs，丧失类型安全
2. 在 EventArgs 中定义可变数据（public set），导致数据被外部篡改
3. 忽略 EventArgs.Empty，频繁创建空 EventArgs 实例造成不必要 GC
4. 传递过重的对象引用，引发内存泄漏或逻辑耦合


## 事件（Event）

### 核心定义
- 基于委托实现的**对象间消息通知机制**，是委托的封装与安全升级版；
- 遵循发布-订阅模式，发布者触发事件，订阅者响应处理；
- 本质：对 `delegate` 添加 `event` 关键字修饰，限制委托的外部调用权限。

### 核心特性
- 安全防护：仅类内部可触发，外部只能订阅/取消订阅，防止非法调用、覆盖；
- 标准实现：是观察者模式的标准落地方式；
- 场景适配：广泛用于游戏全局消息、UI 交互、状态广播。

### 底层原理
- 本质是**私有委托 + 公共 add/remove 方法**；
- 编译器自动生成 `add_EventName`、`remove_EventName` 实现 `+=`/`-=`；
- 外部无法访问原始委托，保证线程、结构、逻辑安全。

### 内置事件委托
- `EventHandler`：标准无自定义数据的事件委托
  
  ```csharp
  public event EventHandler Clicked;
  ```
- `EventHandler<TEventArgs>`：带自定义参数的泛型事件委托
  ```csharp
  public event EventHandler<MyEventArgs> ValueChanged;
  ```

### 完整使用示例

#### 基础准备：自定义事件参数类（泛型版需要）

先定义一个继承自 `EventArgs` 的类，用于传递自定义事件数据：
```csharp
using System;
using UnityEngine;

// 自定义事件参数（继承自 EventArgs 是 .NET 规范）
public class PlayerStateEventArgs : EventArgs
{
    // 自定义要传递的数据
    public int PlayerId { get; set; }
    public string State { get; set; }
    public float Hp { get; set; }

    // 构造函数初始化数据
    public PlayerStateEventArgs(int playerId, string state, float hp)
    {
        PlayerId = playerId;
        State = state;
        Hp = hp;
    }
}
```

#### 事件发布者（Publisher）
包含 `EventHandler`（无参）和 `EventHandler<TEventArgs>`（泛型带参）两种事件声明：
```csharp
public class Player : MonoBehaviour
{
    // 1. 基础 EventHandler（无自定义参数，仅传递 sender 和空 EventArgs）
    public event EventHandler OnPlayerBorn;

    // 2. 泛型 EventHandler<T>（带自定义 PlayerStateEventArgs 参数）
    public event EventHandler<PlayerStateEventArgs> OnPlayerStateChanged;

    private void Start()
    {
        // 模拟玩家出生 → 触发无参事件
        TriggerPlayerBorn();

        // 模拟玩家血量变化 → 触发带参事件
        TriggerPlayerStateChanged(1, "Hurt", 75.5f);
    }

    // 触发无参事件（OnPlayerBorn）
    private void TriggerPlayerBorn()
    {
        // 安全触发事件（? 避免空引用）
        // sender: 事件发布者自身；EventArgs.Empty: 空参数
        OnPlayerBorn?.Invoke(this, EventArgs.Empty);
    }

    // 触发带参事件（OnPlayerStateChanged）
    private void TriggerPlayerStateChanged(int playerId, string state, float hp)
    {
        // 封装自定义参数并触发事件
        var args = new PlayerStateEventArgs(playerId, state, hp);
        OnPlayerStateChanged?.Invoke(this, args);
    }
}
```

#### 事件订阅者（Subscriber）
```csharp
public class UIManager : MonoBehaviour
{
    [SerializeField] private Player _player;

    private void OnEnable()
    {
        // 订阅事件：绑定响应方法
        _player.OnPlayerBorn += OnPlayerBornHandler;
        _player.OnPlayerStateChanged += OnPlayerStateChangedHandler;
    }

    private void OnDisable()
    {
        // 必须取消订阅！避免 Unity 物体销毁后内存泄漏
        _player.OnPlayerBorn -= OnPlayerBornHandler;
        _player.OnPlayerStateChanged -= OnPlayerStateChangedHandler;
    }

    // 无参事件响应方法（匹配 EventHandler 签名）
    private void OnPlayerBornHandler(object sender, EventArgs e)
    {
        // sender 可以强转为发布者类型，获取发布者信息
        var player = sender as Player;
        Debug.Log($"玩家[{player.name}]出生！");
    }

    // 泛型事件响应方法（匹配 EventHandler<PlayerStateEventArgs> 签名）
    private void OnPlayerStateChangedHandler(object sender, PlayerStateEventArgs e)
    {
        // 读取自定义事件参数
        Debug.Log($"玩家[{e.PlayerId}]状态变化：{e.State}，当前血量：{e.Hp}");
    }
}
```

### 完整使用示例

#### 基础事件示例
```c#
public class Subject
{
    // 带参数事件
    public event Action<string> OnMessage;

    public void SendMsg(string msg)
    {
        OnMessage?.Invoke(msg);
    }
}

public class Observer
{
    public void Update(string msg)
    {
        Console.WriteLine($"观察者收到：{msg}");
    }
}

class Program
{
    static void Main()
    {
        Subject sub = new Subject();
        Observer obs = new Observer();

        sub.OnMessage += obs.Update;
        sub.SendMsg("玩家血量过低");
        sub.OnMessage -= obs.Update;
    }
}
```

#### Unity 中事件示例
```csharp
public class Enemy : MonoBehaviour
{
    // 声明事件
    public event Action OnDeath;

    public void Die()
    {
        // 仅内部可触发
        OnDeath?.Invoke();
    }
}

// 外部使用
public class UIManager : MonoBehaviour
{
    void Start()
    {
        GetComponent<Enemy>().OnDeath += ShowDeathUI;
    }

    void ShowDeathUI() { }
}
```

### 空值安全调用
- 标准写法：`OnDeath?.Invoke();`
- 底层等价于：
  ```csharp
  if (OnDeath != null) OnDeath.Invoke();
  ```
- 特性：C# 语法糖，无性能损耗。

## Unity 专属事件：UnityEvent / UnityAction
### 核心定义
- `UnityEvent`：Unity 引擎封装的事件回调系统，基于委托实现，专门用于 UGUI/游戏对象解耦通信；
- 遵循发布-订阅模式，支持**可视化绑定 + 代码动态监听**双模式；
- `UnityAction`：支持序列化的无参数委托，是 UnityEvent 的底层支撑之一。

### 核心特性
- 区别于 C# 原生 event：支持编辑器面板赋值、生命周期适配、物体销毁安全解绑；
- 序列化支持：可跨场景保存绑定关系，是 UGUI 交互核心（如 `Button.onClick`）；
- 常用场景：`Button.onClick`、`EventTrigger` 等 UI 交互，游戏对象解耦通信。

### 内置事件类型
- `UnityEvent`：无参无返回值基础事件
  ```csharp
  public UnityEvent OnClick;
  ```
- `UnityEvent<T>`：单个泛型参数事件
  ```csharp
  public UnityEvent<string> OnMessage;
  public UnityEvent<int> OnValueChange;
  ```

### 底层原理
- 不依赖 C# 标准委托，由 Unity 独立实现；
- 底层存储对象引用、方法名、参数，运行时通过反射调用（性能略低于原生委托）；
- 支持序列化，是 Unity 编辑器生态核心。

### 完整使用示例
```csharp
using UnityEngine;
using UnityEngine.Events;

public class Subject : MonoBehaviour
{
    public UnityEvent<string> OnMessage;

    public void SendMsg(string msg)
    {
        OnMessage?.Invoke(msg);
    }
}

public class Observer : MonoBehaviour
{
    public void Update(string msg)
    {
        Debug.Log($"观察者收到：{msg}");
    }
}

public class Test : MonoBehaviour
{
    public Subject subject;
    public Observer observer;

    void Start()
    {
        subject.OnMessage.AddListener(observer.Update);
        subject.SendMsg("玩家血量过低");
        subject.OnMessage.RemoveListener(observer.Update);
    }
}
```

## 匿名函数与 Lambda
### 核心定义
无需声明方法名，直接以代码块形式绑定到委托，简洁高效。

### 代码示例
```csharp
Action onTrigger;

void Start()
{
    // 匿名方法
    onTrigger += delegate() { Debug.Log("Trigger"); };
    
    // Lambda
    onTrigger += () => Debug.Log("Lambda");
}
```

### 底层原理
- 编译器自动生成匿名类与闭包；
- 捕获外部变量时创建闭包对象，可能产生 GC；
- 建议：Unity 高频逻辑中谨慎使用。

## 核心对比总结
### 委托 vs 事件
| 特性 | 委托（Delegate） | 事件（Event） |
|------|------------------|---------------|
| 访问权限 | 公开可调用、赋值 | 内部可触发，外部仅订阅/退订 |
| 安全性 | 较低，易被外部覆盖 | 极高，杜绝非法操作 |
| 使用场景 | 内部回调、私有逻辑 | 外部监听、公共消息广播 |
| 封装性 | 无封装，直接暴露委托实例 | 委托的安全封装（add/remove 方法） |

### 性能对比
| 类型 | 性能特点 | 适用场景 |
|------|----------|----------|
| C# 原生委托（Action/Func/自定义） | 无反射、无 GC、高性能 | 游戏核心逻辑、高频回调 |
| UnityEvent / UnityAction | 反射调用、可序列化、性能较低 | 编辑器可视化绑定、UI 交互、低频逻辑 |