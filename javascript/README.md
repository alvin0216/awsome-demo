## String Skill

### 生成随机 ID

```js
const RandomId = len =>
  Math.random()
    .toString(36)
    .substr(3, len)
const id = RandomId(10)
// id => gkkshs67e3
```

### 操作 URL 查询参数

```js
const params = new URLSearchParams(location.search.replace(/\?/gi, '')) // location.search = "?name=young&sex=male"
params.has('young') // true
params.get('sex') // "male"
```

### 格式化金钱

```js
const ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const money = ThousandNum(20190214)
// money => "20,190,214"
```

### 生成随机 HEX 色值

```js
const RandomColor = () =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')
const color = RandomColor()
// color => "#f03665"
```

## Number Skill

### 取整

```js
const num1 = ~~1.69
const num2 = 1.69 | 0
const num3 = 1.69 >> 0
// num1 num2 num3 => 1 1 1
```

> 这个方法比较少见、维护性较差、了解即可，建议还是用

```js
Math.ceil(0.4) // 1 向上取整
Math.floor(0.6) // 0 向下取整
```

### 判断奇偶

```js
const OddEven = num => (!!(num & 1) ? 'odd' : 'even')
const num = OddEven(2)
// num => "even"
```

### 取最小最大值

```js
const arr = [0, 1, 2]
const min = Math.min(...arr)
const max = Math.max(...arr)
// min max => 0 2
```

### 生成范围随机数

```js
const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const num = RandomNum(1, 10)
```

## Boolean Skill

### 判断数据类型

> 可判断类型：undefined、null、string、number、boolean、array、object、symbol、date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap

```js
function DataType(tgt, type) {
  const dataType = Object.prototype.toString
    .call(tgt)
    .replace(/\[object /g, '')
    .replace(/\]/g, '')
    .toLowerCase()
  return type ? dataType === type : dataType
}
DataType('young') // "string"
DataType(20190214) // "number"
DataType(true) // "boolean"
DataType([], 'array') // true
DataType({}, 'array') // false
```

### 是否为空对象

```js
const obj = {}
const flag = DataType(obj, 'object') && !Object.keys(obj).length
// flag => true
```

### switch/case 使用区间

```js
const age = 26
switch (true) {
  case isNaN(age):
    console.log('not a number')
    break
  case age < 18:
    console.log('under age')
    break
  case age >= 18:
    console.log('adult')
    break
  default:
    console.log('please set your age')
    break
}
```

## Array Skill

### 混淆数组

```js
const arr = [0, 1, 2, 3, 4, 5].slice().sort(() => Math.random() - 0.5)
// arr => [3, 4, 0, 5, 1, 2]
```

### 过滤空值

> 空值：undefined、null、""、0、false、NaN

```js
const arr = [undefined, null, '', 0, false, NaN, 1, 2].filter(Boolean)
// arr => [1, 2]
```

## Function Skill

### 检测非空参数

```js
function IsRequired() {
  throw new Error('param is required')
}
function Func(name = IsRequired()) {
  console.log('I Love ' + name)
}
Func() // "param is required"
Func('You') // "I Love You"
```

## 参考

[灵活运用 JS 开发技巧](https://juejin.im/post/5cc7afdde51d456e671c7e48)
