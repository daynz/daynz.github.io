# 集合

[toc]

## 非泛型集合：`ArrayList`、`Hashtable`

### 核心定义
- **非泛型集合**：C# 早期（.NET Framework 1.x）无泛型时的集合类型，所有元素统一以`object`类型存储，不限制元素数据类型
- **`ArrayList`**：动态长度的**有序线性集合**，功能等价于数组，可自动扩容
- **`Hashtable`**：**键值对（Key/Value）集合**，根据唯一键快速查找值，基于哈希表实现

### 继承结构
- `ArrayList`：直接继承自`object`，实现`IList`、`ICollection`、`IEnumerable`接口
- `Hashtable`：直接继承自`object`，实现`IDictionary`、`ICollection`、`IEnumerable`接口

### 核心特性
##### `ArrayList` 特性
1. 元素类型统一为`object`，可存储**任意类型**数据（如同时存`int`、`string`、自定义对象）
2. 动态扩容：容量不足时自动翻倍，无需手动指定长度
3. 有序存储：元素按添加顺序排列，通过**索引**访问（从0开始）
4. 元素可重复，无长度限制

##### `Hashtable` 特性
1. 存储形式：`键(Key) + 值(Value)` 键值对，**键必须唯一**，值可重复
2. 键和值均为`object`类型，支持任意类型作为键/值
3. 无序存储：不记录添加顺序，遍历顺序不固定
4. 高效查找：通过键直接定位值，查找速度远快于`ArrayList`
5. 键不能为`null`，值可以为`null`

### 实现原理
#### `ArrayList`
1. 底层基于`object[]`数组实现，默认初始容量为0，首次添加元素时扩容为4
2. 添加元素：将元素装箱为`object`存入数组
3. 访问/获取元素：返回`object`类型，需拆箱为原始值类型
4. 扩容机制：容量不足时，新容量 = 当前容量 × 2

#### `Hashtable`
1. 底层基于哈希桶 + 链表结构，通过键的哈希码分配存储位置
2. 添加元素：键、值分别装箱为`object`，根据键的哈希码存储
3. 查找元素：通过键的哈希码快速定位，无需遍历全部元素
4. 处理哈希冲突：使用链表存储冲突元素，保证数据完整性

### 装箱与拆箱
1. **值类型元素必装箱**：往集合中添加`int`、`struct`等值类型时，会触发装箱操作
2. **取值必拆箱**：从集合中获取元素时，需强制类型转换，触发拆箱操作
3. 频繁装箱拆箱会造成**堆内存分配、GC频繁回收**，显著降低程序性能

### 类型安全问题
- 无编译时类型检查：可随意添加不同类型元素，运行时获取元素转换类型错误会抛`InvalidCastException`
- 代码冗余：每次存取都需要手动强制类型转换，可读性、可维护性差

### 常用操作示例
**`ArrayList` 示例**

```csharp
// 创建集合
ArrayList arrayList = new ArrayList();

// 添加元素（值类型装箱）
arrayList.Add(100);        // int → object 装箱
arrayList.Add("Hello");    // 引用类型，无装箱
arrayList.Add(3.14);

// 访问元素（拆箱）
int num = (int)arrayList[0];  // object → int 拆箱
string str = (string)arrayList[1];

// 遍历集合
foreach (var item in arrayList)
{
    Console.WriteLine(item);
}

// 其他常用方法
arrayList.Remove(100);      // 移除指定元素
arrayList.RemoveAt(0);      // 根据索引移除
arrayList.Clear();          // 清空集合
```

**`Hashtable` 示例**

```csharp
// 创建集合
Hashtable hashtable = new Hashtable();

// 添加键值对（键、值均装箱）
hashtable.Add(1, "张三");       // 键：int，值：string
hashtable.Add("age", 20);       // 键：string，值：int（装箱）
hashtable[2] = "李四";          // 索引器添加

// 访问元素（值拆箱）
string name = (string)hashtable[1];
int age = (int)hashtable["age"]; // object → int 拆箱

// 遍历键、值
foreach (var key in hashtable.Keys)
{
    Console.WriteLine($"键：{key}，值：{hashtable[key]}");
}

// 其他常用方法
hashtable.Remove(1);        // 根据键移除
bool exists = hashtable.ContainsKey("age"); // 判断键是否存在
hashtable.Clear();          // 清空集合
```

### 性能影响
1. **装箱拆箱开销**：值类型频繁存取产生大量装箱、拆箱操作，消耗CPU和内存
2. **GC压力**：装箱产生的堆内存对象，会增加垃圾回收（GC）频率
3. **类型转换开销**：运行时类型转换，相比泛型集合无性能优势
4. 仅适合**少量数据、简单场景**，大数据量、高性能场景不推荐使用

