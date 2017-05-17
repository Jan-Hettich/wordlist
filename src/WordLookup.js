import React, {Component} from 'react';
import uuid from 'uuid';
import axios from 'axios';
import './WordLookup.css';

class WordLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: "", words: []};
    this.lastRequest = 0;
    this.lastResponse = 0;
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
      .then((result1) => this.delay(result1, 1000, () => startOfWord.endsWith('d')))
      .then((result2) => this.apiCallback(result2))
      .catch((error) => console.log(error));

  apiSendRequest = (startOfWord) => {
    const params = startOfWord.length > 0 ? {sp: startOfWord + '*', max: 20} : {}
    return axios({
      method: 'get',
      baseURL: 'https://api.datamuse.com',
      url: '/words',
      params: params,
      responseType: 'json',
      requestNumber: ++this.lastRequest,
    });
  }

  delay = (result1, ms, condition) => {
    ms = condition() ? ms : 0;
    return new Promise((resolve, reject) => setTimeout(() => resolve(result1), ms));
  }

  apiCallback = (api_response) => {
    console.log("api_response: ", api_response);
    this.checkResponseOrder(api_response);
    const words = api_response.data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
  }

  checkResponseOrder = ({config: {params: {sp}, requestNumber}}) => {
    if (requestNumber <= this.lastResponse) {
      throw new Error(`discarding response received out of order for: ${sp}`);
    }
    return this.lastResponse = requestNumber;
  }

}

export default WordLookup;
