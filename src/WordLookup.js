import React, {Component} from 'react';
import uuid from 'uuid';
import axios from 'axios';
import './WordLookup.css';

class WordLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: "", words: []};
    this.lastSeqRequest = 0;
    this.lastSeqResponse = 0;
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
    this.callApi(firstLetters);
  }

  callApi(startOfWord) {
    axios({
      method: 'get',
      baseURL: 'https://api.datamuse.com',
      url: '/words',
      params: {
        sp: startOfWord + '*',
        max: 20,
        seq: ++this.lastSeqRequest
      },
      responseType: 'json',
    })
      .then((result1) => this.delay(result1, 1000, () => startOfWord.endsWith('d')))
      .then((result2) => this.apiCallback(result2))
      .catch((error) => console.log(error));
  }

  apiCallback = (api_response) => {
    console.log("api_response: ", api_response);
    this.checkSequenceNumber(api_response);
    const {data} = api_response;
    const words = data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
  }

  checkSequenceNumber = (api_response) => {
    const {config: {params: {seq}}} = api_response;
    console.log(`seq: ${seq}, lastSeqResponse: ${this.lastSeqResponse}`);
    if (seq <= this.lastSeqResponse) {
      throw new Error(`discarding response received out of order (${seq})`);
    }
    this.lastSeqResponse = seq;
  }

  delay = (result, ms, condition) => {
    const delay = condition();
    console.log(`delay, condition: ${delay}`);
    ms = delay ? ms : 0;
    return new Promise((resolve, reject) => setTimeout(() => resolve(result), ms));
  }
}

export default WordLookup;
