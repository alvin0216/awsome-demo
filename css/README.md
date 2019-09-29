## Behavior Skill

### 使用 attr()抓取 data-\*

- 要点：在标签上自定义属性 `data-\*`，通过 `attr()`获取其内容赋值到 `content` 上
- 提示框
- 代码: [在线演示](https://codepen.io/gershonv/pen/OJLqWap)

![](https://user-gold-cdn.xitu.io/2019/8/13/16c89a136baf3248?imageslim)

### 使用:valid 和:invalid 校验表单

- 要点：`<input>` 使用伪类`:valid` 和`:invalid` 配合 `pattern` 校验表单输入的内容
- 场景：表单校验
- 代码: [在线演示](https://codepen.io/gershonv/pen/LYPabog)

![](https://user-gold-cdn.xitu.io/2019/8/12/16c85a44b6e85d4d?imageslim)

### 使用 `pointer-events` 禁用事件触发

- 要点：通过 `pointer-events:none` 禁用事件触发(默认事件、冒泡事件、鼠标事件、键盘事件等)，相当于`<button>`的 `disabled`
- 场景：限时点击按钮(发送验证码倒计时)、事件冒泡禁用(多个元素重叠且自带事件、a 标签跳转)
- 代码: [在线演示](https://codepen.io/gershonv/pen/XWrGpGO)

![](https://user-gold-cdn.xitu.io/2019/8/13/16c89a4c194c9b0e?imageslim)

### 使用+或~美化选项框

- 要点：`<label>`使用`+`或`~`配合 `for` 绑定 `radio` 或 `checkbox` 的选择行为
- 场景：选项框美化、选中项增加选中样式
- 代码: [在线演示](https://codepen.io/gershonv/pen/oNvVWqy)

![](https://user-gold-cdn.xitu.io/2019/8/13/16c89a655ab953fb?imageslim)

### 使用 max-height 切换自动高度

- 要点：通过 `max-height` 定义收起的最小高度和展开的最大高度，设置两者间的过渡切换
- 场景：隐藏式子导航栏、悬浮式折叠面板
- 代码: [在线演示](https://codepen.io/gershonv/pen/PoYLgpK)

![](https://user-gold-cdn.xitu.io/2019/8/20/16cae04e03f3c6d1?imageslim)

### 使用 animation-delay 保留动画起始帧

- 要点：通过 `transform-delay` 或 `animation-delay`设置负值时延保留动画起始帧，让动画进入页面不用等待即可运行
- 场景：开场动画
- 代码: [在线演示](https://codepen.io/gershonv/pen/bGbZJrv)

![](https://user-gold-cdn.xitu.io/2019/8/19/16ca89d92e02edb5?imageslim)

## Color Skill

### 使用 color 改变边框颜色

- 要点：`border` 没有定义 `border-color` 时，设置 `color` 后，`border-color` 会被定义成 `color`
- 场景：开场动画
- 代码: [在线演示](https://codepen.io/gershonv/pen/bGbZJrv)

```css
.elem {
  border: 1px solid;
  color: #f66;
}
```

![](https://user-gold-cdn.xitu.io/2019/8/12/16c85d05f9f62ab3?imageslim)

### 使用 filter 将图片置灰

- 要点：通过 `filter:grayscale()`设置灰度模式来悼念某位去世的仁兄或悼念因灾难而去世的人们
- 场景：网站悼念
- 代码: [在线演示](https://codepen.io/gershonv/pen/ExYMJox)

![](https://user-gold-cdn.xitu.io/2019/8/19/16ca879fc82eb5b3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 使用::selection 改变文本选择颜色

- 要点：通过 `::selection` 根据主题颜色自定义文本选择颜色
- 场景：主题化
- 代码: [在线演示](https://codepen.io/gershonv/pen/QWLoPQZ)

![](https://user-gold-cdn.xitu.io/2019/8/19/16ca87447638b572?imageslim)

### 使用 linear-gradient 控制背景渐变

- 要点：通过 `linear-gradient` 设置背景渐变色并放大背景尺寸，添加背景移动效果
- 场景：主题化、彩虹背景墙
- 代码: [在线演示](https://codepen.io/gershonv/pen/jONJRzQ)

![](https://user-gold-cdn.xitu.io/2019/8/14/16c8fd7b7b15b4a5?imageslim)

### 使用 caret-color 改变光标颜色

- 要点：通过 `caret-color` 根据主题颜色自定义光标颜色
- 场景：主题化
- 代码: [在线演示](https://codepen.io/gershonv/pen/LYPabog)

![](https://user-gold-cdn.xitu.io/2019/8/13/16c89b102d09baf6?imageslim)

### 使用 :scrollbar 改变滚动条样式

- 要点：通过 `scrollbar` 的 `scrollbar-track` 和 `scrollbar-thumb` 等属性来自定义滚动条样式
- 场景：主题化、页面滚动
- 代码: [在线演示](https://codepen.io/gershonv/pen/zYObXJx)

![](https://user-gold-cdn.xitu.io/2019/8/16/16c98313e43098eb?imageslim)

## Component Skill

### 迭代计数器

- 要点：累加选项单位的计数器
- 场景：章节目录、选项计数器、加法计数器
- 代码: [在线演示](https://codepen.io/gershonv/pen/NWKJZmv)

![](https://user-gold-cdn.xitu.io/2019/8/13/16c89a88691d5586?imageslim)

### 下划线跟随导航栏

- 要点：下划线跟随鼠标移动的导航栏
- 场景：动态导航栏
- 代码: [在线演示](https://codepen.io/gershonv/pen/XWrGLvo)

![](https://user-gold-cdn.xitu.io/2019/8/15/16c93317e5c79625?imageslim)

### 气泡背景墙

- 要点：不间断冒出气泡的背景墙
- 场景：动态背景
- 代码: [在线演示](https://codepen.io/gershonv/pen/PoYLMop)

![](https://user-gold-cdn.xitu.io/2019/8/14/16c8f08d7c4537f9?imageslim)

### 动态边框

- 要点：鼠标悬浮时动态渐变显示的边框
- 场景：悬浮按钮、边框动画
- 代码: [在线演示](https://codepen.io/JowayYoung/pen/qBWZPvE)

![](https://user-gold-cdn.xitu.io/2019/8/15/16c9542d0050b2f2?imageslim)

## Figure Skill

### 使用 div 描绘各种图形

- 要点：`<div>`配合其伪元素(`::before`、`::after`)通过 `clip`、`transform` 等方式绘制各种图形
- 场景：各种图形容器
- 代码: [在线演示](https://css-tricks.com/the-shapes-of-css/)

### 使用 box-shadow 裁剪图像

- 要点：通过 `box-shadow` 模拟蒙层实现中间镂空
- 场景：图片裁剪、新手引导、背景镂空、投射定位
- 代码: [在线演示](https://codepen.io/JowayYoung/pen/zYONxRG)

![](https://user-gold-cdn.xitu.io/2019/8/22/16cb95deb1e5a956?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 参考

[灵活运用 CSS 开发技巧](https://juejin.im/post/5d4d0ec651882549594e7293)
