import React from 'react';

const PropertyList = ({ properties }) => {
  return (
    <div>
      <h2>Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <h3>{property.name}</h3>
              <p>{property.description}</p>
              <p>Location: {property.location}</p>
              <p>Price: \ per night</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;
