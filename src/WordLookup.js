import React, {Component} from 'react';
import {apiGetWords} from './Api'
import SearchForm from './SearchForm';
import WordList from './WordList';
import './WordLookup.css';

class WordLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: "", words: []};
  }

  render() {
    return (
      <div>
        <SearchForm firstLetters={this.state.firstLetters} callback={this.firstLettersChanged} />
        <WordList words={this.state.words} />
      </div>
    );
  }

  firstLettersChanged = (event) => {
    const firstLetters = event.target.value;
    this.setState({firstLetters: firstLetters});
    apiGetWords(firstLetters)
      .then(({words}) => this.setState({...this.state, words}))
      .catch((error) => console.log(error));
  }
}

export default WordLookup;
