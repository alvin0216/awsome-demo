## useMemo - demo

```jsx
import React, { useState } from 'react'

function Text({ name, content }) {
  function changeName(name) {
    console.log('run changeName')
    return `${new Date().getTime()} ${name}`
  }
  const newName = changeName(name)
  return (
    <>
      <h4>name: {newName}</h4>
      <h4>content: {content}</h4>
    </>
  )
}

function App() {
  const [name, setName] = useState('名称1')
  const [content, setContent] = useState('内容1')

  return (
    <>
      <button onClick={() => setName(name === '名称1' ? '名称2' : '名称1')}>name</button>
      <button onClick={() => setContent(new Date().getTime())}>content</button>
      <Text name={name} content={content} />
    </>
  )
}

export default App
```

我们点击 `content` 发现更新 `content` 的同时， `Text` 组件中的 `name` 的 `changeName` 方法也发生了变更。 这是我们不希望出现的。

面我们使用 `useMemo` 进行优化, 优化之后的 `Text` 组件

```jsx
import React, { useState, useMemo } from 'react'

function Text({ name, content }) {
  function changeName(name) {
    console.log('run changeName')
    return `${new Date().getTime()} ${name}`
  }
  const newName = useMemo(() => changeName(name), [name])
  return (
    <>
      <h4>name: {newName}</h4>
      <h4>content: {content}</h4>
    </>
  )
}
```

这个时候我们点击 改变 `content` 值的按钮，发现 `changeName` 并没有被调用。但是点击改变 `name` 值按钮的时候，`changeName` 被调用了。

所以我们可以使用 `useMemo` 方法 避免无用方法的调用，当然一般我们 `changName` 里面可能会使用 `useState` 来改变 `state` 的值，那是不是就避免了组件的二次渲染。

达到了优化性能的目的
