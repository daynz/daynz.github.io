# 数据类型

Lua 使用 `type(value)` 查询类型（返回字符串，如 "number"）。

> 常见错误：`type(a) == nil` 错误，因 nil 是值，type 返回字符串。

| 类型         | 描述   | 关键特性                                          |
| ---------- | ---- | --------------------------------------------- |
| `nil`      | 无效值  | 唯一值 nil，条件判断为 false。用于表示“无”或删除变量。             |
| `boolean`  | 布尔值  | true 和 false，但条件中只有 false 和 nil 为假（0、空字符串为真）。 |
| `number`   | 数字   | `Lua 5.x`分 integer 和 float，默认双精度浮点。支持科学计数法。   |
| `string`   | 字符串  | 不可变，支持单/双引号和 [[ ]] 多行。字节级操作，UTF-8 需 utf8 库。   |
| `function` | 函数   | 一等公民，支持闭包和可变参数。                               |
| `userdata` | 用户数据 | 用于 C 扩展。                                      |
| `thread`   | 协程   | 支持协作式多任务。                                     |
| `table`    | 表    | 唯一数据结构，兼具数组和字典功能，支持元表。                        |

## `nil`

### 定义

唯一值 `nil`，表示**不存在、未赋值、空**。

### 特性

1. 全局变量未定义时默认是 `nil`
2. table 访问不存在的键返回 `nil`
3. 将变量赋值为 `nil` = 删除该变量
4. 条件判断中：`nil` 等价于假
5. `nil == nil` 为 true，但不能作为 table 的 key；
6. 只有 `nil` 和 `false` 为假，其余全部为真
7. `nil ~= false`，二者完全不同

```lua
local a
print(type(a))          --> nil
print(type(a) == "nil") --> true
```

一个全局变量没有被赋值以前默认值为 nil，给全局变量赋 nil 可以删除该变量。

## `boolean`

只有两个值：`true` / `false`

### 特性

1. 仅 `false`、`nil` 在 if/while 中判定为假
2. 数字 0、空字符串 `""`、空表 `{}` 全部为 **真**

```lua
print(0 and true)  --> true  -- 0 为真
print("" or false) --> ""    -- 空字符串为真
```

## `number`

Lua 统一用 number 承载**整数 + 浮点数**

```lua
-- 十进制整数
123, -456
-- 小数
3.14, .5, 100.
-- 科学计数
1e3  -- 1000
2.5e-2 -- 0.025
-- 十六进制（0x开头）
0xff, 0x1A
-- Lua5.4支持二进制 0b
0b1010 -- 10
```

## `string`

### 定义

1. 单引号 `'hello'`
2. 双引号 `"world"`
3. 长多行字符串 `[[多行文本]]`（不会转义）

```lua
local str1 = '单引号'
local str2 = "双引号"
local str3 = [[多行 \n直接原样输出
字符串]]

a = "one string"
b = string.gsub(a, "one", "another")
print("10" + 1)    -->11
print(10 .. 20)    --> 1020
print(tonumber("10"))
```

### 特性

- **不可变**：字符串一旦创建不能修改，拼接会生成新字符串

```lua
local s = "abc"
s = s .. "d" -- 产生新字符串，原字符串不变
```

- 支持用 `#s` 获取字节长度（不是字符长度，中文占多字节）

```lua
print(#"中文") -- 6（UTF8每个中文3字节）
```

- 字符串可像数组一样下标取字节（1 开始索引）

```lua
local s = "abc"
print(s[1]) -- a
```

- Lua 弱类型，运算时自动转 number：

```lua
print("12" + 3) -- 15
print("3.5" * 2) -- 7
print("abc" + 1) -- 报错，无法转数字
```

  - `tonumber()`：显式将 string 转成数字
  - `tostring()`：显式将数字转成 string

## `Function`

Lua 中的函数是带有词法定界（被嵌套的函数可以访问他外部函数中的变量）的第一类值（第一公民）（first-class values）。

