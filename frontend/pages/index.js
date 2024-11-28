import React, { useState } from 'react';
import AdvancedSearch from '../components/AdvancedSearch';
import PropertyList from '../components/PropertyList';

export default function Home() {
    const [properties, setProperties] = useState([]);

    const handleSearch = (results) => {
        setProperties(results);
    };

    return (
        <div>
            <h1>Welcome to Dungeon Directory</h1>
            <p>Explore properties tailored to the BDSM and Poly communities.</p>
            <AdvancedSearch onSearch={handleSearch} />
            <PropertyList properties={properties} />
        </div>
    );
}
