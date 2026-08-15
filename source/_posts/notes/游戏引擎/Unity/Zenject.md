---
title: "Zenject"
date: 2026-08-08 18:04:25
permalink: /notes/游戏引擎/Unity/Zenject.html
tags: [游戏引擎]
---

# Extenject (Zenject) 完整API文档
Extenject（原Zenject）是Unity中轻量级且功能强大的依赖注入框架，以下是其核心API接口、类型及使用说明，聚焦于框架核心能力而非入门基础。

## 一、核心容器（Container）相关
### 1. DiContainer 核心类
`DiContainer` 是依赖注入的核心容器，负责实例化、解析、管理依赖关系，所有注入逻辑均围绕此类展开。

#### 1.1 注册（Binding）相关API
| 方法签名 | 功能说明 |
|:---------|:---------|
| `void Bind<TFrom>().To<TTo>().AsSingle()` | 将 `TFrom` 绑定到 `TTo`，注册为单例（全局唯一实例） |
| `void Bind<TFrom>().To<TTo>().AsTransient()` | 每次解析生成新实例 |
| `void Bind<TFrom>().ToSelf().AsSingle()` | 绑定类型到自身（`TFrom` = `TTo`） |
| `void Bind<T>().FromInstance(T instance)` | 绑定已有实例到容器 |
| `void Bind<T>().FromMethod(Func<DiContainer, T> method)` | 通过自定义方法创建实例并绑定 |
| `void Bind<T>().FromComponentInNewPrefab(GameObject prefab)` | 从预制体实例化并绑定其内部指定组件 |
| `void Bind<T>().FromComponentInHierarchy()` | 从场景层级中查找指定组件并绑定 |
| `void Bind<T>().FromComponentSibling()` | 从当前注入对象的同级节点查找组件 |
| `void BindInterfacesTo<T>().AsSingle()` | 将T的所有接口绑定到T自身（单例） |
| `void Bind<T>().WithId(object identifier)` | 带标识绑定（区分同类型不同实例） |
| `void Bind<T>().NonLazy()` | 立即实例化（默认延迟解析时实例化） |
| `void Unbind<T>()` | 解绑指定类型的所有绑定 |
| `void UnbindId<T>(object identifier)` | 解绑指定标识的绑定 |
| `void Rebind<TFrom>().To<TTo>().AsSingle()` | 重新绑定（先解绑再绑定） |

#### 1.2 解析（Resolution）相关API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `T Resolve<T>()` | 解析指定类型的实例 | `var service = Container.Resolve<IService>();` |
| `T ResolveId<T>(object identifier)` | 解析带指定标识的实例 | `var weapon = Container.ResolveId<IWeapon>("Melee");` |
| `bool TryResolve<T>(out T instance)` | 尝试解析，失败时返回false（无异常） | `if (Container.TryResolve<IService>(out var service)) { /* 使用service */ }` |
| `bool TryResolveId<T>(object identifier, out T instance)` | 尝试解析带标识的实例 | `if (Container.TryResolveId<IWeapon>("Ranged", out var weapon)) { /* 使用weapon */ }` |
| `IEnumerable<T> ResolveAll<T>()` | 解析指定类型的所有绑定实例 | `var allWeapons = Container.ResolveAll<IWeapon>();` |
| `object Resolve(Type type)` | 动态解析指定Type的实例（非泛型） | `var serviceType = typeof(IService); var service = Container.Resolve(serviceType);` |

#### 1.3 作用域（Scope）相关API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `DiContainer CreateSubContainer()` | 创建子容器（继承父容器绑定，独立管理实例） | `var subContainer = Container.CreateSubContainer();` |
| `void InjectGameObject(GameObject gameObject)` | 为GameObject及其子节点的MonoBehaviour注入依赖 | `Container.InjectGameObject(PlayerObject);` |
| `void Inject(object instance)` | 手动为已有实例注入依赖（字段/属性/方法） | `var manager = new GameManager(); Container.Inject(manager);` |
| `void InjectComponent<T>(T component) where T : MonoBehaviour` | 手动为单个MonoBehaviour组件注入依赖 | `var controller = GetComponent<PlayerController>(); Container.InjectComponent(controller);` |

## 二、注入标记（Attributes）
Extenject通过特性标记实现自动注入，所有特性均位于 `Zenject` 命名空间下。

### 2.1 字段/属性注入
| 特性 | 功能说明 | 示例 |
|------|----------|------|
| `[Inject]` | 标记需要注入的字段/属性（可加标识） | `[Inject] private IService _service;`<br>`[Inject(Id = "Melee")] private IWeapon _meleeWeapon;` |
| `[InjectOptional]` | 标记可选注入（无绑定也不抛异常） | `[InjectOptional] private ILogger _logger;` |

