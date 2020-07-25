import React, { useContext } from 'react'
import Context from './context'
import { pathToRegexp } from 'path-to-regexp'

const Switch = props => {
  const { location } = useContext(Context)
  const pathname = location.pathname

  for (let i = 0; i < props.children.length; i++) {
    const child = props.children[i]
    const path = child.props.path || ''
    const reg = pathToRegexp(path, [], { end: false })

    if (reg.test(pathname)) {
      return child
    }
  }

  return null
}

export default Switch
