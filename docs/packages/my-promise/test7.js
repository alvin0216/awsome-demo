/**
 * 测试 返回值 x 为 Promise 时值需要的操作
 */
const Promise = require('./promise');

new Promise((resolve, reject) => {
  resolve(1);
})
  .then(
    (value) => {
      return new Promise((reslove) => {
        reslove(
          new Promise((resolve, reject) => {
            reslove(2);
          }),
        );
      });
    },
    (reason) => {},
  )
  .then(
    (value) => {
      console.log(value);
    },
    (reason) => {},
  )
  .then((value) => {
    console.log('then2 value', value);
  });

// 2
// then2 value undefined
