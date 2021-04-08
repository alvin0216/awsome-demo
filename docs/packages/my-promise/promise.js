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

    // 成功态回调
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    // 拒绝态回调
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
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
    if (this.status === FULFILLED) {
      //? then 方法为微任务，所以用 setTimeout 实现异步 see test2 test3
      setTimeout(() => {
        typeof onFulfilled === 'function' && onFulfilled(this.value);
      });
    }

    if (this.status === REJECTED) {
      //? then 方法为微任务，所以用 setTimeout 实现异步 see test2 test3
      setTimeout(() => {
        typeof onRejected === 'function' && onRejected(this.reason);
      });
    }

    return this;
  }
}

module.exports = MyPromise;
