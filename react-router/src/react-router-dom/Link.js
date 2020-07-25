import React, { useEffect, useState } from 'react'
import Context from './context'

const Link = props => {
  const { to } = props

  return (
    <Context.Consumer>
      {state => {
        return <a onClick={e => state.history.push(to)}>{props.children}</a>
      }}
    </Context.Consumer>
  )
}

export default Link
