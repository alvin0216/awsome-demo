const exec = require('child_process').exec

execute(
  `
    cd ${process.cwd()}
    git add .
    git commit -m 'updated at ${getCurrentDate()}'
    git push origin master
  `
)

function execute(cmd) {
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.error(error)
    } else {
      console.log('=================> push success')
    }
  })
}

function getCurrentDate(fmt = 'YYYY-MM-DD hh:mm:ss') {
  const date = new Date()
  let opt = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}
