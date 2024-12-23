export default function PropertyList({ properties }) {
    return (
        <div>
            {properties.map((property) => (
                <div key={property.id}>
                    <h2>{property.name}</h2>
                    <p>{property.location}</p>
                </div>
            ))}
        </div>
    );
}
