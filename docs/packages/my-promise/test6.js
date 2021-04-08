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
        reslove(2);
      });
    },
    (reason) => {},
  )
  .then(
    (value) => {
      console.log(value);
    },
    (reason) => {},
  );

// * 答案 2
