import React, {Component} from 'react';
import uuid from 'uuid';

const WordList = ({words}) => (
  <ul>
    {words.map((word) => (
      <li key={uuid.v4()}>{word}</li>
    ))}
  </ul>
)

export default WordList;
