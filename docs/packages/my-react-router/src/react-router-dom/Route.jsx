import React from 'react';
import Context from './context';
import { pathToRegexp } from 'path-to-regexp';

const Route = props => {
  const { path, component: Component, extract = false } = props;

  return (
    <Context.Consumer>
      {state => {
        // 也可以使用 useContext
        const { pathname } = state.location;
        let keys = [];
        // extract 严格匹配
        let reg = pathToRegexp(path, keys, { end: extract });
        let result = pathname.match(reg);
        let [url, ...values] = result || [];

        let comProps = {
          location: state.location,
          history: state.history,
          match: {
            params: keys.reduce((obj, item, idx) => {
              const key = item.name;
              obj[key] = values[idx];
              return obj;
            }, {}),
          },
        };

        return result ? <Component {...comProps} /> : null;
      }}
    </Context.Consumer>
  );
};

export default Route;
