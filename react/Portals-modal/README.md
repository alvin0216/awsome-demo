## 相关链接

- [官网 - Portals](https://reactjs.org/docs/portals.html)
- [http://keycode.info/](http://keycode.info/)
- [portals 在线 demo](https://codesandbox.io/s/62rvxkonnw)

## 简述

> Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component

```jsx
ReactDOM.createPortal(child, container)
```

- **child** : The first argument (child) is any renderable React child，such as an element, string, or fragment
  - 即可渲染的 react 组件
- **container** : a DOM element

举个例子：你要创建的 `Modal` 、`Tooltip` 等等不需要挂载到 `<div id='root'></div>` 中。你可以添加一个`<div id='modal-root'></div>`, 使用 `ReactDOM.createPortal` 将需要渲染的 组件挂载到这个节点上