### 注意事项
1. **类型转换异常**：获取元素时必须与原始类型完全一致，否则运行时报错
2. **线程不安全**：多线程环境下读写集合，需要手动加锁，否则会报错
3. **`Hashtable` 键唯一性**：重复添加相同键会抛`ArgumentException`
4. **无序性**：`Hashtable` 不保证元素顺序，依赖顺序的场景禁止使用
5. 已被**泛型集合**完全替代，不建议在新项目中使用

### 替代方案
| 非泛型集合 | 推荐泛型替代 | 优势 |
|------------|--------------|------|
| `ArrayList` | `List<T>` | 类型安全、无装箱拆箱、性能更高 |
| `Hashtable` | `Dictionary<TKey, TValue>` | 类型安全、无装箱拆箱、有序（按添加顺序）、效率更高 |

## 泛型集合：`List<T>`

### 核心定义
- **泛型集合**：强类型集合，通过`<T>`（类型参数）指定存储元素的**唯一数据类型**
- **`List<T>`**：基于动态数组实现的**有序线性泛型集合**，是`ArrayList`的泛型替代方案，`T`代表集合中元素的类型（如`List<int>`、`List<string>`）

### 继承结构
- 直接实现：`IList<T>`、`ICollection<T>`、`IEnumerable<T>`
- 间接实现：`IList`、`ICollection`、`IEnumerable`

### 核心特性
1. **强类型安全**：编译时**严格校验元素类型**，只能存储指定`T`类型数据，避免运行时类型转换异常
2. **无装箱拆箱**：存储值类型元素时，直接以原值类型存储，**完全避免装箱与拆箱**
3. **动态扩容**：底层基于`T[]`泛型数组实现，容量不足自动扩容
4. **有序存储**：元素按添加顺序排列，支持**索引快速访问**（从0开始）
5. **元素可重复**：允许添加相同值的元素，无长度限制

### 实现原理
1. 底层使用**泛型数组`T[]`**存储数据，默认初始容量为0，首次添加元素扩容为4
2. 扩容机制：容量不足时，新容量 = 当前容量 × 2，复制原数组数据到新数组并GC
3. 添加/访问元素：直接操作指定类型数据，无装箱、拆箱、类型转换操作
4. 索引访问：通过下标直接定位元素，时间复杂度O(1)

### 常用操作示例

```csharp
// 1. 创建泛型集合（指定存储类型为 int）
List<int> intList = new List<int>();

// 2. 添加元素（无装箱，直接存储值类型）
intList.Add(10);
intList.Add(20);
intList.Add(30);
// intList.Add("test"); // 编译报错，类型不匹配，强类型安全

// 3. 批量添加元素
intList.AddRange(new int[] { 40, 50, 60 });

// 4. 访问元素（无拆箱，直接获取int类型）
int first = intList[0]; 
int last = intList[intList.Count - 1];

// 5. 修改元素
intList[1] = 200;

// 6. 遍历集合
foreach (int num in intList)
{
    Console.WriteLine(num);
}

// 7. 常用泛型方法
intList.Remove(20);      // 移除指定元素
intList.RemoveAt(0);    // 根据索引移除
bool contains = intList.Contains(30); // 判断是否包含元素
intList.Sort();         // 排序
intList.Clear();        // 清空集合
```

### 高级常用方法
```csharp
List<int> list = new List<int> { 1, 2, 3, 4, 5 };

// 查找符合条件的元素
int find = list.Find(x => x > 3); 

// 查找所有符合条件的元素
List<int> findAll = list.FindAll(x => x % 2 == 0); 

// 遍历元素
list.ForEach(x => Console.WriteLine(x));

// 获取范围元素
List<int> range = list.GetRange(1, 3);

// 插入元素
list.Insert(2, 100);
```

### 性能与内存
1. **无装箱拆箱**：存储值类型时，数据直接存于数组（栈或托管堆），无额外堆内存开销
2. **低GC压力**：无临时装箱对象，大幅减少垃圾回收次数
3. **扩容优化**：可通过构造函数指定初始容量（`new List<int>(100)`），避免频繁扩容，提升性能
4. **访问效率**：索引访问速度极快，适合频繁读取、遍历场景

### 注意事项
1. **线程不安全**：多线程并发读写时，必须加锁或使用线程安全集合（`ConcurrentBag<T>`）
2. **插入/删除性能**：中间位置插入/删除元素需移动后续数据，时间复杂度O(n)，频繁操作建议用`LinkedList<T>`
3. **初始容量设置**：预知数据量时，指定初始容量可避免多次扩容，优化性能
4. **引用类型判空**：存储引用类型时，需判断元素是否为`null`，避免空引用异常

