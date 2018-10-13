### 将之前做的 redux-todoList 改写

之前写的一个 demo - [redux-todoList](https://github.com/gershonv/redux-todoList)，由 redux 实现改为 context 实现

### src/contexts/ReminderContext.js

```jsx
import React, { Component } from 'react'
import { bake_cookie, read_cookie } from 'sfcookies'

export const ReminderContext = React.createContext()

export class ReminderProvider extends Component {
  state = {
    reminders: read_cookie('reminders') || []
  }

  addReminder = (text, dueDate) => {
    let reminders = []
    reminders = [...this.state.reminders, { id: Math.random(), text, dueDate }]
    this.setState({
      reminders: reminders
    })
    bake_cookie('reminders', reminders)
  }

  deleteReminder = id => {
    let reminders = []
    reminders = this.state.reminders.filter(reminder => reminder.id !== id)
    this.setState({
      reminders: reminders
    })
    bake_cookie('reminders', reminders)
  }

  clearReminders = () => {
    this.setState({
      reminders: []
    })
    bake_cookie('reminders', [])
  }

  render() {
    return (
      <ReminderContext.Provider
        value={{
          reminders: this.state.reminders,
          addReminder: this.addReminder,
          deleteReminder: this.deleteReminder,
          clearReminders: this.clearReminders
        }}
      >
        {this.props.children}
      </ReminderContext.Provider>
    )
  }
}
```

### src/index.js

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App.jsx'

import { ReminderContext, ReminderProvider } from './context/ReminderContext'

ReactDOM.render(
  <ReminderProvider>
    <ReminderContext.Consumer>
      {({ reminders, clearReminders, addReminder, deleteReminder }) => (
        <App {...{ reminders, clearReminders, addReminder, deleteReminder }} />
      )}
    </ReminderContext.Consumer>
  </ReminderProvider>,
  document.getElementById('root')
)
```

### src/components/App.jsx

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      dueDate: ''
    }
  }

  addReminder() {
    this.props.addReminder(this.state.text, this.state.dueDate)
  }

  deleteReminder(id) {
    this.props.deleteReminder(id)
  }

  clearReminders() {
    this.props.clearReminders()
  }

  renderReminders() {
    console.log(this.props)
    const { reminders } = this.props
    return (
      <ul className="list-group col-sm-8 mt-2">
        {reminders.map(reminder => {
          return (
            <li key={reminder.id} className="list-group-item">
              <div className="list-item">
                <div>{reminder.text}</div>
                <div>
                  <em>{moment(new Date(reminder.dueDate)).fromNow()}</em>
                </div>
              </div>
              <div
                className="list-item delete-button"
                onClick={() => this.deleteReminder(reminder.id)}
              />
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="title">Reminder Pro</div>

        <div className="form-inline">
          <div className="form-group mr-2">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="I have to..."
              onChange={event => this.setState({ text: event.target.value })}
            />
            <input
              type="datetime-local"
              className="form-control"
              onChange={event => this.setState({ dueDate: event.target.value })}
            />
          </div>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => this.addReminder()}
          >
            Add Reminder
          </button>
        </div>
        {this.renderReminders()}
        <div
          className="btn btn-danger mt-3"
          onClick={() => this.clearReminders()}
        >
          Clear Reminders
        </div>
      </div>
    )
  }
}

App.propTypes = {
  reminders: PropTypes.array.isRequired,
  addReminder: PropTypes.func.isRequired,
  deleteReminder: PropTypes.func.isRequired,
  clearReminders: PropTypes.func.isRequired
}

export default App
```
