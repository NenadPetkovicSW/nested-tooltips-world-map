import { useState, useEffect } from 'react';
import * as FeatureApi from "../api/featureApi";
import { Feature } from '../types/Feature';
/**
 * Custom hook to fetch data.
 * @returns {Object} An object containing the fetched data, loading status, and any error encountered.
 */
const useFetchFeatureData = () => {
    const [data, setData] = useState<Feature[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await FeatureApi.fetchData();
                setData(fetchedData);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return { data, loading, error };
};

export default useFetchFeatureData;
