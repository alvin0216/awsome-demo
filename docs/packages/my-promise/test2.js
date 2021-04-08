/**
 * 1. 测试 new Promise(executor).then() 方法
 * 2. 测试链式调用
 */
const Promise = require('./promise');

new Promise((resolve, reject) => {
  resolve('A');
}).then(
  (value) => {
    console.log('执行成功态回调，value:', value);
  },
  (error) => {
    console.log('执行拒绝态回调，error:', error);
  },
);

new Promise((resolve, reject) => {
  reject('B');
}).then(
  (value) => {
    console.log('执行成功态回调，value:', value);
  },
  (error) => {
    console.log('执行拒绝态回调，error:', error);
  },
);

new Promise((resolve, reject) => {
  resolve('C');
})
  .then()
  .then((value) => {
    console.log('链式调用测试，value:', value);
  });

/** 
  * ? 即使支持了 then 方法。执行顺序也是不对的。Promise.reslove 方法是一个微任务，需要在上一个宏任务执行完后才执行
  * * 代码：
   console.log(1)
   new Promise((resolve, reject) => {
     console.log(2)
     resolve('A')
   }).then(
     value => {
       console.log(4)
     }
   )
   console.log(3)
   * * 结果为 1 2 4 3
   * * 正确结果为：1 2 3 4
  * 
 */
