class Event {
  constructor() {
    this.events = {}
  }
  
  on(name, fn) {
    this.events[name] = fn
  }
  
  emit(name, ...args) {
    if (this.events[name] && typeof this.events[name] === 'function') {
      this.events[name].apply(this, args)
    }
  }
}

class Observer {
  constructor(data) {
    each(data)

    return { data }
  }

  each(obj) {
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key])) {
        this.each(obj[key])
      } else {
        this.convert(obj, key, obj[key])
      }
    })
  }

  convert(obj, key, value) {
    Object.defineProperty(obj, key, {
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

    obj[key] = value
  }
}