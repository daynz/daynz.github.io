# Lambda基础

Lambda 表达式是 C++11 引入的一种便捷语法，用于创建一个**临时的、匿名的函数对象**。

它允许你在需要函数的地方就地（in-place）定义一个简单的函数，无需预先声明一个独立的函数或类。

**本质**：Lambda 在编译时会被转换成一个未命名的函数对象类。

**主要用途**：

- 配合 STL 算法（如 `std::sort`, `std::find_if`, `std::for_each`）使用。
- 作为回调函数（Callback）。
- 简化代码，提高可读性。

## 基本语法

```cpp
[capture-list] (parameters) -> return-type { function-body; }
```

- **`[capture-list]` (捕获列表)**：定义 Lambda 如何访问其定义位置的外部作用域中的变量。这是 Lambda 的核心特性。
- **`(parameters)` (参数列表)**：与普通函数相同，可以为空 `()`。
- **`-> return-type` (返回类型)**：可选。如果函数体只有一个 `return` 语句，编译器可以自动推导；若函数体为空，则返回 `void`。
- **`{ function-body }` (函数体)**：具体的实现代码。

## 捕获列表详解

捕获列表决定了外部变量如何被引入到 Lambda 内部。

|     捕获方式     |    语法     | 描述                                                | 示例                      | 解释                       |
| :--------------: | :---------: | :-------------------------------------------------- | :------------------------ | :------------------------- |
|    **值捕获**    |   `[var]`   | 按值拷贝 `var` 到 Lambda 内部。内部修改不影响外部。 | `[x]() { return x; }`     | 捕获 `x` 的值。            |
|   **引用捕获**   |  `[&var]`   | 按引用捕获 `var`。内部修改直接影响外部。            | `[&x]() { x++; }`         | 捕获 `x` 的引用。          |
|  **隐式值捕获**  |    `[=]`    | 捕获函数体内使用的所有外部变量，均为**值拷贝**。    | `[=]() { return a + b; }` | 捕获所有用到的变量。       |
| **隐式引用捕获** |    `[&]`    | 捕获函数体内使用的所有外部变量，均为**引用**。      | `[&]() { a++; b++; }`     | 捕获所有用到的变量。       |
|   **混合捕获**   | `[&, var]`  | 默认按引用，但 `var` 按值捕获。                     | `[&, x]() { x++; y++; }`  | `y` 是引用，`x` 是值拷贝。 |
|                  | `[=, &var]` | 默认按值，但 `var` 按引用捕获。                     | `[=, &y]() { x++; y++; }` | `x` 是值拷贝，`y` 是引用。 |

## 使用

### 无参数、无返回值

```cpp
//匿名Lambda：定义后立即调用（末尾的()是调用符）
[]() { std::cout << "1.1 Hello from Lambda!" << std::endl; }();

//命名Lambda：先定义，后调用（用auto推导类型）
auto simple_lambda = []() { std::cout << "1.2 Hello again!" << std::endl; };
simple_lambda();
```

### 有返回值，自动推导

```cpp
auto add = [](int a, int b) { return a + b; };
int sum1 = add(5, 3); // 调用Lambda 输出: Sum is: 8
```

### 捕获外部变量（值捕获）

```cpp
std::vector<int> numbers1 = { 1, 5, 3, 9, 2, 7, 4 };
int threshold = 4;
// 用accumulate累加：仅累加大于threshold的元素
// Lambda值捕获threshold（拷贝一份，不影响外部变量）
int sum2 = std::accumulate(numbers1.begin(), numbers1.end(), 0, //0为初始值
    [threshold](int current_sum, int num) {
        return num > threshold ? current_sum + num : current_sum;
    });
std::cout << "Sum of numbers greater than " << threshold << " is: " << sum2 << std::endl;
```

### 参数引用 + 值捕获

```cpp
std::vector<int> numbers2 = { 1, 2, 3, 4, 5 };
int multiplier = 10;
// Lambda值捕获multiplier，参数n是引用（可修改原数组）
std::for_each(numbers2.begin(), numbers2.end(),
    [multiplier](int& n) { // n是numbers2元素的引用，修改n即修改原数组
        n *= multiplier;
    });
```

