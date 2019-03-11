> 以下整理给金三银四求职的小伙伴，同时也是为了巩固笔者所学的知识，希望对大家有所帮助，后面将会陆续整理出其他篇章 js 系列 、http 、算法等...

本文探讨下面试常谈问题之三栏布局，说到三栏布局，可能大家心中至少也可以想出 2-3 种答案，这些谷歌就一大堆解决方案的题目为什么还要拿出来谈谈呢？

注意，面试可能会由浅入深问下来，比如你能答出几种？ => 这几种方式的优缺点在哪？ => 最佳方案是哪个以及如何解决这些缺点...
这些可以考验到你是否背题亦或者真正掌握到这些知识点。

## 高度已知，实现三栏布局，左右 300px 中间自适应。

在实现前先重置一下默认的样式

```css
* {
  margin: 0;
  padding: 0;
}
.layout {
  margin-top: 20px;
}
.layout article div {
  min-height: 100px;
}
```

### 浮动布局解决方案

左右浮动，给宽度，这样就实现了，是不是很简单~但是也存在一些缺点，后边会讲到。

```html
<section class="layout float">
  <style>
    .layout.float .left {
      float: left;
      width: 300px;
      background: red;
    }
    .layout.float .right {
      float: right;
      width: 300px;
      background: blue;
    }
    .layout.float .center {
      background: yellow;
    }
  </style>
  <article class="left-right-center">
    <div class="left"></div>
    <div class="right"></div>
    <div class="center">
      <h1>浮动解决方案</h1>
      1. 这是三栏布局中间部分 2. 这是三栏布局中间部分
    </div>
  </article>
</section>
```

### 绝对定位布局解决方案

`left/center/right` 均给绝对定位，左右给 300px，中间设置 `left 300 right 300`，也同样实现这个布局~

```html
<!-- 绝对定位解决方案 -->
<section class="layout absoulute">
  <style>
    .layout.absoulute .left-center-right > div {
      position: absolute;
    }
    .layout.absoulute .left {
      left: 0;
      width: 300px;
      background: red;
    }
    .layout.absoulute .center {
      left: 300px;
      right: 300px;
      background: yellow;
    }
    .layout.absoulute .right {
      right: 0;
      width: 300px;
      background: blue;
    }
  </style>
  <article class="left-center-right">
    <div class="left"></div>
    <div class="center">
      <h1>绝对定位解决方案</h1>
      1. 这是三栏布局中间部分 2. 这是三栏布局中间部分
    </div>
    <div class="right"></div>
  </article>
</section>
```

### flex 布局解决方案

父级 box 给 display: flex , 左右宽 300， 中间 `flex : 1` ，flex 的灵活性也十分的好用 ~

```html
<section class="layout flexbox">
  <style>
    .layout.flexbox {
      margin-top: 140px;
    }
    .layout.flexbox .left-center-right {
      display: flex;
    }
    .layout.flexbox .left {
      width: 300px;
      background: red;
    }
    .layout.flexbox .center {
      flex: 1;
      background: yellow;
    }
    .layout.flexbox .right {
      width: 300px;
      background: blue;
    }
  </style>
  <article class="left-center-right">
    <div class="left"></div>
    <div class="center">
      <h1>flex 布局解决方案</h1>
      1. 这是三栏布局中间部分 2. 这是三栏布局中间部分
    </div>
    <div class="right"></div>
  </article>
</section>
```

### table 布局解决方案

父级 `display: table;` 左中右 `display: table-cell;`

```html
<section class="layout table">
  <style>
    .layout.table .left-center-right {
      width: 100%;
      display: table;
      height: 100px;
    }
    .layout.table .left-center-right > div {
      display: table-cell;
    }
    .layout.table .left {
      width: 300px;
      background: red;
    }
    .layout.table .center {
      background: yellow;
    }
    .layout.table .right {
      width: 300px;
      background: blue;
    }
  </style>
  <article class="left-center-right">
    <div class="left"></div>
    <div class="center">
      <h1>表格布局解决方案</h1>
      1. 这是三栏布局中间部分 2. 这是三栏布局中间部分
    </div>
    <div class="right"></div>
  </article>
</section>
```

### grid 布局解决方案

利用网格布局 ，父级 `display: grid; width: 100%; grid-template-columns: 300px auto 300px;`

```html
<section class="layout grid">
  <style>
    .layout.grid .left-center-right {
      display: grid;
      width: 100%;
      grid-template-rows: 100px;
      grid-template-columns: 300px auto 300px;
    }
    .layout.grid .left {
      background: red;
    }
    .layout.grid .center {
      background: yellow;
    }
    .layout.grid .right {
      background: blue;
    }
  </style>
  <article class="left-center-right">
    <div class="left"></div>
    <div class="center">
      <h1>grid布局解决方案</h1>
      1. 这是三栏布局中间部分 2. 这是三栏布局中间部分
    </div>
    <div class="right"></div>
  </article>
</section>
```

## 优缺点

上面我们给出 5 种解决方案，那么面试官怎么延伸这个问题呢？
如果把高度已知去掉，又该如何实现呢？那我们不止要考虑水平方向的，同时要考虑中间的高度问题。那我们刚写的五种方案，哪些可以适用，哪些又不能适用了呢
这五种方案的兼容性又如何，最优的解决方案又是哪个

1. float

- 缺点：在于脱离文档流，意味着它下面的子元素也必须脱离文档流，还需要清除浮动带来的影响，如果处理不好会带来很多问题，这是它本身的局限性
- 优点：兼容性很好，快捷，不容易出问题

2. absoulute
3. flex

- 缺点：兼容到 IE 8
- 在 float 、absoulute 出现之后出现的一种布局方式，为了解决两种布局方式的不足。flex 布局方案算是比较完美的一种，尤其是现在移动端基本都是使用 flex 布局

4. table

- 缺点：操作麻烦，对 seo 不友好 ，当某一个单元格高度超出的时候，那么其他单元格也会跟着调整高度，有时候我们场景是不允许的
- 优点：兼容性很好，当 flex 解决不了的话，可以尝试下用表格布局

5. grid
   - 新出的网格布局，通过 网格布局可以做很多事情，代码精简

当我们增加内容高度时会发生什么事情呢？

![](https://user-gold-cdn.xitu.io/2019/3/11/1696b342022b78a8?w=1916&h=942&f=png&s=173325)

很明显

- 浮动布局文字自动排版到左边了。（浮动的基本原理）
- 绝对定位撑开中间部分的布局，两边不变
- flex 、table 布局中内容撑开盒子的高度 - better
- grid 布局中内容中不撑开高度

关于浮动的问题有可以延伸出来，怎么解决内容向左排版的 bug 呢？创建 BFC ，那么 BFC 又是什么呢，具体我会在下一篇文章介绍。

页面布局的变通

- 三栏布局
  - 左右宽固定，中间自适应
  - 上下高固定，中间自适应
- 两栏布局
  - 左宽度固定，右自适应 或者相反
  - 上宽度固定，下自适应 或者相反

## 页面布局总结

- 语义化掌握到位
- 页面布局深刻理解
- CSS 基础知识扎实
- 代码书写规范

参考 https://www.bilibili.com/video/av31563161?p=3
