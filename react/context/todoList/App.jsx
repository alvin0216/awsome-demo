import React, { Component } from 'react'

import { TodoContext, TodoProvider } from './context/TodoContext'

class App extends Component {
  state = {
    text: ''
  }

  render() {
    const { todoList, addTodo, deleteTodo, clearTodos } = this.props
    const { text } = this.state
    return (
      <div>
        <h2>TodoList</h2>
        <div>
          <input
            type="text"
            placeholder="请输入内容"
            onChange={e => this.setState({ text: e.target.value })}
          />
          <button onClick={e => addTodo(text)}>AddTodo</button>
          <button onClick={clearTodos}>clearTodos</button>
        </div>
        <ul>
          {todoList.map(todo => (
            <li key={todo.id}>
              {todo.text}
              <button onClick={e => deleteTodo(todo.id)}>delete</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const Hoc = WrappedComponent =>
  class extends Component {
    render() {
      return (
        <TodoProvider>
          <TodoContext.Consumer>
            {ctx => <WrappedComponent {...ctx} />}
          </TodoContext.Consumer>
        </TodoProvider>
      )
    }
  }

export default Hoc(App)
