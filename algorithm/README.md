## 各种排序实现

![](https://user-gold-cdn.xitu.io/2018/9/9/165bd6dedf755d33?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

时间复杂度: 第一遍找元素 O(n),第二遍找位置 O(n). n 即长度。

## 冒泡排序

> 比较两个相邻的项，如果第一个大于第二个则交换他们的位置,元素项向上移动至正确的顺序，就好像气泡往上冒一样

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898b4742e?imageslim)

1. 外层循环，从最大值开始递减，因为内层是两两比较，因此最外层当>=2 时即可停止；
2. 内层是两两比较，从 0 开始，比较 `j` 与 `j+1`，因此，临界条件是`j<i -1`

```js
function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
      }
    }
  }
}
```

## 选择排序

> 选择排序是从数组的开头开始，将第一个元素和其他元素作比较，检查完所有的元素后，最小的放在第一个位置，接下来再开始从第二个元素开始，重复以上一直到最后。

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc899fabfa0?imageslim)

1. 外层循环的 `i` 表示第几轮，`arr[i]`就表示当前轮次最靠前(小)的位置；
2. 内层从 `i` 开始，依次往后数，找到比开头小的，互换位置即可

```js
function selectSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = i; j < len; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}
```

## 插入排序

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898df137f?imageslim)

1. 首先将待排序的第一个记录作为一个有序段
2. 从第二个开始，到最后一个，依次和前面的有序段进行比较，确定插入位置

```js
function insertSort(arr) {
  //外循环从1开始，默认arr[0]是有序段
  for (let i = 1; i < arr.length; i++) {
    //j = i,将arr[j]依次插入有序段中
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      } else {
        break
      }
    }
  }
  return arr
}
```

## 快速排序

> important
> 快排是处理大数据最快的排序算法之一。它是一种分而治之的算法，通过递归的方式将数据依次分解为包含较小元素和较大元素的不同子序列。该算法不断重复这个步骤直至所有数据都是有序的。

简单说： 找到一个数作为参考，比这个数字大的放在数字左边，比它小的放在右边； 然后分别再对左边和右变的序列做相同的操作:

1. 选择一个基准元素，将列表分割成两个子序列；
2. 对列表重新排序，将所有小于基准值的元素放在基准值前面，所有大于基准值的元素放在基准值的后面；
3. 分别对较小元素的子序列和较大元素的子序列重复步骤1和2

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898c22284?imageslim)

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr
  let [left, right] = [[], []]
  let current = arr.splice(0, 1)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < current[0]) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(current, quickSort(right))
}

let arr = [2, 1, 34, 5, 6, 7]
console.log(quickSort(arr)) // [ 1, 2, 5, 6, 7, 34 ]
```

## 希尔排序

希尔排序是插入排序的改良算法，但是核心理念与插入算法又不同，它会先比较距离较远的元素，而非相邻的元素。文字太枯燥，还是看下面的动图吧：

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898c88c5f?imageslim)

在实现之前，先看下刚才插入排序怎么写的：

```js
function insertSort(arr) {
  //外循环从1开始，默认arr[0]是有序段
  for (let i = 1; i < arr.length; i++) {
    //j = i,将arr[j]依次插入有序段中
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      } else {
        break
      }
    }
  }
  return arr
}
```
现在，不同之处是在上面的基础上，让步长按照3、2、1来进行比较，相当于是三层循环和嵌套啦。

```js
function shellSort(arr, gap) {
  for (let i = 0; i < gap.length; i++) { //最外层循环，一次取不同的步长，步长需要预先给出
    let n = gap[i] //步长为n
    for (let j = i + n; j < arr.length; j++) { //接下类和插入排序一样，j循环依次取后面的数
      for (let k = j; k > 0; k -= n) {  //k循环进行比较，和直接插入的唯一区别是1变为了n       
        if (arr[k] < arr[k - n]) {
          [arr[k], arr[k - n]] = [arr[k - n], arr[k]]
          console.log(`当前序列为[${arr}] \n 交换了${arr[k]}和${arr[k - n]}`) //为了观察过程
        }
      }
    }
  }
  return arr
}

let arr = [2, 1, 34, 5, 6, 7]
console.log(shellSort(arr, [3, 2, 1])) // [ 1, 2, 5, 6, 7, 34 ]
```

## 参考自

- [前端笔试&面试爬坑系列---算法](https://juejin.im/post/5b72f0caf265da282809f3b5#heading-1)
