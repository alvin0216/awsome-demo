/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Context from './context'

const HashRouter = props => {
  const [location, setLocation] = useState({
    hash: '',
    pathname: window.location.hash.slice(1) || '/', // 删除 #
    search: '',
    state: undefined
  })

  useEffect(() => {
    window.location.hash = window.location.hash || '/' // 默认添加 hash

    // 监听 hash 值变化
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  function onHashChange() {
    setLocation({ ...location, pathname: window.location.hash.slice(1) || '/' })
  }

  const value = {
    location,
    history: {
      push(to) {
        window.location.hash = to
      }
    }
  }

  return (
    <Context.Provider value={value}>
      {/* */}
      {props.children}
    </Context.Provider>
  )
}

export default HashRouter
