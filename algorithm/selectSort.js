/**
 * @func selectSort
 * 选择排序是从数组的开头开始，将第一个元素和其他元素作比较，检查完所有的元素后，最小的放在第一个位置，接下来再开始从第二个元素开始，重复以上一直到最后。
 */

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

let arr = [2, 1, 34, 5, 6, 7]

selectSort(arr)

console.log(arr) // [ 1, 2, 5, 6, 7, 34 ]

// 比较过程

// i = 0 循环 5 次

// j = 0 arr[0] === arr[0] 此时 [2, 1, 34, 5, 6, 7]
// j = 1 arr[0] > arr[1] 交换 [1, 2, 34, 5, 6, 7]
// j = 2 arr[0] < arr[2]
// j = 3 arr[0] < arr[3]
// j = 4 arr[0] < arr[4]
// j = 5 arr[0] < arr[5]

// i = 1 (i + 1 , j + 1)

// j = 1 arr[1] === arr[1] 此时 [1, 2, 34, 5, 6, 7]
// j = 2 arr[1] < arr[2]
// j = 3 arr[1] < arr[3]
// j = 4 arr[1] < arr[4]
// j = 5 arr[1] < arr[5]

// i = 2 

// j = 2 arr[2] === arr[2] 此时 [1, 2, 34, 5, 6, 7]
// j = 3 arr[2] > arr[3] 交换 [1, 2, 5, 34, 6, 7]
// j = 4 arr[2] > arr[4] 交换 [1, 2, 5, 6, 34, 7]
// j = 5 arr[2] > arr[4] 交换 [1, 2, 5, 6, 7, 34]

// ...