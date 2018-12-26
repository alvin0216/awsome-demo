## 各种排序实现

![](https://user-gold-cdn.xitu.io/2018/9/9/165bd6dedf755d33?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 冒泡排序

> 比较两个相邻的项，如果第一个大于第二个则交换他们的位置,元素项向上移动至正确的顺序，就好像气泡往上冒一样

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898b4742e?imageslim)

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
