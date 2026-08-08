# Lua 基础

## Lua简介

Lua 是一种轻量小巧的脚本语言，用标准C语言编写并以源代码形式开放， 其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

## 语言特性

- **轻量级**：Lua 的核心库体积小，编译后文件也很小，这使得它能在资源受限的环境中高效运行。
- **可嵌入性**：Lua 能很方便地嵌入到其他应用程序中，为应用程序提供灵活的脚本扩展能力。
- **高效性**：Lua 的执行速度快，在性能方面表现出色。
- **语法简洁**：它的语法简单易懂，易于学习和使用，降低了开发者的学习成本。
- **动态类型**：变量的类型由其值决定，无需事先声明变量类型，编写代码时更加灵活。

## Lua 应用场景

- **游戏开发**：实现游戏逻辑、脚本系统和配置管理。它能让游戏开发者在不重新编译整个游戏的情况下，快速修改和更新游戏内容。
- **Web 应用脚本**：Lua 可用于服务器端脚本编程。
- **扩展和数据库插件**：户可以编写 Lua 脚本来自动化执行一些重复性任务，或者实现自定义的功能。
- **安全系统**，如入侵检测系统。

## Lua环境

### Linux

#### 源码安装

```shell
curl -L -R -O https://www.lua.org/ftp/lua-5.4.7.tar.gz
tar zxf lua-5.4.7.tar.gz
cd lua-5.4.7
make all test
make install
```

#### 包管理器

```shell
sudo apt update
sudo apt install lua5.3
```

### Windows

