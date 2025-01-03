export const fetchProperties = async () => {
    const response = await fetch('/api/properties');
    return response.json();
};

export const fetchSavedSearches = async () => {
    const response = await fetch('/api/saved-searches');
    return response.json();
};
