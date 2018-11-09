import React, { Component } from 'react'

export const TodoContext = React.createContext()

export class TodoProvider extends Component {
  state = {
    todoList: []
  }

  addTodo = text => {
    const todoList = [...this.state.todoList, { id: Math.random(), text }]
    this.setState({ todoList })
  }

  deleteTodo = id => {
    const todoList = this.state.todoList.filter(todo => todo.id !== id)
    this.setState({ todoList })
  }

  clearTodos = () => {
    this.setState({ todoList: [] })
  }

  render() {
    return (
      <TodoContext.Provider
        value={{
          todoList: this.state.todoList,
          addTodo: this.addTodo,
          deleteTodo: this.deleteTodo,
          clearTodos: this.clearTodos
        }}>
        {this.props.children}
      </TodoContext.Provider>
    )
  }
}
