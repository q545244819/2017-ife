class Observer {
  constructor(json) {
    const data = {}

    Object.keys(json).forEach(key => {
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        writeable: true,
        get: function () {
          console.log(`你访问了 ${key}`)
        },
        set: newValue => [
          console.log(`你设置了 ${key}，新的值为${newValue}`)
        ]
      })

      data[key] = json[key]
    })

    return { data }
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