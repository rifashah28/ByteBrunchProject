import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Journal from './Journal';
import reportWebVitals from './reportWebVitals';
import * as language from '@google-cloud/language';
import { GoogleLogin } from 'react-google-login';




ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
