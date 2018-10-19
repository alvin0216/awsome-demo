import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as types from './types'
import axios from 'axios'
import { Button } from 'antd'

/**
 * @state store 中的state
 * @props 组件内接收的props 写了第二个参数props，那么当组件内props发生变化的时候，mapStateToProps也会被调用
 * @return Object
 * */
const mapStateToProps = (state, props) => {
  return {
    name: state.demo.name,
    jsonArray: state.demo.jsonArray,
    array: state.demo.array,
  }
}


@connect(mapStateToProps)
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (type) => {
    switch (type) {
      case 1:
        // 常规调用
        this.props.dispatch({
          type: types.UPDATE_NAME,
          payload: {
            name: '同步调用redux'
          }
        })
        break
      case 2:
        // 异步请求
        this.props.dispatch(
          dispatch => {
            return axios.get('https://randomuser.me/api/').then(
              res => {
                dispatch({
                  type: types.UPDATE_NAME,
                  payload: {
                    name: res.data.results[0].name.title
                  }
                })
              }
            )
          }
        )
        break
      case 3:
        // 改变json数组，通过普通方式
        this.props.dispatch({
          type: types.UPODATE_ARRAY,
          payload: {
            name: '这是需要被渲染的 name'
          }
        })
        break
      default:

    }
  }

  componentWillReceiveProps() {
    console.log('props change')
  }

  render() {
    const { name, jsonArray } = this.props
    return (
      <div>
        name: {name} <br/>
        jsonArray[0]['name'] : {jsonArray[0]['name']}<br/>
        <Button onClick={e => this.handleClick(1)}>常规调用</Button>
        <Button onClick={e => this.handleClick(2)}>异步调用</Button>
        <Button onClick={e => this.handleClick(3)}>改变json数组</Button>
      </div>
    )
  }
}

export default App
