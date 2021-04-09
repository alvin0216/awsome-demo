---
title: 实现 Promise A+
---

## 开始

```bash
yarn

## 本目录下
yarn test

## 或者使用 lerna
lerna run test --stream --scope my-promise
```

文档参阅

- [Promises/A+](https://promisesaplus.com/)
- [Promises/A+ 规范（译文）](https://www.ituring.com.cn/article/66566)

## 逐步实现 PromiseA+ 规范

请看 test 文件，结合 `commit` 记录查看每个步骤的代码实现过程。开发文件 [promise.js](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/promise.js)

- 第一步：[new Promise(executor) 参数 executor 校验](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test1.js)
- 第二步：[实现 then 方法，以及支持链式调用](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test2.js)
- 第三步：[实现 then 方法异步执行](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test3.js)
- 第四步：[解决在 executor 函数中异步 reslove， then 方法没有被调用](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test4.js)
- 第五步：[解决 onFulfilled 方法返回字符串，值却没有被传递到下一个 then 的 onFulfilled 当中](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test5.js)
- 第六步：[处理 onFulfilled 返回值 x 为 Promise 的情况](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test6.js)
- 第七步：[处理 onFulfilled/onRejected 返回值 x 类型不同情况的处理](https://github.com/alvin0216/awsome-demo/blob/master/docs/packages/my-promise/test7.js)

## Promise 解决过程

也即 x 的不同情况的处理

- x 与 promise 相等：`throw new TypeError('Chaining cycle detected for promise')`
- x 为 Promise
  - 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
  - 如果 x 处于执行态，用相同的值执行 promise
  - 如果 x 处于拒绝态，用相同的据因拒绝 promise
- 如果 x 为对象或者函数
  - 把 x.then 赋值给 then
  - 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
  - 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
    - 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
    - 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
    - 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    - 如果调用 then 方法抛出了异常 e
      - 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
      - 否则以 e 为据因拒绝 promise
    - 如果 then 不是函数，以 x 为参数执行 promise
- 如果 x 不为对象或者函数，以 x 为参数执行 promise

---

也就是说：`new Promise((reslove, reject) => { return x })` 中返回值的处理要通过 `resolvePromise(promise2, x, resolve, reject)` 去处理。

返回 `object` 或者 `function` 类型，判断是否有 `then` 属性, 这里很有很可能返回 promise, 那么要重新进入 `resolvePromise` 进行判断

## 源码

```js
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
            resolvePromise(promise2, x, resolve, reject);
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
            resolvePromise(promise2, x, resolve, reject);
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
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
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

// ? see test6+ 对 x 进行判断
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (promise2 === x) {
    throw new TypeError('Chaining cycle detected for promise');
  }

  // x 为 function / object
  if ((x && typeof x === 'object') || typeof x === 'function') {
    // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    let called = false;
    try {
      // 如果 then 是函数，将 x 作为函数的作用域 this 调用之
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          },
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

module.exports = MyPromise;
```
