import React from 'react';
import * as language from '@google-cloud/language';

import logo from './logo.svg';
import './App.css';

export default class Journal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: '', sentiment: null};
  }

  get client() {
    // if(this._client) {
    //   return this._client;
    // } else {
    //   if(this.props.auth) {
    //     this._client = new language.LanguageServiceClient({credentials: this.props.auth});
    //     return this._client;
    //   }
    // }
    return null;
  }

  fetchSentimentInfo = () => {
    if(this.client) {
      const document = {
        content: this.state.text,
        type: 'PLAIN_TEXT',
      };
      this.client.analyzeSentiment({document: document}).then((result) => {
        const sentiment = result[0].documentSentiment;
        console.log(`Text: ${this.state.text}`);
        console.log(`Sentiment score: ${sentiment.score}`);
        console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
      })
    }
    return "not authenticated.";
  }

  handleTextChange = (event) => {
    this.setState({text: event.target.value});
  }

  render() {
    return (
      <div className="App">
        <div>{this.fetchSentimentInfo()}</div>
        <textarea onChange={this.handleTextChange}></textarea>
      </div>
    );
  }
}