> 第一公民：可以被赋值、传递、作为参数传入、作为返回值返回、可存储的实体，能像普通变量一样自由使用。

```lua
-- 1. 标准赋值
local f = function(a,b)
    return a + b
end

-- 2. 语法糖
local function f(a,b)
    return a + b
end
```

### 核心能力

1. 匿名函数、闭包（捕获外层局部变量 `upvalue`）
2. 回调函数、高阶函数
3. 存进 table 实现类方法
4. 作为 `load`/`coroutine` 参数

### 闭包示例

```lua
function makeCounter()
    local i = 0
    return function()
        i = i + 1
        return i
    end
end
local c = makeCounter()
print(c()) --1
print(c()) --2
```

- Lua 也提供了面向对象方式调用函数的语法
- Lua 使用的函数可以是 Lua 编写也可以是其他语言编写
- Lua 函数实参和形参的匹配与赋值语句类似，多余部分被忽略，缺少部分用 nil 补足

### 多返回值

```lua
function calc(a, b)
    return a + b, a * b
end
local sum, product = calc(1, 2) --> 3, 2
```

一个 return 语句如果使用圆括号将返回值括起来也将导致返回一个值。

### `unpack`

接受一个数组作为输入参数，返回数组的所有元素。

```lua
table.unpack({1,2,3,4})  -- 1 2 3 4
```

### 可变参数

Lua 将函数的参数放在一个叫 `arg` 的表中，除了参数以外，`arg` 表中还有一个域 n 表示参数的个数。  
（注意：在 Lua 5.1 及以上版本中，`arg` 不再默认提供，推荐使用 `{...}` 打包和 `select` 函数。）

```lua
function sum(...)
    local args = {...}
    local total = 0
    for _, v in ipairs(args) do
        total = total + v
    end
    return total
end
print(sum(3))  --> 6
```

### `select`

一种是计算传递给函数的参数数量，另一种是从指定的索引开始返回参数列表。

```lua
select(index: number | string, ...)
```

用法示例：

- `select("#", ...)` 返回参数个数
- `select(n, ...)` 返回从第 n 个开始的所有参数

```lua
print(select("#", "a", "b", "c"))   -- 3
print(select(2, "a", "b", "c"))     -- b   c
```

### 命名参数

Lua 函数的参数本质是 “位置参数”，但如果将所有参数打包成一个**键值对表（table）** 传给函数，调用时就能通过 “键名” 指定参数（而非依赖位置），从而实现 “命名参数” 。

```lua
-- 定义函数：接收一个表作为参数（模拟命名参数）
function createUser(params)
  -- 从表中提取参数，支持默认值（用 or 处理 nil）
  local name = params.name  -- 必选参数（无默认值）
  local age = params.age or 18  -- 可选参数，默认18
  local gender = params.gender or "unknown"  -- 可选参数，默认unknown

  -- 业务逻辑
  print(string.format("创建用户：姓名=%s，年龄=%d，性别=%s", name, age, gender))
end

-- 调用函数：传入键值对表（参数顺序可任意）
createUser({
  name = "Lua",    -- 必选参数（按“键名”指定）
  gender = "male", -- 可选参数（按“键名”指定）
  age = 25         -- 可选参数（顺序不影响）
})
```

### 匿名函数

```lua
foo = function(x) return 2 * x end

table.sort(network, function (a,b) 
	return (a.name > b.name) 
end)
```

### 闭包

当一个函数内部嵌套另一个函数定义时，内部的函数体可以访问外部的函数的局部变量，这种特征称作词法定界。

**闭包（Closure）是一种特殊的函数**—— 它不仅能执行自身定义的代码，还能 “记住” 创建它时所处的**外部环境（ lexical environment，词法环境）**，即使这个函数在外部环境之外被调用，依然能访问和操作外部环境中的变量。

