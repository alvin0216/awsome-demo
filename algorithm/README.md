## 各种排序实现

![](https://user-gold-cdn.xitu.io/2018/9/9/165bd6dedf755d33?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

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
      console.log(arr[j], arr[j + 1])
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
