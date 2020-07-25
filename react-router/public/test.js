let { pathToRegexp } = require('path-to-regexp')

let keys = []
let reg2 = pathToRegexp('/list/:type/:id', keys, { end: true })

let [url, ...values] = '/list/1/abc'.match(reg2)

console.log(values) // [ '1', 'abc' ]

const keyList = keys.map(item => item.name) // [ 'type', 'id' ]

// 采用 reduce
const params2 = keys.reduce((obj, item, idx) => {
  const key = item.name
  obj[key] = values[idx]
  return obj
}, {})

console.log('params2', params2) // params2 { type: '1', id: 'abc' }
