# 百度前端学院学习：动态数据绑定（二）

 > [题目地址](http://ife.baidu.com/course/detail/id/21)
 > [源代码地址](https://github.com/q545244819/2017-ife/tree/master/Vue/%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%EF%BC%88%E4%B8%89%EF%BC%89)

## 处理上个任务的问题

上个任务抛出了两个问题，一个是在初始化一个实例的时候如果传一个比较深的对象会被打平。把`each`和`convert`做出了一些修改：

`each()`：

```JavaScript
each(obj, parents = []) {
  Object.keys(obj).forEach(key => {
    this.convert(key, obj[key], parents)
  })
}
```

`convert()`：

```JavaScript
convert(key, value, parents) {
  ...

  // 判断传入的 value 是否一个对象
  // 如果是一个对象的话，就在调用 each 函数
  if (Object.prototype.toString.call(value) === '[object Object]') {
    that.setData = value
    that.each(value, [...parents, key])
    that.setData = null
  }

  ...
}
```

上面代码多了一个`parents`，这个是用来实现这个任务的功能，也就是事件冒泡而用的。

## 实现深层次数据变化如何逐层往上传播

学习过 dom 的同学都知道，给一个元素绑定一个事件，这个元素的子元素触发这个事件，也会同样会触发它的所有父元素同样的事件。

上面用`parents`来存储比较深的对象，每个对象的父的 key 值，在 setter 函数里面同样做出一些修改：

```JavaScript
...
Object.defineProperty(this.setData || this.data, key, {
  set: function (newValue) {
    ...

    // parents 存的是上一级 key
    // 循环 parents 实现逐层往上传播
    parents.forEach(item => {
      that.emit(item, that.data[item])
    })
    
    ...
  }
})
...
```

## 另外一个问题

实现了深层次数据变化如何逐层往上传播的功能后，发现一个问题。如果出事传入一个这样的对象：

```JavaScript
let app = new Observer({
  name: {
    a: 1,
    b: {
      c: 2 
    }
  }
})
```

试着输出`app.data`的值发现：

```JSON
{
  b: {
    c: 2
  },
  name: {
    a: 1,
    b: {
      c: 2 
    }
  }
}
```

因为我们在`convert()`函数里面实现深度对象处理有一些问题，只需要在添加一个判断就可以了：

```JavaScript
convert(key, value, parents) {
  ...

  // parents 里有上级的 key 值，但是 setData 为 null 则直接跳出函数
  if (parents.length && !this.setData) {
    return
  }

  ...
}
```