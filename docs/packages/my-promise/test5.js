/**
 * 测试 onFulfilled 方法返回一个字符串后的结果
 */

const Promise = require('./promise');

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  });
})
  .then(
    (value) => {
      return 'then1 return string';
    },
    (reason) => {
      console.log('then1 reason', reason);
    },
  )
  .then(
    (value) => {
      console.log('then2 value', value);
    },
    (reason) => {
      console.log('then2 reason', reason);
    },
  );

// * 结果 then1 return string

/** 
  * ? 如果 onFulfilled 或 onRejected 返回值不为字符串而是 Promise 呢？
  * * 代码：
     new Promise((resolve, reject) => {
       setTimeout(() => {
         resolve('A')
       })
     })
       .then(
         value => {
           return new Promise(resolve => resolve('B'))
         },
         reason => {
           console.log('then1 reason', reason)
         }
       )
       .then(
         value => {
           console.log('then2 value', value)
         },
         reason => {
           console.log('then2 reason', reason)
         }
       )
   * * 结果 then2 value MyPromise { status: 'fulfilled',  value: 'B'...}
   * * 正确结果 then2 value B
   */
