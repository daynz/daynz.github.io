---
title: "06Csharp-委托与事件"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/06Csharp-委托与事件.html
tags: [编程语言]
---

[toc]

# 委托与事件

## 委托 Delegate
### 核心定义
委托是**存储方法引用**的引用类型，可理解为类型安全的方法指针容器；

**核心价值**：能够将方法作为参数传递，实现**回调、事件、多播**等核心编程功能。

### 委托声明语法
```csharp
// 标准声明格式：访问修饰符 delegate 返回值类型 委托名称(参数列表)
public delegate int CalcDelegate(int a, int b);
```

### 核心特性
1. **类型安全**：严格匹配方法的返回值类型、参数类型与参数数量
2. **多指向性**：可绑定静态方法、实例方法、匿名方法、Lambda 表达式
3. **多播能力**：单个委托可绑定多个方法，按绑定顺序依次执行
4. **灵活传递**：可作为方法参数、方法返回值使用
5. **引用类型**：存储于托管堆，具备引用类型特性

### 委托标准使用步骤
1. 声明自定义委托类型
2. 定义与委托签名匹配的方法
3. 创建委托实例并绑定目标方法
4. 调用委托，间接执行绑定方法

```csharp
// 1. 声明委托
delegate int CalcDelegate(int a, int b);

// 2. 定义匹配签名的方法
class MathHelper
{
    // 静态方法
    public static int Add(int a, int b) => a + b;
    // 实例方法
    public int Sub(int a, int b) => a - b;
}

// 3. 实例化并使用委托
CalcDelegate del1 = MathHelper.Add; // 绑定静态方法
// 绑定实例方法
MathHelper helper = new MathHelper();
CalcDelegate del2 = helper.Sub;

// 4. 调用委托
int res1 = del1(10, 5);   // 结果：15
int res2 = del2(10, 5);   // 结果：5
```

### 多播委托
- 一个委托绑定多个方法，调用时**按绑定顺序依次执行**
- 使用 `+=` 绑定方法，`-=` 移除方法
- 有返回值的多播委托，**仅返回最后一个执行方法的结果**

```csharp
delegate void ShowDelegate(string msg);

static void Show1(string msg) => Console.WriteLine("1:" + msg);
static void Show2(string msg) => Console.WriteLine("2:" + msg);

static void Main()
{
    ShowDelegate del = Show1;
    del += Show2; // 追加绑定方法
    
    del("测试");  // 依次执行 Show1、Show2
}
```

### 委托作为方法参数
通过委托实现**方法回调**，常用于异步完成通知、逻辑解耦场景。
```csharp
// 声明回调委托
delegate void CallbackDelegate(int result);

// 核心计算方法，接收委托作为回调参数
static void Calc(int a, int b, CallbackDelegate callback)
{
    int res = a + b;
    callback(res); // 执行回调逻辑
}

// 回调方法
static void ShowResult(int res) => Console.WriteLine("结果：" + res);

static void Main()
{
    // 将方法作为参数传递
    Calc(10, 20, ShowResult);
}
```

### 匿名方法与 Lambda 表达式
简化委托赋值，无需单独定义独立方法，是开发常用写法。
```csharp
// 匿名方法
CalcDelegate del1 = delegate(int a, int b) { return a + b; };

// Lambda 表达式（官方推荐）
CalcDelegate del2 = (a, b) => a + b;
```

### 系统内置委托
无需手动声明，直接使用的通用委托，覆盖绝大多数场景。
- `Action`：无返回值委托，支持 0~16 个输入参数
- `Func<TResult>`：有返回值委托，**最后一个泛型参数为返回值类型**
- `Predicate<T>`：固定返回 `bool` 类型的判断委托

```csharp
Action<string> act = Console.WriteLine;
Func<int, int, int> func = (a, b) => a * b;
Predicate<int> pre = x => x > 0;
```

### 执行原理
1. 所有委托均继承自基类 `MulticastDelegate`
2. 委托内部维护一个方法调用列表
3. 调用委托时，遍历列表依次执行绑定方法
4. 编译时进行类型校验，运行时安全调用

### 关键注意事项
1. **空引用风险**：委托为 `null` 时调用会抛出 `NullReferenceException`，必须判空
2. **多播返回值**：有返回值的多播委托仅保留最后一个方法的返回结果
3. **签名严格匹配**：方法的返回值、参数类型/数量必须与委托完全一致
4. **线程安全**：委托本身非线程安全，多线程赋值需要加锁保护
5. **内存泄漏**：长期持有委托引用可能导致目标对象无法被垃圾回收

