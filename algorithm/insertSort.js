/**
 * 首先将待排序的第一个记录作为一个有序段
 * 从第二个开始，到最后一个，依次和前面的有序段进行比较，确定插入位置
 */
function insertSort(arr) {
  //外循环从1开始，默认arr[0]是有序段
  for (let i = 1; i < arr.length; i++) {
    //j = i,将arr[j]依次插入有序段中
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      } else {
        break
      }
    }
  }
  return arr
}

let arr = [2, 1, 34, 5, 6, 7]
insertSort(arr)

console.log(arr)

// i = 1 [2, 1, 34, 5, 6, 7]
// j = 1 arr[1] < arr[0] [1, 2, 34, 5, 6, 7]

// i = 2
// j = 2 arr[2] > arr[1]
// j = 1 arr[1] > arr[0]

// i = 3
// j = 3 arr[3] < arr[2] [1, 2, 5, 34, 6, 7]
// j = 2 arr[2] > arr[1]
// j = 1 arr[1] > arr[0]

// i = 4
// j = 4 arr[4] < arr[3] [1, 2, 5, 6, 34, 7]
// j = 3 arr[3] > arr[2]
// j = 2 arr[2] > arr[1]
// j = 1 arr[1] > arr[0]

// ...