### 与`ArrayList`核心对比
| 特性 | `List<T>` | `ArrayList` |
| :--- | :--- | :--- |
| 类型约束 | 强类型，仅存储指定`T`类型 | 无约束，存储`object`任意类型 |
| 装箱拆箱 | 完全无 | 值类型必触发 |
| 类型安全 | 编译时校验，安全无异常 | 运行时转换，易报错 |
| 代码写法 | 简洁，无需强制转换 | 冗余，需强制类型转换 |
| 性能 | 高性能，低GC压力 | 性能低，GC压力大 |

## 键值对集合：`Dictionary<TKey, TValue>`

### 核心定义
- **泛型键值对集合**：强类型安全的键值对存储结构，是`Hashtable`的泛型替代方案
- **`Dictionary<TKey, TValue>`**：通过`<TKey>`指定键的类型，`<TValue>`指定值的类型，基于哈希表实现，根据唯一键快速查找值

### 继承结构
- 直接实现：`IDictionary<TKey, TValue>`、`ICollection<KeyValuePair<TKey, TValue>>`、`IEnumerable<KeyValuePair<TKey, TValue>>`
- 间接实现：`IDictionary`、`ICollection`、`IEnumerable`

### 核心特性
1. **强类型安全**：编译时**严格校验键、值的数据类型**，避免运行时类型转换异常
2. **无装箱拆箱**：键和值直接以指定类型存储，值类型操作完全**避免装箱与拆箱**
3. **键唯一约束**：**键`TKey`必须唯一**，重复添加相同键会抛`ArgumentException`
4. **高效查找**：通过键的哈希码定位数据，查找、添加、删除操作平均时间复杂度O(1)
5. **可空规则**：键不能为`null`，值可以为`null`
6. **有序性**：按元素添加顺序枚举（区别于`Hashtable`无序）

### 实现原理
1. 底层基于**哈希桶+链表 / 红黑树**结构实现，通过键的哈希码分配存储位置
2. 添加元素：计算键的哈希码，映射到对应哈希桶，存储键值对数据
3. 查找元素：根据键的哈希码快速定位桶位置，无需遍历全部数据
4. 哈希冲突处理：使用链表存储冲突元素，保证数据完整性与访问效率
5. 动态扩容：元素数量达到容量阈值时自动扩容，重新分配哈希桶

### 底层实现

- **int [] buckets（哈希桶数组）**
  - 存**链表头节点的索引**
  - 作用：根据 Key 的哈希值快速定位到数据位置
- **Entry [] entries（数据数组）**
  - 真正存数据的结构体数组
  - 每个 Entry 包含：
    - `HashCode` 哈希值
    - `Key` 键
    - `Value` 值
    - `Next` 下一个节点索引（链表用）
- **int count**
  - 当前实际元素个数
- **负载因子（默认 0.72）**：触发扩容的阈值

### 常用操作示例

```csharp
// 创建字典（键：int类型，值：string类型）
Dictionary<int, string> dict = new Dictionary<int, string>();

// 添加键值对（无装箱拆箱）
dict.Add(1, "张三");
dict.Add(2, "李四");
dict[3] = "王五"; // 索引器添加/修改

// 访问元素（无拆箱，直接获取强类型值）
string name = dict[1];
// 安全获取值，避免键不存在报错
if (dict.TryGetValue(2, out string value))
{
    Console.WriteLine(value);
}

// 遍历键值对
foreach (KeyValuePair<int, string> kvp in dict)
{
    Console.WriteLine($"键：{kvp.Key}，值：{kvp.Value}");
}

// 单独遍历键/值
foreach (int key in dict.Keys) { }
foreach (string val in dict.Values) { }
```

### 常用方法
```csharp
Dictionary<int, string> dict = new Dictionary<int, string>();

// 添加元素
dict.Add(1, "测试");

// 判断键是否存在
bool hasKey = dict.ContainsKey(1);
// 判断值是否存在
bool hasValue = dict.ContainsValue("测试");

// 移除元素
dict.Remove(1);

// 清空集合
dict.Clear();

// 获取元素数量
int count = dict.Count;
```

### 性能影响
1. **无装箱拆箱开销**：键值直接存储，无堆内存额外分配，CPU与内存消耗极低
2. **高效读写**：哈希表结构保证添加、删除、查找操作高效执行
3. **GC低压力**：无临时装箱对象，大幅减少垃圾回收频率
4. **哈希函数影响**：键类型的哈希函数质量直接影响性能，自定义类型需重写`GetHashCode()`和`Equals()`

### 注意事项
1. **键唯一性**：同一字典中不允许重复键，添加重复键会直接抛出异常
2. **键的不可变性**：作为键的对象，其哈希值不可变更，否则会导致查找失效
3. **自定义类型作为键**：必须重写`Equals()`和`GetHashCode()`方法，保证键的唯一性判断正确
4. **线程不安全**：多线程并发读写时，必须加锁或使用`ConcurrentDictionary<TKey, TValue>`
5. **键不存在异常**：直接通过索引访问不存在的键，会触发`KeyNotFoundException`，推荐使用`TryGetValue`

