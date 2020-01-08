/**
 * 详见： http://47.112.48.225:4001/javascript/debounce
 * immediate 是否立即执行
 *   立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。
 *      timeout = setTimeOut 这段时间内 timer 不为 undefined 所以 callnow = false 函数一直不执行
 *      计时器过了后 timeout 重新赋值为 null 此时 callnow = true 又可以重新执行 func 了
 */
function debounce(func, wait, immediate) {
  var timeout, result

  var debounced = function() {
    var context = this // 存储 this
    var args = arguments // 存储相应的 arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
