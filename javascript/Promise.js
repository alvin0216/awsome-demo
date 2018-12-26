/**
 * @desc 实现 promise - 简易版
 */
function MyPromise(executor) {
  let that = this
  that.status = 'pending' // Promise 当前状态
  that.data = undefined // Promise的值
  that.onResolvedCallback = [] // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面
  that.onRejectedCallback = [] // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

  function resolve(value) {
    if (that.status === 'pending') {
      that.status = 'resolved'
      that.data = value
      that.onResolvedCallback.map(handler => handler(value))
    }
  }

  function reject(reason) {
    if (that.status === 'pending') {
      that.status = 'rejected'
      that.data = reason
      that.onRejectedCallback.map(handler => handler(value))
    }
  }

  try {
    executor(resolve, reject) // 执行executor并传入相应的参数◊
  } catch (e) {
    reject(e)
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  let that = this
  let promise2
  // 值穿透
  onResolved = typeof onResolved === 'function' ? onResolved : function(v){ return v }
  onRejected = typeof onRejected === 'function' ? onRejected : function(r){ return r }

  if(that.status === 'resolved'){
    return promise2 = new MyPromise(function(resolve, reject){
      try{
        var x = onResolved(that.data)
        if(x instanceof MyPromise){ // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
          x.then(resolve, reject)
        }
        resolve(x) // 否则，以它的返回值做为promise2的结果 
      } catch(e) {
        reject(e) // 如果出错，以捕获到的错误做为promise2的结果
      }
    })
  }

  if(that.status === 'rejected'){
    return promise2 = new MyPromise(function(resolve, reject){
      try{
        var x = onRejected(that.data)
        if(x instanceof MyPromise){
          x.then(resolve, reject)
        }
      } catch(e) {
        reject(e)
      }
    })
  }

  if(that.status === 'pending'){
    return promise2 = new MyPromise(function(resolve, reject){
      self.onResolvedCallback.push(function(reason){
        try{
          var x = onResolved(that.data)
          if(x instanceof MyPromise){
            x.then(resolve, reject)
          }
        } catch(e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function(value){
        try{
          var x = onRejected(that.data)
          if(x instanceof MyPromise){
            x.then(resolve, reject)
          }
        } catch(e) {
          reject(e)
        }
      })
    })
  }
}

MyPromise.prototype.catch = function(onRejected){
  return this.then(null, onRejected)
}

// 以下是简单的测试样例：
new MyPromise(resolve => resolve(8)).then(value => {
  console.log(value)
})