### 2.2 构造函数注入
| 特性 | 功能说明 | 示例 |
|------|----------|------|
| `[Inject]` | 标记非默认构造函数（容器优先使用此构造函数实例化） | `public class GameService { [Inject] public GameService(ISettings settings) { /* 逻辑 */ } }` |

### 2.3 方法注入
| 特性 | 功能说明 | 示例 |
|------|----------|------|
| `[Inject]` | 标记需要注入的方法（参数从容器解析） | `[Inject] private void Initialize(IService service) { _service = service; }` |

### 2.4 标识相关
| 特性 | 功能说明 | 示例 |
|------|----------|------|
| `[Id(object identifier)]` | 配合`[Inject]`使用，指定注入实例的标识 | `[Inject, Id("Ranged")] private IWeapon _rangedWeapon;` |

## 三、安装器（Installers）
安装器是Extenject中组织绑定逻辑的核心方式，所有安装器需继承 `MonoInstaller` 或 `Installer`。

### 3.1 核心安装器基类
| 类名 | 适用场景 | 核心方法 |
|------|----------|----------|
| `Installer<TInstaller>` | 非MonoBehaviour安装器（纯代码绑定） | `public override void InstallBindings() { /* 绑定逻辑 */ }` |
| `MonoInstaller<TInstaller>` | 挂载到GameObject的安装器（可关联场景/预制体） | `public override void InstallBindings() { /* 绑定逻辑 */ }` |
| `ScriptableObjectInstaller<TInstaller>` | 基于ScriptableObject的安装器（可序列化配置） | `public override void InstallBindings() { /* 绑定逻辑 */ }` |

### 3.2 安装器相关API
| 方法/属性 | 所属类 | 功能说明 | 示例 |
|-----------|--------|----------|------|
| `DiContainer Container` | 所有Installer子类 | 获取当前安装器关联的容器 | `Container.Bind<IService>().To<GameService>().AsSingle();` |
| `void InstallBindings()` | 所有Installer子类 | 抽象方法，必须重写以编写绑定逻辑 | 见下文示例 |
| `static void Install(DiContainer container)` | `Installer<T>` | 静态方法，手动安装指定安装器 | `GameInstaller.Install(Container);` |
| `void InstallFromResource<T>(string resourcePath)` | `DiContainer` | 从Resources加载ScriptableObjectInstaller并安装 | `Container.InstallFromResource<SettingsInstaller>("Installers/SettingsInstaller");` |

#### 示例：自定义安装器
```csharp
using Zenject;

public class GameInstaller : MonoInstaller<GameInstaller>
{
    [SerializeField] private GameObject _playerPrefab;
    
    public override void InstallBindings()
    {
        // 绑定服务
        Container.Bind<IService>().To<GameService>().AsSingle();
        // 绑定预制体组件
        Container.Bind<PlayerController>().FromComponentInNewPrefab(_playerPrefab).AsSingle();
        // 绑定接口到多个实现
        Container.Bind<IWeapon>().To<Sword>().WithId("Melee").AsSingle();
        Container.Bind<IWeapon>().To<Bow>().WithId("Ranged").AsSingle();
    }
}
```

## 四、工厂（Factories）
Extenject提供工厂模式封装，简化动态实例化逻辑，核心工厂类型如下：

### 4.1 基础工厂接口
| 接口 | 功能说明 | 生成方式 |
|------|----------|----------|
| `IFactory<TResult>` | 无参工厂 | `Container.BindFactory<PlayerController, PlayerController.Factory>();` |
| `IFactory<T1, TResult>` | 单参数工厂 | `Container.BindFactory<WeaponType, IWeapon, IWeapon.Factory>();` |
| `IFactory<T1, T2, TResult>` | 双参数工厂 | `Container.BindFactory<Vector3, Quaternion, Enemy, Enemy.Factory>();` |
| `IValidatableFactory<TResult>` | 可验证的无参工厂 | 继承后实现`Validate()`方法校验参数 |

### 4.2 工厂绑定API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void BindFactory<TParam, TResult, TFactory>()` | 绑定参数化工厂 | `Container.BindFactory<string, UIView, UIView.Factory>().FromComponentInNewPrefab(UIViewPrefab);` |
| `void BindFactory<TResult, TFactory>().FromPool<TPool>()` | 工厂关联对象池 | `Container.BindFactory<Bullet, Bullet.Factory>().FromPool<BulletPool>();` |
| `void BindFactory<TResult, TFactory>().FromMethod(Func<DiContainer, TResult> method)` | 工厂通过自定义方法创建实例 | `Container.BindFactory<IService, IService.Factory>().FromMethod(container => new TestService());` |

