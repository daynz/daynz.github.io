# Html

参考文档：[HTML:超文本标记语言 | MDN Web 中文网](https://web.nodejs.cn/en-us/docs/web/html/)

## 结构标签



## 文本标签

```html
<h1>1级标题</h1>
<h2>2级标题</h2>
<h3>3级标题</h3>
<h4>4级标题</h4>
<h5>5级标题</h5>
<h6>6级标题</h6>
<p>段落</p>
<p>文本样式：<b>加粗</b> <i>斜体</i> <u>下划线</u> <s>删除线</s></p>
<ul>
    <li>无序列表1</li>
    <li>无序列表2</li>
    <li>无序列表3</li>
</ul>

<ol>
    <li>有序列表1</li>
    <li>有序列表1</li>
    <li>有序列表1</li>
</ol>

<table>
    <tr>
        <th>列标题1</th>
        <th>列标题2</th>
        <th>列标题3</th>
    </tr>
    <tr>
        <td>元素1</td>
        <td>元素2</td>
        <td>元素3</td>
    </tr>
</table>
```

```html
<a href="#">超链接</a>
<img src="图片.png">
```

## 区块

### 块元素

```html
<div>
    块
</div>
```

### 行内元素

```html
<span>行内</span>
```

## 属性

### 适用于大多数元素

`class`：定义一个或多个类名（样式表中使用）

`id`：定义元素的唯一id（脚本文件中使用）

`style`：元素的行内样式

## 表单

### form

#### 属性

- action：表单提交的URL
- method：发送表单数据时使用的 HTTP 方法

### label

#### 属性

- for：标签绑定到哪个表单元素

### input

#### 属性

- type
  - button：按钮
  - text：文本
  - password：密码
  - radio：单选框
  - checkbox：复选框
  - submit：提交按钮
- name：元素名称，只有设置了 `name` 属性的表单元素才能在提交表单时传递它们的值
- placeholder：简短提示
- value：文本







