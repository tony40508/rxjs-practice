import React from 'react';
import logo from './logo.svg';
import './App.css';

const App = props => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>{props.message}</p>
    </header>
  </div>
);

export default App;
