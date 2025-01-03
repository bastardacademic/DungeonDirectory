import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetch('https://your-backend-api.com/api/properties')
            .then((res) => res.json())
            .then((data) => setProperties(data));
    }, []);

    return (
        <View>
            <Text>Welcome to Dungeon Directory</Text>
            {properties.map((property) => (
                <View key={property.id}>
                    <Text>{property.name}</Text>
                    <Button
                        title="Book Now"
                        onPress={() => navigation.navigate('Booking', { property })}
                    />
                </View>
            ))}
        </View>
    );
}
