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

// current [2] 
// left [1] right [34, 5, 6, 7]
// return [1].concat([2], quickSort([34, 5, 6, 7]))
// => [1, 2].concat(quickSort([34, 5, 6, 7])

// current [34]
// left [5, 6, 7] right []
// return quickSort([5, 6, 7]).concat([34], [])
// => [1, 2].concat(quickSort([5, 6, 7]), [34])

// current [5]
// left [] right [6, 7]
// return [].concat([5], quickSort([6, 7]))
// => [1, 2].concat([5], quickSort([6, 7], [34]))

// current [6]
// left [] right [7]
// return [].concat(6, 7)
// => [1, 2, 5].concat([6], [7], [34]))