### 减少性能损耗的方法
**指定初始容量**

```csharp
// 预知数据量时指定初始容量，避免频繁扩容
Dictionary<int, string> dict = new Dictionary<int, string>(100);
```
**自定义键类型重写方法**
```csharp
public class Person
{
    public int Id { get; set; }
    // 重写相等性判断，保证字典键判断正确
    public override bool Equals(object obj) => obj is Person p && Id == p.Id;
    // 重写哈希码，提升哈希表性能
    public override int GetHashCode() => HashCode.Combine(Id);
}
```
**使用`TryGetValue`替代索引器访问**
```csharp
// 避免键不存在时抛异常，更安全高效
if(dict.TryGetValue(1, out var result))
{
    // 业务逻辑
}
```

## `HashSet<T>`、`Queue<T>`、`Stack<T>`

### 核心定义
- **`HashSet<T>`**：基于哈希表实现的**无序、无重复**泛型集合，专注用于高效去重和集合运算
- **`Queue<T>`**：遵循**先进先出（FIFO）** 原则的泛型队列集合
- **`Stack<T>`**：遵循**后进先出（LIFO）** 原则的泛型栈集合

### 继承结构
- `HashSet<T>`：实现`ICollection<T>`、`IEnumerable<T>`、`ISet<T>`
- `Queue<T>`：实现`IEnumerable<T>`、`ICollection`
- `Stack<T>`：实现`IEnumerable<T>`、`ICollection`

### 核心特性
#### `HashSet<T>` 特性
1. **元素唯一性**：自动去重，不允许存储重复元素，添加重复元素不会报错但会忽略
2. **无序性**：不记录元素添加顺序，遍历顺序不固定
3. **高效查找**：查找、添加、删除操作平均时间复杂度O(1)
4. **强类型安全**：编译时校验元素类型，仅存储指定`T`类型数据
5. **专属集合运算**：支持并集、交集、差集、子集判断等高级集合操作

#### `Queue<T>` 特性
1. **先进先出**：最先入队的元素最先出队
2. **有序访问**：仅允许在队尾添加元素，队头取出元素
3. **单向操作**：不支持通过索引随机访问中间元素
4. **动态扩容**：底层数组自动扩容，容量不足时翻倍

#### `Stack<T>` 特性
1. **后进先出**：最后入栈的元素最先出栈
2. **栈顶操作**：仅允许在栈顶添加、取出元素
3. **单向操作**：不支持通过索引随机访问中间元素
4. **动态扩容**：底层数组自动扩容，容量不足时翻倍

### 实现原理
#### `HashSet<T>`
1. 底层基于哈希表结构实现，通过哈希码存储和定位元素
2. 利用哈希值唯一性校验元素是否重复
3. 无容量限制，达到负载因子时自动扩容

#### `Queue<T>`
1. 底层使用**循环数组**实现，维护队头、队尾指针
2. 入队：元素添加到队尾，指针后移
3. 出队：从队头取出元素，指针后移
4. 循环结构避免数据移动，提升操作效率

#### `Stack<T>`
1. 底层使用数组实现，维护栈顶指针
2. 入栈：元素添加到栈顶，指针上移
3. 出栈：从栈顶取出元素，指针下移
4. 仅操作栈顶，数据存取效率极高

### 常用操作示例
#### `HashSet<T>` 示例
```csharp
HashSet<int> hashSet = new HashSet<int>();

// 添加元素（自动去重）
hashSet.Add(1);
hashSet.Add(2);
hashSet.Add(2); // 重复元素，添加失败
hashSet.Add(3);

// 判断元素是否存在
bool exists = hashSet.Contains(2);

// 集合运算
HashSet<int> otherSet = new HashSet<int> { 3, 4, 5 };
hashSet.UnionWith(otherSet); // 并集
hashSet.IntersectWith(otherSet); // 交集
hashSet.ExceptWith(otherSet); // 差集

// 遍历
foreach (int item in hashSet) { }
```

#### `Queue<T>` 示例
```csharp
Queue<int> queue = new Queue<int>();

// 入队（添加到队尾）
queue.Enqueue(10);
queue.Enqueue(20);
queue.Enqueue(30);

// 查看队头元素（不取出）
int peek = queue.Peek();

// 出队（从队头取出）
int dequeue = queue.Dequeue();

// 遍历
foreach (int item in queue) { }
```

#### `Stack<T>` 示例
```csharp
Stack<int> stack = new Stack<int>();

// 入栈（添加到栈顶）
stack.Push(10);
stack.Push(20);
stack.Push(30);

// 查看栈顶元素（不取出）
int peek = stack.Peek();

// 出栈（从栈顶取出）
int pop = stack.Pop();

// 遍历
foreach (int item in stack) { }
```

