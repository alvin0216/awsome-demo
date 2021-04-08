/**
 * 测试 在 executor 函数中异步 reslove
 */

const Promise = require('./promise');

console.log(1);
new Promise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    resolve('A');
  });
}).then((value) => {
  console.log(4);
});
console.log(3);

// 1 2 3 4

/** 
  * ? 如果在 then 函数中 return string
  * * 代码:
  * 
   new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve('A')
     })
   })
     .then(
       value => {
         return 'then1 return string'
       },
       reason => {
         console.log('then1 reason', reason)
       }
     )
     .then(
       value => {
         console.log(value)
       },
       reason => {
         console.log('then2 reason', reason)
       }
     )
  * * 结果 A
  * * 正确结果 then1 return string
  * 
 */
