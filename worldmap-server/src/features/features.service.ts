import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feature } from './feature.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeaturesService {
    constructor(@InjectModel('Feature') private readonly featureModel: Model<Feature>) {}

    async importData(): Promise<void> {
        const filePath = path.join(__dirname, '../../FOR_VIEW.json');
        console.log(`Reading data from: ${filePath}`);

        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File content read successfully.');

            const jsonData = JSON.parse(fileContent);
            console.log('JSON parsed successfully.');

            const data = jsonData.features;

            await this.featureModel.insertMany(data);
            console.log('Data imported successfully.');
        } catch (error) {
            console.error('Error during data import:', error);
        }
    }

    async getFeatureById(id: string): Promise<Feature> {
        const feature = await this.featureModel.findOne({id}).exec();
        if (!feature) {
            throw new NotFoundException(`Feature with ID ${id} not found`);
        }
        return feature;
    }

    async getAllFeatures(): Promise<Feature[]> {
        const features = await this.featureModel.find().exec();
        return features;
    }
}