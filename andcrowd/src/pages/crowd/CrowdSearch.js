import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const CrowdSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    history.push(`/results/${searchTerm}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default CrowdSearch;
