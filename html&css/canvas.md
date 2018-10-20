[更好地阅读体验戳这里](https://gershonv.github.io/2018/08/03/canvas/)

## 基本用法
`<canvas>` 两个可选属性 `width` 默认300，`height` 默认150。可以使用`css`属性来设置宽高，但是如果宽高属性和初始比例不一致，就会出现扭曲。

```html
<style>
    #canvas{
        width: 600px;
        height: 300px;
        background: #ddd;
    }
</style>
```
**这种设置`canvas`宽高会让画布变得模糊**
**这种设置`canvas`宽高会让画布变得模糊**
**这种设置`canvas`宽高会让画布变得模糊**

`better`
```html
<canvas id="canvas" width="600" height="300"></canvas>
```

```html
<canvas id="canvas"></canvas>
<script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (canvas.getContext) {
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, 200, 200)
    }
</script>
```
`ctx` : 渲染上下文。绘制都靠他

## 绘制

### 绘制矩形 fillReact、clearRect、strokeRect 
3种绘制矩形的参数都一样，相对画布的 xy坐标以及绘制的宽高
- `fillRect(x, y, width, height)`: 绘制一个**填充**的矩形
- `strokeRect(x, y, width, height)`: 绘制一个矩形的**边框**
- `clearRect(x, y, width, height)`: 清除指定矩形区域，让清除部分完全透明
```js
<canvas id="canvas"></canvas>
<script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (canvas.getContext) {
        ctx.fillStyle = 'red'
        ctx.fillRect(25,25,200,200);
        ctx.clearRect(45,45,100,100);
        ctx.strokeRect(50,50,50,50);
    }
</script>
```
![image.png](https://upload-images.jianshu.io/upload_images/8677726-b6833054414cec15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 绘制线段 moveTo、lineTo、stoke

#### 基本使用
- `moveTo(x,y)`: 画笔移到Canvas画布中的某个位置 **（直线的起点）**
- `lineTo(x,y)`: 把画笔移到另一个点 **（直线的终点）**
- `stroke()`： 有了起点终点最后需要 `stroke` 方法才可以绘制线段

```js
ctx.moveTo(50, 50)
ctx.lineTo(150, 50)
ctx.stroke()
```
上面代码 花了一条横线。默认黑色

#### 线段粗细 lineWidth 
```js
 ctx.lineWidth = 10
ctx.moveTo(50, 50)
ctx.lineTo(150, 50)
ctx.stroke()
```

#### 线段颜色 strokeStyle
```js
ctx.strokeStyle = '#f00'
//...
```

`createLinearGradient` 渐变色 （略）

#### 绘制多条线段 beginPath closePath
```js
ctx.lineWidth = 10
ctx.strokeStyle = '#f36';
ctx.moveTo(50, 50)
ctx.lineTo(150, 50)
ctx.lineTo(150, 150)
ctx.stroke()
```
效果图
![image.png](https://upload-images.jianshu.io/upload_images/8677726-5b8f084c0979fc77.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```js
ctx.lineWidth = 10
ctx.strokeStyle = '#f36';
ctx.beginPath();
ctx.moveTo(50, 50)
ctx.lineTo(150, 50)
ctx.lineTo(150, 150)
ctx.stroke()
ctx.closePath()
ctx.beginPath()
ctx.moveTo(200, 50)
ctx.lineTo(200, 150)
ctx.stroke()
ctx.closePath()
```

效果图 
![image.png](https://upload-images.jianshu.io/upload_images/8677726-472e46782a9ffeed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### fill 通过填充路径的内容区域生成实心的图形
`stroke` 绘制线段而`fill` 可以填充！
如下 可以画出个实心三角形
```js
ctx.beginPath();
ctx.moveTo(75,50);
ctx.lineTo(100,75);
ctx.lineTo(100,25);
ctx.fill();
```

[canvas api 网址](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)