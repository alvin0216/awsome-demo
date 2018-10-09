import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd'
import './main.less'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className='red'>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Button>Learn React</Button>
        </header>
      </div>
    );
  }
}

export default App;
