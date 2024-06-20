import { Schema, Document } from 'mongoose';

// Define Mongoose schema for 'Feature' collection
export const FeatureSchema = new Schema({
    type: { type: String, required: true }, // Type of the feature (e.g., "Feature")
    geometry: { // Geometry information (typically coordinates)
        type: { type: String, required: true }, // Type of geometry (e.g., "Point", "Polygon")
        coordinates: { type: Schema.Types.Mixed, required: true }, // Coordinates of the geometry
    },
    id: { type: String, required: true, unique: true }, // Unique identifier for the feature
    neighbors: [{ type: String }], // List of neighboring feature IDs
    name: { type: String, required: true }, // Name or title of the feature
});

// Define TypeScript interface for 'Feature' document
export interface Feature extends Document {
    type: string;
    geometry: {
        type: string;
        coordinates: any; // Can be any valid JSON structure for coordinates
    };
    id: string;
    neighbors: string[]; // Array of strings representing neighboring feature IDs
    name: string;
}
