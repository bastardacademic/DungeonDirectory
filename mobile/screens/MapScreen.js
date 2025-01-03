import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ properties }) {
    return (
        <MapView style={{ flex: 1 }}>
            {properties.map((property) => (
                <Marker
                    key={property.id}
                    coordinate={{ latitude: property.lat, longitude: property.lng }}
                    title={property.name}
                />
            ))}
        </MapView>
    );
}
