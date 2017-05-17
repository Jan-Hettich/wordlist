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

  textChanged = (event) => {
    const firstLetters = event.target.value;
    this.setState({firstLetters: firstLetters});
    this.callApi(firstLetters);
  }

  callApi(startOfWord) {
    this.delay(1000, () => startOfWord.endsWith('d'))
      .then(() => {
        console.log("axios");
        return axios({
          method: 'get',
          baseURL: 'https://api.datamuse.com',
          url: '/words',
          params: {
            sp: startOfWord + '*',
            max: 20,
            seq: ++this.lastSeqRequest
          },
          responseType: 'json',
        });
      })
      .then((api_response) => this.apiCallback(api_response))
      .catch((error) => console.log(error));
  }

  apiCallback = ({data, status, statusText, headers, config, request}) => {
    // console.log(status, statusText, headers, config, request);
    console.log("apiCallback");
    const {params: {seq}} = config;
    console.log(`seq: ${seq}, lastSeqResponse: ${this.lastSeqResponse}`);
    if (seq <= this.lastSeqResponse) {
      throw new Error(`discarding response received out of order (${seq})`);
    }
    this.lastSeqResponse = seq;
    const words = data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
  }

  delay = (ms, condition) => {
    console.log("delay");
    ms = condition() ? ms : 0;
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
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
}

export default WordLookup;

// fetchWithAxios = (firstLetters) => {
//   console.log('fetchWithAxios called');
//   const p = axios({ // "https://api.datamuse.com/words?sp=" + firstLetters + "*&max=20";
//     method: 'get',
//     baseURL: 'https://api.datamuse.com',
//     url: '/words',
//     params: {
//       sp: firstLetters + '*',
//       max: 20,
//       seq: ++this.lastSeqRequest
//     },
//     responseType: 'json',
//   });
//   console.log(typeof p);
//   return p;
// }