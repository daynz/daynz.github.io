# 特性
[toc]

## 特性基础
### 核心定义
- **特性（Attribute）**：用于为**程序集、类、方法、属性、参数**等代码元素添加**附加元数据**的标记
- 本质是继承自 `Attribute` 的特殊类，使用 `[ ]` 语法标注
- 作用：给代码附加说明、配置、约束，供编译器、框架、反射在运行时读取使用
- 特性**不直接影响代码逻辑**，属于声明式扩展，无侵入性

### 声明语法
```csharp
[特性名(参数, 属性=值)]
public class 类名
{
    [特性名]
    public void 方法() { }
}
```

### 核心特性
1. **元数据附加**：仅存储信息，不修改原有代码逻辑
2. **多标记叠加**：一个元素可标注多个特性，互不干扰
3. **参数支持**：支持定位参数、命名参数赋值
4. **反射读取**：运行时通过 `GetCustomAttributes()` 获取特性，频繁反射读取特性会有开销，建议缓存
5. **作用域限制**：可通过 `AttributeUsage` 限定使用目标
6. **无侵入性**：低耦合扩展代码功能

### `AttributeUsage` 特性约束
- 用于**限制自定义特性的使用范围**，是自定义特性必备配置
- 常用参数：
  - `AttributeTargets`：指定可标注的目标（类、方法、字段等）
  - `AllowMultiple`：是否允许重复标注
  - `Inherited`：是否可被子类继承

```csharp
[AttributeUsage(
    AttributeTargets.Class | AttributeTargets.Method,
    AllowMultiple = false,
    Inherited = true
)]
public class MyAttribute : Attribute { }
```

### 特性读取（反射）
运行时通过反射获取代码上标注的特性信息，实现动态逻辑控制
```csharp
// 获取类上的特性
var attrs = typeof(类名).GetCustomAttributes<MyAttribute>();

// 获取方法上的特性
var method = typeof(类名).GetMethod("方法名");
var methodAttrs = method.GetCustomAttributes<MyAttribute>();
```

### 特性使用规范
1. **命名规范**：自定义特性类以 `Attribute` 结尾
2. **作用域限制**：必须使用 `[AttributeUsage]` 限定目标
3. **无业务逻辑**：特性仅存储元数据，不写复杂业务代码
4. **叠加顺序**：多个特性标注顺序不影响功能
5. **框架优先**：优先使用系统/框架内置特性

## 常用系统内置特性
### 编译与代码管理特性
##### `[Obsolete]` 标记过期/废弃成员
- 提示成员已过时，支持警告/报错
```csharp
[Obsolete("请使用 NewMethod")]
public void OldMethod() { }

[Obsolete("禁止使用", error: true)]
public void OldMethod2() { }
```

##### `[Conditional]` 条件编译
- 满足编译符号才生效，常用于日志、调试
```csharp
[Conditional("DEBUG")]
public void LogDebug() { }
```

##### `[Serializable]` 标记可序列化
- 标记类可转为二进制/流数据进行传输
```csharp
[Serializable]
public class User { }
```

##### `[DllImport]` 调用非托管DLL
- 调用C/C++ 系统API
```csharp
[DllImport("user32.dll")]
private static extern int MessageBox(int h, string m, string c, int t);
```

### 数据校验特性（Data Annotations）
##### `[Required]` 必填校验
```csharp
[Required(ErrorMessage = "姓名不能为空")]
public string Name { get; set; }
```

##### `[StringLength]` 长度限制
```csharp
[StringLength(10, MinimumLength = 2)]
public string Name { get; set; }
```

##### `[Range]` 数值范围
```csharp
[Range(0, 150)]
public int Age { get; set; }
```

##### `[RegularExpression]` 正则验证
```csharp
[RegularExpression(@"^1\d{10}$")]
public string Phone { get; set; }
```

##### `[DisplayName]` 显示名称
```csharp
[DisplayName("用户姓名")]
public string Name { get; set; }
```

