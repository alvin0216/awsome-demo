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