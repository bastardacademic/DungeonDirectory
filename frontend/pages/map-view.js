import { useState } from 'react';
import GoogleMapReact from 'google-map-react';

export default function MapView({ properties }) {
    const [selectedProperty, setSelectedProperty] = useState(null);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <GoogleMapReact
                defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
                defaultZoom={12}
                onClick={() => setSelectedProperty(null)}
            >
                {properties.map((property) => (
                    <div
                        key={property.id}
                        lat={property.lat}
                        lng={property.lng}
                        onClick={() => setSelectedProperty(property)}
                    >
                        📍
                    </div>
                ))}
            </GoogleMapReact>
            {selectedProperty && <div>{selectedProperty.name}</div>}
        </div>
    );
}
