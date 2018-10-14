import React, { Component } from 'react'

import Modal from './Modal'

class App extends Component {
  state = {
    show: false
  }

  showModal = () => {
    this.setState({
      show: !this.state.show
    })
  }

  closeModal = () => {
    this.setState({
      show: false
    })
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.setState({ show: true })}>
          open Modal
        </button>

        <Modal show={this.state.show} onClose={this.closeModal}>
          This message is from Modal
        </Modal>
      </div>
    )
  }
}

export default App