#### 示例：自定义工厂
```csharp
using Zenject;

public class Enemy
{
    public class Factory : PlaceholderFactory<EnemyType, Enemy> { }
    
    private readonly EnemyType _type;
    
    [Inject]
    public Enemy(EnemyType type, IEnemyAI ai)
    {
        _type = type;
        // 逻辑
    }
}

// 安装器中绑定
public class EnemyInstaller : MonoInstaller<EnemyInstaller>
{
    public override void InstallBindings()
    {
        Container.BindFactory<EnemyType, Enemy, Enemy.Factory>()
            .FromMethod((container, type) => 
            {
                var ai = container.ResolveId<IEnemyAI>(type.ToString());
                return new Enemy(type, ai);
            });
    }
}
```

## 五、对象池（Pools）
Extenject内置对象池实现，简化重复实例化对象的管理，核心类型为 `MemoryPool`。

### 5.1 核心池类
| 类名 | 功能说明 | 核心方法/重写点 |
|------|----------|----------------|
| `MemoryPool<TResult>` | 基础无参对象池 | `protected override TResult Create() { /* 创建实例 */ }`<br>`protected override void Reinitialize(TResult item) { /* 重置实例 */ }`<br>`protected override void OnDespawned(TResult item) { /* 回收时逻辑 */ }` |
| `MemoryPool<TParam, TResult>` | 单参数对象池 | `protected override TResult Create(TParam param) { /* 带参数创建 */ }` |
| `MonoPoolableMemoryPool<TResult>` | 针对MonoBehaviour的对象池 | 自动处理GameObject激活/失活 |

### 5.2 池绑定API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void BindMemoryPool<TResult, TPool>()` | 绑定对象池 | `Container.BindMemoryPool<Bullet, BulletPool>().WithInitialSize(10).FromComponentInNewPrefab(BulletPrefab);` |
| `void WithInitialSize(int size)` | 设置池初始容量 | 见上例 |
| `void ExpandByOneAtATime()` | 池耗尽时每次扩容1个 | `Container.BindMemoryPool<Enemy, EnemyPool>().ExpandByOneAtATime();` |
| `void WithMaxSize(int maxSize)` | 设置池最大容量（超出后抛异常） | `Container.BindMemoryPool<Bullet, BulletPool>().WithMaxSize(50);` |

#### 示例：自定义对象池
```csharp
using Zenject;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public class Pool : MonoPoolableMemoryPool<Bullet>
    {
        protected override void OnSpawned(Bullet item)
        {
            item.gameObject.SetActive(true);
            item.ResetPosition();
        }

        protected override void OnDespawned(Bullet item)
        {
            item.gameObject.SetActive(false);
        }
    }

    private void ResetPosition()
    {
        transform.position = Vector3.zero;
    }
}

// 安装器中绑定
public class BulletInstaller : MonoInstaller<BulletInstaller>
{
    [SerializeField] private GameObject _bulletPrefab;
    
    public override void InstallBindings()
    {
        Container.BindMemoryPool<Bullet, Bullet.Pool>()
            .WithInitialSize(10)
            .WithMaxSize(30)
            .FromComponentInNewPrefab(_bulletPrefab)
            .UnderTransformGroup("Bullets"); // 实例化后归到指定父节点
    }
}
```

## 六、信号与信号器（Signals）
Extenject的信号系统实现发布-订阅模式，与容器集成实现依赖注入。

### 6.1 核心信号类型
| 类/接口 | 功能说明 | 示例 |
|------|----------|------|
| `Signal` | 基础无参信号 | 继承后定义信号 |
| `Signal<T>` | 单参数信号 | `public class EnemyDiedSignal : Signal<Enemy> { }` |
| `Signal<T1, T2>` | 双参数信号 | `public class PlayerDamagedSignal : Signal<Player, int> { }` |
| `ISignalBus` | 信号总线（管理信号的发布/订阅） | 容器自动绑定，可注入使用 |

### 6.2 信号绑定与使用API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void BindSignal<TSignal>()` | 绑定信号到容器 | `Container.BindSignal<EnemyDiedSignal>();` |
| `void BindSignal<TSignal>().ToMethod<TTarget>(TTarget target, Action method)` | 信号订阅指定方法 | `Container.BindSignal<EnemyDiedSignal>().ToMethod<GameManager>(_gameManager, gm => gm.OnEnemyDied);` |
| `void BindSignal<TSignal>().ToMethod(Action method)` | 信号订阅无目标方法 | `Container.BindSignal<GameOverSignal>().ToMethod(OnGameOver);` |
| `void UnbindSignal<TSignal>()` | 解绑信号所有订阅 | `Container.UnbindSignal<EnemyDiedSignal>();` |

