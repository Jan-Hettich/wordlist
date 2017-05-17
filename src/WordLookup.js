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
    console.log(`firstLetters:  ${firstLetters}`);
    this.setState({firstLetters: firstLetters});
    this.apiGetWords(firstLetters);
  }

  apiGetWords = (startOfWord) =>
    this.apiSendRequest(startOfWord)
      .then((result) => this.apiCallback(result))
      .catch((error) => console.log(error));

  apiSendRequest = (startOfWord) => {
    const params = startOfWord.length > 0 ? {sp: startOfWord + '*', max: 20} : {}
    return axios({
      method: 'get',
      baseURL: 'https://api.datamuse.com',
      url: '/words',
      params: params,
      responseType: 'json',
    });
  }

  apiCallback = (api_response) => {
    console.log("api_response: ", api_response);
    const words = api_response.data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
  }

}

export default WordLookup;
