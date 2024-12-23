import React, { useState } from 'react';
import axios from 'axios';

const AdvancedSearch = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    pool: false,
    parking: false,
    equipment: false,
  });

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/properties', {
        params: { location, priceRange, amenities },
      });
      onSearch(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <h2>Advanced Search</h2>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div>
        <label>Price Range: </label>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={amenities.wifi}
            onChange={(e) => setAmenities({ ...amenities, wifi: e.target.checked })}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.pool}
            onChange={(e) => setAmenities({ ...amenities, pool: e.target.checked })}
          />
          Pool
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.parking}
            onChange={(e) => setAmenities({ ...amenities, parking: e.target.checked })}
          />
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.equipment}
            onChange={(e) => setAmenities({ ...amenities, equipment: e.target.checked })}
          />
          BDSM Equipment
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AdvancedSearch;
