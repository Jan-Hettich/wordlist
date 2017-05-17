import React, {Component} from 'react';
import uuid from 'uuid';
import axios from 'axios';
import './WordLookup.css';

class WordLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: "", words: []};
  }

  render() {
    return (
      <form className="WordLookup">
        <label>
          Find words beginning with:
          <input
            type="text"
            value={this.state.firstLetters}
            onChange={this.textChanged}/>
        </label>
        <ul>
          {this.state.words.map((word) => (
            <li key={uuid.v4()}>{word}</li>
          ))}
        </ul>
      </form>
    );
  }

  textChanged = (event) => {
    const firstLetters = event.target.value;
    this.setState({firstLetters: firstLetters});
    this.updateFromApi(firstLetters);
  }

  updateFromApi = (startOfWord) =>
    this.callApi(startOfWord)
      .then((result2) => this.apiCallback(result2))
      .catch((error) => console.log(error));

  callApi = (startOfWord) =>
    axios({
      method: 'get',
      baseURL: 'https://api.datamuse.com',
      url: '/words',
      params: {
        sp: startOfWord + '*',
        max: 20,
      },
      responseType: 'json',
    });

  apiCallback = (api_response) => {
    console.log("api_response: ", api_response);
    const words = api_response.data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
  }

}

export default WordLookup;