## 事件 Event

### 核心定义
- **事件**：基于委托实现的**对象间消息通知机制**，是委托的封装与安全升级版
- 事件遵循**发布-订阅（Publisher-Subscriber）** 设计模式，发布者触发事件，订阅者响应处理
- 本质是**对`delegate`添加`event`关键字修饰**，限制委托的外部调用权限

### 与委托的核心区别
1. **封装性**：事件是委托的安全封装，外部只能`+=`/`-=`订阅，不能直接赋值`=`或手动触发
2. **权限控制**：委托可在外部任意调用、赋值；事件仅能在类内部触发，外部无法主动触发
3. **使用场景**：委托用于方法传递、回调；事件专用于消息通知、状态变更
4. **安全性**：事件避免外部干扰对象逻辑，保证代码安全可靠

### 声明语法
```csharp
// 1. 声明委托（通常带 sender 和 EventArgs 参数）
public delegate void MyEventHandler(object sender, MyEventArgs e);

// 2. 声明事件（基于委托）
public event MyEventHandler MyEvent;
```
### .NET 标准约定
- 事件发送者：第一个参数固定为`object sender`（代表事件发布者）
- 事件参数：第二个参数继承自`EventArgs`，传递事件数据

### 核心特性
1. **发布-订阅模式**：一个事件可被多个订阅者监听，一对多通知
2. **安全封装**：仅允许`+=`订阅、`-=`取消订阅，禁止外部直接触发
3. **多播实现**：底层基于多播委托，触发时依次执行所有订阅方法
4. **解耦架构**：发布者与订阅者无直接依赖，独立维护，灵活扩展
5. **标准规范**：遵循`EventHandler`/`EventHandler<T>`内置委托，统一编码风格

### 内置事件委托
- **`EventHandler`**：标准无自定义数据的事件委托
```csharp
public event EventHandler Clicked;
```
- **`EventHandler<TEventArgs>`**：带自定义参数的泛型事件委托
```csharp
public event EventHandler<MyEventArgs> ValueChanged;
```

### 完整使用示例
#### 自定义事件参数

```csharp
public class ValueChangedEventArgs : EventArgs
{
    public int OldValue { get; }
    public int NewValue { get; }

    public ValueChangedEventArgs(int oldValue, int newValue)
    {
        OldValue = oldValue;
        NewValue = newValue;
    }
}
```
#### 事件发布者
```csharp
public class Publisher
{
    private int _value;
    
    // 声明事件
    public event EventHandler<ValueChangedEventArgs> ValueChanged;

    // 触发事件的方法（仅内部可调用）
    protected virtual void OnValueChanged(int oldValue, int newValue)
    {
        ValueChanged?.Invoke(this, new ValueChangedEventArgs(oldValue, newValue));
    }

    // 修改值时触发事件
    public int Value
    {
        get => _value;
        set
        {
            if (_value == value) return;
            int old = _value;
            _value = value;
            OnValueChanged(old, value); // 触发事件
        }
    }
}
```
#### 事件订阅者
```csharp
public class Subscriber
{
    public void Subscribe(Publisher publisher)
    {
        // 订阅事件 +=
        publisher.ValueChanged += Publisher_ValueChanged;
    }

    public void UnSubscribe(Publisher publisher)
    {
        // 取消订阅 -=
        publisher.ValueChanged -= Publisher_ValueChanged;
    }

    // 事件处理方法
    private void Publisher_ValueChanged(object sender, ValueChangedEventArgs e)
    {
        Console.WriteLine($"值变更：旧值={e.OldValue}，新值={e.NewValue}");
    }
}
```
#### 调用测试
```csharp
static void Main()
{
    Publisher pub = new Publisher();
    Subscriber sub = new Subscriber();
    
    sub.Subscribe(pub);
    pub.Value = 10; // 赋值 → 触发事件 → 订阅者响应
}
```

### 事件操作规范
1. **订阅**：使用`+=`绑定处理方法
2. **取消订阅**：使用`-=`移除处理方法
3. **触发**：仅在类内部使用`?.Invoke()`安全触发（避免空引用）
4. **保护方法**：触发逻辑封装在`OnXXX()`虚拟方法中，便于子类重写

### 事件执行原理
1. 事件底层封装私有多播委托，维护订阅方法列表
2. 订阅时`+=`将方法加入调用列表
3. 触发时`Invoke()`遍历列表，依次执行所有订阅方法

