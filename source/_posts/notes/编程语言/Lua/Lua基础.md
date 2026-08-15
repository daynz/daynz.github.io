---
title: "Lua基础"
date: 2026-08-08 23:26:19
permalink: /notes/编程语言/Lua/Lua基础.html
tags: [编程语言]
---

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

## Lua 环境

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

## Hello World

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
> local x = 10 + 5
> print(x) -- 15
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
```

### 多行注释

以 `--[[` 和 `]]` 包围，不能嵌套。

```lua
--[[
  多行注释
  可跨越多行
]]
--[[ 第一段 ]] --[[ 第二段 ]]

--[[ 推荐这样做，可以快速切换注释和非注释

--]]
```

## 标识符

### 命名规则

- 以字母（A-Z，a-z）或下划线 _ 开头，后接字母、数字（0-9）或下划线。
- 严格区分大小写：`name ≠ Name`。
- 不能使用特殊字符（如 @, $, %）。

### 命名规范

- **避免以 _ 加全大写开头**（如 `_VERSION`），这些是 Lua 保留的。
- 推荐小驼峰（`userName`）或下划线式（`user_name`）。
- 全局变量用描述性名称，局部变量可简短但有意义。
- 常量用全大写（如 `MAX_VALUE`）。

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

Lua 5.2 起，全局变量不再直接访问 `_G`，而是通过一个名为 `_ENV` 的特殊局部变量实现。每个代码块（文件、函数等）都拥有自己独立的 `_ENV`，默认指向上层传递的环境表（最顶层指向 `_G`）。

**核心规则：**
- 对**未声明为 `local` 的变量**赋值或读取，实际上会被编译器转换为对 `_ENV` 表字段的访问：  
  `x = 1` → `_ENV.x = 1`  
  `print(x)` → `_ENV.print(_ENV.x)`
- `_ENV` 本身是一个普通的局部变量，你可以像操作其他局部变量一样修改它，从而改变当前代码块的“全局”命名空间。

**改变代码块环境：**
```lua
local a = 10          -- 局部变量，不受 _ENV 影响
local _ENV = { print = print, b = 20 }   -- 自定义环境

print(a)   -- 10    （局部变量正常访问）
print(b)   -- 20    （b 在自定义 _ENV 中）
c = 30     -- 向 _ENV 添加键 c，即 _ENV.c = 30
print(c)   -- 30

print(math.abs(-5))   -- 错误！自定义环境中没有 math
```

**函数环境的继承：**
函数定义时会捕获当前的 `_ENV` 作为自己的默认环境，之后调用时仍然使用该捕获的环境，与调用位置无关。
```lua
local _ENV = { print = print, secret = 42 }
local function get_secret()
    return secret   -- 捕获的是定义时的 _ENV
end

local _ENV = { print = print }   -- 调用处环境不同
print(get_secret())   -- 42 （仍使用定义时的环境）
```

**与 `load` / `loadfile` 配合：**
加载代码时可以通过参数显式指定环境，常用于沙箱或模块加载。
```lua
local sandbox = { print = print, x = 5 }
local code = "x = x + 1; print(x)"
local f = load(code, nil, "t", sandbox)  -- 第四个参数指定环境
f()   --> 6
print(sandbox.x)   --> 6
```

**典型用途：**

- **模块隔离**：通过 `_ENV` 控制模块内部可见的全局变量，避免污染全局。
- **沙箱执行**：为外来脚本提供一个只包含安全函数的环境。
- **精简代码**：在特定环境中省略前缀，如 `local _ENV = math` 后可直接写 `sin(x)`。

`_ENV` 只影响**当前块内的非 `local` 变量**，局部变量不受其干扰。同时，修改 `_ENV` 后，若希望恢复默认环境，通常需要提前保存原来的 `_ENV`

```lua
local old_ENV = _ENV
-- 临时切换环境
local _ENV = new_env
-- ... 代码 ...
_ENV = old_ENV   -- 恢复（注意此处赋值给的是当前块的 _ENV，不是局部变量）
```

## 表达式

### 算术运算符

```lua
+ - * / ^ --(加减乘除幂)
```

``` lua
- --(负值)
```

运算符的操作数都是实数。

```lua
-- 整除（向负无穷取整，也适用于浮点数）
5 // 2      --> 2
5.0 // 2.0  --> 2.0
-5 // 2     --> -3
-5.0 // 2.0 --> -3.0

-- 取模（满足 a % b == a - b * math.floor(a/b)，适用于浮点数）
5 % 2       --> 1
-5 % 2      --> 1
5.3 % 2     --> 1.3   (5.3 - 2 * math.floor(5.3/2) = 1.3)
```

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

```lua
-- cond ? a : b
local val = cond and a or b --a 一定不为 `false` 或 nil 时才可靠
local val = (cond and {a} or {b})[1] --安全的替代写法
```

- 短路特性：短路时**右侧表达式完全不执行**

```lua
-- f() 不会被调用
false and f()
-- g() 不会被调用
true or g()
```

### 其他运算符

- `..`：字符串连接。如果操作数为数字，Lua 将数字转成字符串。
- `#`：长度运算符。用于字符串时返回字节数；用于 table 时，返回序列的长度。如果表中含有 `nil` 空洞，`#` 的行为是未定义的。

### 运算符结合性

- `^` 为右结合，其余所有二元运算符均为左结合。
```lua
2 ^ 3 ^ 2     -- 等价于 2 ^ (3 ^ 2) = 512
"a" .. "b" .. "c"   -- 等价于 ("a" .. "b") .. "c"
```

### 优先级

| 优先级 | 运算符                          |
| --- | -------------------------------- |
| 1   | `^`                              |
| 2   | `not`, `#`, `-`(一元)             |
| 3   | `*`, `/`, `//`, `%`              |
| 4   | `+`, `-`                         |
| 5   | `..`                             |
| 6   | `<`, `>`, `<=`, `>=`, `~=`, `==` |
| 7   | `and`                            |
| 8   | `or`                             |
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

应该尽可能的使用局部变量，有两个好处：
- 避免命名冲突
- 访问局部变量的速度比全局变量更快

### 作用域规则

```lua
local var = "outer"
do
    local var = "inner"
    print(var)  --> inner
end
print(var)      --> outer
```

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

#### 数值 `for`

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

#### 泛型 `for`

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
