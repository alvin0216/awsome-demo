const Mixin = WrappedComponent =>
  class extends WrappedComponent {
    constructor(props) {
      super(props)
      this.state = {
        hoc: 'demo',
        ...this.state
      }
    }

    componentDidMount() {
      console.log(this.state)
    }

    log = () => {
      console.log('run hocMthods')
    }

    render() {
      return super.render()
    }
  }

export default Mixin
