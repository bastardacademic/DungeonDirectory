import { render, screen } from '@testing-library/react';
import PropertyList from '../../frontend/components/PropertyList';

test('renders property list', () => {
    const properties = [
        { id: 1, name: 'Property A', location: 'Location A' },
        { id: 2, name: 'Property B', location: 'Location B' },
    ];
    render(<PropertyList properties={properties} />);
    expect(screen.getByText('Property A')).toBeInTheDocument();
    expect(screen.getByText('Property B')).toBeInTheDocument();
});
