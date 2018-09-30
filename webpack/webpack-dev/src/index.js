import './assets/style/color.css'
import '@/assets/style/index.less'

import tool from 'tool'
tool()

const arr = ['react', 'vue', 'js']

arr.map(d => {
  console.log(d)
})

var a = Object.assign({}, { name: 'gg' })

console.log(a)

if (module.hot) {
  module.hot.accept()
}