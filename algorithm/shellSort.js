/**
 * @func shellSort - 希尔排序
 * @param {Array} arr - 数组
 * @param {Array} gap - 步长数组
 */
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