### 常用方法
#### `HashSet<T>` 常用方法
- `Add(T item)`：添加元素，重复则返回`false`
- `Remove(T item)`：移除指定元素
- `Contains(T item)`：判断是否包含元素
- `Clear()`：清空集合
- `UnionWith()`：合并两个集合并去重
- `IntersectWith()`：取两个集合交集
- `ExceptWith()`：取两个集合差集

#### `Queue<T>` 常用方法
- `Enqueue(T item)`：元素入队（队尾添加）
- `Dequeue()`：元素出队（队头移除并返回）
- `Peek()`：获取队头元素但不移除
- `Clear()`：清空队列
- `Contains(T item)`：判断是否包含元素

#### `Stack<T>` 常用方法
- `Push(T item)`：元素入栈（栈顶添加）
- `Pop()`：元素出栈（栈顶移除并返回）
- `Peek()`：获取栈顶元素但不移除
- `Clear()`：清空栈
- `Contains(T item)`：判断是否包含元素

### 注意事项
#### `HashSet<T>`
1. 不支持通过索引访问元素，无序存储
2. 自定义类型作为元素需重写`Equals()`和`GetHashCode()`
3. 无排序功能，需要有序去重可使用`SortedSet<T>`

#### `Queue<T>`
1. 严格遵循先进先出，不可随机访问中间元素
2. 队列为空时调用`Dequeue()`/`Peek()`会抛异常

#### `Stack<T>`
1. 严格遵循后进先出，不可随机访问中间元素
2. 栈为空时调用`Pop()`/`Peek()`会抛异常

#### 通用注意事项
1. 三者均为**线程不安全**集合，多线程需加锁或使用并发集合
2. 均为强类型泛型集合，编译时类型校验，代码简洁安全
3. 预知数据量时可指定初始容量，减少扩容提升性能

## 有序集合：`SortedList`、`SortedDictionary`
### 核心定义
- **有序泛型集合**：根据键自动维持排序状态的键值对集合，兼具字典查找与排序功能
- **`SortedList<TKey, TValue>`**：基于排序数组实现的有序键值对集合，内存占用小，遍历速度快
- **`SortedDictionary<TKey, TValue>`**：基于二叉搜索树（红黑树）实现的有序键值对集合，增删效率高

### 继承结构
- `SortedList<TKey, TValue>`：实现`IDictionary<TKey, TValue>`、`ICollection<KeyValuePair<TKey, TValue>>`、`IEnumerable<T>`
- `SortedDictionary<TKey, TValue>`：实现`IDictionary<TKey, TValue>`、`ICollection<KeyValuePair<TKey, TValue>>`、`IEnumerable<T>`

### 核心特性
#### 共同特性
1. **自动排序**：根据`TKey`键自动升序排序，可自定义比较器指定排序规则
2. **键唯一**：键不可重复，重复添加会抛出`ArgumentException`
3. **强类型安全**：编译时校验键值类型，支持泛型操作
4. **键访问**：通过键快速查找、访问对应值
5. **可空规则**：键不能为`null`，值可以为`null`

#### `SortedList<TKey, TValue>` 特性
1. 底层使用**两个数组**分别存储键和值
2. 内存占用小，**遍历效率极高**
3. 按索引访问速度快
4. 插入、删除元素效率低，需移动数组元素

#### `SortedDictionary<TKey, TValue>` 特性
1. 底层使用**红黑树**数据结构存储
2. 插入、删除元素效率稳定且高效
3. 不支持按索引访问，仅支持按键访问
4. 内存占用略高于`SortedList`

### 实现原理
#### `SortedList<TKey, TValue>`
1. 维护两个并行数组，分别存储排序后的键与对应值
2. 添加元素时通过二分查找定位插入位置，保持数组有序
3. 查找元素使用二分查找，时间复杂度O(log n)
4. 插入/删除需移动后续元素，时间复杂度O(n)

#### `SortedDictionary<TKey, TValue>`
1. 基于平衡二叉搜索树（红黑树）实现
2. 节点存储键值对，树结构始终保持平衡有序
3. 查找、插入、删除操作均通过树节点遍历完成
4. 核心操作时间复杂度稳定为O(log n)

### 常用操作示例
**`SortedList<TKey, TValue>` 示例**

```csharp
SortedList<int, string> sortedList = new SortedList<int, string>();

// 添加元素（自动按键排序）
sortedList.Add(3, "C");
sortedList.Add(1, "A");
sortedList.Add(2, "B");

// 通过键访问
string value = sortedList[1];

// 通过索引访问（SortedList独有）
string indexValue = sortedList.Values[0];

// 遍历（有序输出）
foreach (var kvp in sortedList)
{
    Console.WriteLine($"{kvp.Key}:{kvp.Value}");
}
```

