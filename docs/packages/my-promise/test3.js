/**
 * 测试 then 方法 在异步下执行
 */
const Promise = require('./promise');

console.log(1);
new Promise((resolve, reject) => {
  console.log(2);
  resolve('A');
}).then((value) => {
  console.log(4);
});
console.log(3);

/** 
  * ? 如果在 executor 函数中异步 reslove 呢？
  * * 代码：
   console.log(1)
   new Promise((resolve, reject) => {
     console.log(2)
     setTimeout(() => {
       resolve('A')
     })
   }).then(value => {
     console.log(4)
   })
   console.log(3)
   * * 结果为 1 2 3
   * * 正确结果为 1 2 3 4
 */
