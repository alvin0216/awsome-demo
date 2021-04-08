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
   * 返回值
   *    then 方法必须返回一个 promise 对象。以支持链式调用
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
        onFulfilled(this.value);
      });
    }

    if (this.status === REJECTED) {
      //? then 方法为微任务，所以用 setTimeout 实现异步 see test2 test3
      setTimeout(() => {
        onRejected(this.reason);
      });
    }

    // ? 在  executor 函数中异步 reslove 就会有 this.status === PENDING  see test3 test4
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push((value) => {
        setTimeout(() => {
          onFulfilled(this.value);
        });
      });

      this.onRejectedCallbacks.push((reason) => {
        setTimeout(() => {
          onRejected(this.reason);
        });
      });
    }

    return this;
  }
}

module.exports = MyPromise;
