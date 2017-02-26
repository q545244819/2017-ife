const lis = document.querySelectorAll('li')
const btn = document.querySelector('button')
const classNames = []
let current = 0

lis.forEach(item => {
  classNames.push(item.className)
})

const move = () => {
  if (current === parseInt(classNames.length)) {
    current = 0
  } else {
    current += 1
  }
  
  const aClassNames = [...classNames]
  const arr = aClassNames.splice(current)
  const queue = [].concat(arr, aClassNames)
 
  queue.forEach((item, index) => {
    lis[index].className = item
  })
}

setInterval(() => {
  move()
}, 1000)