# CSS

## 选择器

### 元素选择器

```css
h1 {}
```

### 类选择器

```css
.类名 {}
```

### id选择器

```css
#id名 {}
```

### 通用选择器

```css
* {}
```

### 子元素选择器

```css
.father > .son {}
```

### 后代选择器

```css
.father 后代 {}
```

### 相邻兄弟选择器

```css
标签 + 相邻 {}
```

### 伪类选择器

```css
#id名:
```

### 伪元素选择器

```css
::after
```

## 盒子模型

盒子：页面中所有的元素(标签) ,都可以看做是一个盒子,由盒子将页面中的元素包含在一个矩形区域内,通过盒子的视角更方便的进行页面布局。

盒子模型组成：

- 内容区域(content) 

- 内边距区域(padding)

- 边框区域(border)

- 外边距区域(margin)。

标签布局：使用div和span标签。

```css
div {
    width: 200px;
    height: 100px;
    background-color: #05a5d2;
    padding: 20px 20px 20px 20px;/*上 右 下 左 顺时针*/
    border: 20px solid #6bd5d7;
    margin: 30px 30px 30px 30px;/*也可以是两个值：上下 左右 一个值：上下左右*/
}
```