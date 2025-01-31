import { View, Text, Button } from 'react-native';

export default function BookingScreen({ route }) {
    const { property } = route.params;

    return (
        <View>
            <Text>Booking for: {property.name}</Text>
            <Button title="Confirm Booking" onPress={() => alert('Booking Confirmed')} />
        </View>
    );
}
