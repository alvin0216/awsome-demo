## 前言
这是本人的学习的记录，因为最近在准备面试，很多情况下会被提问到：请简述 `mvvm` ?
一般情况下我可能这么答：`mvvm` 是视图和逻辑的一个分离，是`model view view-model` 的缩写，通过虚拟dom的方式实现双向数据绑定（我随便答得）

那么问题来了，你知道 `mvvm` 是怎么实现的？
回答: `mvvm` 主要通过 `Object` 的 `defineProperty` 属性，重写 `data` 的 `set` 和`get` 函数来实现。 ok，回答得60分，那么你知道具体实现过程么？想想看，就算他没问到而你答了出来是不是更好？前提下，一定要手撸一下简单的`mvvm`才会对它有印象~

话不多说，接下来是参考自张仁阳老师的教学视频而作，采用的是[ES6](http://es6.ruanyifeng.com/#docs/class)语法，其中也包含了我个人的理解，如果能帮助到您，我将十分高兴。如有错误之处，请各位大佬指正出来，不胜感激~~~

在实现之前，请先了解基本的`mvvm`的编译过程以及使用
- 编译的流程图
![](https://user-gold-cdn.xitu.io/2018/7/18/164ac9a02d21c8cb?w=700&h=374&f=jpeg&s=31670)

- 整体分析
![](https://user-gold-cdn.xitu.io/2018/7/18/164ac90097e68912?w=639&h=388&f=png&s=49631)

可以发现`new MVVM()`后的编译过程主体分为两个部分：

1. 一部分是模板的编译 `Compile`
    - 编译元素和文本，最终渲染到页面中
    - 其中标签中有模板指令的标签才执行编译 例如`<div>我很帅</div>` 不执行编译
2. 一部分是数据劫持 `Observer`
    - `Dep` 发布订阅，将所有需要通知变化的`data`添加到一个数组中
    - `Watcher` 如果数据发生改变，在`Object`的`defineProperty`的`set`函数中调用`Watcher`的`update`方法

#### 明确本文需要实现的目标
1. **实现模板编译的过程 完成`Vue`实例中的属性可以正确绑定在标签中，并且渲染在页面中**
   -  工作：指令的解析，正则替换`{{}}`
   -  将节点的内容`node.textContent`或者`input`的`value`编译出来
2. **完成数据的双向绑定**
   - 工作：通过`observe`类劫持数据变化
   - 添加发布与订阅：`Object.defineProperty` 在`get`钩子中`addSub`,`set`钩子中通知变化`dep.notify()`
   - `dep.notify()`调用的是`Watcher`的`update`方法，也就是说需要在`input`变化时调用更新
> 先明确我们的目标是：视图的渲染和双向的数据绑定以及通知变化！**步骤**：先从怎么使用Vue入手一步步解析，从入口类Vue到编译compile 目标【实现视图渲染】，在此之前还有observe对数据进行劫持后再调用视图的更新，watcher 类监听变化到最后通知所有视图的更新等等。

##  分解 Vue 实例
如何入手？首先从怎么使用`Vue`开始。让我们一步步解析`Vue`的使用：

```js
let vm = new Vue({
    el: '#app'
    data: {
        message: 'hello world'
    }
})
```
上面代码可以看出使用`Vue`,我们是先`new` 一个`Vue` 实例，传一个对象参数，包含 `el` 和 `data`。

ok，以上得到了信息，接下来让我们实现**目标1**：将`Vue`实例的`data`编译到页面中

## 实现 Complie 编译模板的过程
先看看页面的使用：`index.html`
```html
<div id="app">
    <input type="text" v-model="jsonText.text">
    <div>{{message}}</div>
    {{jsonText.text}}
</div>
<script src="./watcher.js"></script>
<script src="./observer.js"></script>
<script src="./compile.js"></script>
<script src="./vue.js"></script>
<script>
    let vm = new Vue({
        el: '#app',
        data: {
            message: 'gershonv',
            jsonText:{
                text: 'hello Vue'
            }
        }
    })
</script>
```

> 第一步当然是添加`Vue`类作为一个入口文件。

### vue 类-入口文件的添加
新建一个`vue.js`文件，其代码如下
构造函数中定义`$el`和`$data`，因为后面的编译要使用到

```js
class Vue {
    constructor(options) {
        this.$el = options.el; // 挂载
        this.$data = options.data;

        // 如果有要编译的模板就开始编译
        if (this.$el) {
            // 用数据和元素进行编译
            new Compile(this.$el, this)
        }
    }
}
```
- 这里暂时未添加数据劫持`obeserve`，实现目标1暂时未用到，后续再添加
- 编译需要 `el` 和相关数据，上面代码执行后会有编译，所以我们新建一个执行编译的类的文件

> 这里在入口文件`vue.js`中`new`了一个`Compile`实例，所以接下来新建`compile.js`

### Compile 类-模板编译的添加
`Compile` 需要做什么？
我们知道页面中操作`dom`会消耗性能，所以可以把`dom`移入内存处理：
1. 先把真实的 `dom` 移入到内存中 （在内存中操作`dom`速度比较快）
    - 怎么放在内存中？可以利用文档碎片 `fragment`
2. 编译 `compile(fragment){}`
    - 提取想要的元素节点和文本节点 `v-model` `{{}}`，然后进行相关操作。
3. 把编译好的`fragment`塞回页面里去
```js
class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {// 如果这个元素能获取到 我们才开始编译
            // 1.先把这些真实的DOM移入到内存中 fragment[文档碎片]
            let fragment = this.node2fragment(this.el)
            // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compile(fragment)
            // 3.编译好的fragment在塞回页面里去
            this.el.appendChild(fragment)
        }
    }

    /* 专门写一些辅助的方法 */
    isElementNode(node) { // 判断是否为元素及节点，用于递归遍历节点条件
        return node.nodeType === 1;
    }

    /* 核心方法 */
    node2fragment(el) { // 将el的内容全部放入内存中
        // 文档碎片
        let fragment = document.createDocumentFragment();
        while (el.firstChild) { // 移动DOM到文档碎片中
            fragment.appendChild(firstChild)
        }
        return fragment;
    }
    
    compile(fragment) {
    }
}
```
补充：将`el`中的内容移入文档碎片`fragment` 中是一个进出栈的过程。el 的子元素被移到`fragment`【出栈】后，`el` 下一个子元素会变成`firstChild`。

> 编译的过程就是把我们的数据渲染好，表现在视图中

#### 编译过程 compile(fragment)
- 第一步：获取元素的节点，提取其中的指令或者模板`{{}}`
    - 首先需要遍历节点，用到了**递归方法**，因为有节点嵌套的关系，`isElementNode` 代表是节点元素，也是递归的终止的判断条件。
- 第二步：分类编译指令的方法`compileElement` 和 编译文本`{{}}`的方法
    - `compileElement` 对`v-model`、`v-text`等指令的解析
    - `compileText` 编译文本节点 `{{}}`
```js
class Compile{
    // ...
    compile(fragment) {
        // 遍历节点 可能节点套着又一层节点 所以需要递归
        let childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                // 是元素节点 继续递归
                // 这里需要编译元素
                this.compileElement(node);
                this.compile(node)
            } else {
                // 文本节点
                // 这里需要编译文本
                this.compileText(node)
            }
        })
    }
}
```

##### compileElement && compileText
1. 取出元素的属性 `node.attributes` 先判断是否包含指令
2. 判断指令类型(`v-html v-text v-model...`) 调用不一样的数据更新方法
    - 这里提取了编译的工具对象 `CompileUtil`
    - 调用方法: `CompileUtil[type](node, this.vm, expr)`
        - `CompileUtil.类型(节点，实例，v-XX 绑定的属性值)`  

```js
class Compile{
    // ...
    
    // 判断是否是指令 ==> compileElement 中递归标签属性中使用
    isDirective(name) {
        return name.includes('v-')
    }
    
    compileElement(node) {
        // v-model 编译
        let attrs = node.attributes; // 取出当前节点的属性
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name;
            // 判断属性名是否包含 v-
            if (this.isDirective(attrName)) {
                // 取到对应的值，放到节点中
                let expr = attr.value;
                // v-model v-html v-text...
                let [, type] = attrName.split('-')
                CompileUtil[type](node, this.vm, expr);
            }
        })
    }
    compileText(node) {
        // 编译 {{}}
        let expr = node.textContent; //取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(expr)) {
            CompileUtil['text'](node, this.vm, expr)
        }
    }
    
    // compile(fragment){...}
}
CompileUtil = {
    getVal(vm, expr) { // 获取实例上对应的数据
        expr = expr.split('.'); // 处理 jsonText.text 的情况
        return expr.reduce((prev, next) => { 
            return prev[next] // 譬如 vm.$data.jsonText.text、vm.$data.message
        }, vm.$data)
    },
    getTextVal(vm, expr) { // 获取文本编译后的结果
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    text(node, vm, expr) { // 文本处理 参数 [节点, vm 实例, 指令的属性值]
        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm, expr)
        updateFn && updateFn(node, value)
    },
    model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}
```

到现在为止 就完成了数据的绑定，也就是说`new Vue` 实例中的 `data` 已经可以正确显示在页面中了，现在要解决的就是**如何实现双向绑定**

结合开篇的`vue`编译过程的图可以知道我们还少一个`observe` 数据劫持，`Dep`通知变化,添加`Watcher`监听变化, 以及最终重写`data`属性


## 实现双向绑定

### Observer 类-观察者的添加
1. 在`vue.js` 中劫持数据
```js
class Vue{
    //...
    if(this.$el){
       new Observer(this.$data); // 数据劫持
       new Compile(this.$el, this); // 用数据和元素进行编译
    }  
}
```
2. 新建 `observer.js` 文件

代码步骤：
- 构造器中添加直接进行 `observe`
  - 判断`data` 是否存在, 是否是个对象（new Vue 时可能不写`data`属性）
  - 将数据一一劫持，获取`data`中的`key`和`value`
```js
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
        let that = this
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 取值时调用的方法
                return value
            },
            set(newValue) { // 当给data属性中设置的时候，更改属性的值
                if (newValue !== value) {
                    // 这里的this不是实例
                    that.observe(newValue) // 如果是对象继续劫持
                    value = newValue
                }
            }
        })
    }
}
```
> 虽然有了`observer`，但是并未关联,以及通知变化。下面就添加`Watcher`类

### Watcher 类的添加
新建`watcher.js`文件
- 观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
- 

先回忆下`watch`的用法：`this.$watch(vm, 'a', function(){...})`
我们在添加发布订阅者时需要传入参数有: **vm实例，v-XX绑定的属性, cb回调函数**
（`getVal` 方法拷贝了之前 `CompileUtil` 的方法，其实可以提取出来的...）

```js
class Watcher {
    // 观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
    // this.$watch(vm, 'a', function(){...})
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;

        // 先获取下老的值
        this.value = this.get();
    }

    getVal(vm, expr) { // 获取实例上对应的数据
        expr = expr.split('.');
        return expr.reduce((prev, next) => { //vm.$data.a
            return prev[next]
        }, vm.$data)
    }

    get() {
        let value = this.getVal(this.vm, this.expr);
        return value
    }

    // 对外暴露的方法
    update(){
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value

        if(newValue !== oldValue){
            this.cb(newValue); // 对应 watch 的callback
        }
    }
}

```
`Watcher` 定义了但是还没有调用，模板编译的时候，需要调观察的时候观察一下
`Compile`
```js
class Compile{
    //...
}
CompileUtil = {
    //...
    text(node, vm, expr) { // 文本处理 参数 [节点, vm 实例, 指令的属性值]
        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm, expr)
        updateFn && updateFn(node, value)

        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], () => {
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })
    },
    //...
    model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // 这里应该加一个监控，数据变化了，应该调用watch 的callback
        new Watcher(vm, expr, (newValue) => {
            // 当值变化后会调用cb 将newValue传递过来（）
            updateFn && updateFn(node, this.getVal(vm, expr))
        });

        node.addEventListener('input', e => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue)
        })
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    
    //...
}
```
实现了监听后发现变化并没有通知到所有指令绑定的模板或是`{{}}`，所以我们需要`Dep` 监控、实例的发布订阅属性的一个类，我们可以添加到`observer.js`中

### Dep 类的添加
注意 第一次编译的时候不会调用`Watcher`，`dep.target`不存在,`new Watcher`的时候`target`才有值 
有点绕，看下面代码：
```js
class Watcher {
    constructor(vm, expr, cb) {
        //...
        this.value = this.get()
    }
    get(){
        Dep.target = this;
        let value = this.getVal(this.vm, this.expr);
        Dep.target = null;
        return value
    }
    //...
}

// compile.js
CompileUtil = {
    model(node, vm, expr) { // 输入框处理
        //...
        new Watcher(vm, expr, (newValue) => {
            // 当值变化后会调用cb 将newValue传递过来（）
            updateFn && updateFn(node, this.getVal(vm, expr))
        });
    }
}
```

```js
class Observer{
    //...
    defineReactive(obj, key, value){
        let that = this;
        let dep = new Dep(); // 每个变化的数据 都会对应一个数组，这个数组存放所有更新的操作
        Object.defineProperty(obj, key, {
            //...
            get(){
                Dep.target && dep.addSub(Dep.target)
                //...
            }
             set(newValue){
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
```

以上代码 就完成了**发布订阅者**模式,简单的实现。。也就是说双向绑定的目标2已经完成了

---
## 结语
板门弄斧了，本人无意哗众取宠，这只是一篇我的学习记录的文章。想分享出来，这样才有进步。
如果这篇文章帮助到您，我将十分高兴。有问题可以提`issue`，有错误之处也希望大家能提出来，非常感激。