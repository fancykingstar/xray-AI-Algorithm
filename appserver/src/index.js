import 'bootstrap/dist/css/bootstrap.min.css'
//import './CustomBootstrap/css/bootstrap.css'
import './app.css'
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App';
import './index.css';

ReactDOM.render(
   <Router>
      <App />
   </Router>, document.getElementById('root'));

