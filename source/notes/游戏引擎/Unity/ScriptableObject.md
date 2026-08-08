### Unity 核心序列化/编辑器特性全表
| 特性分类       | 特性名称                  | 核心作用                                                                 | 适用类型                          | 关键示例                                                                 |
|----------------|---------------------------|--------------------------------------------------------------------------|-----------------------------------|--------------------------------------------------------------------------|
| 🌟 数值约束     | `[Range(min, max)]`       | 限制数值范围，Inspector 显示滑动条                                       | int、float、double                | `[Range(1,80)] [SerializeField] private int _level;`                     |
|                | `[MinValue(min)]`         | 仅限制数值最小值（Unity 2020+）                                          | int、float、double                | `[MinValue(1)] [SerializeField] private float _speed;`                   |
|                | `[MaxValue(max)]`         | 仅限制数值最大值（Unity 2020+）                                          | int、float、double                | `[MaxValue(1f)] [SerializeField] private float _critRate;`               |
| 🌟 显示控制     | `[Header("标题")]`        | 给字段分组，添加可视化标题                                               | 所有可序列化类型                  | `[Header("基础属性")] [SerializeField] private float _health;`          |
|                | `[Tooltip("提示文本")]`   | 鼠标悬停字段时显示提示文字                                               | 所有可序列化类型                  | `[Tooltip("暴击伤害（0-5）")] [SerializeField] private float _critDamage;` |
|                | `[Space(height)]`         | 在 Inspector 中添加空白间距，分隔字段                                    | 所有可序列化类型                  | `[Space(10)] [SerializeField] private float _defense;`                   |
|                | `[TextArea(min, max)]`    | 将 string 显示为带滚动条的多行文本框                                     | string                            | `[TextArea(3,5)] [SerializeField] private string _description;`          |
|                | `[Multiline(lines)]`      | 将 string 显示为简单多行文本框（无滚动条）                               | string                            | `[Multiline(3)] [SerializeField] private string _note;`                  |
|                | `[HideInInspector]`       | 序列化字段但在 Inspector 中隐藏                                         | 所有可序列化类型                  | `[HideInInspector] [SerializeField] private string _id;`                 |
|                | `[ReadOnly]`              | Inspector 中显示字段但禁止编辑（Unity 2021+ 内置）                       | 所有可序列化类型                  | `[ReadOnly] [SerializeField] private float _finalAttack;`                |
|                | `[Delayed]`               | 输入数值后按回车才生效（避免实时修改触发多次校验）                       | int、float、string                | `[Delayed] [SerializeField] private string _name;`                       |
|                | `[ColorUsage(showAlpha, hdr)]` | 自定义颜色拾取器（是否显示透明度/支持HDR）                          | Color                             | `[ColorUsage(false,true)] [SerializeField] private Color _themeColor;`   |
|                | `[GradientUsage(hdr)]`    | 自定义渐变拾取器（支持HDR）                                              | Gradient                          | `[GradientUsage(true)] [SerializeField] private Gradient _skillGradient;`|
|                | `[EnumFlags]`             | 让枚举字段支持多选（需配合 `[Flags]` 枚举）                              | 带 `[Flags]` 的枚举               | `[EnumFlags] [SerializeField] private WeaponType _weapons;`              |
|                | `[AssetPreview]`          | 显示资源预览图（比如 Sprite、Texture）                                   | 资源引用类型（Sprite、Texture）   | `[AssetPreview] [SerializeField] private Sprite _avatar;`                |
| 🌟 序列化控制   | `[SerializeField]`        | 强制序列化私有字段（核心）                                               | 所有可序列化类型                  | `[SerializeField] private float _attack;`                                |
|                | `[NonSerialized]`         | 禁止序列化 public 字段（不保存，运行时重置）                             | 所有类型                          | `[NonSerialized] public float _tempData;`                                |
|                | `[SerializeReference]`    | 序列化接口/抽象类引用（支持多态）                                       | 接口、抽象类                      | `[SerializeReference] private IBuff _buff;`                              |
|                | `[FormerlySerializedAs("旧字段名")]` | 重命名字段后保留旧数据（避免丢失配置）                          | 所有可序列化类型                  | `[FormerlySerializedAs("oldHealth")] [SerializeField] private float _health;` |
| 🌟 交互功能     | `[ContextMenu("菜单名")]` | 类右键菜单添加自定义方法（无参数void方法）                              | 类内的 void 方法（私有/公开）     | `[ContextMenu("重置默认值")] private void ResetDefault();`               |
|                | `[ContextMenuItem("按钮名", "方法名")]` | 字段右侧添加按钮，点击执行方法                                 | 所有可序列化类型                  | `[ContextMenuItem("设为5星","Set5Star")] [SerializeField] private int _rarity;` |
| 🌟 资源管理     | `[CreateAssetMenu(fileName, menuName, order)]` | 右键创建 ScriptableObject 实例                          | 继承 ScriptableObject 的类        | `[CreateAssetMenu(menuName="Honkai/Character")] public class CharacterAttr : ScriptableObject {}` |
|                | `[AssetMenuOrder(order)]` | 调整资源创建菜单的显示顺序                                               | 继承 ScriptableObject 的类        | `[AssetMenuOrder(2)] [CreateAssetMenu] public class ItemData : ScriptableObject {}` |
|                | `[PreviewType(typeof(T))]` | 指定资源预览类型（比如用 Sprite 预览 Texture）                          | 资源类型                          | `[PreviewType(typeof(Sprite))] [SerializeField] private Texture2D _icon;`|
| 🌟 校验与调试   | `[Tooltip("提示")]`       | （同显示控制，补充：可结合 `[ValidateInput]`）                            | 所有类型                          | 见显示控制示例                                                           |
|                | `[ValidateInput("校验方法名", "错误提示")]` | 输入值校验（需自定义静态方法）                                   | 所有类型                          | `[ValidateInput("CheckLevel", "等级必须1-80")] [SerializeField] private int _level;` |
| 🌟 特殊标记     | `[RequireComponent(typeof(T))]` | 自动添加依赖组件（仅 MonoBehaviour）                              | MonoBehaviour 类                  | `[RequireComponent(typeof(Rigidbody))] public class Character : MonoBehaviour {}` |
|                | `[DisallowMultipleComponent]` | 禁止同一 GameObject 挂载多个该组件（仅 MonoBehaviour）           | MonoBehaviour 类                  | `[DisallowMultipleComponent] public class PlayerController : MonoBehaviour {}` |
|                | `[ExecuteInEditMode]`     | 在编辑器模式下执行脚本（仅 MonoBehaviour）                               | MonoBehaviour 类                  | `[ExecuteInEditMode] public class EditorPreview : MonoBehaviour {}`       |
|                | `[CanEditMultipleObjects]` | 支持同时编辑多个对象的该组件（仅 MonoBehaviour）                         | MonoBehaviour 类                  | `[CanEditMultipleObjects] public class EnemyAI : MonoBehaviour {}`        |

