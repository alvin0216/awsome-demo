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
