import React, { useState } from 'react';
import AdvancedSearch from '../components/AdvancedSearch';
import PropertyList from '../components/PropertyList'; // Create a PropertyList component to display results

export default function Home() {
  const [properties, setProperties] = useState([]);

  const handleSearch = (results) => {
    setProperties(results);
  };

  return (
    <div>
      <h1>Welcome to the Airbnb-like Platform</h1>
      <p>This platform is tailored for the BDSM and Poly communities.</p>
      <AdvancedSearch onSearch={handleSearch} />
      <PropertyList properties={properties} />
    </div>
  );
}