### 多变量值捕获

```cpp
std::vector<Player> players = {
    {"Alice", 10, 1500},
    {"Bob", 5, 800},
    {"Charlie", 15, 2200},
    {"David", 12, 1800}
};
int min_level = 10;
int min_score = 1600;

// 用find_if筛选：Lambda值捕获min_level/min_score，判断玩家是否满足双条件
auto it = std::find_if(players.begin(), players.end(),
    [min_level, min_score](const Player& p) {
        return p.level >= min_level && p.score >= min_score;
    });

if (it != players.end()) {
    std::cout << "5.1 Found high-level, high-score player: "
        << it->name << " (Level: " << it->level << ", Score: " << it->score << ")" << std::endl;
    // 输出: Found high-level, high-score player: David (Level: 12, Score: 1800)
}
```

### Lambda工厂函数（返回Lambda）

```cpp
// 6.1 调用工厂函数：生成乘2、乘3的Lambda
auto double_it = make_multiplier(2);
auto triple_it = make_multiplier(3);

// 6.2 调用工厂返回的Lambda
std::cout << "6.1 Double 5: " << double_it(5) << std::endl; // 输出: Double 5: 10
std::cout << "6.2 Triple 4: " << triple_it(4) << std::endl; // 输出: Triple 4: 12

// 6.3 结合transform算法：用Lambda修改数组
std::vector<int> nums = { 1, 2, 3 };
std::cout << "6.3 Original: ";
for (int n : nums) std::cout << n << " "; std::cout << std::endl;

std::transform(nums.begin(), nums.end(), nums.begin(), double_it);

std::cout << "6.4 Doubled:  ";
for (int n : nums) std::cout << n << " "; std::cout << std::endl;
// 输出: Doubled:  2 4 6
```

### Lambda回调（引用捕获 + 多回调注册）

```cpp
// 7.1 准备游戏对象和碰撞管理器
GameObject player("Player");
GameObject enemy("Enemy");
CollisionManager manager;

// 7.2 注册回调1：碰撞时扣血（无捕获，直接修改对象引用）
manager.register_callback([](GameObject& obj1, GameObject& obj2) {
    obj1.health -= 10;
    obj2.health -= 10;
    std::cout << "7.1 " << obj1.name << " and " << obj2.name << " took damage!" << std::endl;
    });

// 7.3 注册回调2：碰撞时打印日志（引用捕获log_count，统计日志次数）
int log_count = 0; // 外部变量：日志计数
manager.register_callback([&log_count](GameObject& obj1, GameObject& obj2) {
    log_count++;
    std::cout << "7.2 [LOG " << log_count << "] Collision between " << obj1.name << " and " << obj2.name << std::endl;
    });

// 7.4 触发碰撞：执行所有注册的Lambda回调
manager.trigger_collision(player, enemy);

// 7.5 输出最终状态
std::cout << "\n7.3 Final Stats:" << std::endl;
std::cout << player.name << " HP: " << player.health << std::endl; // HP: 90
std::cout << enemy.name << " HP: " << enemy.health << std::endl;   // HP: 90
```

#### 依赖

```cpp
// 1. 定义Player结构体（Lambda筛选场景使用）
struct Player {
    std::string name;   // 玩家名称
    int level;          // 玩家等级
    int score;          // 玩家分数
};

// 2. 定义GameObject结构体（Lambda回调场景使用）
struct GameObject {
    std::string name;   // 游戏对象名称
    int health = 100;   // 生命值，默认100
    // 构造函数：初始化游戏对象名称
    GameObject(const std::string& n) : name(n) {}
};

// 3. 定义CollisionManager类（Lambda回调注册/触发场景使用）
class CollisionManager {
public:
    // 定义回调函数类型：接收两个GameObject引用，无返回值
    using Callback = std::function<void(GameObject& obj1, GameObject& obj2)>;
    // 存储所有注册的回调函数
    std::vector<Callback> callbacks;

    // 注册回调函数：将Lambda（或其他可调用对象）加入回调列表
    void register_callback(Callback cb) {
        callbacks.push_back(cb);
    }

    // 触发碰撞：执行所有注册的回调函数
    void trigger_collision(GameObject& a, GameObject& b) {
        std::cout << a.name << " collided with " << b.name << "!" << std::endl;
        for (auto& cb : callbacks) {
            cb(a, b); // 执行每个Lambda回调
        }
    }
};

// 4. 定义返回Lambda的工厂函数（C++14及以上支持auto返回值）
auto make_multiplier(int factor) {
    // 捕获factor的值，返回一个专用的乘法器Lambda
    return [factor](int value) { return value * factor; };
}
```

