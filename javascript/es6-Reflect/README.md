## Reflect

`Reflect` 对象与 `Proxy` 对象一样，也是 ES6 为了操作对象而提供的新 API。 类比 ES5 中操作对象的方法 `Object.defineProperty(obj, name, desc)`

特点：

1. 将 `Object` 对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到 `Reflect` 对象上。现阶段，某些方法同时在 `Object` 和 `Reflect` 对象上部署，未来的新方法将只部署在 `Reflect` 对象上。也就是说，从 `Reflect` 对象上可以拿到语言内部的方法。

2. 修改某些 `Object` 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)`则会返回 false。

   ```js
   // 老写法
   try {
     Object.defineProperty(target, property, attributes)
     // success
   } catch (e) {
     // failure
   }

   // 新写法
   if (Reflect.defineProperty(target, property, attributes)) {
     // success
   } else {
     // failure
   }
   ```

3. 让 `Object` 操作都变成函数行为。某些 `Object` 操作是命令式，比如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, name)`和 `Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

   ```js
   // 老写法
   'assign' in Object // true

   // 新写法
   Reflect.has(Object, 'assign') // true
   ```

4. `Reflect` 对象的方法与 `Proxy` 对象的方法一一对应，只要是 `Proxy` 对象的方法，就能在 `Reflect` 对象上找到对应的方法。这就让 `Proxy` 对象可以方便地调用对应的 `Reflect` 方法，完成默认行为，作为修改行为的基础。也就是说，不管 `Proxy` 怎么修改默认行为，你总可以在 `Reflect` 上获取默认行为。

   ```js
   Proxy(target, {
     set: function(target, name, value, receiver) {
       var success = Reflect.set(target, name, value, receiver)
       if (success) {
         console.log('property ' + name + ' on ' + target + ' set to ' + value)
       }
       return success
     }
   })
   ```

   上面代码中，`Proxy` 方法拦截 `target` 对象的属性赋值行为。它采用 `Reflect.set` 方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

```js
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name)
    return Reflect.get(target, name)
  },
  deleteProperty(target, name) {
    console.log('delete' + name)
    return Reflect.deleteProperty(target, name)
  },
  has(target, name) {
    console.log('has' + name)
    return Reflect.has(target, name)
  }
})
```

上面代码中，每一个 `Proxy` 对象的拦截操作（`get、delete、has）`，内部都调用对应的 `Reflect` 方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志
有了 `Reflect` 对象以后，很多操作会更易读。

```js
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```

## 静态方法

### Reflect.get(target, name, receiver)

查找并返回 `target` 对象的 `name` 属性，如果没有该属性，则返回 `undefined`。

```js
let person = {
  name: 'guodada',
  get print() {
    return `welcome ${this.name}`
  }
}

console.log(person.name) // guodada

console.log(Reflect.get(person, 'name')) // guodada
console.log(Reflect.get(person, 'print')) // welcome guodada

let myReceiverObject = { name: 'tom' }

// 如果name属性部署了读取函数（getter），则读取函数的this绑定receiver。
console.log(Reflect.get(person, 'print', myReceiverObject)) // welcome tom
```

### Reflect.set(target, name, value, receiver)

`Reflect.set` 方法设置 `target` 对象的 `name` 属性等于 `value`。

```js
let person = {
  name: 'guodada',
  set bar(value) {
    return (this.name = value + ' is handsome')
  }
}

console.log(person.name) // guodada

Reflect.set(person, 'name', 'steven')
console.log(person.name) // steven

Reflect.set(person, 'bar', 'john')
console.log(person.name) // john  is handsome

let myReceiverObject = { name: 'tom' }

// 如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
Reflect.set(person, 'bar', 'xxx', myReceiverObject)
console.log(myReceiverObject.name) // xxx is handsome
```

### Reflect.has(obj, name)

`Reflect.has` 方法对应 `name in obj` 里面的 `in` 运算符。

```js
var myObject = { foo: 1 }

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

### Reflect.deleteProperty(obj, name)

`Reflect.deleteProperty` 方法等同于 `delete obj[name]`，用于删除对象的属性。

```js
const myObj = { foo: 'bar' }

// 旧写法
delete myObj.foo

// 新写法
Reflect.deleteProperty(myObj, 'foo') // return true/false
```

