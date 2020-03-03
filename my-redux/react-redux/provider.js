import React from 'react'
import PropTypes from 'prop-types'

export default class Provider extends React.Component {
  // 需要声明静态属性childContextTypes来指定context对象的属性,是context的固定写法
  static childContextTypes = {
    store: PropTypes.object
  }

  // 实现getChildContext方法,返回context对象,也是固定写法
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  // 渲染被Provider包裹的组件
  render() {
    return this.props.children
  }
}
