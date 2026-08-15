---
title: "CMake构建系统"
date: 2026-08-08 17:00:00
permalink: /notes/编程语言/cpp/CMake构建系统.html
tags: [编程语言]
---

# CMake 构建系统

## 简介

基于CMake的构建系统由一组高级逻辑目标构成。每个目标对应一个可执行文件或库，或者是一个包含自定义命令的自定义目标。构建系统中会表示目标之间的依赖关系，以确定构建顺序以及在发生变更时的重新生成规则。

## 二进制目标

可执行文件和库是使用 [`add_executable()`](https://cmake.org/cmake/help/latest/command/add_executable.html#command:add_executable) 和 [`add_library()`](https://cmake.org/cmake/help/latest/command/add_library.html#command:add_library) 命令定义的。生成的二进制文件针对目标平台具有适当的 `PREFIX`[^PREFIX]、`SUFFIX`[^SUFFIX]和扩展名。二进制目标之间的依赖关系使用 [`target_link_libraries()`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html#command:target_link_libraries) 命令表示。

#### 可执行文件

### 添加可执行文件 ([`add_executable()`](https://cmake.org/cmake/help/latest/command/add_executable.html#command:add_executable))  

使用指定的源文件向项目中添加一个可执行文件。

#### 可执行文件

```cmake
add_executable(<name> <options>... <sources>...)
```

添加一个名为 `<name>` 的可执行目标，该目标将从命令调用中列出的源文件构建。

- `<name>`：对应逻辑目标名称，且在项目中必须全局唯一。所构建可执行文件的实际文件名是根据本地平台的约定来构造的（例如 `<name>.exe` 或仅 `<name>`）。

- `<options>`：

  - `WIN32`：自动设置[`WIN32_EXECUTABLE`](https://cmake.org/cmake/help/latest/prop_tgt/WIN32_EXECUTABLE.html#prop_tgt:WIN32_EXECUTABLE)目标属性。

  - `MACOSX_BUNDLE`：自动设置 [`MACOSX_BUNDLE`](https://cmake.org/cmake/help/latest/prop_tgt/MACOSX_BUNDLE.html#prop_tgt:MACOSX_BUNDLE) 目标属性。

  - `EXCLUDE_FROM_ALL`：自动设置 [`EXCLUDE_FROM_ALL`](https://cmake.org/cmake/help/latest/prop_tgt/EXCLUDE_FROM_ALL.html#prop_tgt:EXCLUDE_FROM_ALL) 目标属性。

- `<source>`：

  - 可以使用语法为 `$<...>lt;...>` 的“生成器表达式”。(3.1版本新增)
  - 如果源文件随后通过 [`target_sources()`](https://cmake.org/cmake/help/latest/command/target_sources.html#command:target_sources) 添加，则可以省略这些源文件(3.11 版本新增)。

#### 添加库：普通库、对象库，接口库、导入库、别名库 ([`add_library()`](https://cmake.org/cmake/help/latest/command/add_library.html#normal))  

##### 普通库

```cmake
add_library(<name> [<type>] [EXCLUDE_FROM_ALL] <sources>...)
```

添加一个名为 `<name>` 的库目标，该目标将根据命令调用中列出的源文件进行构建。

- `<name>`：

- `<type>` ：

  - `STATIC`静态库：链接其他目标时使用的目标文件存档。


  - `SHARED`[共享库](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#shared-libraries)：一种动态库，可由其他目标链接并在运行时加载。


  - `MODULE`[模块库](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#module-libraries)：一种插件，其他目标可能不会链接它，但可以在运行时使用类似dlopen的功能动态加载。
  - `Object`[对象库](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#id32)
  - `INTERFACE`[接口库](https://cmake.org/cmake/help/latest/command/add_library.html#id4)
  - `IMPORT`[导入库](https://cmake.org/cmake/help/latest/command/add_library.html#id5)
  - `ALIAS`[别名库](https://cmake.org/cmake/help/latest/command/add_library.html#id6)
  - 如果未给出 `<type>`，则根据 [`BUILD_SHARED_LIBS`](https://cmake.org/cmake/help/latest/variable/BUILD_SHARED_LIBS.html#variable:BUILD_SHARED_LIBS) 变量的值，默认值为 `STATIC` 或 `SHARED`。


- `EXCLUDE_FROM_ALL`
- 自动设置 [`EXCLUDE_FROM_ALL`](https://cmake.org/cmake/help/latest/prop_tgt/EXCLUDE_FROM_ALL.html#prop_tgt:EXCLUDE_FROM_ALL) 目标属性。有关详细信息，请参阅该目标属性的文档。

- `<source>`：

  - 可以使用语法为 `$<...>lt;...>` 的“生成器表达式”。(3.1版本新增)

  - 如果源文件随后通过 [`target_sources()`](https://cmake.org/cmake/help/latest/command/target_sources.html#command:target_sources) 添加，则可以省略这些源文件(3.11 版本新增)。

## 构建规范和使用要求

目标根据其自身的[构建规范](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#target-build-specification)，结合从其链接依赖项传递而来的[使用要求](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#target-usage-requirements)进行构建。这两者都可以使用特定于目标的[命令](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#target-commands)进行指定。

### 目标命令

#### [`目标编译选项()`](https://cmake.org/cmake/help/latest/command/target_compile_options.html#command:target_compile_options)

```
target_compile_definitions(<target>
  <INTERFACE|PUBLIC|PRIVATE> [items1...]
  [<INTERFACE|PUBLIC|PRIVATE> [items2...] ...])
```



## 配置构建

## 伪目标

### 目标属性配置

- 包含目录 (`target_include_directories()`)  
- 编译选项 (`target_compile_options()`)  
- 链接依赖 (`target_link_libraries()`)  
- 链接目录与库 (`target_link_directories()/target_link_options()`)  
- 预处理器定义 (`target_compile_definitions()`)  
- 源文件属性 (`set_source_files_properties()`)  

### 依赖管理

- `find_package()` 机制（模块模式/配置模式）  
- 自定义 Find 模块编写  
- `pkg-config` 集成 (`find_package(PkgConfig)`)  

[^PREFIX]:库名之前的内容。一个目标属性，可设置该属性以覆盖库名称上的前缀（如`lib`）。
[^SUFFIX]:目标名称之后的内容。一个目标属性，可设置该属性以覆盖库、模块或可执行文件名称上的后缀（如 `.so` 或 `.exe`）。

---

### 三、构建流程控制

1. **生成器表达式**  
   - 条件表达式 (`$<IF:...>`, `$<CONFIG:Release>`)  
   - 目标相关表达式 (`$<TARGET_FILE:...>`)  
   - 编译特性检测 (`$<COMPILE_FEATURES:cxx_std_17>`)  

2. **构建配置与类型**  
   - `CMAKE_BUILD_TYPE` (Debug/Release/RelWithDebInfo)  
   - 多配置生成器（VS, Xcode）  
   - 自定义构建配置  

3. **编译器与工具链**  
   - 编译器标志默认规则  
   - 交叉编译工具链文件 (`-DCMAKE_TOOLCHAIN_FILE`)  
   - 语言标准控制 (`CXX_STANDARD`, `CUDA_STANDARD`)  

---

### 四、项目组织与模块化
1. **子目录管理**  
   - `add_subdirectory()` 的用法与变量传递  
   - 作用域隔离与 `CACHE` 变量  

2. **函数与宏**  
   - 定义与调用 (`function()/macro()`)  
   - 参数解析 (`cmake_parse_arguments()`)  

3. **模块化设计**  
   - `include()` 加载脚本  
   - 创建可重用模块（`.cmake` 文件）  

---

### 五、安装与打包
1. **安装规则**  
   - 目标安装 (`install(TARGETS ...)`)  
   - 文件安装 (`install(FILES/DIRECTORY ...)`)  
   - 导出配置 (`install(EXPORT ...)`)  

2. **CPack 打包**  
   - 生成 DEB/RPM/NSIS 等包  
   - 配置包元数据（作者、版本、依赖）  

---

### 六、高级特性
1. **自定义命令与目标**  
   - 构建前/后步骤 (`add_custom_target()`)  
   - 文件生成 (`add_custom_command()`)  
   - 生成器表达式在自定义命令中的使用  

2. **测试集成**  
   - CTest 基础 (`enable_testing()/add_test()`)  
   - 测试属性（超时、工作目录）  
   - 测试覆盖率（gcov/lcov）  

3. **外部项目集成**  
   - `ExternalProject_Add()`（下载/编译第三方代码）  
   - `FetchContent`（直接集成依赖源码）  

---

### 七、调试与优化
1. **调试技巧**  
   - 打印变量 (`message()`)  
   - 日志级别控制 (`--log-level=DEBUG`)  
   - 文件跟踪 (`--trace-source=CMakeLists.txt`)  

2. **性能优化**  
   - 避免重复配置  
   - 减少全局作用域操作  
   - 使用 `target_sources()` 替代全局变量  

---

### 八、跨平台实践
1. **平台检测**  
   - 操作系统判断 (`WIN32`, `UNIX`, `APPLE`)  
   - 处理器架构检测  

2. **平台特定代码处理**  
   - 条件编译（通过 CMake 传递宏）  
   - 平台依赖的链接库管理  

---

### 九、工具链与交叉编译
1. **工具链文件详解**  
   - 编译器路径设置  
   - Sysroot 配置  
   - 跨编译目标属性 (`CMAKE_SYSTEM_NAME`)  

2. **多架构支持**  
   - iOS/Android 构建配置  
   - 嵌入式系统适配（如 ARM Cortex-M）  

---

### 十、现代 CMake 最佳实践
1. **基于 Target 的设计模式**  
   - 避免全局函数（`include_directories()` 已过时）  
   - 使用 `INTERFACE` 库传递依赖  

2. **依赖传播模型**  
   - `PUBLIC/PRIVATE/INTERFACE` 关键字的使用场景  
   - 避免循环依赖  