#### 示例：信号使用
```csharp
using Zenject;

// 定义信号
public class PlayerScoreChangedSignal : Signal<int> { }

// 订阅者
public class UIScoreDisplay : MonoBehaviour
{
    [Inject] private SignalBus _signalBus;

    private void Start()
    {
        _signalBus.Subscribe<PlayerScoreChangedSignal>(OnScoreChanged);
    }

    private void OnScoreChanged(int newScore)
    {
        // 更新UI显示
    }

    private void OnDestroy()
    {
        _signalBus.Unsubscribe<PlayerScoreChangedSignal>(OnScoreChanged);
    }
}

// 发布者
public class PlayerController : MonoBehaviour
{
    [Inject] private SignalBus _signalBus;

    private void AddScore(int points)
    {
        // 发布信号
        _signalBus.Fire(new PlayerScoreChangedSignal(points));
    }
}

// 安装器绑定
public class SignalInstaller : MonoInstaller<SignalInstaller>
{
    public override void InstallBindings()
    {
        Container.BindSignal<PlayerScoreChangedSignal>();
        Container.Bind<SignalBus>().AsSingle();
    }
}
```

## 七、验证与调试（Validation & Debugging）
### 7.1 验证API
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void Validate()` | 验证容器所有绑定是否可解析（提前暴露依赖缺失问题） | `Container.Validate();` |
| `void ValidateResolve<T>()` | 验证指定类型是否可解析 | `Container.ValidateResolve<IService>();` |
| `void ValidateResolveId<T>(object identifier)` | 验证带标识的类型是否可解析 | `Container.ValidateResolveId<IWeapon>("Melee");` |

### 7.2 调试属性/方法
| 成员 | 功能说明 |
|------|----------|
| `bool EnableDiagrams` | 启用依赖关系图生成（需在Unity编辑器设置） |
| `void DumpBindings()` | 打印所有绑定信息到控制台 |
| `DiContainerDebugWindow` | Unity编辑器窗口，可视化容器绑定和实例 |

## 八、高级特性API
### 8.1 条件绑定
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void Bind<T>().When(Func<InjectContext, bool> condition)` | 仅当条件满足时生效绑定 | `Container.Bind<IService>().To<MobileService>().When(ctx => Application.platform == RuntimePlatform.Android);` |
| `void Bind<T>().WhenInjectedInto<TTarget>()` | 仅当注入到指定类型时生效 | `Container.Bind<IInput>().To<MobileInput>().WhenInjectedInto<MobilePlayerController>();` |

### 8.2 装饰器（Decorators）
| 方法签名 | 功能说明 | 示例 |
|----------|----------|------|
| `void Bind<TFrom>().To<TTo>().WithDecoration<TDecorator>()` | 为绑定类型添加装饰器（包装原实例） | `Container.Bind<IService>().To<GameService>().WithDecoration<LoggingServiceDecorator>();` |
| `void Bind<TFrom>().To<TTo>().WithDecorator(Func<TFrom, TFrom> decorator)` | 自定义装饰器逻辑 | `Container.Bind<IService>().To<GameService>().WithDecorator(original => new CachedService(original));` |

### 8.3 延迟注入
| 特性/方法 | 功能说明 | 示例 |
|-----------|----------|------|
| `[InjectLazy]` | 延迟注入（首次访问时才解析） | `[InjectLazy] private Lazy<IService> _lazyService;` |
| `Lazy<T> ResolveLazy<T>()` | 解析延迟加载的实例 | `var lazyService = Container.ResolveLazy<IService>();` |

## 九、命名空间说明
Extenject核心API均位于以下命名空间，使用时需引入：
- `Zenject`：核心容器、特性、安装器、工厂、池、信号等
- `Zenject.Signals`：信号相关扩展
- `Zenject.Poolable`：对象池相关扩展
- `Zenject.SpaceFiller`：辅助工具（较少使用）

## 注意事项
1. 所有绑定逻辑建议在`InstallBindings`方法中完成，避免运行时动态绑定导致的不可预测性；
2. MonoBehaviour的注入需确保`InjectGameObject`或`InjectComponent`被调用，或通过`SceneContext`/`GameObjectContext`自动注入；
3. 子容器的实例不会被父容器管理，需手动处理生命周期；
4. 验证功能仅在开发阶段使用，发布时建议关闭以提升性能。

此文档覆盖Extenject核心API，如需更细节的场景化用法，可参考官方仓库的示例项目（https://github.com/Mathijs-Bakker/Extenject/tree/master/UnityProject/Assets/Extenject/Examples）。