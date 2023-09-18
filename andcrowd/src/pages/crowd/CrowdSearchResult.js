import React from 'react';
import { useParams } from 'react-router-dom';

const CrowdSearchResult = ({ data }) => {
  let { searchTerm } = useParams();
  
  searchTerm = searchTerm.toLowerCase();

  const results =
    data.filter(item =>
      item.crowdTitle.toLowerCase().includes(searchTerm) ||
      item.crowdContent.toLowerCase().includes(searchTerm)
    );

   return (
     <div>
       <h1>Results for "{searchTerm}"</h1>
       <ul>
         {results.map((item, index) => (
           <li key={index}>
             <h2>{item.crowdTitle}</h2>
             <p>{item.crowdContent}</p>
           </li>
         ))}
       </ul>
     </div> 
   );
};

export default CrowdSearchResult;
