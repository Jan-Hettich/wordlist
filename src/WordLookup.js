import React, {Component} from 'react';
import './WordLookup.css';

class WordList extends Component {
  constructor(props) {
    super(props);
    this.state = {firstLetters: ""};
  }

  textChanged = (event) => {
    this.setState({firstLetters: event.target.value});
  }

  render(props) {
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
          <li key="1">word1</li>
          <li key="2">word2</li>
        </ul>
      </form>
    );
  }
}

export default WordList;