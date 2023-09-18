import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import {  setNavigationItems } from './store/Actions';

// Set your navigation items here
const navigationItems = ['Home', 'Signin', ];

store.dispatch(setNavigationItems(navigationItems));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