[http://www.lua.org](http://www.lua.org/)

## 第一个Lua程序

- `HelloWorld.lua`

```lua
print("Hello World!")
```

终端输入

```shell
lua HelloWorld.lua #或是lua54(对应版本)
```

## 编程方式

### 交互式编程

- **启用方式**：命令行输入 `lua -i` 或 `lua` 启动解释器。

- **用途**：适合调试和快速测试。

- **示例**：

  ```lua
  -- 启动交互模式
  $ lua -i
  Lua 5.4.Copyright (C) 1994-20Lua.org, PUC-Rio
  > print("Hello World!")  -- 直接输入代码
  Hello World!
  > local x = + 5
  > print(x)
  15
  ```

### 脚本式编程

- **文件格式**：Lua 脚本以 `.lua` 为后缀。

- **执行方式**：

  ```shell
  lua 文件名.lua
  ```

- **示例脚本**：

  ```lua
  print("Hello from script!")
  ```
  

执行：`lua hello.lua` 输出 `"Hello from script!"`。

## 注释

### 单行注释

以 `--` 开头，至行尾结束。

```lua
-- 这是单行注释
local x =  -- 变量初始化
```

### 多行注释

以 `--[[` 和 `]]` 包围，不能嵌套。

```lua
--[[
  多行注释
  可跨越多行
]]
--[[ 第一段 ]] --[[ 第二段 ]]
```

## 标识符

### 命名规则

- 以字母（A-Z, a-z）或下划线 _ 开头，后接字母、数字（0-9）或下划线。
- 严格区分大小写：name ≠ Name。
- 不能使用特殊字符（如 @, $, %）。

### 命名规范

- **避免以 _ 加全大写开头**（如 _VERSION），这些是 Lua 保留的。
- 推荐小驼峰（`userName`）或下划线式（`user_name`）。
- 全局变量用描述性名称，局部变量可简短但有意义。
- 常量用全大写（如 MAX_VALUE）。

### 保留字

按字母排序：`and, break, do, else, elseif, end, false, for, function, goto, if, in, local, nil, not, or, repeat, return, then, true, until, while`

## 全局变量

### 特性

- **全局变量**：无需声明，给一个变量赋值后即创建了这个全局变量，存储在 _G 表中。
- **未初始化变量**：访问一个没有初始化的全局变量也不会出错，得到的结果是：nil
- **删除**：赋值为 nil（如 a = nil）。
- **环境表**：_G 是默认环境表，Lua 5.引入 _ENV 支持自定义环境。

```lua
_G.a =  -- 等价于 a = 10
print(_G["a"])  --> 10

local _ENV = {print = print}  -- 新环境
a =  -- 错误：_ENV 无 a
```

**注意**：

- 优先使用 local 避免全局污染，性能更高（避免 _G 查找）。
- _ENV 可用于模块隔离或沙箱环境。

### 环境（`_ENV`）

TODO

## 数据类型（8种）

Lua 使用 `type(value)` 查询类型（返回字符串，如 "number"）。

**常见错误**：**`type(a) == nil` 错误，因 nil 是值，type 返回字符串。**

| 类型       | 描述     | 关键特性                                                     |
| ---------- | -------- | ------------------------------------------------------------ |
| `nil`      | 无效值   | 唯一值 nil，条件判断为 false。用于表示“无”或删除变量。       |
| `boolean`  | 布尔值   | true 和 false，但条件中只有 false 和 nil 为假（0、空字符串为真）。 |
| `number`   | 数字     | Lua 5.分 integer 和 float，默认双精度浮点。支持科学计数法。  |
| `string`   | 字符串   | 不可变，支持单/双引号和 [[ ]] 多行。字节级操作，UTF-8 需 utf8 库。 |
| `function` | 函数     | 一等公民，支持闭包和可变参数。                               |
| `userdata` | 用户数据 | 用于 C 扩展。                                                |
| `thread`   | 协程     | 支持协作式多任务。                                           |
| `table`    | 表       | 唯一数据结构，兼具数组和字典功能，支持元表。                 |

### `nil`

#### 定义

唯一值 `nil`，表示**不存在、未赋值、空**。

#### 特性

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

### `boolean`

只有两个值：`true` / `false`

#### 特性

1. 仅 `false`、`nil` 在 if/while 中判定为假
2. 数字 0、空字符串 `""`、空表 `{}` 全部为 **真**

```lua
print(0 and true)  --> true  -- 0 为真
print("" or false) --> ""    -- 空字符串为真
```

### `number`

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

### `string`

#### 三种写法

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

#### 特性

- **不可变**：字符串一旦创建不能修改，拼接会生成新字符串

  - ```lua
  local s = "abc"
  s = s .. "d" -- 产生新字符串，原字符串不变
  
- 支持用 `#s` 获取字节长度（不是字符长度，中文占多字节）

  - ```lua
  print(#"中文") -- 6（UTF8每个中文3字节）
  
- 字符串可像数组一样下标取字节（1 开始索引）

  - ```lua
    local s = "abc"
    print(s[1]) -- a
  
- Lua 弱类型，运算时自动转 number：

  - ```lua
    print("12" + 3) -- 15
    print("3.5" * 2) -- 7
    print("abc" + 1) -- 报错，无法转数字
    ```

  - `tonumber()`：显式将 string 转成数字

  - `tostring()`：显式将数字转成 string 


#### 标准库

TODO

### `Function`

Lua 中函数是**一等公民（第一类值）**，可以像普通变量一样传递、赋值、存入 table、作为参数 / 返回值。

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

#### 核心能力

1. 匿名函数、闭包（捕获外层局部变量 upvalue）
2. 回调函数、高阶函数
3. 存进 table 实现类方法
4. 作为 `load`/`coroutine` 参数

#### 闭包示例

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

### `Userdata`

用于嵌入 C/C++ 扩展，**Lua 脚本无法直接创建**，只能由 C API 生成。

#### 分类

1. **full userdata**：一块内存绑定到 Lua 对象，可附加元表
2. **light userdata**：轻量指针，仅存 C 指针，无独立元表

#### 常见场景

文件句柄 `io.open()`、窗口对象、网络 socket、自定义 C 结构体

```lua
local f = io.open("test.txt","r")
print(type(f)) -- userdata
```

脚本只能通过 C 提供的方法操作 userdata，不能直接修改内部内存。

### `thread`

Lua **协程（coroutine）**，轻量级多任务。`type(coroutine.create(func))` 返回 `"thread"`。

#### 特点

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

### `table`

table 本质是**哈希表 + 数组**混合结构。

#### 两种使用形式

- 数组（连续整数 key，从 1 开始）

  - ```lua
    local arr = {10,20,30}
    print(arr[1]) -- 10
    #arr = 3  -- 获取数组长度
    ```

- 字典（任意类型作 key）

  - ```lua
    local dict = {
        name = "lua",
        version = 5.4
    }
    print(dict.name) -- lua
    print(dict["version"]) -- 5.4
    ```

#### 特性

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

#### 遍历

- `ipairs`：只遍历连续整数数组部分（1,2,3… 中间 nil 停止）
- `pairs`：遍历全部键值对（数组 + 字典）

## 表达式

### 算术运算符

```lua
+ - * / ^ --(加减乘除幂)
```

``` lua
- --(负值)
```

运算符的操作数都是实数

### 关系运算符

```lua
< > <= >= == ~=
```

- 关系运算符返回结果为 false 或者 true

- 不同类型一定不相等

- nil 只和自己相等
- Lua 通过引用比较 table、userdata、function，当且仅当两者表示同一个对象时相等

### 逻辑运算符

```lua
and or not
```

逻辑运算符认为 false 和 nil 是假（false），其他为真，0 也是 true.

- 模拟三元表达式

  - ```lua
    -- cond ? a : b
    local val = cond and a or b
    ```

- 短路特性：短路时**右侧表达式完全不执行**

  - ```lua
    -- f() 不会被调用
    false and f()
    -- g() 不会被调用
    true or g()
    ```

### 其他运算符

- `..`：字符串连接。如果操作数为数字，Lua 将数字转成字符串。
- `#`：长度（字符串字节，只统计表的连续整数数组，中间 nil 会截断长度）。

### 优先级

| 优先级 | 运算符                           |
| ------ | -------------------------------- |
| 1      | `^`                              |
| 2      | `not`, `#`, `-`(一元)            |
| 3      | `*`, `/`, `//`, `%`              |
| 4      | `+`, `-`                         |
| 5      | `..`                             |
| 6      | `<`, `>`, `<=`, `>=`, `~=`, `==` |
| 7      | `and`                            |
| 8      | `or`                             |

## 基本语法

### 赋值语句

```lua
a = 1  --赋值
a, b = 10, 2*x --> a=10; b=2*x --多个变量同时赋值
a, b = b, a --交换
a, b, c = 0  --> a=0,b=nil,c=nil
a, b, c = 0, 0, 0 -->a=0,b=0,c=0
a, b = f() -- f()返回两个值，第一个赋给 a，第二个赋给 b。
```

- Lua 可以对多个变量同时赋值，变量列表和值列表的各个元素用逗号分开，赋值语句右边的值会依次赋给左边的变量
- 当变量个数和值的个数不一致时，Lua 会一直以变量个数为基础采取以下策略
  - 变量个数>值的个数 按变量个数补足 nil
  - 变量个数<值的个数 多余的值会被忽略

### 局部变量

使用 local 创建一个局部变量，与全局变量不同，局部变量只在被声明的那个代码块内有效。

- 应该尽可能的使用局部变量，有两个好处：
  1. 避免命名冲突
  2. 访问局部变量的速度比全局变量更快

### 作用域规则

```lua
local var = "outer"
do
    local var = "inner"
    print(var)  --> inner
end
print(var)      --> outer
```

**注意**：局部变量优先，块（如 do-end, if, for）定义新作用域。

## 控制结构语句

### `if`语句

```lua
if conditions then 
 then-part 
end

if conditions then 
 then-part 
else 
 else-part 
end

if conditions then 
 then-part 
elseif conditions then
 elseif-part 
.. --->多个 elseif 
else 
 else-part 
end
```

### `while`语句

```lua
while condition do
 statements; 
end
```

### `repeat-until`语句

```lua
repeat 
 statements; 
until conditions
```

### `for`循环

#### 数值 for

```lua
for var=exp1,exp2,exp3 do
	--循环体
end
```

- 初始值：exp1
- 终止值：exp2
- 步长：exp3，可以省略，默认 step=1
- 注意：
  - 三个表达式只会被计算一次，并且是在循环开始前
  - 控制变量 var 是局部变量自动被声明，并且只在循环内有效，如果需要保留控制变量的值，需要在循环中将其保存
  - 循环过程中不要改变控制变量的值，那样做的结果是不可预知的。

#### 泛型 for

- `pairs(t)`：遍历所有**键值对**，无序（能遍历数字、字符串、table 等所有合法 key，不会被 nil 截断）
- `ipairs(t)`：遍历**数组**部分（整数键从 1 连续，底层迭代器遇到 `nil` 就停止，只处理数组部分，忽略字符串键）。
- 自定义迭代器：见[Lua进阶](./Lua进阶.md)

```lua
for <var-list> in <exp-list> do
    --循环体
end
```

### 循环控制

- `break`：退出循环
- `return`：用来从函数返回结果，当一个函数自然结束结尾会有一个默认的 return
- Lua 语法要求 break 和 return 只能出现在 block 的结尾一句
- 需要在 block 的中间使用 return 或者 break，可以显式的使用 do..end 来实现

## 函数

Lua 中的函数是带有词法定界（被嵌套的函数可以访问他外部函数中的变量）的第一类值（first-class values）。

第一类值：在 Lua 中函数和其他值一样，函数可以被存放在变量中，也可以存放在表中，可以作为函数的参数，还可以作为函数的返回值。

### 基本定义

```lua
function func_name (arguments-list) 
	statements-list; 
end
local func_name = (arguments-list)
	statements-list; 
end
```

### 函数调用

```lua
o:foo(x)
o.foo(o,x) --等价
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

#### `unpack`

接受一个数组作为输入参数，返回数组的所有元素。

```lua
table.unpack({1,2,3,4})  -- 1 2 3 4
```

### 可变参数

Lua 将函数的参数放在一个叫 `arg` 的表中，除了参数以外，`arg` 表中还有一个域 n 表示参数的个数。

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

#### `select`

一种是计算传递给函数的参数数量，另一种是从指定的索引开始返回参数列表。

```lua
select(index: number | string, ...)
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

