---
title: "EffectiveC++"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/cpp/EffectiveC++.html
tags: [编程语言]
---

# 1. 让自己习惯C++

## 条款1 视C++为一个语言联邦

## 条款2 尽量以const，enum，inline替换#define

## 条款3 尽可能使用const

## 条款4 确定对象在使用前已先初始化

- 内置类型：手动赋值

- 自定义类：构造函数

  - 注意：

    - 初始化(推荐)

    - ```c++
      ClassA::ClassA(const int a) : theA(a)
      ```

    - 赋值
    
    - ```c++
      ClassA::ClassA(const int a) { theA = a; }
      ```

**问题：对于不同编译单元全局静态对象初始化次序的问题**

解决：将全局静态对象搬到自己的专属函数内，该对象在此函数内被声明为static，这些函数返回一个引用指向它们所含的对象。（单例模式）函数内的本地静态对象会在该函数被调用期间，首次遇上该对象的定义式时被初始化。在多线程中在程序的单线程启动阶段，手工调用所有引用返回函数可消除与初始化相关的竞速形势。

# 2, 构造/析构/赋值运算

## 条款5 了解C++默默编写并调用哪些函数

在 C++ 中，如果一个类没有显式定义某些成员函数，编译器会**默认生成**以下 6 个特殊成员函数，这些是笔试高频考点：

1. **默认构造函数**：无参数的构造函数，仅当类没有显式定义任何构造函数时才会生成，用于创建对象时初始化成员。
2. **析构函数**：用于对象销毁时清理资源，默认是内联的，不抛出异常。
3. **拷贝构造函数**：用同类型对象初始化新对象时调用，默认行为是**成员逐个拷贝**。
4. **拷贝赋值运算符**：用同类型对象给已有对象赋值时调用，默认行为也是**成员逐个拷贝**。
5. **移动构造函数**：C++11 新增，当对象是右值时调用，默认行为是**成员逐个移动**，仅当类没有显式定义拷贝相关函数、移动相关函数和析构函数时才会生成。
6. **移动赋值运算符**：C++11 新增，用右值对象给已有对象赋值时调用，默认行为是**成员逐个移动**，生成条件和移动构造函数相同。

## 条款6 若不想用编译器自动生成的函数，就该明确拒绝

```c++
class Empty {
public:
    Empty() = delete;
    ~Empty() = delete;
    Empty(const Empty&) = delete;
    Empty& operator=(const Empty&) = delete;
    Empty(Empty&&) = delete;
    Empty& operator=(Empty&&) = delete;
};
```

## 条款7 为多态基类声明virtual析构函数

**问题：用基类类型的指针指向一个派生类的对象，然后通过这个基类指针调用 delete 来销毁对象，如果基类析构不是虚函数，这时候只会销毁基类部分，派生类的资源可能泄漏。**

解决：给基类一个虚析构函数

## 条款8 别让异常逃离析构函数

析构函数绝对不要抛出异常，如果一个析构函数调用的函数可能抛出异常，析构函数应该捕获任何异常，然后处理他们(不传播)或者结束程序。

## 条款9 绝不在构造和析构过程中调用virtual函数

在基类对象的基类构造期间，对象类型是基类而不是派生类。

## 条款10 令operator=返回一个reference to *this

```c++
Widget& operator=(const Widget& rhs)
{
    return *this;
}
```

## 条款11 在operator=处理自我赋值

```c++
Widget& operator=(const Widget& rhs)
{
    if(this == &rhs) return *this;
    delete pb;
    pb = new Bitmap(*rhs.pb);
    return *this;
}
```

## 条款12 复制对象时勿忘其每一个成分

```c++
class Base {
protected:
    int base_val; // 基类成员
public:
    // 基类拷贝赋值
    Base& operator=(const Base& other) {
        if (this == &other) return *this;
        base_val = other.base_val; // 复制基类成员
        return *this;
    }
};

class Derived : public Base {
private:
    int derived_val;
public:
    Derived& operator=(const Derived& other) {
        if (this == &other) return *this;
        Base::operator=(other); // 显式调用基类拷贝赋值
        derived_val = other.derived_val;
        return *this;
    }
};
```

