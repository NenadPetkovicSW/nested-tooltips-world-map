const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetches data for a specific feature by its ID.
 * @param {string} id - The ID of the feature to fetch.
 * @returns {Promise<object>} The data for the specified feature.
 * @throws Will throw an error if the network request fails.
 */
export const getById = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/features/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        return json; // Update state with fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

/**
 * Fetches data for all features.
 * @returns {Promise<Array<object>>} The data for all features.
 * @throws Will throw an error if the network request fails.
 */
export const fetchData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/features`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        return json; // Update state with fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};