简单来说：闭包 = 函数 + 函数创建时的外部环境（变量、参数等）。

```lua
-- 1. 定义外部函数（创建环境的函数）
function createCounter()
    -- 外部环境中的变量：count（仅在 createCounter 内部定义）
    local count = 0  

    -- 2. 定义内部函数（闭包函数）
    local function increment()
        count = count + 1  -- 访问外部环境的变量 count
        return count
    end

    -- 3. 返回内部函数（将闭包“暴露”到外部环境之外）
    return increment
end

-- 4. 调用外部函数，得到闭包（此时闭包记住了 count=0 的环境）
local counter1 = createCounter()
local counter2 = createCounter()

-- 5. 在外部调用闭包（此时闭包仍能访问 count）
print(counter1())  -- 输出 1（count 从 0 变成 1）
print(counter1())  -- 输出 2（count 从 1 变成 2）
print(counter2())  -- 输出 1（counter2 记住的是自己的 count=0，与 counter1 独立）
```

### 尾调用

尾调用之后程序不需要在栈中保留关于调用者的任何信息，Lua 解释器利用这种特性在处理尾调用时不使用额外的栈，由于尾调用不需要使用栈空间，那么尾调用递归的层次可以无限制的。

尾调用必须满足 `return func(args)` 形式，且返回后无其他操作。例如尾递归：

```lua
-- 尾递归计算阶乘
function factorial(n, acc)
    acc = acc or 1
    if n <= 1 then
        return acc
    end
    return factorial(n - 1, n * acc)   -- 尾调用
end
```

## `Userdata`

用于嵌入 C/C++ 扩展，**Lua 脚本无法直接创建**，只能由 C API 生成。

### 分类

1. **full userdata**：一块内存绑定到 Lua 对象，可附加元表
2. **light userdata**：轻量指针，仅存 C 指针，无独立元表

### 常见场景

文件句柄 `io.open()`、窗口对象、网络 socket、自定义 C 结构体

```lua
local f = io.open("test.txt","r")
print(type(f)) -- userdata
```

脚本只能通过 C 提供的方法操作 userdata，不能直接修改内部内存。

## `thread`

Lua **协程（coroutine）**，轻量级多任务。`type(coroutine.create(func))` 返回 `"thread"`。

### 特点

1. 非抢占式，手动 `yield` 让出、`resume` 恢复执行
2. 每个协程拥有独立栈、局部变量，状态可挂起保存
3. 用途：异步逻辑、迭代器、状态机

```lua
local co = coroutine.create(function()
    yield(1)
    yield(2)
end)
print(coroutine.resume(co)) -- true 1
print(coroutine.resume(co)) -- true 2
```

## `table`

table 本质是**哈希表 + 数组**混合结构。

### 数组和字典

- 数组（连续整数 key，从 1 开始）

```lua
local arr = {10,20,30}
print(arr[1]) -- 10
#arr = 3  -- 获取数组长度
```

- 字典（任意类型作 key）

```lua
local dict = {
	name = "lua",
	version = 5.4
}
print(dict.name) -- lua
print(dict["version"]) -- 5.4
```

### 特性

1. key 可以是任意类型：nil 除外（nil 会删除键）number、string、boolean、table、function 都能当 key
2. table 是**引用类型**，赋值只复制引用，不复制内容

```lua
local t1 = {x=1}
local t2 = t1
t2.x = 99
print(t1.x) -- 99，共用同一张表
```

3. 空表 `{}` 是独立对象
4. 元表 `metatable`：配合 `__index/__newindex/__call` 实现面向对象、重载运算符
5. 全局环境 `_G`、函数环境 `_ENV` 底层都是 table
6. table 之间 `==` 仅判断是否为同一个对象，内容相同也不相等。

### 遍历

- `ipairs`：只遍历连续整数数组部分（1,2,3… 中间 nil 停止）
- `pairs`：遍历全部键值对（数组 + 字典）