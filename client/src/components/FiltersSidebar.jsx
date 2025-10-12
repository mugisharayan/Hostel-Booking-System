import React, { useState, useEffect } from 'react';

// Define the available amenities list once
const AVAILABLE_AMENITIES = ['WiFi', 'Breakfast', 'Locker', 'Laundry', '24hr Reception'];

// Props: 'onFilterChange' is a function passed from the parent to update results
const FiltersSidebar = ({ currentFilters, onFilterChange }) => {
    // State to hold the temporary filter selections in the sidebar
    // We initialize it with currentFilters, but use useEffect to handle external changes
    const [filters, setFilters] = useState(currentFilters);

    // Sync local state when the parent's currentFilters prop changes (e.g., initial load or reset)
    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters]);

    // Function to handle changes in any standard filter input (Location, Cost, Rating, Gender)
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // 1. Update the local state
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);

        // 2. Requirement: Filters must update search results in real-time
        onFilterChange(updatedFilters); 
    };

    // Function to handle changes in the Amenity checkboxes
    const handleAmenityChange = (e) => {
        const amenity = e.target.value;
        const checked = e.target.checked;
        
        // Get the current amenities array, default to an empty array if undefined
        let currentAmenities = filters.amenities || [];

        if (checked) {
            // Add amenity if checked
            currentAmenities = [...currentAmenities, amenity];
        } else {
            // Remove amenity if unchecked
            currentAmenities = currentAmenities.filter(a => a !== amenity);
        }

        // Create the new filter object with the updated amenities array
        const updatedFilters = { ...filters, amenities: currentAmenities };
        setFilters(updatedFilters);
        
        // Trigger real-time search update
        onFilterChange(updatedFilters);
    };

    return (
        <div className="filters-sidebar">
            <h2>Filter Hostels</h2>

            {/* Location Filter */}
            <div className="filter-group">
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., London, UK"
                />
            </div>

            {/* Cost Filter (Max Price) */}
            <div className="filter-group">
                <label htmlFor="maxCost">Max Cost ($):</label>
                <input
                    type="number"
                    id="maxCost"
                    name="maxCost"
                    value={filters.maxCost || ''}
                    onChange={handleChange}
                    min="10"
                    placeholder="Max Price"
                />
            </div>

            {/* Gender Filter */}
            <div className="filter-group">
                <label htmlFor="gender">Gender:</label>
                <select
                    id="gender"
                    name="gender"
                    value={filters.gender || ''}
                    onChange={handleChange}
                >
                    <option value="">Any</option>
                    <option value="Male">Male Dorms</option>
                    <option value="Female">Female Dorms</option>
                    <option value="Mixed">Mixed Dorms</option>
                </select>
            </div>

            {/* --- NEW: Minimum Rating Filter --- */}
            <div className="filter-group">
                <label htmlFor="minRating">Minimum Rating (★):</label>
                <input
                    type="number"
                    id="minRating"
                    name="minRating"
                    value={filters.minRating || ''}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.5"
                    placeholder="e.g., 4.0"
                />
            </div>

            {/* --- NEW: Amenities Filter (Checkboxes) --- */}
            <div className="filter-group">
                <label>Amenities:</label>
                <div className="amenities-checkboxes">
                    {AVAILABLE_AMENITIES.map(amenity => (
                        <div key={amenity} className="checkbox-item">
                            <input
                                type="checkbox"
                                id={amenity}
                                value={amenity}
                                // Check if the current list of amenities includes this amenity
                                checked={(filters.amenities || []).includes(amenity)}
                                onChange={handleAmenityChange}
                            />
                            <label htmlFor={amenity}>{amenity}</label>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FiltersSidebar;