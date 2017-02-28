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
  }

  each(obj) {
  }

  convert(obj, key, value) {
  }
}