---
title: "07Csharp反射"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Csharp/07Csharp反射.html
tags: [编程语言]
---

# 反射
[toc]

## 反射基础
### 核心定义
- **反射**：程序在**运行时获取自身类型信息**（类、方法、属性、字段、特性）并**动态调用的机制**
- 核心操作对象：**`Type`**（用于描述任意数据类型的元数据类）
- 作用：动态加载程序集、创建对象、调用方法、访问私有成员、读取特性，实现代码解耦与模块化扩展

### 核心作用
1. **运行时获取类型信息**：查看类结构、成员列表、特性标记、继承与接口实现
2. **动态创建对象**：根据类型名称字符串实例化对象，无需编译期`new`
3. **动态调用成员**：调用公共/私有方法、读写字段与属性
4. **读取特性元数据**：获取`Attribute`附加的配置与说明信息
5. **插件化与解耦**：动态加载外部程序集，实现无侵入式扩展

### 核心类
- **`Type`**：描述类型结构（类、接口、结构体、枚举、委托）
- **`Assembly`**：加载与操作程序集、动态链接库
- **`MethodInfo`**：封装方法的元数据，用于调用
- **`FieldInfo`**：封装字段的元数据，用于读写
- **`PropertyInfo`**：封装属性的元数据，用于读写
- **`Activator`**：提供静态方法快速动态创建对象实例
- **`BindingFlags`**：反射查找成员时指定访问级别与类型

### 获取`Type`对象的3种方式
```csharp
// 1. 通过已存在的实例获取
User user = new User();
Type type1 = user.GetType();

// 2. 通过 typeof 直接获取（最常用、性能最高）
Type type2 = typeof(User);

// 3. 通过类的全名字符串获取（动态加载专用）
Type type3 = Type.GetType("命名空间.User");
```

### 动态创建对象
```csharp
// 无参构造
object instance = Activator.CreateInstance(typeof(User));

// 带参构造
object instance = Activator.CreateInstance(typeof(User), "参数1", 参数2);
```

### 动态调用方法
```csharp
Type type = typeof(User);
object instance = Activator.CreateInstance(type);

// 获取公共方法
MethodInfo method = type.GetMethod("MethodName");

// 调用（实例对象，参数数组）
method.Invoke(instance, new object[] { "参数" });
```

### 动态访问属性与字段
```csharp
Type type = typeof(User);
object instance = Activator.CreateInstance(type);

// 访问属性
PropertyInfo prop = type.GetProperty("PropertyName");
prop.SetValue(instance, "赋值内容");
object value = prop.GetValue(instance);

// 访问字段
FieldInfo field = type.GetField("fieldName");
field.SetValue(instance, "赋值内容");
object fieldValue = field.GetValue(instance);
```

### 访问私有成员
需配合**`BindingFlags`**指定查找条件
```csharp
// 获取私有实例方法
MethodInfo method = type.GetMethod(
    "PrivateMethod", 
    BindingFlags.Instance | BindingFlags.NonPublic
);

// 获取私有字段
FieldInfo field = type.GetField(
    "_privateField", 
    BindingFlags.Instance | BindingFlags.NonPublic
);

// 调用/赋值方式与公共成员一致
method.Invoke(instance, null);
```

### 反射读取特性
反射与特性结合，实现运行时读取元数据
```csharp
Type type = typeof(User);

// 获取单个特性
var attr = type.GetCustomAttribute<MyCustomAttribute>();

// 获取所有特性
var attrs = type.GetCustomAttributes();
```

### 获取类型基础信息
```csharp
Type type = typeof(User);

bool isClass = type.IsClass;
bool isPublic = type.IsPublic;
bool isAbstract = type.IsAbstract;
bool isGenericType = type.IsGenericType;

string typeName = type.Name;
string fullName = type.FullName;

Type baseType = type.BaseType;
Type[] interfaces = type.GetInterfaces();
```

### 常用 `BindingFlags` 枚举
- `BindingFlags.Instance`：实例成员
- `BindingFlags.Static`：静态成员
- `BindingFlags.Public`：公共成员
- `BindingFlags.NonPublic`：私有/保护/内部成员
- 组合写法：`BindingFlags.Instance | BindingFlags.NonPublic`

### 执行原理
1. 编译后，类型、成员、特性信息以**元数据**形式保存在程序集中
2. 运行时，CLR 读取元数据并构建`Type`对象
3. 通过`Invoke`等方法间接执行成员，实现**晚绑定**
4. 泛型类型会在运行时生成闭合类型，反射可正常识别

### 性能说明
1. 反射调用性能低于直接硬编码调用
2. 高频调用场景建议**缓存`Type`、`MethodInfo`、`PropertyInfo`**
3. 高性能替代方案：`Expression`表达式目录树、`delegate`委托、`dynamic`
4. 引用类型共用JIT代码，值类型独立生成，无额外装箱拆箱损耗

