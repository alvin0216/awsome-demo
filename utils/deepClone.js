/**
 * 基本类型 null, undefined, string, boolean, number, symbol
 * 引用类型 object, function ...
 *
 * 对象的深拷贝
 *    {...obj}、Object.assign({}, obj) 浅拷贝
 *    JSON.parse(JSON.stringify(obj)) 深拷贝
 *        1. 他无法实现对函数 、RegExp等特殊对象的克隆
 *        2. 会抛弃对象的constructor,所有的构造函数会指向Object
 *        3. 对象有循环引用,会报错
 * */

/**
 * 判断属性的类型
 * @param {Object} obj - 判断的对象
 * @param {String} 是否为该类型
 * */
function isType(obj, type) {
  if (typeof obj !== 'object') return false
  const typeString = Object.prototype.toString.call(obj)
  let flag
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]'
      break
    case 'Date':
      flag = typeString === '[object Date]'
      break
    case 'RegExp':
      flag = typeString === '[object RegExp]'
      break
    default:
      flag = false
  }
  return flag
}

const getRegExp = re => {
  let flags = ''
  if (re.global) flags += 'g'
  if (re.ignoreCase) flags += 'i'
  if (re.multiline) flags += 'm'
  return flags
}

/**
 * @copyright https://juejin.im/post/5abb55ee6fb9a028e33b7e0a#heading-0
 * @desc 这个深克隆还不算完美,例如Buffer对象、Promise、Set、Map可能都需要我们做特殊处理
 * @param {Object} obj - 复制的对象
 * @return newObject
 * */
const deepClone = obj => {
  // 维护两个储存循环引用的数组
  const temp = []
  const children = []

  const _clone = obj => {
    if (obj === null) return null
    if (typeof obj !== 'object') return obj

    let child, proto

    if (isType(obj, 'Array')) {
      // 对数组做特殊处理
      child = []
    } else if (isType(obj, 'RegExp')) {
      // 对正则对象做特殊处理
      child = new RegExp(obj.source, getRegExp(obj))
      if (obj.lastIndex) child.lastIndex = obj.lastIndex
    } else if (isType(obj, 'Date')) {
      // 对Date对象做特殊处理
      child = new Date(obj.getTime())
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(obj)
      // 利用Object.create切断原型链
      child = Object.create(proto)
    }

    // 处理循环引用
    const index = temp.indexOf(obj)

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index]
    }
    temp.push(obj)
    children.push(child)

    for (let i in obj) {
      // 递归
      child[i] = _clone(obj[i])
    }

    return child
  }
  return _clone(obj)
}
