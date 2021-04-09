import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getClientStore } from '../redux';
import { renderRoutes } from 'react-router-config';
import routes from '../routes';

const Root = (
  <Provider store={getClientStore()}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>
);

ReactDom.hydrate(Root, document.getElementById('root'));