# Lambda进阶

## 泛型Lambda

C++14 对 Lambda 表达式的核心增强是**泛型 Lambda**（也叫 “多态 Lambda”），允许 Lambda 的参数使用自动类型推导（`auto`关键字），无需显式指定参数类型。这让 Lambda 具备了模板函数的 “泛型” 能力，能处理任意类型的参数，大幅提升了 Lambda 的灵活性和复用性。

泛型Lambda的核心价值：**用`auto`推导参数类型，让单个Lambda处理任意类型的参数**，等价于“匿名的模板函数”，彻底解决C++11 Lambda类型固定的问题。

### 背景

C++11的Lambda必须显式指定参数类型，导致Lambda只能处理固定类型的参数，复用性差：

```cpp
// C++11 Lambda：仅能处理int类型
auto add_int = [](int a, int b) { return a + b; };
cout << add_int(1, 2) << endl; // 正常输出3

// 尝试处理double类型：编译报错（参数类型不匹配）
// cout << add_int(1.5, 2.5) << endl;

// 需重新定义处理double的Lambda，代码冗余
auto add_double = [](double a, double b) { return a + b; };
cout << add_double(1.5, 2.5) << endl; // 输出4.0
```

### 核心语法

泛型Lambda的核心是将参数类型替换为`auto`，编译器会根据调用时的实参自动推导参数类型：

```cpp
// C++14 泛型Lambda：参数用auto，支持任意类型
auto generic_add = [](auto a, auto b) { return a + b; };
```

编译器会将这个Lambda隐式转换为一个模板函数，等价于：

```cpp
template <typename T, typename U>
auto generic_add(T a, U b) { return a + b; }
```

**通用加法Lambda**

```cpp
// 泛型Lambda：支持任意可相加的类型
auto add = [](auto a, auto b) { return a + b; };
// 处理int
cout << add(1, 2) << endl; // 3
// 处理double
cout << add(1.5, 2.5) << endl; // 4.0
// 处理string
cout << add(string("hello "), string("world")) << endl; // hello world
// 处理不同类型（int + double）
cout << add(3, 4.5) << endl; // 7.5
```

**关键**：只要参数类型支持`+`运算符，泛型Lambda就能处理，无需修改Lambda本身。

#### 混合固定类型与泛型参数

泛型Lambda支持部分参数用`auto`，部分参数显式指定类型：

```cpp
// 第一个参数固定为int，第二个参数泛型
auto print_int_and_any = [](int num, auto val) {
    cout << "整数：" << num << "，任意类型值：" << val << endl;
};
print_int_and_any(10, 3.14); // 整数：10，任意类型值：3.14
print_int_and_any(20, "hello"); // 整数：20，任意类型值：hello
```

#### 返回值类型推导（C++14 Lambda默认支持）

C++11 Lambda的返回值类型需显式指定（或通过`-> decltype(...)`推导），C++14泛型Lambda默认支持返回值自动推导：

```cpp
// C++11需显式指定返回值：[](int a, int b) -> int { return a + b; }
// C++14泛型Lambda自动推导返回值
auto func = [](auto a, auto b) {
    if (a > b) return a; // 返回a的类型
    else return b;       // 返回b的类型（需与a的类型兼容）
};
cout << func(10, 20) << endl; // 20（int）
cout << func(3.14, 2.71) << endl; // 3.14（double）
```

### 核心使用场景

**通用算法/工具函数**

用泛型Lambda实现通用的工具逻辑，替代多个类型特定的Lambda：

