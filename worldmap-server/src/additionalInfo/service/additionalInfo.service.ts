import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {AdditionalInfo} from "../schema/additionalInfo.schema";

@Injectable()
export class AdditionalInfoService {
    constructor(@InjectModel('AdditionalInfo') private readonly additionalInfoModel: Model<AdditionalInfo>) {}

    /**
     * Imports data from a JSON file into the 'AdditionalInfo' collection.
     * @returns {Promise<void>} Promise that resolves when data import is complete.
     */
    async importData(): Promise<void> {
        const filePath = path.join(__dirname, '../../../INFO.json');
        console.log(`Reading data from: ${filePath}`);

        try {
            // Read file content
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File content read successfully.');

            // Parse JSON content
            const jsonData = JSON.parse(fileContent);
            console.log('JSON parsed successfully.');

            const data = jsonData.additionalInfos;

            // Insert data into MongoDB
            await this.additionalInfoModel.insertMany(data);
            console.log('Data imported successfully.');
        } catch (error) {
            console.error('Error during data import:', error);
        }
    }

    /**
     * Retrieves a AdditionalInfo by its ID.
     * @param {string} id - The ID of the AdditionalInfo to retrieve.
     * @returns {Promise<Feature>} Promise that resolves to the retrieved Feature object.
     * @throws {NotFoundException} Throws NotFoundException if the AdditionalInfo with the specified ID is not found.
     */
    async getAdditionalInfoById(id: string): Promise<AdditionalInfo> {
        const additionalInfo = await this.additionalInfoModel.findOne({id}).exec();
        if (!additionalInfo) {
            throw new NotFoundException(`Feature with ID ${id} not found`);
        }
        return additionalInfo;
    }

    /**
     * Retrieves all features from the 'Feature' collection.
     * @returns {Promise<Feature[]>} Promise that resolves to an array of all Feature objects.
     */
    async getAllAdditionalInfos(): Promise<AdditionalInfo[]> {
        const additionalInfo = await this.additionalInfoModel.find().exec();
        return additionalInfo;
    }
}