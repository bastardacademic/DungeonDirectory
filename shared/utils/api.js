export const fetchProperties = async () => {
    const response = await fetch('/api/properties');
    return response.json();
};
