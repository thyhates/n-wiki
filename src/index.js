import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin'
//CSS

import '../node_modules/font-awesome/css/font-awesome.min.css'
import './index.css';

injectTapEventPlugin();
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
