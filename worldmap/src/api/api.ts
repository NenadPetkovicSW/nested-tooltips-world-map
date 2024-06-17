export const getById = async (id: string) => {
    try {
        const response = await fetch('http://localhost:3000/features/' + id);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        return json; // Update state with fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3000/features');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        return json; // Update state with fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};