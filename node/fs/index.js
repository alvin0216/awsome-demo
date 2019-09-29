// 脚本
const fs = require('fs')

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.includes('js'))
  .forEach(file => {
    require(`./${file}`)
  })
