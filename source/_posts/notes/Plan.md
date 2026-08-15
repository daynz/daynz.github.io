---
title: "Plan"
date: 2026-08-08 21:54:01
permalink: /notes/Plan.html
tags: [其他]
---

# Plan

## 总览

| 分类 | 项目 | 项目 | 项目 | 项目 | 项目 |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| [编程语言](D:/Study/Notes/Notes/编程语言/README.md) | [C++](D:/Study/Notes/Notes/编程语言/C++/README.md) | [Java](D:/Study/Notes/Notes/编程语言/Java/README.md) | [C#](D:/Study/Notes/Notes/编程语言/Csharp/README.md) | [Lua](D:/Study/Notes/Notes/编程语言/Lua/README.md) |      |
| [考研](D:/Study/Notes/Notes/408/README.md) | [数据结构](D:/Study/Notes/Notes/408/数据结构/README.md) | [算法](D:/Study/Notes/Notes/408/算法/README.md) | [操作系统](D:/Study/Notes/Notes/408/操作系统/README.md) | [网络](D:/Study/Notes/Notes/408/计算机网络/README.md) | [组成原理](D:/Study/Notes/Notes/408/计算机组成原理/README.md) |
| [数据库](D:/Study/Notes/Notes/数据库/README.md) | [MySQL](D:/Study/Notes/Notes/数据库/MySQL/README.md) | [MongoDB](D:/Study/Notes/Notes/数据库/MongoDB/README.md) | [Redis](D:/Study/Notes/Notes/数据库/Redis/README.md) | [基础](D:/Study/Notes/Notes/数据库/基础/README.md) |  |
| [Web相关](D:/Study/Notes/Notes/Web相关/README.md) | [Web编程](D:/Study/Notes/Notes/Web相关/Web编程/README.md) | [消息队列](D:/Study/Notes/Notes/Web相关/消息队列/README.md) | [缓存技术](D:/Study/Notes/Notes/Web相关/缓存技术/README.md) | [容器技术](D:/Study/Notes/Notes/Web相关/容器/README.md) | [微服务](D:/Study/Notes/Notes/Web相关/微服务/README.md) |
| [游戏引擎](D:/Study/Notes/Notes/游戏引擎/README.md) | [Unity](D:/Study/Notes/Notes/游戏引擎/Unity/README.md) | [UE](D:/Study/Notes/Notes/游戏引擎/UE/README.md) | [图形学](D:/Study/Notes/Notes/图形学/README.md) | [引擎架构](D:/Study/Notes/Notes/游戏引擎/引擎架构/README.md) |         |
| [开发技术](D:/Study/Notes/Notes/开发技术/README.md) | [设计模式](D:/Study/Notes/Notes/开发技术/设计模式/README.md) | [软件工程](D:/Study/Notes/Notes/开发技术/软件工程/README.md) | [编译原理](D:/Study/Notes/Notes/开发技术/编译原理/README.md) | [前端技术](D:/Study/Notes/Notes/开发技术/前端/README.md) |  |

## [编程语言](D:/Study/Notes/Notes/编程语言/README.md)

### [C++](D:/Study/Notes/Notes/编程语言/C++/README.md)

#### 基础

| 章节       | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| 语言基石   | 基本程序结构、运算符、作用域规则、限定符、控制流语句         |
| 数据类型   | 基础数据类型，变量、常量、指针、引用、数组、复合数据结构     |
| 函数       | 函数声明/定义、参数传递机制、返回值、函数重载、默认参数、内联函数、函数指针（回调）、（匿名函数）、`noexcept`异常规范 |
| 类与对象   | 访问控制、构造函数/析构函数、`this`指针、`const`成员函数、`static`成员、友元、RAII原则 |
| 继承与多态 | 继承模型、虚函数、抽象类、多态、基类指针/引用                |
| 内存管理   | 内存模型概览、动态内存分配、常见内存问题、智能指针           |
| 标准库     | STL与算法                                                    |
| 异常处理   | 异常机制、标准异常类、异常安全保证、RAII在异常安全中的作用   |
| 文件IO     | 文件流、文本/二进制读写模式、文件打开/关闭、基本读写操作     |

#### 进阶

| C++11 | C++14 | C++17 | C++20 | C++Latest |
| ----- | ----- | ----- | ----- | --------- |

#### 构建

| CMake |      |
| :---: | ---- |

#### 第三方库

|     库名      | 介绍 |
| :-----------: | :--: |
|      Qt       |      |
|     Boost     |      |
|   Protobuf    |      |
|     curl      |      |
|     crow      |      |
|     zlib      |      |
| nlohmann/json |      |


#### 项目

|     项目     | 介绍 |
| :----------: | :--: |
|    QtChat    |      |
| 日程管理系统 |      |

### [Java](D:/Study/Notes/Notes/编程语言/Java/README.md)

#### 基础

#### 进阶

#### 构建

| Maven | Gradle |
| :---: | :----: |

#### 项目

| MinecraftMod |
| :----------: |

### [C#](D:/Study/Notes/Notes/编程语言/Csharp/README.md)

#### 基础

#### 进阶

### [Lua](D:/Study/Notes/Notes/编程语言/Lua/README.md)

|      **章节**      | **核心内容介绍**                                             |
| :----------------: | ------------------------------------------------------------ |
|    Lua语言精要     | 基础语法速通；Table深度解析；协程(Coroutine)原理与Unity应用  |
| Unity与Lua交互方案 | xLua/ToLua/SLua对比；C#调用Lua四类方式；Lua操作C#引擎API实战 |
|   热更新实战架构   | 热更新流程设计；Lua脚本管理器；热补丁技术(Hotfix)实现BUG修复 |
|    性能优化专项    | 内存管理三原则；Table使用陷阱规避；C#-Lua跨语言调用开销优化策略 |
|    框架集成实践    | UGUI界面Lua驱动；Protobuf网络协议解析；技能配置表+战斗逻辑实现 |
|   调试与异常处理   | EmmyLua/VSCode断点调试；xpcall错误捕获；日志分级(控制台/文件/网络)输出体系 |
|      项目规范      | 模块化代码结构；Lua脚本加密(luac)；内存安全防护机制          |

## [考研](D:/Study/Notes/Notes/408/README.md)

### [数据结构](D:/Study/Notes/Notes/408/数据结构/README.md)

#### 基础

#### STL源码剖析

#### 项目

| TinySTL |
| :-----: |

### [算法](D:/Study/Notes/Notes/408/算法/README.md)

#### Leetcode

### [操作系统](D:/Study/Notes/Notes/408/操作系统/README.md)

#### 基础
#### Windows
#### Linux

### [计算机网络](D:/Study/Notes/Notes/408/计算机网络/README.md)

#### 自底向上的计算机网络

1. 计算机网络体系结构
2. 物理层
3. 数据链路层
4. 网络层
5. 传输层
6. 应用层

#### Socket编程

#### TCP-IP详解卷一：协议

#### 项目

- TinyWebServer

### [计算机组成原理](D:/Study/Notes/Notes/408/计算机组成原理/README.md)

#### 基础

#### 项目

| logisim-CPU |
| :---------: |

## [数据库](D:/Study/Notes/Notes/数据库/README.md)

### [基础](D:/Study/Notes/Notes/数据库/基础/README.md)

#### 基础

### [MySQL](D:/Study/Notes/Notes/数据库/MySQL/README.md)

#### 基础

### [MongoDB](D:/Study/Notes/Notes/数据库/MongoDB/README.md)

#### 基础

### [Redis](D:/Study/Notes/Notes/数据库/Redis/README.md)

#### 基础

## [Web相关](D:/Study/Notes/Notes/Web相关/README.md)

### [Web编程](D:/Study/Notes/Notes/Web相关/Web编程/README.md)

#### 基础

#### 项目

| JavaWeb开发 |
| :---------: |

### ~~[消息队列](D:/Study/Notes/Notes/Web相关/消息队列/README.md)~~

### [缓存](D:/Study/Notes/Notes/Web相关/缓存技术/README.md)

### [容器](D:/Study/Notes/Notes/Web相关/容器/README.md)

### ~~[微服务](D:/Study/Notes/Notes/Web相关/微服务/README.md)~~

## [游戏引擎](D:/Study/Notes/Notes/游戏引擎/README.md)

### [Unity](D:/Study/Notes/Notes/游戏引擎/Unity/README.md)

#### gameplay

#### UI

#### 渲染

#### 动画

#### 物理

#### 文件

#### 资源

#### 跨平台

### [UE](D:/Study/Notes/Notes/游戏引擎/UE/README.md)

#### gameplay

### [引擎架构](D:/Study/Notes/Notes/游戏引擎/引擎架构/README.md)



## [图形学](D:/Study/Notes/Notes/图形学/README.md)

#### Games101

#### Games202

#### Games104

#### 项目

## [开发技术](D:/Study/Notes/Notes/开发技术/README.md)

### [设计模式](D:/Study/Notes/Notes/开发技术/设计模式/README.md)

#### 基础

#### 游戏

### [软件工程](D:/Study/Notes/Notes/开发技术/软件工程/README.md)

### [编译原理](D:/Study/Notes/Notes/开发技术/编译原理/README.md)

### [前端技术](D:/Study/Notes/Notes/开发技术/前端/README.md)
