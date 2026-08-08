# JavaScript

## 输出

```js
console.log()
```

## 变量

```js
let a = 10;
const PI = 3.14;
```

## 控制语句

```js
if(true){
    
}else if{
    
}else{
    
}
```

```js
for(let i=0;i<10;i++){
    
}
while(true){
}
```

## 函数

```js
function name(let a){
    return 0;
}
```

## 事件

|    事件     |     描述     |
| :---------: | :----------: |
|   onClick   |   点击事件   |
| onMouseOver |   鼠标进过   |
| onMouseOut  |   鼠标移出   |
|  onChange   | 文本内容改变 |
|  onSelect   |  文本框选中  |
|   onFocus   |   光标聚集   |
|   onBlur    |   移开光标   |

### 事件绑定

- HTML属性

```html
<button onclick="click_event()">
    按钮
</button>

<script>
function click_event(){
    alert("点击");
}
</script>
```

- DOM属性

- addEventListener方法

## DOM

### 获取元素的方法

```js
let element_id = document.getElementById('id');
let element_class = document.getElementsClassName('class');
let element_tag = document.getElementsByTagName('div');
```

### 修改元素

```js
element_id.innerHTML = '<a>修改后</a>';
element_id.innerText = '文本';
```

### 事件绑定

```js
let element_id = document.getElementById('id');
element_id.onclick = function(){
    alert("点击");
}

element_id.addEventListener('click',function(){
    
});
```

### 操纵元素

|      方法       |              描述              |
| :-------------: | :----------------------------: |
|   appendChild   |     把新节点添加到指定节点     |
|   removeChild   |           删除子节点           |
|  replaceChild   |           替换子节点           |
|  insertBefore   | 在指定的子节点前插入新的子节点 |
| createAttribute |          创建属性节点          |
|  createElement  |          创建元素节点          |
| createTextNode  |          创建文本节点          |
|  getAttribute   |        返回指定的属性值        |





