import React, { useContext } from 'react'
import Context from './context'

const Redirect = props => {
  const { history } = useContext(Context)
  history.push(props.to)
  return null
}

export default Redirect
