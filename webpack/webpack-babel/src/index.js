const func = () => {
  console.log('hello webpack')
}
func()

function annotation(target) {
  target.annotated = true
}

@annotation
class User {
  constructor() {
    console.log('new User')
  }
}

const user = new User()

console.log('装饰器', user.annotated)

new Promise(resolve => console.log('promise'))

Array.from('foo')
