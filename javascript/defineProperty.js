/**
 * Object.defineProperty(obj, prop, descriptor)
 * @desc 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
 *
 * @param {Object} obj - 要在其上定义属性的对象。
 * @param {String} prop - 要定义或修改的属性的名称.
 * @param {Object} descriptor - 将被定义或修改的属性描述符。
 */

/**
 * descriptor - 描述符 默认不可枚举、属性不可删除（修改）、属性值为 undefined、属性值不可被修改
 * @argument {Boolean} enumerable - 是否可枚举 @default false
 * @argument {Boolean} configurable - 属性描述符才能够被改变， true 时属性才可以被删除  @default false
 * @argument {*} value - 属性值 @default undefined
 * @argument {Boolean} writable - 属性是否可以被写 @default false
 *
 * @argument {Function} get - 当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象
 * @argument {Function} set - 当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
 */

let person = {}

// base
Object.defineProperty(person, 'name', {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 'guodada'
})

// get / set， 注意使用 get/set 的时候 descriptor 中同时存在 writable/value 时会报错
Object.defineProperty(person, 'score', {
  enumerable: true,
  configurable: true,
  get() {
    console.log('run get')
    return 20
  },
  set(newValue) {
    this.score = newValue
  }
})

console.log(person.score) // run get , 20
console.log(person) // { name: 'guodada', score: 20 }

// 下面的例子展示了如何实现一个自存档对象。 当设置temperature 属性时，archive 数组会获取日志条目。
function Archiver() {
  let [temperature, archive] = [null, []]
  Object.defineProperty(this, 'temperature', {
    get() {
      console.log('get')
      return temperature
    },
    set(value) {
      temperature = value
      archive.push({ val: temperature })
    }
  })
  this.getArchive = () => archive
}

let arc = new Archiver() 
arc.temperature  // get
arc.temperature = 11
arc.temperature = 13
arc.getArchive() // [{ val: 11 }, { val: 13 }]

// learn more from https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty