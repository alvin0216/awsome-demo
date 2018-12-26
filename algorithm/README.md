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
        ;[arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
      }
    }
  }
}
```

## 选择排序

