class Observer {
  constructor(json) {
    this.data = {}
    this.setData = null
    this.watchProperties = {}

    this.each(json)

    return {
      data: this.data,
      $watch: this.$watch.bind(this)
    }
  }

  each(obj) {
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        this.each(obj[key])
      } else {
        this.convert(key, obj[key])
      }
    })
  }

  convert(key, value) {
    const that = this
    let val = value

    Object.defineProperty(this.setData || this.data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        console.log(`你访问了 ${key}`)

        return val
      },
      set: function (newValue) {
        if (Object.prototype.toString.call(newValue) === '[object Object]') {
          that.setData = newValue
          that.each(newValue)
          that.setData = null
        }

        that.emit(key, newValue)

        console.log(`你设置了 ${key}，新的值为${newValue}`)

        val = newValue
      }
    })
  }

  $watch(name, fn) {
    this.watchProperties[name] = fn
  }

  emit(name, val) {
    if (this.watchProperties[name] && typeof this.watchProperties[name] === 'function') {
      this.watchProperties[name](val)
    }
  }
}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

app1.data.name = {
  lastName: 'liang',
  firstName: 'shaofeng'
};

app1.data.name.lastName;
// 这里还需要输出 '你访问了 lastName '
app1.data.name.firstName = 'lalala';
// 这里还需要输出 '你设置了firstName, 新的值为 lalala'

// 你需要实现 $watch 这个 API
app1.$watch('age', function (age) {
  console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'