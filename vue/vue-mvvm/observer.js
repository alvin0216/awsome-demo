class Observer {
    constructor(data) {
        this.observe(data)
    }

    observe(data) {
        // 要对这个数据将原有的属性改成 set 和 get 的形式
        if (!data || typeof data !== 'object') {
            return
        }
        // 将数据一一劫持
        Object.keys(data).forEach(key => {
            // 劫持
            this.defineReactive(data, key, data[key])
            this.observe(data[key]) //递归深度劫持
        })
    }

    defineReactive(obj, key, value) {
        let that = this;
        let dep = new Dep(); // 每个变化的数据 都会对应一个数组，这个数组存放所有更新的操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 取值时调用的方法
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) { // 当给data属性中设置的时候，更改属性的值
                if (newValue !== value) {
                    // 这里的this不是实例
                    that.observe(newValue) // 如果是对象继续劫持
                    value = newValue;
                    dep.notify(); //通知所有人更新了
                }
            }
        })
    }
}

class Dep {
    constructor() {
        // 订阅的数组
        this.subs = []
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