```cpp
// 泛型Lambda：打印任意类型的容器元素
auto print_container = [](const auto& container) {
    for (const auto& elem : container) {
        cout << elem << " ";
    }
    cout << endl;
};
// 处理vector<int>
vector<int> vec_int = {1, 2, 3, 4};
print_container(vec_int); // 1 2 3 4
// 处理vector<string>
vector<string> vec_str = {"a", "b", "c"};
print_container(vec_str); // a b c
// 处理数组
int arr[] = {10, 20, 30};
print_container(arr); // 10 20 30
```

**STL算法中的泛型谓词**

STL算法（如`sort`/`find_if`）结合泛型Lambda，实现通用的比较/判断逻辑：

```cpp
// 泛型Lambda：比较两个元素的大小（支持任意可比较类型）
auto compare_greater = [](auto a, auto b) {
    return a > b;
};
// 排序int数组
vector<int> vec_int = {3, 1, 4, 2};
sort(vec_int.begin(), vec_int.end(), compare_greater);
print_container(vec_int); // 4 3 2 1
// 排序string数组
vector<string> vec_str = {"banana", "apple", "cherry"};
sort(vec_str.begin(), vec_str.end(), compare_greater);
print_container(vec_str); // cherry banana apple
```

**泛型Lambda与模板函数结合**

泛型Lambda可作为模板函数的参数，实现更高层次的泛型编程：

```cpp
// 模板函数：接收泛型Lambda，处理任意类型的两个值
template <typename Func, typename T, typename U>
auto apply_func(Func f, T a, U b) {
    return f(a, b);
}
// 泛型Lambda：乘法
auto multiply = [](auto a, auto b) { return a * b; };
// 处理int*int
cout << apply_func(multiply, 5, 6) << endl; // 30
// 处理double*int
cout << apply_func(multiply, 2.5, 4) << endl; // 10.0
// 处理string*int（重复字符串）
cout << apply_func(multiply, string("hi"), 3) << endl; // hihihi
```

**泛型Lambda捕获`this`（类内使用）**

在类成员函数中，泛型Lambda可捕获`this`，处理类的任意类型成员：

```cpp
class MyClass {
public:
    int num = 10; string str = "hello";
    void process() {
        // 泛型Lambda：捕获this，访问类成员，处理任意类型
        auto print_member = [this](auto member_name) {
            if constexpr (is_same_v<decltype(member_name), string>) {
                cout << "字符串成员：" << this->str << endl;
            } else {
                cout << "整数成员：" << this->num << endl;
            }
        };
        print_member("num"); // 整数成员：10
        print_member(string("str")); // 字符串成员：hello
    }
};
```

**注意**：`if constexpr`是C++17特性，用于在编译期判断类型，配合泛型Lambda实现类型分支逻辑。

### 核心规则与注意事项

**泛型Lambda的本质**

编译器会将泛型Lambda转换为**带有模板调用运算符的匿名类**，例如：

```cpp
// 泛型Lambda
auto add = [](auto a, auto b) { return a + b; };
// 编译器等价转换为：
struct AnonymousLambda {
    template <typename T, typename U>
    auto operator()(T a, U b) const {
        return a + b;
    }
};
AnonymousLambda add;
```

因此，泛型Lambda的调用本质是模板实例化，遵循模板的类型推导规则。

**类型兼容性要求**

泛型Lambda的逻辑需适用于所有可能的参数类型，否则会编译报错：

```cpp
auto wrong_func = [](auto a, auto b) {
    return a / b; // 若b为0或类型不支持/，则调用时报错
};
// 正确调用
cout << wrong_func(10, 2) << endl; // 5
// 错误调用：编译报错（string不支持/）
cout << wrong_func(string("a"), string("b")) << endl;
```

## Lambda初始化捕获

C++14 对 Lambda 表达式的另一核心增强是**初始化捕获**（也叫 “广义捕获” Generalized Capture），允许在 Lambda 捕获列表中直接定义并初始化新变量，或移动（而非拷贝）对象到 Lambda 中。这解决了 C++11 Lambda 捕获的两大痛点：无法捕获未命名变量、无法移动捕获对象，大幅扩展了 Lambda 的捕获能力和灵活性。