**`SortedDictionary<TKey, TValue>` 示例**

```csharp
SortedDictionary<int, string> sortedDict = new SortedDictionary<int, string>();

// 添加元素（自动按键排序）
sortedDict.Add(3, "C");
sortedDict.Add(1, "A");
sortedDict.Add(2, "B");

// 通过键访问
string value = sortedDict[1];

// 遍历（有序输出）
foreach (var kvp in sortedDict)
{
    Console.WriteLine($"{kvp.Key}:{kvp.Value}");
}
```

### 常用方法
#### 通用方法
- `Add(TKey key, TValue value)`：添加有序键值对
- `Remove(TKey key)`：根据键移除元素
- `ContainsKey(TKey key)`：判断是否包含指定键
- `TryGetValue(TKey key, out TValue value)`：安全获取值
- `Clear()`：清空集合
- `Keys`：获取所有键的集合
- `Values`：获取所有值的集合

#### `SortedList` 独有方法
- `IndexOfKey(TKey key)`：获取指定键的索引
- `RemoveAt(int index)`：根据索引移除元素

### 性能对比
| 操作 | SortedList | SortedDictionary |
|------|------------|------------------|
| 查找 | O(log n)，二分查找 | O(log n)，树查找 |
| 插入 | O(n)，需移动数组元素 | O(log n)，树节点调整 |
| 删除 | O(n)，需移动数组元素 | O(log n)，树节点调整 |
| 遍历 | 最快，内存连续性好 | 较快，节点分散访问 |
| 内存占用 | 低 | 较高 |
| 索引访问 | 支持 | 不支持 |

### 注意事项
1. **排序规则**：默认按键升序排序，可通过`IComparer<TKey>`自定义排序
2. **键类型要求**：键必须可比较，自定义类型需实现`IComparable<T>`或自定义比较器
3. **线程安全**：两者均为线程不安全，多线程环境需加锁
4. **数据量适配**：数据量大且频繁增删时优先使用`SortedDictionary`
5. **索引限制**：`SortedDictionary`不支持索引访问，仅能通过键操作

### 使用场景
**`SortedList<TKey, TValue>`**

1. 数据量较小、**读取和遍历操作频繁**，增删较少的场景
2. 需要**按键排序 + 按索引访问**的场景
3. 内存资源紧张，追求低内存占用的场景
4. 数据提前已知，一次性加载的有序列表场景

**`SortedDictionary<TKey, TValue>`**

1. 数据量较大、**频繁插入/删除**元素的动态场景
2. 仅需按键排序和按键查找，无需索引访问的场景
3. 动态维护有序数据，增删操作均衡的场景
4. 需要稳定高效排序操作的业务逻辑

## `foreach` 遍历与迭代器

### 核心定义
- **`foreach`**：用于遍历集合、数组等可枚举类型的语法糖，简化遍历代码，无需手动管理索引或指针
- **迭代器（Enumerator）**：实现遍历集合元素的专用对象，封装了遍历的核心逻辑，负责按顺序返回元素
- **可枚举类型（Enumerable）**：实现了 `IEnumerable` / `IEnumerable<T>` 接口，能够获取迭代器进行遍历的类型（所有标准集合均为可枚举类型）

### 核心接口
#### 非泛型接口
- `IEnumerable`：定义 `GetEnumerator()` 方法，返回迭代器对象
- `IEnumerator`：迭代器基础接口，包含 `Current` 属性、`MoveNext()` 方法、`Reset()` 方法

#### 泛型接口
- `IEnumerable<T>`：继承 `IEnumerable`，强类型版本，返回泛型迭代器
- `IEnumerator<T>`：继承 `IEnumerator`，强类型迭代器，避免类型转换

### 核心成员
- `Current`：获取当前指向的集合元素（只读）
- `MoveNext()`：将迭代器指针移动到下一个元素，返回 `bool`（`true` 表示有元素，`false` 表示遍历结束）
- `Reset()`：将迭代器指针重置到初始位置（非必须实现）

### 执行原理
1. 编译器编译 `foreach` 时，自动转换为迭代器调用逻辑
2. 调用集合的 `GetEnumerator()` 方法获取迭代器对象
3. 循环调用 `MoveNext()` 方法移动指针
4. 若 `MoveNext()` 返回 `true`，通过 `Current` 获取当前元素并执行循环体
5. 遍历结束或中途退出，自动释放迭代器资源

```csharp
List<int> list = new List<int> { 1, 2, 3 };
Dictionary<int, string> dict = new Dictionary<int, string> { { 1, "A" }, { 2, "B" } };

// 遍历 List
foreach (int item in list)
{
    Console.WriteLine(item);
}

// 遍历 Dictionary
foreach (KeyValuePair<int, string> kvp in dict)
{
    Console.WriteLine(kvp.Key + ":" + kvp.Value);
}
```

