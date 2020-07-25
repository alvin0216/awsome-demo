import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom'

const Home = props => {
  console.log(props)
  return <h2>home</h2>
}
const User = () => <h2>user</h2>
const Profile = () => <h2>profile</h2>
const NotFound = () => <h2>NotFound</h2>
const List = props => <h2>List {JSON.stringify(props.match.params)}</h2>

const App = props => {
  return (
    <HashRouter>
      <nav>
        <Link to='/home'>home</Link> ---
        <Link to='/user'>user</Link> ---
        <Link to='/profile'>profile</Link> ---
        <Link to='/list/1/abc'>List</Link>
      </nav>
      <Switch>
        <Route path='/home/123' extract component={Home} />
        <Route path='/home' component={Home} />
        <Route path='/user' component={User} />
        <Route path='/profile' component={Profile} />
        <Route path='/list/:type/:id' component={List} />
        <Route path='/404' component={NotFound} />
        <Redirect to='/404' />
      </Switch>
    </HashRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