初始化捕获的核心价值：**在捕获列表中直接初始化变量**，支持移动语义，可重命名捕获变量，彻底解决 C++11 捕获的局限性。

### 背景

C++11 的 Lambda 捕获规则非常受限：

1. 只能捕获**当前作用域中已命名的变量**，无法直接定义新变量或捕获临时对象；
2. 仅支持拷贝捕获（`[var]`）或引用捕获（`[&var]`），无法移动（`std::move`）捕获对象（如`std::unique_ptr`这类不可拷贝的对象）；
3. 无法为捕获的变量重命名。

```c++
// C++11 痛点1：无法捕获临时对象/未命名变量
// 错误：临时值100无名称，无法直接捕获
auto func = [100]() { return 100; };
// C++11 痛点2：无法移动捕获不可拷贝对象
unique_ptr<int> ptr = make_unique<int>(42);
// 错误：unique_ptr不可拷贝，无法捕获
auto func2 = [ptr]() { cout << *ptr << endl; };
// C++11 痛点3：无法重命名捕获变量
int x = 5;
// 只能捕获x，无法命名为其他名称
auto func3 = [x]() { return x; };
```

### 核心语法

初始化捕获的核心是在捕获列表中使用 `变量名 = 初始化表达式` 的形式，定义并初始化 Lambda 的捕获变量

```c++
// 基础语法：[捕获变量名 = 初始化表达式](参数) { 逻辑 }
auto lambda = [x = 100]() { return x; }; // 定义x并初始化为100
```

编译器会将这个捕获变量作为 Lambda 匿名类的成员变量，等价于：

```c++
struct AnonymousLambda {
    int x; // 捕获变量作为成员
    AnonymousLambda() : x(100) {} // 初始化
    auto operator()() const { return x; }
};
AnonymousLambda lambda;
```

**捕获临时变量 / 重命名变量**

```c++
// 示例1：捕获临时变量（C++11不支持，C++14初始化捕获支持）
auto add_100 = [x = 100](int a) { return a + x; };
cout << add_100(50) << endl; // 150
// 示例2：重命名捕获现有变量
int num = 200;
// 将num拷贝到捕获变量y中（重命名）
auto add_y = [y = num](int a) { return a + y; };
cout << add_y(50) << endl; // 250
// 示例3：捕获表达式结果
auto calc = [sum = 10 + 20](int a) { return sum * a; };
cout << calc(3) << endl; // 90
```

**关键**：初始化捕获的变量作用域仅限于 Lambda 内部，是 Lambda 匿名类的成员，与外部变量互不干扰（除非显式引用）。

#### 移动捕获（Move Capture）

初始化捕获结合`std::move`，可捕获不可拷贝但可移动的对象（如`std::unique_ptr`、`std::string`、`std::vector`等），解决 C++11 无法捕获这类对象的问题

```c++
// 示例1：移动捕获unique_ptr（不可拷贝）
unique_ptr<int> ptr = make_unique<int>(42);
// 将ptr移动到捕获变量p中，外部ptr变为空
auto func = [p = move(ptr)]() {
    cout << "移动捕获的值：" << *p << endl; // 42
};
func();
// 验证外部ptr已空
if (!ptr) cout << "外部ptr已为空" << endl;
// 示例2：移动捕获vector
vector<int> vec = {1, 2, 3, 4};
auto process_vec = [v = move(vec)]() {
    for (int i : v) cout << i << " "; // 1 2 3 4
};
process_vec();
// 外部vec已空
cout << "\n外部vec大小：" << vec.size() << endl; // 0
```

**注意**：移动捕获后，原对象会处于 “有效但未指定” 的状态，不可再使用（除非重新赋值）。

#### 引用捕获结合初始化

初始化捕获也支持引用语义，通过`&`声明捕获变量为引用

```c++
int base = 100;
// 捕获base的引用到变量ref中
auto add_ref = [&ref = base](int a) {
    ref += a; // 修改的是外部base的值
    return ref;
};
cout << add_ref(50) << endl; // 150
cout << base << endl; // 150（外部变量已被修改）
```

#### 初始化捕获与泛型 Lambda 结合

C++14 的初始化捕获可与泛型 Lambda（auto 参数）结合

