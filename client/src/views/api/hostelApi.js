
// Using 'axios' is a professional standard for HTTP requests
import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:5000/api/hostels';

/*
 * Fetches a list of hostels based on search criteria and filters.
 * @param {object} filters - The current active filters (location, cost, gender, etc.)
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of hostel objects.
 */
export const fetchHostels = async (filters) => {
    try {
        // Constructs a query string from the filters object
        const response = await axios.get(API_URL, {
            params: filters // axios automatically converts this to ?location=...&cost=...
        });
        return response.data; // The backend should return the array of hostels here
    } catch (error) {
        console.error("Error fetching hostels:", error);
        // Professional practice: throw an error so the caller can handle it
        throw new Error("Failed to fetch hostel data.");
    }
};