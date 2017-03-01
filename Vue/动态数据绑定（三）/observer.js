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

  each(obj, parents = []) {
    Object.keys(obj).forEach(key => {
      this.convert(key, obj[key], parents)
    })
  }

  convert(key, value, parents) {
    const that = this
    
    if (Object.prototype.toString.call(value) === '[object Object]') {
      that.setData = value
      that.each(value, [...parents, key])
      that.setData = null
    }
    
    let val = value
    
    if (parents.length && !this.setData) {
      return
    }
    
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
        
        parents.forEach(item => {
          that.emit(item, that.data[item])
        })
        
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

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。