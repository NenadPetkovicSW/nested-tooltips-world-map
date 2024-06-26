import { Schema, Document } from 'mongoose';

// Define Mongoose schema for 'Feature' collection
export const AdditionalInfoSchema = new Schema({
    id: { type: String, unique: true }, // Unique identifier for the feature
    area: { type: Number }, // Name or title of the feature
    population: { type: Number }, // Name or title of the feature
    capital: { type: String }, // Name or title of the feature
});

// Define TypeScript interface for 'Feature' document
export interface AdditionalInfo extends Document {
    id: string;
    area: number;
    population: number;
    capital: string;
}
