class Observer {
  constructor(json) {
    this.data = {}
    
    this.each(json)
    
    return {
      data: this.data
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
    Object.defineProperty(this.data, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        console.log(`你访问了 ${key}`)
        
        return value
      },
      set: newValue => {
        console.log(`你设置了 ${key}，新的值为${newValue}`)
      }
    })
  }
}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science