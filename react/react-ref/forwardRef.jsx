import React, { Component } from 'react'

const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

class App extends Component {
  componentDidMount = () => {
    console.log(this.$inputRef) // <button class="FancyButton">click</button>
    this.$inputRef.focus()
  }
  
  render() {
    return <FancyButton ref={el => this.$inputRef = el}>click</FancyButton>
  }
}

export default App
