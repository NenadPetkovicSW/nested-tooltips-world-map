import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feature } from '../schema/feature.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeaturesService {
    constructor(@InjectModel('Feature') private readonly featureModel: Model<Feature>) {}

    /**
     * Imports data from a JSON file into the 'Feature' collection.
     * @returns {Promise<void>} Promise that resolves when data import is complete.
     */
    async importData(): Promise<void> {
        const filePath = path.join(__dirname, '../../FOR_VIEW.json');
        console.log(`Reading data from: ${filePath}`);

        try {
            // Read file content
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File content read successfully.');

            // Parse JSON content
            const jsonData = JSON.parse(fileContent);
            console.log('JSON parsed successfully.');

            const data = jsonData.features;

            // Insert data into MongoDB
            await this.featureModel.insertMany(data);
            console.log('Data imported successfully.');
        } catch (error) {
            console.error('Error during data import:', error);
        }
    }

    /**
     * Retrieves a feature by its ID.
     * @param {string} id - The ID of the feature to retrieve.
     * @returns {Promise<Feature>} Promise that resolves to the retrieved Feature object.
     * @throws {NotFoundException} Throws NotFoundException if the feature with the specified ID is not found.
     */
    async getFeatureById(id: string): Promise<Feature> {
        const feature = await this.featureModel.findOne({id}).exec();
        if (!feature) {
            throw new NotFoundException(`Feature with ID ${id} not found`);
        }
        return feature;
    }

    /**
     * Retrieves all features from the 'Feature' collection.
     * @returns {Promise<Feature[]>} Promise that resolves to an array of all Feature objects.
     */
    async getAllFeatures(): Promise<Feature[]> {
        const features = await this.featureModel.find().exec();
        return features;
    }
}