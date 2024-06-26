import { Controller, Get, Param, Post } from '@nestjs/common';
import { AdditionalInfoService } from '../service/additionalInfo.service';
import {AdditionalInfo} from "../schema/additionalInfo.schema";

@Controller('additionalInfo')
export class AdditionalInfoController {
    constructor(private readonly additionalInfoService: AdditionalInfoService) {}

    /**
     * Endpoint to import data from a JSON file into the 'Feature' collection.
     * @returns {Promise<{ message: string }>} Promise that resolves to an object with success message.
     */
    @Post('import')
    async importData(): Promise<{ message: string }> {
        await this.additionalInfoService.importData();
        return { message: 'Data imported successfully' };
    }

    /**
     * Retrieves a additional info by its ID.
     * @param {string} id - The ID of the additional info to retrieve.
     * @returns {Promise<Feature>} Promise that resolves to the retrieved Feature object.
     */
    @Get(':id')
    async getFeatureById(@Param('id') id: string): Promise<AdditionalInfo> {
        return this.additionalInfoService.getAdditionalInfoById(id);
    }

    /**
     * Retrieves all features from the 'Feature' collection.
     * @returns {Promise<Feature[]>} Promise that resolves to an array of all Feature objects.
     */
    @Get()
    async getAllFeatures(): Promise<AdditionalInfo[]> {
        return this.additionalInfoService.getAllAdditionalInfos();
    }
}