### 注意事项
1. **空触发安全**：必须使用`?.Invoke()`，无订阅者时不触发
2. **外部禁止触发**：`event`关键字限制外部调用，保证封装安全
3. **取消订阅**：订阅者销毁前必须取消订阅，防止内存泄漏
4. **异常传播**：一个订阅方法异常会中断后续执行，需单独异常处理
5. **线程安全**：多线程环境触发事件需加锁，避免竞争

## 泛型委托 Action、Func、Predicate
### 核心定义
- **泛型委托**：.NET 内置的通用委托类型，无需手动自定义委托，直接使用泛型参数定义方法签名
- **`Action`**：无返回值（`void`）的泛型委托，用于执行操作
- **`Func`**：有返回值的泛型委托，最后一个泛型参数为返回值类型
- **`Predicate`**：固定返回`bool`的泛型委托，用于条件判断

### 核心特性
1. **系统内置**：无需`delegate`声明，直接引用使用
2. **泛型灵活**：通过泛型参数指定方法参数类型，适配任意签名
3. **类型安全**：编译时校验参数与返回值类型
4. **简化代码**：替代大量自定义委托，代码更简洁
5. **兼容 Lambda/匿名方法**：完美配合内联方法使用

### Action 泛型委托
- **功能**：封装**无返回值**的方法，可携带 0~16 个输入参数
- **签名**：`Action`、`Action<T1>`、`Action<T1,T2>...`
- **返回值**：`void`

```csharp
// 无参数
Action act1 = () => Console.WriteLine("无参数");
act1();

// 1个参数
Action<int> act2 = (num) => Console.WriteLine(num);
act2(10);

// 多个参数
Action<int, string> act3 = (a, b) => Console.WriteLine($"{a}:{b}");
act3(1, "测试");
```

### Func 泛型委托
- **功能**：封装**有返回值**的方法，可携带 0~16 个输入参数
- **签名**：`Func<TResult>`、`Func<T1,TResult>`、`Func<T1,T2,TResult>...`
- **规则**：**最后一个泛型参数 = 返回值类型**，前面均为输入参数

```csharp
// 无参数，有返回值
Func<int> func1 = () => 100;
int res1 = func1();

// 1个参数，有返回值
Func<int, bool> func2 = (x) => x > 0;
bool res2 = func2(10);

// 多个参数，有返回值
Func<int, int, int> func3 = (a, b) => a + b;
int res3 = func3(10, 20);
```

### Predicate 泛型委托
- **功能**：封装**条件判断**方法，**固定返回`bool`**
- **签名**：`Predicate<T>`
- **参数**：接收 1 个输入参数，返回`bool`

```csharp
Predicate<int> predicate = (x) => x % 2 == 0;
bool isEven = predicate(4); // true
```

### 三者核心对比
| 委托类型 | 返回值 | 参数数量 | 典型用途 |
|----------|--------|----------|----------|
| `Action` | `void` | 0~16 | 执行操作、打印、修改、无结果逻辑 |
| `Func` | 自定义 | 0~16 | 计算、转换、获取结果、有返回逻辑 |
| `Predicate` | `bool` | 1 | 条件判断、过滤、匹配检查 |

### 常用场景示例
#### Action 场景
```csharp
List<int> list = new List<int> {1,2,3};
list.ForEach(x => Console.WriteLine(x));
```

#### Func 场景
```csharp
var result = list.Select(x => x * 2);
```

#### Predicate 场景
```csharp
int num = list.Find(x => x > 2);
bool exists = list.Exists(x => x == 3);
```

### 执行原理
1. 本质是编译器预定义的密封泛型委托类型
2. 编译后与自定义委托完全一致
3. 支持多播，可使用`+=`绑定多个方法

### 注意事项
1. **空值安全**：委托实例为`null`时调用会抛异常，建议使用`?.Invoke()`
2. **多播返回值**：`Func`多播仅返回最后一个方法结果
3. **参数数量**：最大支持 16 个输入参数，满足绝大多数场景
4. **不可混用**：严格区分有无返回值，不能相互替代

## Unity 事件与委托
### Unity 常用内置委托与事件
Unity 自身大量使用委托与事件机制，常见于 UI 交互、生命周期回调、物理触发、异步加载等场景，语法与 C# 标准完全兼容，可直接使用 `Action`、`Func`、`UnityEvent` 等类型。

