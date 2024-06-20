/**
 * Interface representing a geographic feature.
 */
export interface Feature {
    /**
     * The type of the geographic feature (e.g., 'Feature').
     */
    type: string;

    /**
     * The geometry of the geographic feature (GeoJSON format).
     */
    geometry: any;

    /**
     * The unique identifier for the geographic feature.
     */
    id: string;

    /**
     * An array of neighboring feature IDs.
     */
    neighbors: string[];

    /**
     * The name of the geographic feature.
     */
    name: string;
}
