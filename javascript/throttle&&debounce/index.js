// 函数节流 - 对于持续触发的事件，规定一个间隔时间（n秒），每隔一段只能执行一次

/**
 * @desc 节流函数的实现，常用于滚动、页面 resize， 鼠标移动等事件
 * @param {Function} handler - func
 * @param {Number} duration - 节流时间差, ms
 *
 * @example window.onscroll = throttle(func, 200)
 */
function throttle(handler, duration) {
  let lastTime = 0
  return function() {
    let context = this
    let nowTime = new Date().getTime()
    if (nowTime - lastTime >= duration) {
      handler.apply(context, arguments)
      lastTime = nowTime
    }
  }
}

// 函数调用n秒后才会执行，如果函数在n秒内被调用的话则函数不执行，重新计算执行时间

/**
 * @desc 防抖函数的实现，常用于输入框的输入检验等
 * @param {Function} handler - func
 * @param {Number} delay - 节流时间差, ms
 * 
 * @example oInput.onchange = debounce(func, 200)
 */
function debounce(handler, delay) {
  let timer = null
  return function() {
    let context = this
    clearTimeout(timer)
    timer = setTimeout(() => {
      handler.apply(context, arguments)
    }, delay)
  }
}
