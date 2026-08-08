# OpenGL配置

## 依赖

- **OpenGL**：系统自带的图形库，通过`find_package`查找
- **GLFW**：用于创建窗口和处理输入，作为子项目编译。([Download | GLFW](https://www.glfw.org/download.html))
- **GLAD**：OpenGL 函数加载器，需要预先生成并包含其源文件([glad](https://glad.dav1d.de/))
- **GLM**（可选）：数学库([glm: OpenGL Mathematics (GLM)](https://github.com/g-truc/glm))

## 基础文件结构

```shell
project/
├── CMakeLists.txt
├── include/
├── libs/
│   ├── glfw/          
|	├── glad/
|	|	├ include
|	|	└ src
|	├── glm/
└── src/
    └── main.cpp       # 你的主程序
```

## CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.20)

project(OpenGL)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories("include")

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/bin")

file(GLOB_RECURSE SRC CONFIGURE_DEPENDS "src/*.cpp")
file(GLOB_RECURSE INCLUDES CONFIGURE_DEPENDS "include/*.h")

add_executable(${PROJECT_NAME} ${INCLUDES} ${SRC})

add_subdirectory("lib/glfw")
target_link_libraries(${PROJECT_NAME} PUBLIC glfw)
add_subdirectory("lib/glad")
target_link_libraries(${PROJECT_NAME} PUBLIC glad)
add_subdirectory("lib/glm")
target_link_libraries(${PROJECT_NAME} PUBLIC glm)
```