```c++
// 初始化捕获：默认前缀 + 泛型参数
auto print_with_prefix = [prefix = "结果："](auto val) {
    cout << prefix << val << endl;
};
print_with_prefix(123); // 结果：123
print_with_prefix(3.14); // 结果：3.14
print_with_prefix(string("hello")); // 结果：hello

// 移动捕获 + 泛型
string msg = "hello world";
auto process_msg = [m = move(msg)](auto suffix) {
    return m + suffix;
};
cout << process_msg("!") << endl; // hello world!
```

### 核心使用场景

**捕获不可拷贝的对象**

最常用场景：捕获`std::unique_ptr`、`std::future`等不可拷贝但可移动的对象：

```c++
// 创建不可拷贝的unique_ptr
auto data = make_unique<int>(1000);
// 移动捕获到线程Lambda中
thread t([d = move(data)]() {
    std::this_thread::sleep_for(std::chrono::seconds(1));
    cout << "线程中访问：" << *d << endl; // 1000
});
t.join();
```

**捕获临时表达式 / 计算结果**

无需提前定义变量，直接捕获表达式结果

```c++
// 捕获计算结果（圆的面积公式）
auto calc_area = [pi = 3.14159](double r) {
    return pi * r * r;
};
cout << "半径为2的圆面积：" << calc_area(2) << endl; // 12.56636
// 捕获临时表达式
auto complex_calc = [base = pow(2, 10)](int a) {
    return base + a; // 1024 + a
};
cout << complex_calc(10) << endl; // 1034
```

**Lambda 间传递状态**

初始化捕获可在 Lambda 中封装状态，实现 “带状态的 Lambda”

```c++
// 带计数器的Lambda（初始化捕获计数器）
auto counter = [count = 0]() mutable {
    // mutable：允许修改捕获变量（默认捕获变量为const）
    return ++count;
};
cout << counter() << endl; // 1
cout << counter() << endl; // 2
cout << counter() << endl; // 3
```

**注意**：默认情况下，Lambda 的捕获变量是`const`的，需加`mutable`关键字才能修改。

**简化 STL 算法中的捕获逻辑**

在 STL 算法中使用初始化捕获，避免提前定义临时变量

```c++
vector<int> vec = {1, 2, 3, 4, 5, 6};
int target = 3;
// 初始化捕获：目标值+偏移量，简化查找逻辑
auto it = find_if(vec.begin(), vec.end(), 
    [t = target, offset = 1](int val) {
        return val == t + offset; // 查找3+1=4
    }
);
if (it != vec.end()) {
    cout << "找到值：" << *it << endl; // 4
}
```

### 核心规则与注意事项

**初始化捕获的本质**

编译器将初始化捕获的变量转换为 Lambda 匿名类的**成员变量**，初始化逻辑在 Lambda 构造时执行

```c++
// 初始化捕获Lambda
auto lambda = [x = 100, y = move(ptr)]() { /* 逻辑 */ };

// 编译器等价转换为：
struct AnonymousLambda {
    int x;
    unique_ptr<int> y;

    // 构造函数：执行初始化
    AnonymousLambda(int x_val, unique_ptr<int> y_val) 
        : x(x_val), y(move(y_val)) {}

    auto operator()() const { /* 逻辑 */ }
};
// 构造时传入初始化值
AnonymousLambda lambda(100, move(ptr));
```

**`mutable`关键字的使用**

若需修改初始化捕获的变量，必须在 Lambda 参数列表后加`mutable`（解除 const 限制）

```c++
// 错误：捕获变量count默认是const，无法修改
auto counter = [count = 0]() { return ++count; };
// 正确：加mutable允许修改
auto counter = [count = 0]() mutable {
    return ++count;
};
cout << counter() << endl; // 1
cout << counter() << endl; // 2
```

**生命周期与作用域**

- 初始化捕获的变量**生命周期与 Lambda 对象一致**，Lambda 销毁时，捕获变量也会销毁；
- 移动捕获的对象，原对象的生命周期不受影响，但内容已被转移；
- 引用捕获的变量，需确保外部变量生命周期长于 Lambda，避免悬空引用。







