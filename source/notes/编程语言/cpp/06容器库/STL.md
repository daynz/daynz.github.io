# STL

## 基础知识

## 组件

## 序列式容器

### `std:vector`

#### 基本概念

- **定义**: `std::vector`用于存储一系列元素。它的特点是：
  - **动态大小**: 可以在运行时根据需要自动增长或缩小，无需预先声明固定大小（与普通数组不同）。
  - **连续内存**: 其内部元素在内存中是连续存储的。这使得通过索引随机访问元素非常高效，并且可以方便地与只接受普通指针的 C 风格 API 进行交互 (`vec.data()`)。
  - **同质性**: 容器内的所有元素必须是相同的数据类型 `T` (例如 `int`, `float`, 自定义类 `GameObject` 等)。

### 常用构造函数

- **默认构造函数**: 创建一个空的 `vector`。

  ```cpp
  std::vector<int> vec1; // 创建一个空的整数向量
  ```

- **填充构造函数**: 创建指定数量的元素，并用给定值初始化。

  ```cpp
  std::vector<int> vec2(5, 10); // 创建一个包含5个元素，每个元素都是10的向量: {10, 10, 10, 10, 10}
  ```

- **范围构造函数**: 从一对迭代器（如另一个容器的开始和结束位置）来初始化 `vector`。

  ```cpp
  std::vector<int> source{1, 2, 3, 4, 5};
  std::vector<int> vec3(source.begin(), source.end()); // 复制 source 的所有元素到 vec3
  ```

- **拷贝构造函数**: 从另一个 `vector` 拷贝一份新的。

  ```cpp
  std::vector<int> vec4(vec2); // vec4 是 vec2 的一个副本
  ```

- **移动构造函数**: 将一个临时 `vector` (右值) 的资源转移给新对象，避免不必要的拷贝，提高性能。

  ```cpp
  std::vector<int> createVec() {
      return std::vector<int>(5, 20); // 返回一个临时对象
  }
  std::vector<int> vec5 = createVec(); // 调用移动构造函数，效率高
  ```

- **初始化列表构造函数 (C++11)**: 使用花括号 `{}` 直接初始化。

  ```cpp
  std::vector<int> vec6{1, 2, 3, 4, 5}; // 最常用和直观的初始化方式
  ```

### **主要成员函数**

#### 访问元素 (Element Access)

- `operator[]`: 通过索引随机访问元素，**不进行边界检查**，速度最快，但可能造成未定义行为。

  ```cpp
  vec[0] = 100; // 设置第一个元素
  int val = vec[0]; // 获取第一个元素
  ```

- `at(pos)`: 通过索引访问元素，**会进行边界检查**。如果索引越界，会抛出 `std::out_of_range` 异常，更安全。

  ```cpp
  try {
      int val = vec.at(100); // 如果 vec.size() <= 100, 会抛出异常
  } catch (const std::out_of_range& e) {
      std::cout << "Accessed out of range!" << std::endl;
  }
  ```

- `front()`: 返回对第一个元素的引用。

  ```cpp
  if (!vec.empty()) { // 使用前应确保 vector 不为空
      auto first_elem = vec.front();
  }
  ```

- `back()`: 返回对最后一个元素的引用。

  ```cpp
  if (!vec.empty()) {
      auto last_elem = vec.back();
  }
  ```

- `data()`: 返回指向内部数组首元素的原始指针。这是将 `vector` 数据传递给需要原生数组或指针的 C 函数的关键方法。

  ```cpp
  std::vector<float> positions = {1.0f, 2.0f, 3.0f};
  some_c_function_that_takes_array(positions.data(), positions.size());
  ```

#### 迭代器(Iterators)

迭代器提供了一种统一的方式来遍历容器中的元素。

- `begin()` / `end()`: 返回正向迭代器，分别指向第一个元素和“最后一个元素之后”的位置。
- `rbegin()` / `rend()`: 返回反向迭代器，分别指向最后一个元素和“第一个元素之前”的位置。

```cpp
std::vector<int> vec{10, 20, 30};

// 范围for循环 (C++11 推荐)
for (int value : vec) {
    std::cout << value << " ";
}

// 传统迭代器循环
for (auto it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << " ";
}

// 反向迭代器
for (auto rit = vec.rbegin(); rit != vec.rend(); ++rit) {
    std::cout << *rit << " ";
}
```

#### 容量 (Capacity)

- `size()`: 返回当前 `vector` 中元素的数量。

- `empty()`: 检查 `vector` 是否为空（`size() == 0`），通常比 `size() == 0` 更高效。

- `capacity()`: 返回 `vector` 当前分配的存储空间能容纳的元素数量。这个值大于或等于 `size()`。

- `max_size()`: 返回 `vector` 理论上能容纳的最大元素数量（受系统内存限制）。

- reserve(n): 预先分配至少能容纳 

  n个元素的内存空间。如果 n 大于当前 capacity()，会触发重新分配。此举可以避免在后续添加大量元素时频繁重新分配内存，从而提升性能。

  ```cpp
  std::vector<int> vec;
  vec.reserve(1000); // 预分配空间，接下来 push_back 1000次不会发生reallocate
  for(int i = 0; i < 1000; ++i) {
      vec.push_back(i);
  }
  ```

- `shrink_to_fit()`: (C++11) 请求移除未使用的容量，使 `capacity()` 尽可能接近 `size()`。

#### 修改器 (Modifiers)

- `clear()`: 移除 `vector` 中的所有元素（`size()` 变为 0），但**不释放内存**（`capacity()` 保持不变）。

- `insert(pos, elem)`: 在迭代器 pos 指向的位置之前插入一个元素 `elem`。返回一个指向新插入元素的迭代器。也可以插入多个相同元素或一个范围。

  ```cpp
  vec.insert(vec.begin() + 1, 99); // 在第二个位置插入99
  vec.insert(vec.end(), 3, 88); // 在末尾插入3个88
  ```

- `erase(pos)`: 删除迭代器 pos 指向的元素。返回一个指向被删除元素之后元素的迭代器。也可以删除一个范围 `[first, last)`。

  ```cpp
  vec.erase(vec.begin()); // 删除第一个元素
  vec.erase(vec.begin() + 1, vec.end() - 1); // 删除除首尾外的所有元素
  ```

- `push_back(elem)`: 在 `vector` 的末尾添加一个元素的拷贝。如果容量不足，会自动重新分配。

  ```cpp
  vec.push_back(42);
  ```

- `pop_back()`: 移除 `vector`末尾的元素。注意，此操作不会返回被移除的元素值，也不会释放 `vector` 的容量。

  ```cpp
  if (!vec.empty()) {
      vec.pop_back(); // 安全起见，先判断是否为空
  }
  ```

- `emplace_back(args...)`: (C++11) 在 `vector` 末尾就地构造一个元素。相比 `push_back`，它避免了额外的拷贝或移动操作，性能更高，尤其是在处理复杂对象时。

  ```cpp
  struct Point { float x, y; Point(float x_, float y_) : x(x_), y(y_) {} };
  std::vector<Point> points;
  // points.push_back(Point(1.0f, 2.0f)); // 1. 构造临时对象 2. 移动/拷贝到vector
  points.emplace_back(1.0f, 2.0f);       // 1. 直接在vector内部构造Point对象
  ```

- `swap(other_vec)`: 与另一个同类型的 `vector` 交换内容。这是一个非常快的操作，因为它只交换了两个容器内部的指针和元数据，而不是逐个交换元素。

## 关联式容器

## 无序关联容器

## 容器适配器

## 算法