/**
 * @func bubbleSort - 冒泡排序
 * 比较两个相邻的项，如果第一个大于第二个则交换他们的位置,元素项向上移动至正确的顺序，就好像气泡往上冒一样
 */

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

let arr = [2, 1, 34, 5, 6, 7]
bubbleSort(arr)

console.log(arr) // [ 1, 2, 5, 6, 7, 34 ]

// 比较过程
// i = 0 循环 len - 1 - i === 5 次

// j = 0 2 > 1 交换 此时 [ 1, 2, 34, 5, 6, 7]
// j = 1 2 < 34 
// j = 2 34 > 5 交换 此时 [ 1, 2, 5, 34, 6, 7]
// j = 3 34 > 6 交换 此时 [ 1, 2, 5, 6, 34, 7]
// j = 4 34 > 7 交换 此时 [ 1, 2, 5, 6, 7, 34] 

// i = 1 循环 4 次

// j = 0 1 > 2
// j = 1 2 > 5
// j = 2 5 > 6
// j = 3 6 > 7

// 以此类推