### Reflect.construct(target, args)

`Reflect.construct` 方法等同于 `new target(...args)`，这提供了一种不使用 new，来调用构造函数的方法。

```js
function Greeting(name) {
  this.name = name
}

// new 的写法
const instance = new Greeting('张三')

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三'])
```

### Reflect.getPrototypeOf(obj)

`Reflect.getPrototypeOf` 方法用于读取对象的 `__proto__` 属性，对应 ``Object.getPrototypeOf`(obj)`。

```js
const myObj = new FancyThing()

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype
```

`Reflect.getPrototypeOf` 和 `Object.getPrototypeOf` 的一个区别是，如果参数不是对象，`Object.getPrototypeOf` 会将这个参数转为对象，然后再运行，而 `Reflect.getPrototypeOf` 会报错。

```js
Object.getPrototypeOf(1) // Number {[[PrimitiveValue]]: 0}
Reflect.getPrototypeOf(1) // 报错
```

### Reflect.setPrototypeOf(obj, newProto)

`Reflect.setPrototypeOf` 方法用于设置目标对象的原型（`prototype`），对应 `Object.setPrototypeOf(obj, newProto)`方法。它返回一个布尔值，表示是否设置成功。

```js
const myObj = {}

// 旧写法
Object.setPrototypeOf(myObj, Array.prototype)

// 新写法
Reflect.setPrototypeOf(myObj, Array.prototype)

myObj.length // 0
```

### Reflect.apply(func, thisArg, args)

`Reflect.apply` 方法等同于 `Function.prototype.apply.call(func, thisArg, args)`，用于绑定 `this` 对象后执行给定函数。

一般来说，如果要绑定一个函数的 `this` 对象，可以这样写 `fn.apply(obj, args)`，但是如果函数定义了自己的 `apply` 方法，就只能写成 `Function.prototype.apply.call(fn, obj, args)`，采用 `Reflect` 对象可以简化这种操作。

```js
const ages = [11, 33, 12, 54, 18, 96]

// 旧写法
const youngest = Math.min.apply(Math, ages)
const oldest = Math.max.apply(Math, ages)
const type = Object.prototype.toString.call(youngest)

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages)
const oldest = Reflect.apply(Math.max, Math, ages)
const type = Reflect.apply(Object.prototype.toString, youngest, [])
```

### Reflect.defineProperty(target, propertyKey, attributes)

> `Reflect.defineProperty` 方法基本等同于 `Object.defineProperty`，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用 `Reflect.defineProperty` 代替它。

```js
function MyDate() {
  /*…*/
}

// 旧写法
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now()
})

// 新写法
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now()
})
```

这个方法可以与 `Proxy.defineProperty` 配合使用。

```js
const p = new Proxy(
  {},
  {
    defineProperty(target, prop, descriptor) {
      console.log(descriptor)
      return Reflect.defineProperty(target, prop, descriptor)
    }
  }
)

p.foo = 'bar'
// {value: "bar", writable: true, enumerable: true, configurable: true}

p.foo // "bar"
```

### Reflect.getOwnPropertyDescriptor(target, propertyKey)

> `Reflect.getOwnPropertyDescriptor` 基本等同于 `Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象，将来会替代掉后者。

```js
var myObject = {}
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false
})

// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden')

// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden')
```

### Reflect.isExtensible (target)

`Reflect.isExtensible` 方法对应 `Object.isExtensible`，返回一个布尔值，表示当前对象是否可扩展。

```js
const myObject = {}

// 旧写法
Object.isExtensible(myObject) // true

// 新写法
Reflect.isExtensible(myObject) // true
```

### Reflect.preventExtensions(target)

`Reflect.preventExtensions` 对应 `Object.preventExtensions` 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

```js
var myObject = {}

// 旧写法
Object.preventExtensions(myObject) // Object {}

// 新写法
Reflect.preventExtensions(myObject) // true
```

### Reflect.ownKeys (target)

`Reflect.ownKeys` 方法用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames` 与 `Object.getOwnPropertySymbols` 之和。

```js
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4
}

// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']

Object.getOwnPropertySymbols(myObject)
//[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```


