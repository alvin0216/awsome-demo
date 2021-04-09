import React from 'react';
import { renderRoutes } from 'react-router-config';

const App = (props) => {
  return (
    <>
      <h2>App...</h2>
      {renderRoutes(props.route.routes)}
    </>
  );
};

export default App;
