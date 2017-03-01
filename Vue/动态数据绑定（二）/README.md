# 百度前端学院学习：动态数据绑定（二）

 > [题目地址](http://ife.baidu.com/course/detail/id/20)
 > [源代码地址](https://github.com/q545244819/2017-ife/tree/master/Vue/%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%EF%BC%88%E4%BA%8C%EF%BC%89)


## 处理深度对象

题目有个要求是如果传入的对象是比较深的对象，也就是 value 可以能是另外一个新的对象，也是要给那个对象的属性加上 getter 和 setter 的，我的做法就是判断每一个值是否是对象，然后在做一次递归处理。

```JavaScript
each(obj) {
  Object.keys(obj).forEach(key => {
    // 如果值是一个对象的话
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      // 递归自身
      this.each(obj[key])
    } else {
      this.convert(key, obj[key])
    }
  })
}
```

这里用了`Object.prototype.toString.call()`来判断值是什么类型，因为使用`typeof`的话，object、array 和 null 都会返回 object，不是我想要的结果。

## 实现 $watch

题目还有另外一个要求就是实现`$watch`的功能，用过 Vue 的同学都知道，我们可以用这个函数去监听一个值的变化，并且传入一个回调函数，如果值发生变话的话，就执行回调函数。

在`constructor`中添加一个用来存储回调函数的变量：

```JavaScript
...
this.watchProperties = {}
...
```

实现`$watch`和`emit`函数：

存储 watch 的回调函数做法我是用一个对象去处理的，key 为属性名，value 则是回调函数。

```JavaScript
$watch(name, fn) {
  this.watchProperties[name] = fn
}

emit(name, val) {
  if (this.watchProperties[name] && typeof this.watchProperties[name] === 'function') {
    this.watchProperties[name](val)
  }
}
```

在`convert`中添加：

```JavaScript
convert(key, value) {
    ...
    Object.defineProperty(this.setData || this.data, key, {
      ...
      set: function (newValue) {
        ...
        // 调用 emit 执行 watchProperties 里的回调函数
        // key 为属性名
        // newValue 为新设置的值
        that.emit(key, newValue)
        ...
      }
    })
  }
```

最后一步，暴露`$watch`方法：

```JavaScript
constructor(json) {
    ...
    return {
      ...
      // 这里要注意，修改一下上下文的环境
      $watch: this.$watch.bind(this)
    }
  }
```

这里需要使用`bind`去修改执行的时候上下的环境，否则无法访问`watchProperties`。

## 还没完成的功能

 - `$watch`函数不能够监听比较深的对象的属性。
 - 新建一个示例的时候，如果传入一个深对象，会被打平：
  ```JavaScript
  let app = new Observer({
    name: {
      a: 1,
      b: 2
    }
  })

  console.log(app.data)
  // 会输出
  /*
    [object Object] {
      a: 1,
      b: 2
    }
  */
  ```