### 编译后底层逻辑
```csharp
// foreach 编译后的等效代码
IEnumerator<int> enumerator = list.GetEnumerator();
try
{
    while (enumerator.MoveNext())
    {
        int item = enumerator.Current;
        Console.WriteLine(item);
    }
}
finally
{
    enumerator.Dispose();
}
```

### 自定义迭代器（`yield return`）
- `yield return`：简化迭代器实现，无需手动创建迭代器类，编译器自动生成迭代器逻辑
- `yield break`：终止迭代器遍历

```csharp
// 自定义可遍历类型，返回自定义序列
public static IEnumerable<int> GetNumbers()
{
    yield return 1;
    yield return 2;
    yield return 3;
    // 遍历终止
    // yield break;
}

// 使用 foreach 遍历自定义迭代器
foreach (int num in GetNumbers())
{
    Console.WriteLine(num);
}
```

### 与 `for` 循环对比
1. **简洁性**：`foreach` 无需管理索引，代码更简洁，`for` 需要手动定义索引、判断边界
2. **适用范围**：`foreach` 适用于所有可枚举集合；`for` 仅适用于支持索引访问的集合（数组、`List<T>`）
3. **修改限制**：`foreach` 遍历过程中**禁止修改集合**（添加、删除、清空元素），否则抛 `InvalidOperationException`
4. **效率**：数组、`List<T>` 中 `for` 效率略高；其他集合两者效率基本一致

### 特性
1. **只读遍历**：遍历过程中只能读取元素，无法直接修改元素值
2. **自动释放**：遍历结束自动释放迭代器，无需手动管理资源
3. **延迟执行**：自定义迭代器使用 `yield return` 时，采用延迟执行（调用 `MoveNext()` 才生成元素）
4. **通用性**：支持所有标准集合、数组、自定义可枚举类型
5. **线程安全**：遍历过程中集合被修改会触发异常，保证遍历数据一致性

### 注意事项
1. **集合修改异常**：`foreach` 遍历期间，禁止调用 `Add`、`Remove`、`Clear` 等修改集合的方法
2. **元素修改**：值类型元素无法直接修改；引用类型元素可修改内部属性，不能替换对象本身
3. **空集合处理**：遍历 `null` 对象会抛 `NullReferenceException`，遍历前需判空
4. **迭代器复用**：迭代器遍历完成后无法重复使用，需要重新获取
5. **泛型优先**：优先使用泛型迭代器，避免非泛型迭代器的类型转换

## 线程安全集合
### 核心定义
- **线程安全集合**：.NET Framework 4.0 引入的`System.Collections.Concurrent`命名空间下的泛型集合，原生支持多线程并发读写，无需手动加锁
- **`ConcurrentCollection`**：线程安全集合的统称，核心包括`ConcurrentQueue<T>`、`ConcurrentStack<T>`、`ConcurrentDictionary<TKey, TValue>`、`ConcurrentBag<T>`、`BlockingCollection<T>`

### 继承结构
- 全部实现`IProducerConsumerCollection<T>`（生产消费集合接口）、`IEnumerable<T>`、`ICollection`
- `ConcurrentDictionary<TKey, TValue>`独立实现`IDictionary<TKey, TValue>`

### 核心特性
1. **原生线程安全**：内部采用细粒度锁、无锁（CAS）、分区等机制，保证多线程并发安全
2. **无手动锁**：开发中无需编写`lock`语句，避免死锁、竞争问题
3. **原子操作**：添加、删除、获取等核心操作均为原子性，不会出现数据错乱
4. **并发性能**：相比普通集合+锁，并发性能大幅提升，适合高并发场景
5. **强类型安全**：泛型实现，编译时类型校验

### 常用线程安全集合
#### `ConcurrentQueue<T>` 线程安全队列
1. 遵循**先进先出（FIFO）**原则
2. 无锁机制实现，高并发入队、出队性能优异
3. 无阻塞，多线程生产消费模型首选

#### `ConcurrentStack<T>` 线程安全栈
1. 遵循**后进先出（LIFO）**原则
2. 无锁机制实现，线程安全的栈操作
3. 适合并发场景下的后进先出数据处理

#### `ConcurrentDictionary<TKey, TValue>` 线程安全字典
1. 线程安全的键值对集合，`Dictionary<TKey,TValue>`并发替代方案
2. 细粒度锁+分区设计，读写分离，并发性能极高
3. 支持原子性添加、更新、获取操作

#### `ConcurrentBag<T>` 线程安全无序包
1. 无序存储，不保证元素顺序
2. 无锁设计，针对**同一线程多入多岀**场景极致优化
3. 适合不需要顺序，仅需并发存储的场景

