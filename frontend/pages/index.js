import { useEffect, useState } from 'react';
import PropertyList from '../components/PropertyList';

export default function Home() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetch('/api/properties')
            .then((res) => res.json())
            .then((data) => setProperties(data));
    }, []);

    return (
        <div>
            <h1>Welcome to Dungeon Directory</h1>
            <PropertyList properties={properties} />
        </div>
    );
}
