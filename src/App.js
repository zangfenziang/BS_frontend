import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import Index from './page/Index';
import Login from './page/Login';
import Register from './page/Register';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Route exact path='/' component={Index} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/talk/:uid' component={Index} />
        </HashRouter>
      </div>
    );
  }
}

export default App;