### UnityEvent 可视化事件系统
- **`UnityEvent`**：Unity 封装的可序列化事件，支持在 Inspector 面板拖拽绑定，无需代码订阅
- **`UnityEvent<T>`**：带参数的泛型版本，最多支持 4 个参数
- 特点：可序列化、编辑器可视化、支持多播、与普通事件用法一致

```csharp
using UnityEngine;
using UnityEngine.Events;

public class UnityEventDemo : MonoBehaviour
{
    // 无参可视化事件
    public UnityEvent OnTriggered;
    // 带参可视化事件
    public UnityEvent<float> OnValueChanged;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            OnTriggered?.Invoke();
            OnValueChanged?.Invoke(Random.value);
        }
    }
}

public class TestListener : MonoBehaviour
{
    UnityEventDemo demo;

    void Start()
    {
        demo = FindObjectOfType<UnityEventDemo>();

        // 监听
        demo.OnTriggered.AddListener(OnTriggeredCallback);
        demo.OnValueChanged.AddListener(OnValueChangedCallback);
    }

    void OnDestroy()
    {
        // 必须移除！否则会内存泄漏
        demo.OnTriggered.RemoveListener(OnTriggeredCallback);
        demo.OnValueChanged.RemoveListener(OnValueChangedCallback);
    }

    void OnTriggeredCallback()
    {
        Debug.Log("触发了无参事件");
    }

    void OnValueChangedCallback(float v)
    {
        Debug.Log("当前值：" + v);
    }
}
```

### UI 事件（UGUI 基于委托实现）
UGUI 所有交互事件底层均为委托调用，常用事件直接通过代码订阅。

```csharp
using UnityEngine;
using UnityEngine.UI;

public class UGUIEventDemo : MonoBehaviour
{
    public Button btn;
    public Slider slider;
    public InputField input;

    void Awake()
    {
        // 按钮点击
        btn.onClick.AddListener(OnBtnClick);
        // 滑动条值变化
        slider.onValueChanged.AddListener(OnSliderChanged);
        // 输入框内容变更
        input.onValueChanged.AddListener(OnInputChanged);
    }

    void OnBtnClick() => Debug.Log("按钮点击");
    void OnSliderChanged(float value) => Debug.Log("滑动条：" + value);
    void OnInputChanged(string content) => Debug.Log("输入：" + content);
}
```

### 生命周期与物理回调事件
Unity 消息函数（如 `OnCollisionEnter`）本质是内部委托触发，也可通过自定义事件封装。

```csharp
void OnCollisionEnter(Collision collision)
{
    OnPlayerCollided?.Invoke(collision.gameObject);
}

public event Action<GameObject> OnPlayerCollided;
```

### 异步加载与场景事件
异步操作通过委托完成加载完成回调，是 Unity 最常用的异步委托场景。

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;

IEnumerator LoadSceneAsync(string sceneName)
{
    AsyncOperation op = SceneManager.LoadSceneAsync(sceneName);
    op.completed += (operation) =>
    {
        Debug.Log("场景加载完成");
    };
    yield return op;
}
```

### 自定义全局事件中心（观察者模式）
用于模块解耦，是 Unity 项目中委托/事件的核心应用。

```csharp
public static class EventManager
{
    private static event Action<string> OnGameEvent;

    public static void Register(string eventName, Action listener)
    {
        OnGameEvent += (name) => { if (name == eventName) listener?.Invoke(); };
    }

    public static void Trigger(string eventName) => OnGameEvent?.Invoke(eventName);
}

// 订阅
EventManager.Register("GameStart", OnGameStart);
// 触发
EventManager.Trigger("GameStart");
```

### 协程与委托结合
使用 `Action` 实现协程完成回调，常用于延时逻辑、动画结束。

```csharp
void DelayDo(float time, Action callback)
{
    StartCoroutine(DelayCoroutine(time, callback));
}

IEnumerator DelayCoroutine(float time, Action callback)
{
    yield return new WaitForSeconds(time);
    callback?.Invoke();
}

// 调用
DelayDo(2f, () => Debug.Log("2秒后执行"));
```

### 注意事项
- **内存泄漏**：脚本销毁时必须使用 `-=` 取消事件订阅，静态事件尤其危险
- **空引用**：使用 `?.Invoke()` 避免无订阅时触发空异常
- **序列化**：普通 `event` 无法在 Inspector 显示，需用 `UnityEvent`
- **多线程**：Unity 主线程限制，不可在子线程触发 Unity 相关事件
- **性能**：频繁触发的事件（如每帧）避免大量订阅与闭包

