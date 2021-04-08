// Promise 有三种状态，只能改变一次。 注意在 then 链式调用的有重要的作用
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    // ? 类型校验 see test1
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }

    this.status = PENDING; // 当前状态
    this.value = undefined; // 终值
    this.reason = undefined; // 拒因

    this.onFulfilledCallbacks = []; // 成功态回调队列
    this.onRejectedCallbacks = []; //拒绝态回调队列

    // 成功态回调
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
      }
    };

    // 拒绝态回调
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e); // executor 失败也返回拒因
    }
  }

  /**
   * 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
   *
   * 参数说明
   *    如果 onFulfilled 不是函数，其必须被忽略
   *    如果 onRejected 不是函数，其必须被忽略
   *
   *    1. 如果 onFulfilled 或者 onRejected 抛出一个异常 e，则 promise2 必须拒绝执行，并返回拒因 e
   *    2. 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
   *    3. 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
   *
   * 返回值
   *    then 方法必须返回一个 promise 对象。以支持链式调用
   *
   * * onFulfilled 和 onRejected 如果有返回值 x
   * * x 为 Promise
   *   如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
   *   如果 x 处于执行态，用相同的值执行 promise
   *   如果 x 处于拒绝态，用相同的据因拒绝 promise
   *
   * * x 为对象或函数
   *
   */
  then(onFulfilled, onRejected) {
    // onFulfilled, onRejected 参数校验
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (value) {
        return value;
      };
    }

    if (typeof onRejected !== 'function') {
      onRejected = function (reason) {
        throw reason;
      };
    }

    // ? see test5
    let promise2 = new MyPromise((resolve, reject) => {
      /**
       ** promiseA+: onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用
       *    这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行
       *    且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行
       *
       * * so 这里用 setTimeout 异步执行了 then 方法
       * ? see test3
       */
      if (this.status === FULFILLED) {
        //? then 方法为微任务，所以用 setTimeout 实现异步 see test2 test3
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.status === REJECTED) {
        //? then 方法为微任务，所以用 setTimeout 实现异步 see test2 test3
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }

      // ? 在  executor 函数中异步 reslove 就会有 this.status === PENDING  see test3 test4
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}

module.exports = MyPromise;