#### `BlockingCollection<T>` 阻塞集合
1. 实现**生产-消费**模式的核心集合，支持阻塞等待
2. 生产者为空时，消费者自动阻塞；消费者满时，生产者自动阻塞
3. 可绑定其他线程安全集合作为底层存储

### 实现原理

1. **无锁编程（CAS）**：使用`Interlocked`类实现比较并交换，避免锁开销
2. **细粒度锁**：仅锁定操作的局部数据，不锁定整个集合，提升并发度
3. **分区设计**：`ConcurrentDictionary`将数据分区，仅锁定操作分区
4. **线程本地存储**：`ConcurrentBag`使用线程本地队列，减少线程竞争
5. **自旋等待**：短时间等待避免线程切换开销，提升性能

### 常用操作示例
**`ConcurrentQueue<T>` 示例**

```csharp
ConcurrentQueue<int> queue = new ConcurrentQueue<int>();

// 入队（线程安全）
queue.Enqueue(1);
queue.Enqueue(2);

// 尝试出队（无异常，返回bool）
if (queue.TryDequeue(out int result))
{
    Console.WriteLine(result);
}

// 查看队头元素
queue.TryPeek(out int peek);
```

**`ConcurrentDictionary<TKey, TValue>` 示例**

```csharp
ConcurrentDictionary<int, string> dict = new ConcurrentDictionary<int, string>();

// 添加元素（线程安全）
dict.TryAdd(1, "张三");
dict.TryAdd(2, "李四");

// 获取或添加（原子操作）
dict.GetOrAdd(3, "王五");

// 尝试获取值
if (dict.TryGetValue(1, out string value))
{
    Console.WriteLine(value);
}

// 原子更新
dict.TryUpdate(1, "新值", "张三");
```

**`BlockingCollection<T>` 生产消费示例**

```csharp
BlockingCollection<int> blockingCollection = new BlockingCollection<int>();

// 生产者线程
Task.Run(() =>
{
    for (int i = 0; i < 5; i++)
    {
        blockingCollection.Add(i);
        Task.Delay(100).Wait();
    }
    blockingCollection.CompleteAdding();
});

// 消费者线程
Task.Run(() =>
{
    // 集合为空时自动阻塞
    foreach (var item in blockingCollection.GetConsumingEnumerable())
    {
        Console.WriteLine(item);
    }
});
```

### 核心方法

#### 通用方法
- `TryAdd(T item)`：尝试添加元素，返回是否成功
- `TryTake(out T item)`：尝试取出元素，无元素返回false
- `Count`：获取元素数量（并发下为瞬时值）
- `IsEmpty`：判断是否为空（瞬时状态）

#### `ConcurrentDictionary` 独有方法
- `TryAdd(TKey key, TValue value)`：尝试添加键值对
- `TryGetValue(TKey key, out TValue value)`：尝试获取值
- `TryUpdate(TKey key, TValue newValue, TValue comparisonValue)`：原子更新
- `GetOrAdd(TKey key, TValue value)`：存在则获取，不存在则添加

#### `BlockingCollection` 独有方法
- `Add(T item)`：添加元素，满时阻塞
- `Take()`：取出元素，空时阻塞
- `CompleteAdding()`：标记添加完成，停止生产
- `GetConsumingEnumerable()`：可消费枚举，自动阻塞

### 性能特点
1. **高并发优势**：多线程并发场景下，性能远优于普通集合+`lock`
2. **单线程损耗**：单线程下略慢于普通集合，内部安全机制产生少量开销
3. **无锁优先**：`ConcurrentQueue/Stack/Bag`无锁设计，并发性能最优
4. **分区并发**：`ConcurrentDictionary`分区锁，读写并发性能均衡
5. **阻塞控制**：`BlockingCollection`简化生产消费模型，降低开发难度

### 注意事项
1. **瞬时状态**：`Count`、`IsEmpty`为瞬时值，并发下可能实时变化
2. **不可修改**：枚举期间集合可修改，不触发异常（与普通集合不同）
3. **null值**：支持存储null值，需自行判断处理
4. **不可重置**：无法重置枚举器，仅支持向前遍历
5. **单线程选择**：单线程场景优先使用普通集合，避免不必要的性能开销

### 使用场景
- **`ConcurrentQueue<T>`**

  - 多线程**任务队列、消息队列**等先进先出高并发场景

  - 无阻塞生产消费模型


- **`ConcurrentDictionary<TKey, TValue>`**

  - 多线程**缓存、配置、共享字典**等键值对存储场景

  - 高频并发读写的键值数据


- **`ConcurrentBag<T>`**

  - 无需顺序的**并发数据收集、临时对象池**场景

  - 同一线程频繁添加、取出的操作


- **`BlockingCollection<T>`**

  - 标准**生产-消费模式**、任务调度、数据流处理场景

  - 需要线程等待、限流的业务逻辑
