
[更好地阅读体验戳这里](https://gershonv.github.io/2018/07/11/css-flex/)

## Flex 基本概念
![](http://pbj98r3fm.bkt.clouddn.com/flex.jpg)

## Flex 容器相关属性
```css
.container{
    display: flex | inline-flex;       //可以有两种取值
}
```
> 需要注意的是：当时设置 flex 布局之后，子元素的 float、clear、vertical-align 的属性将会失效。
有下面六种属性可以设置在容器上，它们分别是：

> 1. `flex-direction`  
>    1. 功能：决定水平方向的排列方向 
>    2. 参数：row \| row-reverse \| column \| column-reverse
> 2. `flex-wrap`
>    1. 功能：决定容器内项目是否可以换行
>    2. 参数：nowrap \| wrap \| wrap-reverse
> 3. flex-flow
>    1. 功能：flex-direction、flex-wrap 的简写形式 ---&gt; 没什么卵用
>    2. 参数：&lt;flex-direction&gt; \| &lt;flex-wrap&gt;
> 4. `justify-content`
>    1. 功能：定义在水平方向的对齐方式
>    2. 参数：flex-start \| flex-end \| center \| space-between \| space-around
> 5. `align-items`
>    1. 功能：定义了容器内项目的对齐方式
>    2. 参数：stretch \| flex-start \| flex-end \| center \| baseline 
> 6. align-content
>    1. 功能：定义了多根轴线的对齐方式，如果项目只有一根轴线，则该属性将不起作用
>    2. 参数：stretch \| flex-start \| flex-end \| center \| space-between \| space-around

说明 ：参数首位为默认值 ；参数中含有 `reverse` 的表示反方向

### Justify-content
#### space-between 两端对齐
    两端对齐，项目之间的间隔相等，即剩余空间等分成间隙
![](http://pbj98r3fm.bkt.clouddn.com/space-between.png)
#### space-around 项目之间间隔相等
    每个项目两侧的间隔相等，所以项目之间的间隔比项目与边缘的间隔大一倍。
![](http://pbj98r3fm.bkt.clouddn.com/space-around.png)

### align-items
建立在主轴为水平方向时测试，即 flex-direction: row ( 默认值 )

#### stretch 默认值 占满整个容器的高度
    即如果项目未设置高度或者设为 auto，将占满整个容器的高度。
假设容器高度设置为 100px，而项目都没有设置高度的情况下，则项目的高度也为 100px。
![](http://pbj98r3fm.bkt.clouddn.com/align-items01.jpg)   

#### flex-start 交叉轴的起点对齐
假设容器高度设置为 100px，而项目分别为 20px, 40px, 60px, 80px, 100px, 则如下图显示
![](http://pbj98r3fm.bkt.clouddn.com/align-items02.jpg)  

#### flex-end 交叉轴的终点对齐
![](http://pbj98r3fm.bkt.clouddn.com/align-items03.jpg)

#### center 交叉轴的中点对齐
![](http://pbj98r3fm.bkt.clouddn.com/align-items04.jpg)

#### baseline 项目的第一行文字的基线对齐
![](http://pbj98r3fm.bkt.clouddn.com/align-items05.jpg)

## Flex 项目属性
> 1. order
>    1. 功能：定义项在容器中的排列顺序
>    2. 参数：Number 即数字
> 2. flex-basis
>    1. 参数: length | auto;
> 3. flex-grow
>    1. 功能：定义项目的放大比例   
>    2. 参数：Number
> 4. flex-shrink
>    1. 功能：定义了项目的缩小比例
>    2. 参数：Number
> 5. flex
>    1. 功能：flex-grow, flex-shrink 和 flex-basis的简写
>    2. none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
> 6. align-self
>    1. 功能：允许单个项目有与其他项目不一样的对齐方式
>    2. auto | flex-start | flex-end | center | baseline | stretch

### order 定义项目在容器中的排列顺序
定义项目在容器中的排列顺序，数值越小，排列越靠前，默认值为 0
在 HTML 结构中，虽然 -2，-1 的 item 排在后面，但是由于分别设置了 order，使之能够排到最前面。 

### flex-basis 算主轴是否有多余空间
定义了在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间
> 当主轴为水平方向的时候，当设置了 flex-basis，项目的宽度设置值会失效，flex-basis 需要跟 flex-grow 和 flex-shrink 配合使用才能发挥效果。

### flex-grow 定义项目的放大比例
默认值为 0，即如果存在剩余空间，也不放大 
![](http://pbj98r3fm.bkt.clouddn.com/flex-grow.jpg)

当所有的项目都以 flex-basis 的值进行排列后，仍有剩余空间，那么这时候 flex-grow 就会发挥作用了。 如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间。(如果有的话)

如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

当然如果当所有项目以 flex-basis 的值排列完后发现空间不够了，且 flex-wrap：nowrap 时，此时 flex-grow 则不起作用了，这时候就需要接下来的这个属性。

### flex-shrink 定义了项目的缩小比例
默认值: 1，即如果空间不足，该项目将缩小，负值对该属性无效。 
![](http://pbj98r3fm.bkt.clouddn.com/flex-shrink.jpg)

这里可以看出，虽然每个项目都设置了宽度为 50px，但是由于自身容器宽度只有 200px，这时候每个项目会被同比例进行缩小，因为默认值为 1。 同理可得：

如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。

如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小

### flex  flex-grow, flex-shrink 和 flex-basis的简写
flex 的默认值是以上三个属性值的组合。假设以上三个属性同样取默认值，则 flex 的默认值是 0 1 auto。同理，如下是等同的：
```css
.item {flex: 2333 3222 234px;}
.item {
    flex-grow: 2333;
    flex-shrink: 3222;
    flex-basis: 234px;
}
```

当 flex 取值为 none，则计算值为 0 0 auto，如下是等同的：
```css
.item {flex: none;}
.item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}
```

当 flex 取值为 auto，则计算值为 1 1 auto，如下是等同的：
```css
.item {flex: auto;}
.item {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
}
```

当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：
> flex:1相当于width:100%，就是撑开
```css
.item {flex: 1;}
.item {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}
```

### align-self: 允许单个项目有与其他项目不一样的对齐方式