# 百度前端学院学习：动态数据绑定（四）

 > [题目地址](http://ife.baidu.com/course/detail/id/22)
 > [源代码地址](https://github.com/q545244819/2017-ife/tree/master/Vue/%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%EF%BC%88%E5%9B%9B%EF%BC%89)

## 任务分析

这个任务主要是通过解析模板，替换中间出现的属性，例子：

```HTML
<div id="app">
    <p>姓名：{{user.name}}</p>
    <p>年龄：{{user.age}}</p>
</div>
```

替换后：

```HTML
<div id="app">
    <p>姓名：youngwind</p>
    <p>年龄：25</p>
</div>
```

## 实现 el 属性：

主要修改一些`constructor()`就可以了：

```JavaScript
constructor(json) {
  this.el = document.querySelector(json.el)
  ...
  this.originalTemplate = this.el.innerHTML
  this.html = ''

  this.each(json.data)
  ...
}
```

之前我们直接传入一个对象就是`data`，现在我们需要这样做：

```JavaScript
const app = new Observer({
  el: '#app',
  data: {
    user: {
      name: 'john',
      age: 19
    }
  }
})
```

## 解析 html 模板

解析 html 模板主要分两块，一个是解析模板，另外一个是用来替换数据。

`templateMatch()`模板的语法解析匹配：

```JavaScript
templateMatch(temp, data) {
  this.html = temp
  
  temp.match(/{{\w*(.\w*)*}}|{{\s\w*(.\w*)*\s}}/g).forEach(item => {
    const key = item.slice(2, item.length - 2).trim()
    
    this.templateReplace(key, data, item)
  })
  
  this.el.innerHTML = this.html
  this.html = ''
}
```

`templateReplace()`实际数据替换模板：

```JavaScript
templateReplace(key, data, template) {
  const index = key.indexOf('.')
  
  if (index > 0) {
    this.templateReplace(key.slice(index + 1), data[key.slice(0, index)], template)
  } else {
    console.log(template, data[key])
    this.html = this.html.replace(template, data[key]) 
  }
}
```

拆分成两个主要是为了解决深对象的问题，目前看过别的通过都是通过`eval()`并不是一个很好的方法。

最后修改一下`constructor()`和`setter`函数：

```JavaScript
constructor() {
  ...
  this.templateMatch(this.el.innerHTML, this.data)
  ...
}
```

```JavaScript
convert() {
  ...
  
  Object.defineProperty(this.setData || this.data, key, {
    ...
    set: function (newValue) {
      ....
      
      that.templateMatch(that.originalTemplate, that.data)
    }
  })
}
```