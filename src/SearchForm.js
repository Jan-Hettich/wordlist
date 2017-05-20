import React from 'react';


const SearchForm = ({firstLetters, callback}) => (
  <form className="WordLookup">
    <label>
      Find words beginning with:
      <input
        type="text"
        value={firstLetters}
        onChange={callback}/>
    </label>
  </form>
);

export default SearchForm;
