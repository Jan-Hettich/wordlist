import React, {Component} from 'react';
import uuid from 'uuid';
import axios from 'axios';
import './WordLookup.css';

class WordLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: "", words: []};
  }

  textChanged = (event) => {
    const firstLetters = event.target.value;
    this.setState({firstLetters: firstLetters});
    this.callAPI(firstLetters);
  }

  callAPI(firstLetters) {
    // const url = "https://api.datamuse.com/words?sp=" + firstLetters + "*&max=20";
    axios({
      method: 'get',
      baseURL: 'https://api.datamuse.com',
      url: '/words',
      params: {
        sp: firstLetters + '*',
        max: 20
      },
      responseType: 'json',
    })
      .then(this.apiCallback)
      .catch((error) => console.log(error));
  }

  apiCallback = ({data, status, statusText, headers, config, request}) => {
    console.log(status, statusText, headers, config, request);
    const words = data.reduce((acc, {word}) => acc.concat(word), []);
    this.setState(...this.state, {words})
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