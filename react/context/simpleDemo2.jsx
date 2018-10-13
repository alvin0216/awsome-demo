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
