## simpleDemo

```jsx
import React, { Component } from 'react'
import './App.css'

// 第一步，创建 context
const myContext = React.createContext()

// 第二步，创建 Provider Component
class MyProvider extends Component {
  state = {
    name: 'gershon',
    age: 22
  }

  render() {
    return (
      <myContext.Provider value={{ state: this.state }}>
        {this.props.children}
      </myContext.Provider>
    )
  }
}

const Family = props => {
  return (
    <div>
      <h1>Family</h1>
      <Person />
    </div>
  )
}

class Person extends Component {
  render() {
    return (
      <div>
        <h1>Person</h1>
        <myContext.Consumer>
          {({ state }) => <p>My age is {state.age}</p>}
        </myContext.Consumer>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>Hello App</p>
        <MyProvider>
          <Family />
        </MyProvider>
      </div>
    )
  }
}

export default App
```

## simpleDemo2

```jsx
import React, { Component } from 'react'
import { CDNFlagIcon } from 'react-flag-kit' // 插件，自行安装

// 创建全局 context
const ThemeContext = React.createContext()

const localMap = {
  'en-US': { locale: 'en-US', flag: 'US', content: 'Hello, World!' },
  'fr-FR': { locale: 'fr-FR', flag: 'FR', content: 'Bonjour le monde!' },
  'es-ES': { locale: 'es-ES', flag: 'ES', content: '¡Hola Mundo!' }
}

class LocaleSwitcher extends Component {
  state = localMap['en-US']

  render() {
    return (
      <ThemeContext.Provider
        value={{
          state: this.state,
          updateLocale: e => this.setState(localMap[e.target.value])
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

// 下拉框组件
const LocaleSelect = () => {
  return (
    <ThemeContext.Consumer>
      {context => (
        <select value={context.state.locale} onChange={context.updateLocale}>
          <option value="en-US">English</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
        </select>
      )}
    </ThemeContext.Consumer>
  )
}

//  显示国旗的组件
const LocaleFlag = () => {
  return (
    <ThemeContext.Consumer>
      {context => <CDNFlagIcon code={context.state.flag} size={256} />}
    </ThemeContext.Consumer>
  )
}

// 显示当前文本

const LocaleContent = () => {
  return (
    <ThemeContext.Consumer>
      {context => <h1>{context.state.content}</h1>}
    </ThemeContext.Consumer>
  )
}

class App extends Component {
  render() {
    return (
      <LocaleSwitcher>
        <LocaleSelect />
        <LocaleFlag />
        <LocaleContent />
      </LocaleSwitcher>
    )
  }
}

export default App
```

### react-todoList

使用 context 实现 todoList
