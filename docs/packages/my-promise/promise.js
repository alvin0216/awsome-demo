class MyPromise {
  constructor(executor) {
    // ! 类型校验 see test1
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
  }
}

module.exports = MyPromise;
