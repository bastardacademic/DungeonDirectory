import { useState, useEffect } from 'react';

export default function SavedSearches() {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        fetch('/api/saved-searches')
            .then((res) => res.json())
            .then(setSearches);
    }, []);

    return (
        <div>
            <h1>Saved Searches</h1>
            {searches.map((search) => (
                <div key={search.id}>
                    <p>{search.criteria}</p>
                </div>
            ))}
        </div>
    );
}
