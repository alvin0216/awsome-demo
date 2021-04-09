const MyPromise = require('./promise');

// 跑 promises-aplus-tests 验证是否符合 promise A+ 规范
MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