### 补充说明
1. **特性生效范围**：
   - 大部分特性（如 `[Range]`/`[Tooltip]`）仅在 **Unity 编辑器** 生效，不影响运行时性能；
   - 少数特性（如 `[NonSerialized]`/`[SerializeField]`）影响序列化逻辑，运行时也会生效。

2. **兼容性注意**：
   - `[ReadOnly]`/`[MinValue]`/`[MaxValue]` 是 Unity 2021+/2020+ 新增特性，低版本需自定义；
   - `[EnumFlags]` 需手动引入命名空间 `UnityEditor`（仅编辑器代码），或使用第三方工具。

3. **自定义特性**：
   如果内置特性不够用，可自定义编辑器特性（比如“百分比显示”“数值格式化”），示例：
   ```csharp
   // 自定义百分比特性（编辑器代码，放在 Editor 目录）
   using UnityEditor;
   using UnityEngine;
   
   public class PercentAttribute : PropertyAttribute {}
   
   [CustomPropertyDrawer(typeof(PercentAttribute))]
   public class PercentDrawer : PropertyDrawer
   {
       public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
       {
           // 显示为 0-100% 格式
           EditorGUI.BeginProperty(position, label, property);
           float value = property.floatValue * 100;
           value = EditorGUI.FloatField(position, label, value);
           property.floatValue = value / 100;
           EditorGUI.EndProperty();
       }
   }
   
   // 使用自定义特性
   [Percent]
   [SerializeField] private float _critRate = 0.5f; // 显示为 50 而非 0.5
   ```

### 总结
1. 核心高频特性：`[SerializeField]`/`[Range]`/`[Header]`/`[Tooltip]`/`[ContextMenu]` 是你配置 `CharacterAttribute` 最常用的；
2. 进阶特性：`[SerializeReference]`（多态）、`[EnumFlags]`（枚举多选）、`[FormerlySerializedAs]`（数据兼容）适合复杂配置；
3. 特性仅编辑器生效：无需担心性能问题，放心用于优化配置体验。

你可以根据 `CharacterAttribute` 的实际需求，从表格中挑选对应的特性来优化配置面板，比如给暴击率加 `[Percent]` 自定义特性、给角色描述加 `[TextArea]` 等。