### 注意事项
1. 编译时无语法校验，名称/类型错误会在运行时抛出异常
2. 可访问私有成员，**破坏封装性**，必须谨慎使用
3. 动态代码可读性、可调试性低于静态编码
4. 泛型反射需要单独处理构造、闭合类型等操作
5. 所有反射操作建议使用`try-catch`异常捕获
6. 避免在`Update`等高频函数中直接使用反射

## 反射原理

**反射是 .NET 运行时提供的元数据自省机制**：程序在运行时可动态获取类型、成员、程序集信息，并创建对象、调用方法、读写字段 / 属性，无需编译期硬编码类型引用。Unity 依赖反射实现脚本生命周期、组件查找、序列化、热更新等核心能力。

### 元数据与 Type 对象
- **元数据（Metadata）**：C# 编译时，编译器为每个类型（类/结构体/接口/枚举）生成完整描述信息（名称、基类、接口、字段、方法、构造函数、访问权限、内存布局等），嵌入程序集（Assembly）。
- **Type 对象**：程序集加载到应用程序域（`AppDomain`）时，.NET 运行时为每个类型创建唯一的 **`System.Type`** 对象，作为该类型的“元数据入口”。
  
  - 所有实例共享同一个 Type 对象。
  - Type 内部结构（简化）：
    ```csharp
    class Type {
        string Name;          // 类型名
        string Namespace;      // 命名空间
        Type BaseType;         // 基类
        Type[] Interfaces;     // 实现的接口
        FieldInfo[] Fields;    // 字段元数据
        MethodInfo[] Methods;  // 方法元数据
        ConstructorInfo[] Ctors;// 构造函数
        // ... 内存大小、偏移、特性等
    }
    ```
  - 通过 Type 可遍历所有成员，按内存偏移直接访问私有成员。

### 反射的执行流程

1. **获取 Type**：通过 `typeof(类名)`、`对象.GetType()`、`Type.GetType("全类名")`、`Assembly.GetType()` 拿到类型元数据。
2. **获取成员**：用 `GetField()`/`GetMethod()`/`GetProperty()` 拿到 `FieldInfo`/`MethodInfo`/`PropertyInfo`（成员元数据）。
3. **动态操作**：
   - 创建对象：`Activator.CreateInstance(Type)`。
   - 调用方法：`MethodInfo.Invoke(实例, 参数)`。
   - 读写字段：`FieldInfo.GetValue(实例)`/`SetValue(实例, 值)`。
4. **跨边界访问**：通过 `BindingFlags` 可绕过 `public/protected/private` 访问限制。

### Unity 中的反射底层
- Unity 核心（C++）调用 C# 脚本生命周期（`Start`/`Update`/`OnEnable`）时，**完全依赖反射**：
  1. C++ 层通过 Mono/IL2CPP 获取 C# 程序集。
  2. 反射查找脚本类的 `Update` 方法（支持 private）。
  3. 运行时动态调用，实现脚本与引擎的绑定。
- 序列化（Inspector 显示、`JsonUtility`）、`GetComponent`、`AddComponent` 均基于反射实现类型匹配与实例创建。

## 反射核心 API
### 核心命名空间
```csharp
using System;       // Type
using System.Reflection; // FieldInfo/MethodInfo/Assembly
```

### 获取 Type
| 方式 | 用法 | 说明 |
|------|------|------|
| **typeof** | `Type t = typeof(Player);` | 编译期已知类型，性能最高 |
| **GetType()** | `Type t = playerObj.GetType();` | 运行时从实例获取 |
| **Type.GetType** | `Type t = Type.GetType("MyGame.Player");` | 按全类名字符串获取（需程序集已加载） |
| **Assembly 获取** | `Assembly asm = Assembly.GetExecutingAssembly();`<br>`Type t = asm.GetType("MyGame.Player");` | 遍历/查询指定程序集类型 |

### 成员获取（`BindingFlags` 必用）
**`BindingFlags` 是反射权限控制核心**，常用组合：
```csharp
// 实例 + 公开 + 私有（最常用）
var flags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
```

#### 字段（`FieldInfo`）
```csharp
// 获取私有实例字段 m_Health
FieldInfo field = typeof(Player).GetField("m_Health", flags);
// 读取值
int health = (int)field.GetValue(playerInstance);
// 设置值
field.SetValue(playerInstance, 100);
```

#### 方法（`MethodInfo`）
```csharp
// 获取方法：TakeDamage(int damage)
MethodInfo method = typeof(Player).GetMethod("TakeDamage", flags, new Type[] { typeof(int) });
// 调用（实例，参数数组）
method.Invoke(playerInstance, new object[] { 20 });
```

#### 属性（`PropertyInfo`）
```csharp
PropertyInfo prop = typeof(Player).GetProperty("Health", flags);
int currentHealth = (int)prop.GetValue(playerInstance);
prop.SetValue(playerInstance, 150);
```

