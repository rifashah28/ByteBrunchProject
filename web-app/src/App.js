import React from 'react';
import { GoogleLogin } from 'react-google-login';

import logo from './logo.svg';
import './App.css';
import Journal from './Journal';
import * as language from '@google-cloud/language';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {auth: null};
  }

  onLoginSuccess = (response) => {
    console.log("bup")
    console.log("response", response);
    const authResponse = response.getAuthResponse(true);
    this.setState({auth: authResponse});
    console.log(authResponse);
    const client = new language.LanguageServiceClient({credentials: authResponse});
    console.log("client", client)
  }

  onLoginFailure(response) {
    console.log("Login Failure")
    console.log("response", response);
  }

  render() {
    return (
      <div className="App">
        <GoogleLogin
        clientId="1013958473890-en6kk56rg9n7hvi0a8oh4badl070537t.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.onLoginSuccess}
        onFailure={this.onLoginFailure}
        cookiePolicy={'single_host_origin'}
        />
        <Journal auth={this.state.auth}></Journal>
      </div>
    );
  }
}
