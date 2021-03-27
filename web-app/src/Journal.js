import React from 'react';

import logo from './logo.svg';
import './App.css';

export default class Journal extends React.Component {
  sentimentInfo() {
    return "test";
  }

  handleChange() {
    console.log("handle change");
  }

  render() {
    return (
      <div className="App">
        <div>{this.sentimentInfo()}</div>
        <textarea onChange={this.handleChange}></textarea>
      </div>
    );
  }
}
