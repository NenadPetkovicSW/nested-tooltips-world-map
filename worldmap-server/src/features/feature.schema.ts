import { Schema, Document } from 'mongoose';

export const FeatureSchema = new Schema({
    type: { type: String, required: true },
    geometry: {
        type: { type: String, required: true },
        coordinates: { type: Schema.Types.Mixed, required: true },
    },
    id: { type: String, required: true, unique: true },
    neighbors: [{ type: String }],
    name: { type: String, required: true },
});

export interface Feature extends Document {
    type: string;
    geometry: {
        type: string;
        coordinates: any;
    };
    id: string;
    neighbors: string[];
    name: string;
}
