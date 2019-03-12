> 以下整理给金三银四求职的小伙伴，同时也是为了巩固笔者所学的知识，希望对大家有所帮助，后面将会陆续整理出其他篇章 js 系列 、http 、react、vue、算法等...

本文主题

- 创建对象有几种方法
- 原型、构造函数、实例、原型链的关系
- instanceof 原理
- 实例题（考察）

## 创建对象的几种方法

```js
// 通过字面量
const obj1 = { name: 'guodada' }
const obj11 = new Object({ name: 'guodada' })

// 通过构造函数
function Pershon() {
  this.name = 'guodada'
}
const obj2 = new Pershon()

// Object.create
const obj3 = Object.create({ name: 'guodada' })
```

## 原型、构造函数、实例、原型链之间的关系

这里着重点讲原型、构造函数、实例、原型链，因为这也是面试常问、也是容易混淆的点。

### 构造函数 和 new 做了什么?

> 函数被 new 关键字调用时就是构造函数。

`new` 关键字的内部实现机制（举例说明）：

```js
function Person(name) {
  this.name = name
}

const person = new Person('guodada')
```

- 创建一个新对象, 他继承于 `Person.prototype` ；
- 构造函数 Person 被执行，相应的参数传入，同时上下文(this)会被指定为这个新的实例。
- 执行构造函数中的代码；
- 返回新对象

```js
var obj = {} // 创建一个空对象
obj.__proto__ = constructor.prototype //添加 __proto__ 属性，并指向构造函数的 prototype 属性。
constructor.call(this) // 绑定this
return obj
```

（建议看下去再回来看 new 操作符做了什么。。。）

### prototype

> 每一个函数都有一个 prototype 属性。这个属性指向函数的原型对象。

```js
Person.prototype // {constructor: Pershon(),__proto__: Object}
```

### `__proto__`

那么我们该怎么表示实例与实例原型 ?

> 每一个 JavaScript 对象(除了 null )都具有的一个属性，叫`__proto__`，这个属性会指向该对象的原型

```js
person.__proto__ === Person.prototype // true
```

### constructor

既然实例对象和构造函数都可以指向原型，那么原型是否有属性指向构造函数或者实例呢？

```js
Person.prototype.constructor === Person
```

总结一下构造函数、实例原型、和实例之间的关系

```js
Person.prototype // 构造函数['prototype'] 指向函数原型
person.__proto__ === Person.prototype // 实例['__proto__'] 指向函数原型
Person.prototype.constructor === Person // 函数原型['constructor'] 指向构造函数
```

![](https://user-gold-cdn.xitu.io/2019/3/12/169709f93bdb8f90?w=576&h=290&f=png&s=18265)

### 原型链

> 每一个实例都包含一个指向原型对象的 `__proto__` 指针，依赖这条关系，层层递进，就形成了实例与原型的链条。

```js
function Person() {}

Person.prototype.name = 'Kevin'

var person = new Person()

person.name = 'Daisy'
console.log(person.name) // Daisy

delete person.name
console.log(person.name) // Kevin
```

在这个例子中，我们给实例对象 `person` 添加了 `name` 属性，当我们打印 `person.name` 的时候，结果自然为 `Daisy`。

但是当我们删除了 `person` 的 `name` 属性时，读取 `person.name`，从 person 对象中找不到 name 属性就会从 `person` 的原型也就是 `person.__proto__` ，也就是 `Person.prototype` 中查找，幸运的是我们找到了 `name` 属性，结果为 `Kevin`。

> 原型的终点是 `null`，因为 `null` 没有 `proto` 属性。

关系图也可以更新为：

![](https://user-gold-cdn.xitu.io/2019/3/11/1696c26339404725?w=590&h=525&f=png&s=34702)

顺便还要说一下，图中由相互关联的原型组成的链状结构就是原型链，也就是蓝色的这条线。

## instanceof 原理

js 的基本类型有 `String`, `Undefined`, `Boolean`, `Number`, `Null`, `Symbol`, 我们一般可以通过 `typeof` 来判断值的类型

```js
typeof 1 === 'number'
typeof function() {} === 'function'
typeof null === 'object' // 注意！

// 判断引用类型
typeof {} === 'object'
typeof [] === 'object'
```

而引用类型的判断这是通过 `instanceof` ，用来判断实例是不是另一个对象的引用.

```js
person instanceof Person // true
```

原理就是: 实例['__proto__'] === 构造函数['prototype'], 但是值得注意的是 `instanceof` 会通过原型链继续往下找。

```js
person instanceof Object // true

person.__proto__ === Person.prototype // true
person.__proto__.constructor === Person // true
```

## 经典实例题如下

```js
function A() {
  B = function() {
    console.log(10)
  }
  return this
}

A.B = function() {
  console.log(20)
}

A.prototype.B = function() {
  console.log(30)
}

var B = function() {
  console.log(40)
}

function B() {
  console.log(50)
}

A.B()
B()
A().B()
B()
new A.B()
new A().B()
// 请在浏览器环境下运行
```

上述题目答案是多少呢，大家不妨试试。在看下去（ps 这题还涉及到了执行上下文的概念--考察了函数声明和函数表达式）

答案就在笔者之前写过的文章中 [通过一道面试题来学习原型/原型链-函数声明/函数表达式](https://juejin.im/post/5b50ac2ae51d45198905343f)

思考完揭晓答案

- `A.B()` => 在 A 原型对象上找到 `A.B = function() { console.log(20) }` answer 20
- `B()` => 同名的函数表达式和函数声明同时存在时 总是执行表达式 answer 40
- `A().B()` 
  - `A()` 执行函数 A ==> 1.变量 B 重新赋值函数 2.返回 this（window）
  - `.B()`执行全局下的 B 函数 已经被重新赋值 所以输出 10
- `B()` => 上面的代码执行过 A 函数了，此时全局下的 B 函数输出 10
- `new A.B()` => new 执行了 `A.B = function () {console.log(20)};`
- `new A().B()`
  - `new` 执行构造函数 A => `objA.__proto__ = A.prototype`
  - `.B()` 在 A 的原型对象中查找 B; `A.prototype` 指向函数的原型对象
  - `A.prototype.B = function () {console.log(30)}` 输出 30

```js
A.B() // 20
B() // 40
A().B() // 10
B() // 10
new A.B() // 20
new A().B() // 30
```

如有不对之处，请指出~
参考 [JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)