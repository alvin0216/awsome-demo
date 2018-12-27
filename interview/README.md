## JS 实践题

### 判断回文数

利用数组反序号

```js
function isPalindrome(str) {
  return str.split('').reverse().join('') === str
}
```

###  传入10  求出10里面（不包括10） 3 5 倍数相加之和 例如 3 6 9 5（3的倍数）（5的倍数）

```js
function func1(num) {
  let result = 0
  for (let i = 1; i < num; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      result += i
    }
  }
  return result
}

// better 减少循环次数
function func2(num) {
  let result = 0
  for (let i = 1; i * 3 < num; i++) {
    if (i * 5 < num) result += i * 5
    result += i * 3
  }
  return result
} 
```

### AaBcDE => A-Aa-Bbb-Cccc-Ddddd-Eeeeee

```js
let str = 'AaBcDE'

function func(str) {
  return str
    .split('')
    .map((en, i) => `${en.toUpperCase()}${en.toLowerCase().repeat(i)}`)
    .join('-')
}

// es7
function func2(str) {
  return str
    .split('')
    .map((en, i) => en.toUpperCase().padEnd(i + 1, en.toLowerCase()))
    .join('-')
}

func(str) // A-Aa-Bbb-Cccc-Ddddd-Eeeeee
func2(str) // A-Aa-Bbb-Cccc-Ddddd-Eeeeee
```

### 提取 get 请求参数

有这样一个URL：`http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e`，请写一段JS程序提取URL中的各个GET参数(参数名和参数个数不确定)，将其按key-value形式返回到一个json结构中，
如 `{a:'1', b:'2', c:'', d:'xxx', e:undefined}`。

```js
let url = 'http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e'

function getParams(url) {
  let params = {}
  const paramsStr = url.replace(/\.*?/, '') // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach(v => {
    d = v.split('=')
    params[d[0]] = d[1]
  })
  return params
}
console.log(getParams(url)) // `{a: '1', b: '2', c: '', d: 'xxx', e: undefined}
```

### 实现数组扁平化

```js
let arr = [[1, 2], [2, 3, [4]], 3]

arr.flat(2) // es7 [ 1, 2, 2, 3, 4, 3 ]

const flat = arr => arr.toString().split(',').map(item => +item)
flat(arr) // [ 1, 2, 2, 3, 4, 3 ] 缺点 string/number 类型的区分

function flat2(arr) {
  let result = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      result = result.concat(flat2(item))
    } else {
      result.push(item)
    }
  })
  return result
}

console.log(flat2(arr)) //  通过递归实现 [1, 2, 2, 3, 4, 3 ] 
```

### 爬楼梯问题

有一楼梯共 M 级，刚开始时你在第一级，若每次只能跨上一级或二级，要走上第 M 级，共有多少种走法？

分析： 这个问题要倒过来看，要到达n级楼梯，只有两种方式，从（n-1）级 或 （n-2）级到达的。所以可以用递推的思想去想这题，假设有一个数组s[n], 那么s[1] = 1（由于一开始就在第一级，只有一种方法）， s[2] = 1（只能从s[1]上去 没有其他方法）。

```js
function cStairs(n) {
  if (n === 1 || n === 2) {
    return 1
  } else {
    return cStairs(n - 1) + cStairs(n - 2)
  }
}

console.log(cStairs(6)) // 8 其实就是斐波纳契数列问题
```