```
create-react-app redux-1010
cd redux-1010
npm uninstall react-scripts
npm i cross-env -D
npm i react-redux redux custom-react-scripts -S
```

package.json

```json
"scripts": {
    "start": "cross-env REACT_APP_DECORATORS=true react-scripts start",
  },
```

[装饰器](http://es6.ruanyifeng.com/#docs/decorator)