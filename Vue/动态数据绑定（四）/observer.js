class Observer {
  constructor(json) {
    this.el = document.querySelector(json.el)
    this.data = {}
    this.setData = null
    this.watchProperties = {}
    this.originalTemplate = this.el.innerHTML
    this.html = ''

    this.each(json.data)
    this.templateMatch(this.el.innerHTML, this.data)

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
        
        that.templateMatch(that.originalTemplate, that.data)
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
  
  templateMatch(temp, data) {
    this.html = temp
    
    temp.match(/{{\w*(.\w*)*}}|{{\s\w*(.\w*)*\s}}/g).forEach(item => {
      const key = item.slice(2, item.length - 2).trim()
      
      this.templateReplace(key, data, item)
    })
    
    this.el.innerHTML = this.html
    this.html = ''
  }
  
  templateReplace(key, data, template) {
    const index = key.indexOf('.')
    
    if (index > 0) {
      this.templateReplace(key.slice(index + 1), data[key.slice(0, index)], template)
    } else {
      console.log(template, data[key])
      this.html = this.html.replace(template, data[key]) 
    }
  }
}