#### 构造函数（`ConstructorInfo`）
```csharp
ConstructorInfo ctor = typeof(Player).GetConstructor(Type.EmptyTypes);
Player newPlayer = (Player)ctor.Invoke(null);
// 简化：Activator.CreateInstance
Player newPlayer2 = (Player)Activator.CreateInstance(typeof(Player));
```

### 程序集操作（Unity 热更新/插件常用）
```csharp
// 获取当前执行程序集（Assembly-CSharp）
Assembly asm = Assembly.GetExecutingAssembly();
// 获取所有类型
Type[] allTypes = asm.GetTypes();
// 加载外部 DLL（热更新）
Assembly hotfixAsm = Assembly.LoadFrom("Hotfix.dll");
```

## Unity 反射的典型应用场景
### 访问 Unity 组件私有成员（调试/黑盒修改）
```csharp
// 修改 Transform 私有缩放字段 m_LocalScale
FieldInfo scaleField = typeof(Transform).GetField(
    "m_LocalScale", 
    BindingFlags.NonPublic | BindingFlags.Instance
);
if (scaleField != null) {
    scaleField.SetValue(transform, new Vector3(2, 2, 2));
}
```

### 动态创建/添加组件（配置驱动）
```csharp
// 按字符串动态添加 Rigidbody
Type rbType = Type.GetType("UnityEngine.Rigidbody, UnityEngine");
GameObject go = new GameObject("DynamicObj");
Rigidbody rb = (Rigidbody)go.AddComponent(rbType);
```

### 框架级解耦（事件/依赖注入/热更新）
- 自动注册事件：扫描所有类，反射查找带 `[EventListener]` 特性的方法并绑定。
- 热更新：加载外部 DLL，反射创建热更类实例并替换原有逻辑。
- 序列化框架（如 JsonUtility、Protobuf）：反射遍历字段完成读写。

### 编辑器工具（Editor 反射）
- 自动扫描场景中所有实现 `IConfigurable` 接口的组件并批量配置。
- 反射调用 Unity 编辑器内部 API（如 `EditorUtility` 私有方法）。

## Unity 反射的关键限制与坑点
### IL2CPP 与 AOT 限制
- **Mono（JIT）**：完全支持反射，元数据完整保留。
- **IL2CPP（AOT）**：默认**裁剪未使用的元数据**，导致运行时反射找不到类型/方法（编辑器正常、打包崩溃）。
  - 解决：
    1. **link.xml**：明确保留反射用到的类型/程序集。
    2. **[Preserve] 特性**：标记类/成员不被裁剪。
    3. 避免动态字符串获取类型，尽量用 `typeof`。

### 性能开销
- 反射调用比直接调用慢 **100–1000 倍**（`GetMethod`/`Invoke` 均为重量级操作）。
- 优化原则：
  - **禁止在 `Update/FixedUpdate` 中使用反射**。
  - **缓存反射结果**：`Type`/`MethodInfo` 只获取一次，全局复用。
  - 用**委托/接口**替代高频反射调用。

### 访问权限与安全
- 反射可绕过所有访问修饰符（private/protected/internal），破坏封装。
- 易引入隐藏 bug（如修改私有字段导致引擎内部逻辑异常）。

## 最佳实践
1. **能用直接调用就不用反射**：仅在解耦、动态、框架场景使用。
2. **缓存反射对象**：
   ```csharp
   // 全局缓存
   private static readonly MethodInfo _takeDamageMethod = 
       typeof(Player).GetMethod("TakeDamage", BindingFlags.Instance | BindingFlags.Public);
   ```
3. **IL2CPP 提前配置**：项目初期规划 link.xml，避免打包后反射失效。
4. **替代方案**：
   - 接口/抽象类：编译期绑定，性能最优。
   - 委托：运行时绑定，性能接近直接调用。
   - Unity `SendMessage`：底层也是反射，但更易用（性能仍差）。

## 完整测试示例
```csharp
public class TestReflection : MonoBehaviour {
    private int _privateHealth = 100; // 私有字段

    private void Start() {
        // 1. 获取当前类 Type
        Type type = GetType();

        // 2. 获取私有字段
        FieldInfo healthField = type.GetField(
            "_privateHealth", 
            BindingFlags.Instance | BindingFlags.NonPublic
        );

        // 3. 读取并修改私有字段
        Debug.Log($"原私有Health: {healthField.GetValue(this)}");
        healthField.SetValue(this, 200);
        Debug.Log($"修改后Health: {healthField.GetValue(this)}");

        // 4. 动态调用私有方法
        MethodInfo healMethod = type.GetMethod(
            "Heal", 
            BindingFlags.Instance | BindingFlags.NonPublic,
            null,
            new Type[] { typeof(int) },
            null
        );
        healMethod.Invoke(this, new object[] { 50 });
    }

    // 私有方法
    private void Heal(int amount) {
        _privateHealth += amount;
        Debug.Log($"Heal {amount}, 当前Health: {_privateHealth}");
    }
}
```
