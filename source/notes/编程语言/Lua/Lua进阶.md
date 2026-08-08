# Lua 进阶

## 迭代器

迭代器是一种支持指针类型的结构，它可以遍历集合的每一个元素。

在 Lua 中使用函数来描述迭代器，每次调用该函数就返回集合的下一个元素。

迭代器需要保留上一次成功调用的状态和下一次成功调用的状态。

### 有状态迭代器

### 无状态迭代器

### 多状态迭代器

## 异常

调用 error 函数显示的抛出错误，error 的参数是要抛出的错误信息。

## 协程（thread）

### 基本使用

```lua
local co = coroutine.create(function()
    print("协程开始")
    local value = coroutine.yield("暂停")
    print("恢复，收到:", value)
    return "完成"
end)
print(coroutine.resume(co))  --> true "暂停"
print(coroutine.resume(co, "继续"))  --> true "完成"
```