### 序列化特性
##### `[JsonIgnore]` 忽略序列化
```csharp
[JsonIgnore]
public string Password { get; set; }
```

##### `[JsonProperty]` 重命名
```csharp
[JsonProperty("user_name")]
public string UserName { get; set; }
```

### 枚举特性
##### `[Flags]` 位标记枚举
- 支持组合使用与位运算
```csharp
[Flags]
public enum Permission
{
    None = 0,
    Read = 1,
    Write = 2,
    Delete = 4
}
```

## 自定义特性
### 完整定义步骤
1. 继承 `Attribute`
2. 添加 `[AttributeUsage]` 约束
3. 定义构造函数/属性
4. 标注使用

```csharp
// 1. 定义自定义特性
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class CustomLogAttribute : Attribute
{
    // 命名参数
    public string Message { get; set; }
    // 定位参数
    public CustomLogAttribute(string level)
    {
        Level = level;
    }
    public string Level { get; }
}

// 2. 使用自定义特性
[CustomLog("Error", Message = "系统异常")]
public void Test() { }
```

## Unity 特性
### Unity 编辑器序列化与面板控制特性
- 作用于 Inspector 面板、脚本序列化、编辑器显示

##### `[SerializeField]` 强制序列化私有字段
- 让私有字段在 Inspector 显示并可序列化
```csharp
[SerializeField]
private int hp;
```

##### `[HideInInspector]` 隐藏公有字段
- 公有变量不在 Inspector 显示
```csharp
[HideInInspector]
public int score;
```

##### `[Range(float, float)]` 数值滑动条
```csharp
[Range(0, 100)]
public int speed;
```

##### `[Header]` 分组标题
```csharp
[Header("=== 玩家配置 ===")]
public int hp;
```

##### `[Tooltip]` 悬停提示
```csharp
[Tooltip("移动速度，建议1-10")]
public float speed;
```

##### `[Space]` 增加间距
```csharp
[Space(10)]
public int value;
```

##### `[Multiline]` / `[TextArea]` 多行文本
```csharp
[Multiline(3)]
public string desc;

[TextArea(2,5)]
public string story;
```

### Unity 执行与回调特性
##### `[RequireComponent]` 自动依赖组件
- 自动添加依赖组件，防止缺失
```csharp
[RequireComponent(typeof(Rigidbody))]
public class Player : MonoBehaviour { }
```

##### `[DisallowMultipleComponent]` 禁止重复添加
```csharp
[DisallowMultipleComponent]
public class GameManager : MonoBehaviour { }
```

##### `[AddComponentMenu]` 菜单路径
- 在 Unity 编辑器菜单中显示
```csharp
[AddComponentMenu("MyScripts/PlayerController")]
public class PlayerController : MonoBehaviour { }
```

##### `[ExecuteInEditMode]` 编辑模式执行
- 不运行游戏也执行 Update/Start
```csharp
[ExecuteInEditMode]
public class EditorTest : MonoBehaviour { }
```

### Unity 场景与构建特性
##### `[SerializeField]` 

- 让私有 / 保护级别的字段，在 Inspector 面板显示，并且参与 Unity 序列化、场景 / 预制体保存。

##### `[FormerlySerializedAs]` 重命名兼容
- 字段改名后保留序列化数据
```csharp
[FormerlySerializedAs("oldHp")]
public int hp;
```

## 特性使用场景
### 通用场景
1. **数据校验**：模型字段必填、长度、格式验证
2. **序列化控制**：JSON/XML 忽略、重命名
3. **代码标记**：过期、未完成、版本管理
4. **配置映射**：数据库、API 路由、配置绑定
5. **AOP 扩展**：日志、权限、缓存、切面

### Unity 专属场景
1. **Inspector 面板美化与配置**：标题、滑动条、提示
2. **序列化控制**：私有字段序列化、字段重命名兼容
3. **组件依赖管理**：自动添加依赖组件
4. **编辑器扩展**：编辑模式执行、菜单路径
5. **资源与场景管理**：资源引用、打包配置



